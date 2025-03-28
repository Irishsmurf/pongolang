import * as jspb from 'google-protobuf'



export class Vector2 extends jspb.Message {
  getX(): number;
  setX(value: number): Vector2;

  getY(): number;
  setY(value: number): Vector2;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Vector2.AsObject;
  static toObject(includeInstance: boolean, msg: Vector2): Vector2.AsObject;
  static serializeBinaryToWriter(message: Vector2, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Vector2;
  static deserializeBinaryFromReader(message: Vector2, reader: jspb.BinaryReader): Vector2;
}

export namespace Vector2 {
  export type AsObject = {
    x: number,
    y: number,
  }
}

export class PaddleState extends jspb.Message {
  getPlayerId(): string;
  setPlayerId(value: string): PaddleState;

  getPosition(): Vector2 | undefined;
  setPosition(value?: Vector2): PaddleState;
  hasPosition(): boolean;
  clearPosition(): PaddleState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaddleState.AsObject;
  static toObject(includeInstance: boolean, msg: PaddleState): PaddleState.AsObject;
  static serializeBinaryToWriter(message: PaddleState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaddleState;
  static deserializeBinaryFromReader(message: PaddleState, reader: jspb.BinaryReader): PaddleState;
}

export namespace PaddleState {
  export type AsObject = {
    playerId: string,
    position?: Vector2.AsObject,
  }
}

export class BallState extends jspb.Message {
  getPosition(): Vector2 | undefined;
  setPosition(value?: Vector2): BallState;
  hasPosition(): boolean;
  clearPosition(): BallState;

  getVelocity(): Vector2 | undefined;
  setVelocity(value?: Vector2): BallState;
  hasVelocity(): boolean;
  clearVelocity(): BallState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BallState.AsObject;
  static toObject(includeInstance: boolean, msg: BallState): BallState.AsObject;
  static serializeBinaryToWriter(message: BallState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BallState;
  static deserializeBinaryFromReader(message: BallState, reader: jspb.BinaryReader): BallState;
}

export namespace BallState {
  export type AsObject = {
    position?: Vector2.AsObject,
    velocity?: Vector2.AsObject,
  }
}

export class ScoreState extends jspb.Message {
  getPlayer1Score(): number;
  setPlayer1Score(value: number): ScoreState;

  getPlayer2Score(): number;
  setPlayer2Score(value: number): ScoreState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ScoreState.AsObject;
  static toObject(includeInstance: boolean, msg: ScoreState): ScoreState.AsObject;
  static serializeBinaryToWriter(message: ScoreState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ScoreState;
  static deserializeBinaryFromReader(message: ScoreState, reader: jspb.BinaryReader): ScoreState;
}

export namespace ScoreState {
  export type AsObject = {
    player1Score: number,
    player2Score: number,
  }
}

export class GameState extends jspb.Message {
  getMatchId(): string;
  setMatchId(value: string): GameState;

  getBall(): BallState | undefined;
  setBall(value?: BallState): GameState;
  hasBall(): boolean;
  clearBall(): GameState;

  getPlayer1Paddle(): PaddleState | undefined;
  setPlayer1Paddle(value?: PaddleState): GameState;
  hasPlayer1Paddle(): boolean;
  clearPlayer1Paddle(): GameState;

  getPlayer2Paddle(): PaddleState | undefined;
  setPlayer2Paddle(value?: PaddleState): GameState;
  hasPlayer2Paddle(): boolean;
  clearPlayer2Paddle(): GameState;

  getScore(): ScoreState | undefined;
  setScore(value?: ScoreState): GameState;
  hasScore(): boolean;
  clearScore(): GameState;

  getPlayer1Id(): string;
  setPlayer1Id(value: string): GameState;

  getPlayer2Id(): string;
  setPlayer2Id(value: string): GameState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameState.AsObject;
  static toObject(includeInstance: boolean, msg: GameState): GameState.AsObject;
  static serializeBinaryToWriter(message: GameState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameState;
  static deserializeBinaryFromReader(message: GameState, reader: jspb.BinaryReader): GameState;
}

export namespace GameState {
  export type AsObject = {
    matchId: string,
    ball?: BallState.AsObject,
    player1Paddle?: PaddleState.AsObject,
    player2Paddle?: PaddleState.AsObject,
    score?: ScoreState.AsObject,
    player1Id: string,
    player2Id: string,
  }
}

export class GameEvent extends jspb.Message {
  getScoreUpdate(): GameEvent.ScoreUpdate | undefined;
  setScoreUpdate(value?: GameEvent.ScoreUpdate): GameEvent;
  hasScoreUpdate(): boolean;
  clearScoreUpdate(): GameEvent;

  getGameOver(): GameEvent.GameOver | undefined;
  setGameOver(value?: GameEvent.GameOver): GameEvent;
  hasGameOver(): boolean;
  clearGameOver(): GameEvent;

  getEventTypeCase(): GameEvent.EventTypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GameEvent.AsObject;
  static toObject(includeInstance: boolean, msg: GameEvent): GameEvent.AsObject;
  static serializeBinaryToWriter(message: GameEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GameEvent;
  static deserializeBinaryFromReader(message: GameEvent, reader: jspb.BinaryReader): GameEvent;
}

export namespace GameEvent {
  export type AsObject = {
    scoreUpdate?: GameEvent.ScoreUpdate.AsObject,
    gameOver?: GameEvent.GameOver.AsObject,
  }

  export class ScoreUpdate extends jspb.Message {
    getNewScore(): ScoreState | undefined;
    setNewScore(value?: ScoreState): ScoreUpdate;
    hasNewScore(): boolean;
    clearNewScore(): ScoreUpdate;

    getScoringPlayerId(): string;
    setScoringPlayerId(value: string): ScoreUpdate;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ScoreUpdate.AsObject;
    static toObject(includeInstance: boolean, msg: ScoreUpdate): ScoreUpdate.AsObject;
    static serializeBinaryToWriter(message: ScoreUpdate, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ScoreUpdate;
    static deserializeBinaryFromReader(message: ScoreUpdate, reader: jspb.BinaryReader): ScoreUpdate;
  }

  export namespace ScoreUpdate {
    export type AsObject = {
      newScore?: ScoreState.AsObject,
      scoringPlayerId: string,
    }
  }


  export class GameOver extends jspb.Message {
    getWinnerPlayerId(): string;
    setWinnerPlayerId(value: string): GameOver;

    getLoserPlayerId(): string;
    setLoserPlayerId(value: string): GameOver;

    getFinalScore(): ScoreState | undefined;
    setFinalScore(value?: ScoreState): GameOver;
    hasFinalScore(): boolean;
    clearFinalScore(): GameOver;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GameOver.AsObject;
    static toObject(includeInstance: boolean, msg: GameOver): GameOver.AsObject;
    static serializeBinaryToWriter(message: GameOver, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GameOver;
    static deserializeBinaryFromReader(message: GameOver, reader: jspb.BinaryReader): GameOver;
  }

  export namespace GameOver {
    export type AsObject = {
      winnerPlayerId: string,
      loserPlayerId: string,
      finalScore?: ScoreState.AsObject,
    }
  }


  export enum EventTypeCase { 
    EVENT_TYPE_NOT_SET = 0,
    SCORE_UPDATE = 1,
    GAME_OVER = 2,
  }
}

export class ClientToServer extends jspb.Message {
  getConnectRequest(): ClientToServer.InitialConnect | undefined;
  setConnectRequest(value?: ClientToServer.InitialConnect): ClientToServer;
  hasConnectRequest(): boolean;
  clearConnectRequest(): ClientToServer;

  getInput(): ClientToServer.PaddleInput | undefined;
  setInput(value?: ClientToServer.PaddleInput): ClientToServer;
  hasInput(): boolean;
  clearInput(): ClientToServer;

  getMessageTypeCase(): ClientToServer.MessageTypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientToServer.AsObject;
  static toObject(includeInstance: boolean, msg: ClientToServer): ClientToServer.AsObject;
  static serializeBinaryToWriter(message: ClientToServer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientToServer;
  static deserializeBinaryFromReader(message: ClientToServer, reader: jspb.BinaryReader): ClientToServer;
}

export namespace ClientToServer {
  export type AsObject = {
    connectRequest?: ClientToServer.InitialConnect.AsObject,
    input?: ClientToServer.PaddleInput.AsObject,
  }

  export class InitialConnect extends jspb.Message {
    getPlayerId(): string;
    setPlayerId(value: string): InitialConnect;

    getMatchId(): string;
    setMatchId(value: string): InitialConnect;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitialConnect.AsObject;
    static toObject(includeInstance: boolean, msg: InitialConnect): InitialConnect.AsObject;
    static serializeBinaryToWriter(message: InitialConnect, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitialConnect;
    static deserializeBinaryFromReader(message: InitialConnect, reader: jspb.BinaryReader): InitialConnect;
  }

  export namespace InitialConnect {
    export type AsObject = {
      playerId: string,
      matchId: string,
    }
  }


  export class PaddleInput extends jspb.Message {
    getDirection(): ClientToServer.PaddleInput.Direction;
    setDirection(value: ClientToServer.PaddleInput.Direction): PaddleInput;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PaddleInput.AsObject;
    static toObject(includeInstance: boolean, msg: PaddleInput): PaddleInput.AsObject;
    static serializeBinaryToWriter(message: PaddleInput, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PaddleInput;
    static deserializeBinaryFromReader(message: PaddleInput, reader: jspb.BinaryReader): PaddleInput;
  }

  export namespace PaddleInput {
    export type AsObject = {
      direction: ClientToServer.PaddleInput.Direction,
    }

    export enum Direction { 
      DIRECTION_UNSPECIFIED = 0,
      STOP = 1,
      UP = 2,
      DOWN = 3,
    }
  }


  export enum MessageTypeCase { 
    MESSAGE_TYPE_NOT_SET = 0,
    CONNECT_REQUEST = 1,
    INPUT = 2,
  }
}

export class ServerToClient extends jspb.Message {
  getStateUpdate(): GameState | undefined;
  setStateUpdate(value?: GameState): ServerToClient;
  hasStateUpdate(): boolean;
  clearStateUpdate(): ServerToClient;

  getEvent(): GameEvent | undefined;
  setEvent(value?: GameEvent): ServerToClient;
  hasEvent(): boolean;
  clearEvent(): ServerToClient;

  getMessageTypeCase(): ServerToClient.MessageTypeCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerToClient.AsObject;
  static toObject(includeInstance: boolean, msg: ServerToClient): ServerToClient.AsObject;
  static serializeBinaryToWriter(message: ServerToClient, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerToClient;
  static deserializeBinaryFromReader(message: ServerToClient, reader: jspb.BinaryReader): ServerToClient;
}

export namespace ServerToClient {
  export type AsObject = {
    stateUpdate?: GameState.AsObject,
    event?: GameEvent.AsObject,
  }

  export enum MessageTypeCase { 
    MESSAGE_TYPE_NOT_SET = 0,
    STATE_UPDATE = 1,
    EVENT = 2,
  }
}

