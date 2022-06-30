import type { GameAccessionType, GameCode } from '../game';
import { ChatMessage } from '../game';

export interface ClientToServerEvents {
  createLobby: (nickname: string) => void;
  joinLobby: (
    gameCode: string,
    nickname: string,
    gameAccessionType: GameAccessionType
  ) => void;
  sendChatMessage: (message: ChatMessage) => void;
  leaveLobby: (gameCode: GameCode) => void;
  startGame: (gameCode: GameCode) => void;
  requestRound: (gameCode: GameCode) => void;
  submitExplanation: (gameCode: GameCode, submission: string) => void;
}
