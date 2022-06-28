import type { GameAccessionType, GameCode, Player } from '../game';
import { ChatMessage } from '../game';

export interface ClientToServerEvents {
  createGame: (nickname: string) => void;
  joinGame: (
    code: string,
    nickname: string,
    gameAccessionType: GameAccessionType
  ) => void;
  leaveGame: (gameCode: GameCode) => void;
  start: (gameCode: GameCode) => void;
  sendMessage: (message: ChatMessage) => void;
}
