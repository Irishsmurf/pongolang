import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"


export class QueueUpdate extends jspb.Message {
  getStatus(): QueueUpdate.Status;
  setStatus(value: QueueUpdate.Status): QueueUpdate;

  getDetails(): MatchDetails | undefined;
  setDetails(value?: MatchDetails): QueueUpdate;
  hasDetails(): boolean;
  clearDetails(): QueueUpdate;

  getMessage(): string;
  setMessage(value: string): QueueUpdate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QueueUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: QueueUpdate): QueueUpdate.AsObject;
  static serializeBinaryToWriter(message: QueueUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QueueUpdate;
  static deserializeBinaryFromReader(message: QueueUpdate, reader: jspb.BinaryReader): QueueUpdate;
}

export namespace QueueUpdate {
  export type AsObject = {
    status: QueueUpdate.Status,
    details?: MatchDetails.AsObject,
    message: string,
  }

  export enum Status { 
    STATUS_UNSPECIFIED = 0,
    WAITING_FOR_PLAYER = 1,
    MATCH_FOUND = 2,
    QUEUE_TIMEOUT = 3,
    QUEUE_ERROR = 4,
  }

  export enum DetailsCase { 
    _DETAILS_NOT_SET = 0,
    DETAILS = 2,
  }
}

export class MatchDetails extends jspb.Message {
  getMatchId(): string;
  setMatchId(value: string): MatchDetails;

  getPlayer1Id(): string;
  setPlayer1Id(value: string): MatchDetails;

  getPlayer2Id(): string;
  setPlayer2Id(value: string): MatchDetails;

  getGameServerAddress(): string;
  setGameServerAddress(value: string): MatchDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchDetails.AsObject;
  static toObject(includeInstance: boolean, msg: MatchDetails): MatchDetails.AsObject;
  static serializeBinaryToWriter(message: MatchDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchDetails;
  static deserializeBinaryFromReader(message: MatchDetails, reader: jspb.BinaryReader): MatchDetails;
}

export namespace MatchDetails {
  export type AsObject = {
    matchId: string,
    player1Id: string,
    player2Id: string,
    gameServerAddress: string,
  }
}

export class JoinQueueRequest extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): JoinQueueRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinQueueRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JoinQueueRequest): JoinQueueRequest.AsObject;
  static serializeBinaryToWriter(message: JoinQueueRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinQueueRequest;
  static deserializeBinaryFromReader(message: JoinQueueRequest, reader: jspb.BinaryReader): JoinQueueRequest;
}

export namespace JoinQueueRequest {
  export type AsObject = {
    playerId: string,
  }
}

export class LeaveQueueRequest extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): LeaveQueueRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LeaveQueueRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LeaveQueueRequest): LeaveQueueRequest.AsObject;
  static serializeBinaryToWriter(message: LeaveQueueRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LeaveQueueRequest;
  static deserializeBinaryFromReader(message: LeaveQueueRequest, reader: jspb.BinaryReader): LeaveQueueRequest;
}

export namespace LeaveQueueRequest {
  export type AsObject = {
    playerId: string,
  }
}

