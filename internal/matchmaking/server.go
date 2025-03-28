package matchmaking

import (
	"context"
	"log"
	"sync"

	pb "github.com/Irishsmurf/pongolang/api/gen/go/matchmaking" // Adjust import path if needed
	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

// Config holds server configuration
type Config struct {
	GameServerAddress string // Address of the game server to assign matches to
	// Add other config like queue timeout if needed
}

// playerSession holds information about a player waiting in the queue
type playerSession struct {
	id        string
	stream    pb.MatchmakingService_JoinQueueServer
	matchChan chan *pb.MatchDetails // Channel to send match details when found
	doneChan  chan struct{}         // Channel to signal the player goroutine to stop
}

// Server implements the MatchmakingServiceServer interface
type Server struct {
	pb.UnimplementedMatchmakingServiceServer
	config        Config
	mu            sync.Mutex
	waitingPlayer *playerSession // Only one player can wait at a time in this simple version
	// For >2 players, this would be a slice or map: waitingPlayers []*playerSession
}

// NewServer creates a new matchmaking server instance
func NewServer(cfg Config) *Server {
	if cfg.GameServerAddress == "" {
		cfg.GameServerAddress = "localhost:10052" // Default game server address
		log.Printf("Warning: GameServerAddress not specified, using default: %s", cfg.GameServerAddress)
	}
	return &Server{
		config: cfg,
		// waitingPlayers: make([]*playerSession, 0), // Use this for multi-player queue
	}
}

// JoinQueue handles a player's request to join the matchmaking queue
func (s *Server) JoinQueue(req *pb.JoinQueueRequest, stream pb.MatchmakingService_JoinQueueServer) error {
	playerID := req.GetPlayerId()
	if playerID == "" {
		return status.Error(codes.InvalidArgument, "player_id cannot be empty")
	}

	log.Printf("Player %s attempting to join queue...", playerID)

	session := &playerSession{
		id:        playerID,
		stream:    stream,
		matchChan: make(chan *pb.MatchDetails, 1), // Buffered to avoid blocking sender
		doneChan:  make(chan struct{}),
	}

	s.mu.Lock()
	// --- Critical Section Start ---

	// Check if there's already a player waiting
	if s.waitingPlayer != nil {
		// Match Found!
		otherSession := s.waitingPlayer
		s.waitingPlayer = nil // Clear the waiting spot

		s.mu.Unlock() // --- Critical Section End --- (Unlock before potentially long operations)

		log.Printf("Match found between %s and %s", session.id, otherSession.id)

		// Generate match details
		matchID := uuid.New().String()
		details := &pb.MatchDetails{
			MatchId:           matchID,
			Player1Id:         otherSession.id, // Assign player roles
			Player2Id:         session.id,
			GameServerAddress: s.config.GameServerAddress,
		}

		// Notify both players using their channels (non-blocking)
		select {
		case otherSession.matchChan <- details:
			log.Printf("Sent match details to player %s", otherSession.id)
		default:
			log.Printf("Warning: Failed to send match details to player %s (channel full or closed)", otherSession.id)
			// Optionally try to notify the current player session about the failure
			return status.Error(codes.Internal, "failed to notify other player")
		}

		// Also notify the current player via its channel
		session.matchChan <- details
		log.Printf("Sent match details to player %s (current)", session.id)

		// Signal both goroutines that they are done (match found)
		close(otherSession.doneChan) // Signal the other waiting goroutine
		// The current goroutine will exit after the select loop below receives from matchChan

	} else {
		// No player waiting, this player becomes the waiting player
		s.waitingPlayer = session
		s.mu.Unlock() // --- Critical Section End ---

		log.Printf("Player %s is now waiting in queue...", session.id)

		// Send WAITING update to the client
		err := stream.Send(&pb.QueueUpdate{
			Status:  pb.QueueUpdate_WAITING_FOR_PLAYER,
			Message: "Waiting for another player...",
		})
		if err != nil {
			log.Printf("Error sending WAITING update to %s: %v", session.id, err)
			// Attempt to remove player if send failed immediately (might already be handled by context)
			s.removeWaitingPlayer(session.id) // Use helper func
			return status.Errorf(codes.Internal, "failed to send initial status: %v", err)
		}
	}

	// Wait for match, client disconnect, or explicit leave
	select {
	case details := <-session.matchChan:
		log.Printf("Match confirmed for %s, sending final update.", session.id)
		err := stream.Send(&pb.QueueUpdate{
			Status:  pb.QueueUpdate_MATCH_FOUND,
			Details: details,
		})
		if err != nil {
			log.Printf("Error sending MATCH_FOUND update to %s: %v", session.id, err)
			return status.Errorf(codes.Internal, "failed to send match details: %v", err)
		}
		log.Printf("Successfully sent match details to %s", session.id)
		return nil // Success, stream will be closed by gRPC

	case <-session.doneChan:
		// Player was removed via LeaveQueue or matched by another goroutine
		log.Printf("JoinQueue for %s signaled done, closing stream.", session.id)
		// We might want to send a specific status update here if needed
		return nil // Clean exit

	case <-stream.Context().Done():
		// Client disconnected
		log.Printf("Player %s disconnected while waiting.", session.id)
		s.removeWaitingPlayer(session.id) // Clean up if they were waiting
		return status.Error(codes.Canceled, "client disconnected")
	}
}

// LeaveQueue handles a player's request to explicitly leave the queue
func (s *Server) LeaveQueue(ctx context.Context, req *pb.LeaveQueueRequest) (*emptypb.Empty, error) {
	playerID := req.GetPlayerId()
	if playerID == "" {
		return nil, status.Error(codes.InvalidArgument, "player_id cannot be empty")
	}

	log.Printf("Player %s attempting to leave queue...", playerID)

	removed := s.removeWaitingPlayer(playerID)

	if removed {
		log.Printf("Player %s successfully removed from queue.", playerID)
		return &emptypb.Empty{}, nil
	}

	log.Printf("Player %s not found in waiting queue.", playerID)
	return nil, status.Errorf(codes.NotFound, "player %s not in queue", playerID)

}

// removeWaitingPlayer is a helper to remove a player from the queue safely
func (s *Server) removeWaitingPlayer(playerID string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.waitingPlayer != nil && s.waitingPlayer.id == playerID {
		// Close the doneChan to signal the waiting JoinQueue goroutine to exit
		close(s.waitingPlayer.doneChan)
		s.waitingPlayer = nil
		return true // Player was waiting and is now removed
	}
	// To extend this for multiple waiting players:
	// Iterate through s.waitingPlayers, find the player, remove from slice, close doneChan.

	return false // Player wasn't waiting
}

// --- Helper function to simulate finding a game server (replace with real logic) ---
// func (s *Server) findAvailableGameServer() string {
// 	// In a real scenario, this would query a discovery service,
// 	// check a list of available servers, or maybe even provision one.
// 	return s.config.GameServerAddress // Return the configured one for now
// }