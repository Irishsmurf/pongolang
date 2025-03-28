package game

import (
	"math/rand"
	"sync"

	pb "github.com/Irishsmurf/pongolang/api/gen/go/game" // Adjust import path
)

// --- Constants ---
const (
	ScreenWidth          = 800
	ScreenHeight         = 600
	PaddleWidth          = 15
	PaddleHeight         = 100
	BallSize             = 15
	InitialBallSpeedX    = 300 // pixels per second
	InitialBallSpeedY    = 300 // pixels per second
	PaddleSpeed          = 400 // pixels per second
	TargetTicksPerSecond = 60
	WinningScore         = 5
)

// --- Structs ---

type Vector2 struct {
	X float64
	Y float64
}

type Paddle struct {
	Pos      Vector2 // Center position
	Height   float64
	Width    float64
	Score    int32
	PlayerID string // To link paddle to player
}

type Ball struct {
	Pos  Vector2 // Center position
	Vel  Vector2 // Velocity in pixels per second
	Size float64
}

// GameState holds the complete state of one Pong game
type GameState struct {
	mu       sync.RWMutex // Protects access to state during updates/reads
	Ball     Ball
	Paddle1  Paddle  // Corresponds to player 1
	Paddle2  Paddle  // Corresponds to player 2
	Bounds   Vector2 // Screen width/height
	isPaused bool    // To pause before starting/resetting
}

// NewGameState initializes a new game state
func NewGameState(player1ID, player2ID string) *GameState {
	gs := &GameState{
		Bounds: Vector2{X: ScreenWidth, Y: ScreenHeight},
		Paddle1: Paddle{
			Pos:      Vector2{X: PaddleWidth, Y: ScreenHeight / 2.0}, // Left side
			Height:   PaddleHeight,
			Width:    PaddleWidth,
			PlayerID: player1ID,
		},
		Paddle2: Paddle{
			Pos:      Vector2{X: ScreenWidth - PaddleWidth, Y: ScreenHeight / 2.0}, // Right side
			Height:   PaddleHeight,
			Width:    PaddleWidth,
			PlayerID: player2ID,
		},
		Ball: Ball{
			Size: BallSize,
		},
		isPaused: true, // Start paused
	}
	gs.resetBall(false) // Start ball going towards player 1 (left)
	return gs
}

// resetBall places the ball in the center and gives it a random initial velocity
func (gs *GameState) resetBall(serveRight bool) {
	gs.Ball.Pos = Vector2{X: gs.Bounds.X / 2.0, Y: gs.Bounds.Y / 2.0}

	// Randomize initial Y direction slightly, fixed X
	dirX := InitialBallSpeedX
	if serveRight {
		dirX = -InitialBallSpeedX
	}

	dirY := InitialBallSpeedY
	if rand.Float64() > 0.5 {
		dirY = -InitialBallSpeedY
	}

	gs.Ball.Vel = Vector2{X: float64(dirX), Y: float64(dirY)}
	gs.isPaused = true // Pause briefly after reset
}

// Update progresses the game state by one tick
// delta is the time elapsed since the last tick (in seconds)
func (gs *GameState) Update(delta float64, input1, input2 pb.ClientToServer_PaddleInput_Direction) (scored bool, winner string) {
	gs.mu.Lock()
	defer gs.mu.Unlock()

	if gs.isPaused {
		// Simple pause timer could be added here if desired
		// For now, any input or time progression might unpause? Let's unpause immediately for simplicity
		gs.isPaused = false
		// return false, "" // uncomment if a real pause is desired
	}

	// --- Move Paddles ---
	gs.movePaddle(&gs.Paddle1, input1, delta)
	gs.movePaddle(&gs.Paddle2, input2, delta)

	// --- Move Ball ---
	gs.Ball.Pos.X += gs.Ball.Vel.X * delta
	gs.Ball.Pos.Y += gs.Ball.Vel.Y * delta

	// --- Collisions ---
	ballHalf := gs.Ball.Size / 2.0
	paddle1HalfH := gs.Paddle1.Height / 2.0
	paddle2HalfH := gs.Paddle2.Height / 2.0

	// Ball vs Top/Bottom Walls
	if gs.Ball.Pos.Y-ballHalf < 0 {
		gs.Ball.Pos.Y = ballHalf
		gs.Ball.Vel.Y = -gs.Ball.Vel.Y
	} else if gs.Ball.Pos.Y+ballHalf > gs.Bounds.Y {
		gs.Ball.Pos.Y = gs.Bounds.Y - ballHalf
		gs.Ball.Vel.Y = -gs.Ball.Vel.Y
	}

	// Ball vs Paddle 1 (Left)
	if gs.Ball.Vel.X < 0 && // Moving left
		gs.Ball.Pos.X-ballHalf < gs.Paddle1.Pos.X+gs.Paddle1.Width/2.0 && // Right edge of ball < Right edge of paddle
		gs.Ball.Pos.X+ballHalf > gs.Paddle1.Pos.X-gs.Paddle1.Width/2.0 { // Left edge of ball > Left edge of paddle (avoids phasing)
		if gs.Ball.Pos.Y > gs.Paddle1.Pos.Y-paddle1HalfH && gs.Ball.Pos.Y < gs.Paddle1.Pos.Y+paddle1HalfH {
			gs.Ball.Pos.X = gs.Paddle1.Pos.X + gs.Paddle1.Width/2.0 + ballHalf // Place ball just outside paddle
			gs.Ball.Vel.X = -gs.Ball.Vel.X
			// Optional: Add slight Y velocity change based on hit position
			// Optional: Increase ball speed
		}
	}

	// Ball vs Paddle 2 (Right)
	if gs.Ball.Vel.X > 0 && // Moving right
		gs.Ball.Pos.X+ballHalf > gs.Paddle2.Pos.X-gs.Paddle2.Width/2.0 && // Left edge of ball > Left edge of paddle
		gs.Ball.Pos.X-ballHalf < gs.Paddle2.Pos.X+gs.Paddle2.Width/2.0 { // Right edge of ball < Right edge of paddle
		if gs.Ball.Pos.Y > gs.Paddle2.Pos.Y-paddle2HalfH && gs.Ball.Pos.Y < gs.Paddle2.Pos.Y+paddle2HalfH {
			gs.Ball.Pos.X = gs.Paddle2.Pos.X - gs.Paddle2.Width/2.0 - ballHalf // Place ball just outside paddle
			gs.Ball.Vel.X = -gs.Ball.Vel.X
			// Optional: Velocity/speed changes
		}
	}

	// --- Scoring ---
	scored = false
	// Player 2 Scores (Ball past left edge)
	if gs.Ball.Pos.X+ballHalf < 0 {
		gs.Paddle2.Score++
		scored = true
		gs.resetBall(true) // Serve to player 2 (right)
	}
	// Player 1 Scores (Ball past right edge)
	if gs.Ball.Pos.X-ballHalf > gs.Bounds.X {
		gs.Paddle1.Score++
		scored = true
		gs.resetBall(false) // Serve to player 1 (left)
	}

	// --- Check Win Condition ---
	winner = ""
	if gs.Paddle1.Score >= WinningScore {
		winner = gs.Paddle1.PlayerID
	} else if gs.Paddle2.Score >= WinningScore {
		winner = gs.Paddle2.PlayerID
	}

	return scored, winner
}

// movePaddle updates paddle position based on input and bounds
func (gs *GameState) movePaddle(paddle *Paddle, direction pb.ClientToServer_PaddleInput_Direction, delta float64) {
	paddleHalfH := paddle.Height / 2.0
	switch direction {
	case pb.ClientToServer_PaddleInput_UP:
		paddle.Pos.Y -= PaddleSpeed * delta
		if paddle.Pos.Y-paddleHalfH < 0 {
			paddle.Pos.Y = paddleHalfH
		}
	case pb.ClientToServer_PaddleInput_DOWN:
		paddle.Pos.Y += PaddleSpeed * delta
		if paddle.Pos.Y+paddleHalfH > gs.Bounds.Y {
			paddle.Pos.Y = gs.Bounds.Y - paddleHalfH
		}
	case pb.ClientToServer_PaddleInput_STOP, pb.ClientToServer_PaddleInput_DIRECTION_UNSPECIFIED:
		// Do nothing
	}
}

// ToProto converts GameState to its protobuf representation
// Uses RLock for safe concurrent reading
func (gs *GameState) ToProto(matchID string) *pb.GameState {
	gs.mu.RLock()
	defer gs.mu.RUnlock()

	return &pb.GameState{
		MatchId: matchID,
		Ball: &pb.BallState{
			Position: &pb.Vector2{X: float32(gs.Ball.Pos.X), Y: float32(gs.Ball.Pos.Y)},
			Velocity: &pb.Vector2{X: float32(gs.Ball.Vel.X), Y: float32(gs.Ball.Vel.Y)},
		},
		Player1Paddle: &pb.PaddleState{
			PlayerId: gs.Paddle1.PlayerID,
			Position: &pb.Vector2{X: float32(gs.Paddle1.Pos.X), Y: float32(gs.Paddle1.Pos.Y)},
		},
		Player2Paddle: &pb.PaddleState{
			PlayerId: gs.Paddle2.PlayerID,
			Position: &pb.Vector2{X: float32(gs.Paddle2.Pos.X), Y: float32(gs.Paddle2.Pos.Y)},
		},
		Score: &pb.ScoreState{
			Player1Score: gs.Paddle1.Score,
			Player2Score: gs.Paddle2.Score,
		},
		Player1Id: gs.Paddle1.PlayerID,
		Player2Id: gs.Paddle2.PlayerID,
	}
}

// GetScoreState returns the current score state (thread-safe)
func (gs *GameState) GetScoreState() *pb.ScoreState {
	gs.mu.RLock()
	defer gs.mu.RUnlock()
	return &pb.ScoreState{
		Player1Score: gs.Paddle1.Score,
		Player2Score: gs.Paddle2.Score,
	}
}
