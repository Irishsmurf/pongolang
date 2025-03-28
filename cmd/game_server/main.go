package main

import (
	"flag"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	"github.com/Irishsmurf/pongolang/internal/game" // Adjust import path
	pb "github.com/Irishsmurf/pongolang/api/gen/go/game"  // Adjust import path

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection" // Optional: for grpc_cli or other tools
)

func main() {
	// --- Configuration Flags ---
	port := flag.Int("port", 10052, "Port for the game server to listen on")
	// Add other config flags if needed (e.g., different game settings)
	flag.Parse()

	listenAddr := fmt.Sprintf(":%d", *port)
	log.Printf("Starting Game Server on %s", listenAddr)

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

	// --- Create Game Service Implementation ---
	// Pass any required config to NewServer if you add it later
	gameSrv := game.NewServer()

	// --- Register Service ---
	pb.RegisterGameServiceServer(grpcServer, gameSrv)

	// Optional: Register reflection service for tools like grpc_cli
	reflection.Register(grpcServer)
	log.Printf("Registered GameService and Reflection service")

	// --- Start Serving in Goroutine ---
	go func() {
		log.Printf("Game server ready and listening...")
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("Failed to serve gRPC: %v", err)
		}
	}()

	// --- Graceful Shutdown Handling ---
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit // Block until SIGINT or SIGTERM is received

	log.Println("Shutting down gRPC server...")
	grpcServer.GracefulStop() // Stop accepting new connections, wait for existing ones to finish (within limits)
	log.Println("gRPC server stopped.")

	// You might want to signal the game loop to stop here too if it needs extra cleanup
	// close(gameSrv.stopLoop) // Assuming stopLoop is accessible or via a Stop() method
	// gameSrv.loopWG.Wait() // Wait if needed
}