import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class Player extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): Player;

  getDisplayName(): string;
  setDisplayName(value: string): Player;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Player;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Player;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Player.AsObject;
  static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
  static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Player;
  static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
}

export namespace Player {
  export type AsObject = {
    playerId: string,
    displayName: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class Score extends jspb.Message {
  getScoreId(): string;
  setScoreId(value: string): Score;

  getPlayerId(): string;
  setPlayerId(value: string): Score;

  getPlayerDisplayName(): string;
  setPlayerDisplayName(value: string): Score;

  getPoints(): number;
  setPoints(value: number): Score;

  getAchievedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setAchievedAt(value?: google_protobuf_timestamp_pb.Timestamp): Score;
  hasAchievedAt(): boolean;
  clearAchievedAt(): Score;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Score.AsObject;
  static toObject(includeInstance: boolean, msg: Score): Score.AsObject;
  static serializeBinaryToWriter(message: Score, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Score;
  static deserializeBinaryFromReader(message: Score, reader: jspb.BinaryReader): Score;
}

export namespace Score {
  export type AsObject = {
    scoreId: string,
    playerId: string,
    playerDisplayName: string,
    points: number,
    achievedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class RegisterPlayerRequest extends jspb.Message {
  getDesiredDisplayName(): string;
  setDesiredDisplayName(value: string): RegisterPlayerRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterPlayerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterPlayerRequest): RegisterPlayerRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterPlayerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterPlayerRequest;
  static deserializeBinaryFromReader(message: RegisterPlayerRequest, reader: jspb.BinaryReader): RegisterPlayerRequest;
}

export namespace RegisterPlayerRequest {
  export type AsObject = {
    desiredDisplayName: string,
  }
}

export class RegisterPlayerResponse extends jspb.Message {
  getPlayer(): Player | undefined;
  setPlayer(value?: Player): RegisterPlayerResponse;
  hasPlayer(): boolean;
  clearPlayer(): RegisterPlayerResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterPlayerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterPlayerResponse): RegisterPlayerResponse.AsObject;
  static serializeBinaryToWriter(message: RegisterPlayerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterPlayerResponse;
  static deserializeBinaryFromReader(message: RegisterPlayerResponse, reader: jspb.BinaryReader): RegisterPlayerResponse;
}

export namespace RegisterPlayerResponse {
  export type AsObject = {
    player?: Player.AsObject,
  }
}

export class GetPlayerRequest extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): GetPlayerRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlayerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlayerRequest): GetPlayerRequest.AsObject;
  static serializeBinaryToWriter(message: GetPlayerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlayerRequest;
  static deserializeBinaryFromReader(message: GetPlayerRequest, reader: jspb.BinaryReader): GetPlayerRequest;
}

export namespace GetPlayerRequest {
  export type AsObject = {
    playerId: string,
  }
}

export class GetPlayerResponse extends jspb.Message {
  getPlayer(): Player | undefined;
  setPlayer(value?: Player): GetPlayerResponse;
  hasPlayer(): boolean;
  clearPlayer(): GetPlayerResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlayerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlayerResponse): GetPlayerResponse.AsObject;
  static serializeBinaryToWriter(message: GetPlayerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlayerResponse;
  static deserializeBinaryFromReader(message: GetPlayerResponse, reader: jspb.BinaryReader): GetPlayerResponse;
}

export namespace GetPlayerResponse {
  export type AsObject = {
    player?: Player.AsObject,
  }
}

export class SubmitScoreRequest extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): SubmitScoreRequest;

  getPoints(): number;
  setPoints(value: number): SubmitScoreRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitScoreRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitScoreRequest): SubmitScoreRequest.AsObject;
  static serializeBinaryToWriter(message: SubmitScoreRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitScoreRequest;
  static deserializeBinaryFromReader(message: SubmitScoreRequest, reader: jspb.BinaryReader): SubmitScoreRequest;
}

export namespace SubmitScoreRequest {
  export type AsObject = {
    playerId: string,
    points: number,
  }
}

export class SubmitScoreResponse extends jspb.Message {
  getScore(): Score | undefined;
  setScore(value?: Score): SubmitScoreResponse;
  hasScore(): boolean;
  clearScore(): SubmitScoreResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SubmitScoreResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SubmitScoreResponse): SubmitScoreResponse.AsObject;
  static serializeBinaryToWriter(message: SubmitScoreResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SubmitScoreResponse;
  static deserializeBinaryFromReader(message: SubmitScoreResponse, reader: jspb.BinaryReader): SubmitScoreResponse;
}

export namespace SubmitScoreResponse {
  export type AsObject = {
    score?: Score.AsObject,
  }
}

export class GetHighScoresRequest extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): GetHighScoresRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHighScoresRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetHighScoresRequest): GetHighScoresRequest.AsObject;
  static serializeBinaryToWriter(message: GetHighScoresRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHighScoresRequest;
  static deserializeBinaryFromReader(message: GetHighScoresRequest, reader: jspb.BinaryReader): GetHighScoresRequest;
}

export namespace GetHighScoresRequest {
  export type AsObject = {
    limit: number,
  }
}

export class GetHighScoresResponse extends jspb.Message {
  getScoresList(): Array<Score>;
  setScoresList(value: Array<Score>): GetHighScoresResponse;
  clearScoresList(): GetHighScoresResponse;
  addScores(value?: Score, index?: number): Score;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetHighScoresResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetHighScoresResponse): GetHighScoresResponse.AsObject;
  static serializeBinaryToWriter(message: GetHighScoresResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetHighScoresResponse;
  static deserializeBinaryFromReader(message: GetHighScoresResponse, reader: jspb.BinaryReader): GetHighScoresResponse;
}

export namespace GetHighScoresResponse {
  export type AsObject = {
    scoresList: Array<Score.AsObject>,
  }
}

