import type { GameAccessionType, GameCode, Player } from '../game';
import { ChatMessage } from '../game';

export interface ClientToServerEvents {
  create: (
    nickname: string,
    cb: (result: {
      gameCode: GameCode;
      player: Player;
      players: Player[];
      error: boolean;
    }) => void
  ) => void;
  join: (
    code: string,
    nickname: string,
    gameAccessionType: GameAccessionType,
    cb: (result: {
      gameCode: GameCode;
      players: Player[];
      player: Player;
      error: boolean;
    }) => void
  ) => void;
  leave: (
    gameCode: GameCode,
    cb: (result: { players: Player[]; error: boolean }) => void
  ) => void;
  start: (gameCode: GameCode, cb: (result: { error: boolean }) => void) => void;
  sendMessage: (message: ChatMessage) => void;
}
