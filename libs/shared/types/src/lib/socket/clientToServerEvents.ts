import type { GameAccessionType, GameCode, Term } from '../game';
import { ChatMessage } from '../game';

export interface ClientToServerEvents {
  createLobby: (nickname: string) => void;
  joinLobby: (
    code: string,
    nickname: string,
    gameAccessionType: GameAccessionType
  ) => void;
  leaveLobby: (gameCode: GameCode) => void;
  startGame: (gameCode: GameCode) => void;
  requestRound: (
    gameCode: GameCode,
    cb: (result: { gameCode: GameCode; term: Term }) => void
  ) => void;
  sendChatMessage: (message: ChatMessage) => void;
}
