package main

import (
	"flag"
	"fmt"
	"log"
	"net"

	"github.com/Irishsmurf/pongolang/internal/matchmaking" // Adjust import path
	pb "github.com/Irishsmurf/pongolang/api/gen/go/matchmaking"  // Adjust import path

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection" // Optional: for grpc_cli or other tools
)

func main() {
	// --- Configuration Flags ---
	port := flag.Int("port", 10051, "Port for the matchmaking server to listen on")
	gameServerAddr := flag.String("game-server", "localhost:10051", "Address (host:port) of the game server")
	flag.Parse()

	listenAddr := fmt.Sprintf(":%d", *port)
	log.Printf("Starting Matchmaking Server on %s", listenAddr)

	// --- Create Listener ---
	lis, err := net.Listen("tcp", listenAddr)
	if err != nil {
		log.Fatalf("Failed to listen on port %d: %v", *port, err)
	}

	// --- Create gRPC Server ---
	grpcServer := grpc.NewServer(
	// Add interceptors for logging, auth, etc. if needed
	// grpc.UnaryInterceptor(...),
	// grpc.StreamInterceptor(...),
	)

	// --- Create Matchmaking Service Implementation ---
	matchmakingCfg := matchmaking.Config{
		GameServerAddress: *gameServerAddr,
	}
	matchmakingSrv := matchmaking.NewServer(matchmakingCfg)

	// --- Register Service ---
	pb.RegisterMatchmakingServiceServer(grpcServer, matchmakingSrv)

	// Optional: Register reflection service for tools like grpc_cli
	reflection.Register(grpcServer)
	log.Printf("Registered MatchmakingService and Reflection service")

	// --- Start Serving ---
	log.Printf("Matchmaking server ready and listening...")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve gRPC: %v", err)
	}
}