/**
 * @fileoverview gRPC-Web generated client stub for metadata
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v6.30.2
// source: metadata/metadata.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as metadata_metadata_pb from '../metadata/metadata_pb'; // proto import: "metadata/metadata.proto"


export class MetadataServiceClient {
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

  methodDescriptorRegisterPlayer = new grpcWeb.MethodDescriptor(
    '/metadata.MetadataService/RegisterPlayer',
    grpcWeb.MethodType.UNARY,
    metadata_metadata_pb.RegisterPlayerRequest,
    metadata_metadata_pb.RegisterPlayerResponse,
    (request: metadata_metadata_pb.RegisterPlayerRequest) => {
      return request.serializeBinary();
    },
    metadata_metadata_pb.RegisterPlayerResponse.deserializeBinary
  );

  registerPlayer(
    request: metadata_metadata_pb.RegisterPlayerRequest,
    metadata?: grpcWeb.Metadata | null): Promise<metadata_metadata_pb.RegisterPlayerResponse>;

  registerPlayer(
    request: metadata_metadata_pb.RegisterPlayerRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.RegisterPlayerResponse) => void): grpcWeb.ClientReadableStream<metadata_metadata_pb.RegisterPlayerResponse>;

  registerPlayer(
    request: metadata_metadata_pb.RegisterPlayerRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.RegisterPlayerResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/metadata.MetadataService/RegisterPlayer',
        request,
        metadata || {},
        this.methodDescriptorRegisterPlayer,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/metadata.MetadataService/RegisterPlayer',
    request,
    metadata || {},
    this.methodDescriptorRegisterPlayer);
  }

  methodDescriptorGetPlayer = new grpcWeb.MethodDescriptor(
    '/metadata.MetadataService/GetPlayer',
    grpcWeb.MethodType.UNARY,
    metadata_metadata_pb.GetPlayerRequest,
    metadata_metadata_pb.GetPlayerResponse,
    (request: metadata_metadata_pb.GetPlayerRequest) => {
      return request.serializeBinary();
    },
    metadata_metadata_pb.GetPlayerResponse.deserializeBinary
  );

  getPlayer(
    request: metadata_metadata_pb.GetPlayerRequest,
    metadata?: grpcWeb.Metadata | null): Promise<metadata_metadata_pb.GetPlayerResponse>;

  getPlayer(
    request: metadata_metadata_pb.GetPlayerRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.GetPlayerResponse) => void): grpcWeb.ClientReadableStream<metadata_metadata_pb.GetPlayerResponse>;

  getPlayer(
    request: metadata_metadata_pb.GetPlayerRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.GetPlayerResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/metadata.MetadataService/GetPlayer',
        request,
        metadata || {},
        this.methodDescriptorGetPlayer,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/metadata.MetadataService/GetPlayer',
    request,
    metadata || {},
    this.methodDescriptorGetPlayer);
  }

  methodDescriptorSubmitScore = new grpcWeb.MethodDescriptor(
    '/metadata.MetadataService/SubmitScore',
    grpcWeb.MethodType.UNARY,
    metadata_metadata_pb.SubmitScoreRequest,
    metadata_metadata_pb.SubmitScoreResponse,
    (request: metadata_metadata_pb.SubmitScoreRequest) => {
      return request.serializeBinary();
    },
    metadata_metadata_pb.SubmitScoreResponse.deserializeBinary
  );

  submitScore(
    request: metadata_metadata_pb.SubmitScoreRequest,
    metadata?: grpcWeb.Metadata | null): Promise<metadata_metadata_pb.SubmitScoreResponse>;

  submitScore(
    request: metadata_metadata_pb.SubmitScoreRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.SubmitScoreResponse) => void): grpcWeb.ClientReadableStream<metadata_metadata_pb.SubmitScoreResponse>;

  submitScore(
    request: metadata_metadata_pb.SubmitScoreRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.SubmitScoreResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/metadata.MetadataService/SubmitScore',
        request,
        metadata || {},
        this.methodDescriptorSubmitScore,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/metadata.MetadataService/SubmitScore',
    request,
    metadata || {},
    this.methodDescriptorSubmitScore);
  }

  methodDescriptorGetHighScores = new grpcWeb.MethodDescriptor(
    '/metadata.MetadataService/GetHighScores',
    grpcWeb.MethodType.UNARY,
    metadata_metadata_pb.GetHighScoresRequest,
    metadata_metadata_pb.GetHighScoresResponse,
    (request: metadata_metadata_pb.GetHighScoresRequest) => {
      return request.serializeBinary();
    },
    metadata_metadata_pb.GetHighScoresResponse.deserializeBinary
  );

  getHighScores(
    request: metadata_metadata_pb.GetHighScoresRequest,
    metadata?: grpcWeb.Metadata | null): Promise<metadata_metadata_pb.GetHighScoresResponse>;

  getHighScores(
    request: metadata_metadata_pb.GetHighScoresRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.GetHighScoresResponse) => void): grpcWeb.ClientReadableStream<metadata_metadata_pb.GetHighScoresResponse>;

  getHighScores(
    request: metadata_metadata_pb.GetHighScoresRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: metadata_metadata_pb.GetHighScoresResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/metadata.MetadataService/GetHighScores',
        request,
        metadata || {},
        this.methodDescriptorGetHighScores,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/metadata.MetadataService/GetHighScores',
    request,
    metadata || {},
    this.methodDescriptorGetHighScores);
  }

}

