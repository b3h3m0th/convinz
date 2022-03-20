import type { GameCode } from '../game';

export interface ServerToClientEvents {
  created: (gameCode: GameCode) => void;
  receiveMessage: (message: string) => void;
}
