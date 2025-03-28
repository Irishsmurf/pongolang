#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define source and destination directories relative to the script's location (or project root if run from there)
PROJECT_ROOT=$(git rev-parse --show-toplevel) # Assumes script is in a subdir of git repo
PROTO_SRC_DIR="${PROJECT_ROOT}/api/proto"
GO_OUT_DIR="${PROJECT_ROOT}/" # Output Go code relative to module root, respecting go_package
JS_OUT_DIR="${PROJECT_ROOT}/api/gen/js" # Output JS/TS code here

# Create output directories if they don't exist
mkdir -p "${JS_OUT_DIR}/metadata"
mkdir -p "${JS_OUT_DIR}/matchmaking"
mkdir -p "${JS_OUT_DIR}/game"
# Go directories will be created automatically based on go_package option

echo "Removing old generated code..."
rm -rf "${PROJECT_ROOT}/api/gen/go" # Remove old Go generated code completely
rm -rf "${JS_OUT_DIR}/*"            # Clear JS output dir

echo "Generating Go code..."
protoc \
  --proto_path="${PROTO_SRC_DIR}" \
  --go_out="${GO_OUT_DIR}" \
  --go-grpc_out="${GO_OUT_DIR}" \
  "${PROTO_SRC_DIR}/metadata/metadata.proto" \
  "${PROTO_SRC_DIR}/matchmaking/matchmaking.proto" \
  "${PROTO_SRC_DIR}/game/game.proto"

echo "Generating gRPC-Web (JavaScript/TypeScript) code..."
protoc \
  --proto_path="${PROTO_SRC_DIR}" \
  --js_out=import_style=commonjs,binary:"${JS_OUT_DIR}" \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:"${JS_OUT_DIR}" \
  "${PROTO_SRC_DIR}/metadata/metadata.proto" \
  "${PROTO_SRC_DIR}/matchmaking/matchmaking.proto" \
  "${PROTO_SRC_DIR}/game/game.proto"

echo "Proto generation complete."

# Optional: Tidy Go modules after generation
# cd "${PROJECT_ROOT}" && go mod tidy

exit 0