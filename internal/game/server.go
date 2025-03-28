package game

import (
	"io"
	"log"
	"sync"
	"time"

	pb "github.com/Irishsmurf/pongolang/api/gen/go/game" // Adjust import path
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const inputBufferSize = 10 // Buffer size for player input channel

// player holds the state for a connected player
type player struct {
	id         string
	stream     pb.GameService_StreamGameServer
	input      chan pb.ClientToServer_PaddleInput_Direction // Receives input from readInput goroutine
	disconnect chan struct{}                                // Closed when the player disconnects
}

// Server implements the GameServiceServer for a single game instance
type Server struct {
	pb.UnimplementedGameServiceServer
	mu        sync.RWMutex // Protects player slots and game state initialization
	player1   *player
	player2   *player
	gameState *GameState
	matchID   string
	gameReady chan struct{}  // Closed when player 2 connects
	stopLoop  chan struct{}  // Closed to signal game loop and readers to stop
	loopWG    sync.WaitGroup // Waits for game loop and input readers
}

// NewServer creates a new game server instance
func NewServer() *Server {
	return &Server{
		gameReady: make(chan struct{}),
		stopLoop:  make(chan struct{}),
	}
}

// StreamGame handles the bidirectional stream for a single player connecting to the game
func (s *Server) StreamGame(stream pb.GameService_StreamGameServer) error {
	// 1. Receive Initial Connection message
	req, err := stream.Recv()
	if err == io.EOF {
		return status.Error(codes.InvalidArgument, "client closed stream before sending initial connect")
	}
	if err != nil {
		log.Printf("Error receiving initial message: %v", err)
		return status.Errorf(codes.Internal, "failed to receive initial message: %v", err)
	}

	initialMsg := req.GetConnectRequest()
	if initialMsg == nil {
		return status.Error(codes.InvalidArgument, "first message must be InitialConnect")
	}
	playerID := initialMsg.GetPlayerId()
	recvMatchID := initialMsg.GetMatchId()
	if playerID == "" || recvMatchID == "" {
		return status.Error(codes.InvalidArgument, "player_id and match_id must be provided")
	}

	log.Printf("Player %s attempting to connect to match %s", playerID, recvMatchID)

	// Create player session object
	p := &player{
		id:         playerID,
		stream:     stream,
		input:      make(chan pb.ClientToServer_PaddleInput_Direction, inputBufferSize),
		disconnect: make(chan struct{}),
	}

	// 2. Register Player (Mutex protected)
	s.mu.Lock()

	if s.player1 == nil {
		// --- First Player ---
		s.matchID = recvMatchID // Store match ID from the first player
		s.player1 = p
		log.Printf("Player 1 (%s) registered for match %s. Waiting for Player 2.", playerID, s.matchID)
		s.mu.Unlock()

		// Start reading input for player 1
		s.loopWG.Add(1)
		go s.readInput(p)

		// Wait for game ready (player 2 connects) or disconnect
		select {
		case <-s.gameReady:
			log.Printf("Player %s: Game ready signal received.", p.id)
			// Game loop is started by player 2's handler. Now just wait for disconnect.
			<-p.disconnect // Block until readInput closes this channel
			log.Printf("Player %s: Detected disconnect during game.", p.id)
			// Ensure loop stops if it hasn't already (e.g., if P2 disconnects first)
			// Using select avoids blocking if stopLoop is already closed.
			select {
			case <-s.stopLoop: // Already closing
			default:
				close(s.stopLoop) // Signal loop and other reader to stop
			}
			s.loopWG.Wait() // Wait for loop and P2 reader to finish
			log.Printf("Player %s: Goroutines finished.", p.id)
			return nil // Clean disconnect during game

		case <-p.disconnect: // Disconnected before game started
			log.Printf("Player %s: Disconnected before Player 2 joined.", p.id)
			s.mu.Lock()
			s.player1 = nil // Clean up player slot
			s.mu.Unlock()
			return status.Error(codes.Canceled, "player disconnected before match start")

		case <-stream.Context().Done(): // Stream closed externally before game started
			log.Printf("Player %s: Stream context canceled before Player 2 joined.", p.id)
			close(p.disconnect) // Ensure readInput stops
			s.mu.Lock()
			s.player1 = nil // Clean up player slot
			s.mu.Unlock()
			return status.Error(codes.Canceled, "client stream canceled")
		}

	} else if s.player2 == nil {
		// --- Second Player ---
		// Validate match ID and player ID
		if recvMatchID != s.matchID {
			s.mu.Unlock()
			log.Printf("Player %s rejected: Match ID mismatch (expected %s)", playerID, s.matchID)
			return status.Errorf(codes.FailedPrecondition, "match ID mismatch (expected %s)", s.matchID)
		}
		if playerID == s.player1.id {
			s.mu.Unlock()
			log.Printf("Player %s rejected: Attempted to join match twice", playerID)
			return status.Errorf(codes.AlreadyExists, "player %s already in match", playerID)
		}

		s.player2 = p
		log.Printf("Player 2 (%s) registered for match %s.", playerID, s.matchID)

		// Initialize Game State now that both players are here
		s.gameState = NewGameState(s.player1.id, s.player2.id)
		log.Printf("Game state initialized for match %s.", s.matchID)

		s.mu.Unlock()

		// Start reading input for player 2
		s.loopWG.Add(1)
		go s.readInput(p)

		// Signal player 1 that game is ready and start the game loop
		close(s.gameReady)
		s.loopWG.Add(1)
		go s.runGameLoop()
		log.Printf("Game loop started for match %s.", s.matchID)

		// Wait for disconnect
		<-p.disconnect // Block until readInput closes this channel
		log.Printf("Player %s: Detected disconnect during game.", p.id)
		// Ensure loop stops if it hasn't already
		select {
		case <-s.stopLoop: // Already closing
		default:
			close(s.stopLoop) // Signal loop and other reader to stop
		}
		s.loopWG.Wait() // Wait for loop and P1 reader to finish
		log.Printf("Player %s: Goroutines finished.", p.id)
		return nil // Clean disconnect during game

	} else {
		// --- Server Full ---
		s.mu.Unlock()
		log.Printf("Player %s rejected: Server full (match %s already active)", playerID, s.matchID)
		return status.Error(codes.ResourceExhausted, "server is currently full")
	}
}

// readInput runs in a goroutine for each player, receiving input messages
func (s *Server) readInput(p *player) {
	defer s.loopWG.Done()     // Decrement wait group counter when done
	defer close(p.disconnect) // Signal disconnect when this routine exits
	log.Printf("Starting input reader for %s", p.id)

	for {
		req, err := p.stream.Recv()
		if err == io.EOF {
			log.Printf("Input reader %s: Client closed stream (EOF).", p.id)
			return // Graceful disconnect
		}
		if err != nil {
			// Check if context was canceled (another way disconnects happen)
			if status.Code(err) == codes.Canceled || status.Code(err) == codes.Unavailable {
				log.Printf("Input reader %s: Stream context canceled or unavailable.", p.id)
			} else {
				log.Printf("Input reader %s: Error receiving input: %v", p.id, err)
			}
			return // Disconnect due to error or cancellation
		}

		inputMsg := req.GetInput() // Changed from GetInitialConnect
		if inputMsg != nil {
			// Send input non-blockingly to the game loop
			select {
			case p.input <- inputMsg.GetDirection():
				// Input sent successfully
			case <-p.disconnect: // Check if disconnect happened while trying to send
				log.Printf("Input reader %s: Disconnected while sending input.", p.id)
				return
			default:
				log.Printf("Warning: Input reader %s: Input channel full, discarding input.", p.id)
			}
		} else {
			// Ignore messages that are not PaddleInput after initial connect
			log.Printf("Input reader %s: Received unexpected message type", p.id)
		}
		// Check for stop signal if needed, though stream errors are primary exit
		select {
		case <-s.stopLoop:
			log.Printf("Input reader %s: Stop signal received.", p.id)
			return
		default:
			// continue reading
		}
	}
}

// runGameLoop runs in a goroutine, updating state and broadcasting
func (s *Server) runGameLoop() {
	defer s.loopWG.Done() // Decrement wait group counter when done
	log.Printf("Starting game loop for match %s", s.matchID)

	tickDuration := time.Second / TargetTicksPerSecond
	ticker := time.NewTicker(tickDuration)
	defer ticker.Stop()

	p1Input := pb.ClientToServer_PaddleInput_STOP
	p2Input := pb.ClientToServer_PaddleInput_STOP

	for {
		select {
		case <-ticker.C:
			if s.gameState == nil { // Should not happen if loop started correctly
				log.Println("Error: Game loop running with nil state.")
				return
			}

			// Update game state based on last received inputs
			scored, winner := s.gameState.Update(tickDuration.Seconds(), p1Input, p2Input)

			// Create state proto message for broadcasting
			stateProto := s.gameState.ToProto(s.matchID)
			s.broadcast(&pb.ServerToClient{MessageType: &pb.ServerToClient_StateUpdate{StateUpdate: stateProto}})

			// Handle events
			if scored {
				// Inside runGameLoop, after `if scored:`
				scoreProto := s.gameState.GetScoreState() // Get updated score
				// Create an instance of the wrapper type pb.GameEvent_ScoreUpdate
				eventWrapper := &pb.GameEvent_ScoreUpdate_{
					// Assign the actual ScoreUpdate message to the field within the wrapper
					ScoreUpdate: &pb.GameEvent_ScoreUpdate{
						NewScore: scoreProto,
					},
				}
				// Assign the wrapper to the EventType field
				gameEvent := &pb.GameEvent{EventType: eventWrapper}
				s.broadcast(&pb.ServerToClient{MessageType: &pb.ServerToClient_Event{Event: gameEvent}})
				log.Printf("Match %s: Score update %d - %d", s.matchID, scoreProto.Player1Score, scoreProto.Player2Score)
			}

			if winner != "" {
				// Inside runGameLoop, after `if winner != "":`
				finalScore := s.gameState.GetScoreState() // Get final score
				loserID := s.player1.id
				if winner == s.player1.id {
					loserID = s.player2.id
				}
				// Create an instance of the wrapper type pb.GameEvent_GameOver
				eventWrapper := &pb.GameEvent_GameOver_{
					// Assign the actual GameOver message to the field within the wrapper
					GameOver: &pb.GameEvent_GameOver{
						WinnerPlayerId: winner,
						LoserPlayerId:  loserID,
						FinalScore:     finalScore,
					},
				}
				// Assign the wrapper to the EventType field
				gameEvent := &pb.GameEvent{EventType: eventWrapper}
				s.broadcast(&pb.ServerToClient{MessageType: &pb.ServerToClient_Event{Event: gameEvent}})
				log.Printf("Match %s: Game Over! Winner: %s", s.matchID, winner)
				time.Sleep(100 * time.Millisecond) // Small delay so clients get final message
				return                             // Exit loop cleanly after game over
				log.Printf("Match %s: Game Over! Winner: %s", s.matchID, winner)
				// Maybe wait a moment before stopping?
				time.Sleep(100 * time.Millisecond) // Small delay so clients get final message
				return                             // Exit loop cleanly after game over
			}

		case dir := <-s.player1.input:
			p1Input = dir
		case dir := <-s.player2.input:
			p2Input = dir

		case <-s.stopLoop:
			log.Printf("Game loop %s: Stop signal received.", s.matchID)
			// Optionally broadcast a game canceled/aborted event
			// s.broadcast(...)
			return // Exit loop cleanly
		}
	}
}

// broadcast sends a message to both players, handling potential errors
func (s *Server) broadcast(msg *pb.ServerToClient) {
	s.mu.RLock() // Use RLock as we are only reading player pointers
	p1 := s.player1
	p2 := s.player2
	s.mu.RUnlock()

	if p1 != nil {
		if err := p1.stream.Send(msg); err != nil {
			log.Printf("Broadcast error to %s: %v", p1.id, err)
			// Signal disconnect if not already signaled
			select {
			case <-p1.disconnect: // Already closed
			default:
				close(p1.disconnect)
			}
		}
	}
	if p2 != nil {
		if err := p2.stream.Send(msg); err != nil {
			log.Printf("Broadcast error to %s: %v", p2.id, err)
			// Signal disconnect if not already signaled
			select {
			case <-p2.disconnect: // Already closed
			default:
				close(p2.disconnect)
			}
		}
	}
}
