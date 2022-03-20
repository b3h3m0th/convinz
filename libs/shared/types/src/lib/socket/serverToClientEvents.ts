import type { GameCode } from '../game';

export interface ServerToClientEvents {
  joined: (
    nickname: string,
    connectedClientNicknames: string[],
    gameCode: GameCode
  ) => void;
  receiveMessage: (message: string) => void;
}
