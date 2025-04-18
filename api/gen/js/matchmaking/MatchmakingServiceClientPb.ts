/**
 * @fileoverview gRPC-Web generated client stub for matchmaking
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v6.30.2
// source: matchmaking/matchmaking.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as matchmaking_matchmaking_pb from '../matchmaking/matchmaking_pb'; // proto import: "matchmaking/matchmaking.proto"


export class MatchmakingServiceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorJoinQueue = new grpcWeb.MethodDescriptor(
    '/matchmaking.MatchmakingService/JoinQueue',
    grpcWeb.MethodType.SERVER_STREAMING,
    matchmaking_matchmaking_pb.JoinQueueRequest,
    matchmaking_matchmaking_pb.QueueUpdate,
    (request: matchmaking_matchmaking_pb.JoinQueueRequest) => {
      return request.serializeBinary();
    },
    matchmaking_matchmaking_pb.QueueUpdate.deserializeBinary
  );

  joinQueue(
    request: matchmaking_matchmaking_pb.JoinQueueRequest,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<matchmaking_matchmaking_pb.QueueUpdate> {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/matchmaking.MatchmakingService/JoinQueue',
      request,
      metadata || {},
      this.methodDescriptorJoinQueue);
  }

  methodDescriptorLeaveQueue = new grpcWeb.MethodDescriptor(
    '/matchmaking.MatchmakingService/LeaveQueue',
    grpcWeb.MethodType.UNARY,
    matchmaking_matchmaking_pb.LeaveQueueRequest,
    google_protobuf_empty_pb.Empty,
    (request: matchmaking_matchmaking_pb.LeaveQueueRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  leaveQueue(
    request: matchmaking_matchmaking_pb.LeaveQueueRequest,
    metadata?: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  leaveQueue(
    request: matchmaking_matchmaking_pb.LeaveQueueRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  leaveQueue(
    request: matchmaking_matchmaking_pb.LeaveQueueRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/matchmaking.MatchmakingService/LeaveQueue',
        request,
        metadata || {},
        this.methodDescriptorLeaveQueue,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/matchmaking.MatchmakingService/LeaveQueue',
    request,
    metadata || {},
    this.methodDescriptorLeaveQueue);
  }

}

