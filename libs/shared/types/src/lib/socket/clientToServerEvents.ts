import type { GameAccessionType, GameCode, Question } from '../game';
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
  requestRound: (gameCode: GameCode) => void;
  sendChatMessage: (message: ChatMessage) => void;
}
