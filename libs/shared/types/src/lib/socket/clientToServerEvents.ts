import type { GameAccessionType, GameCode } from '../game';
import { ChatMessage } from '../game';

export interface ClientToServerEvents {
  createLobby: (nickname: string, avatar: string) => void;
  joinLobby: (
    gameCode: string,
    nickname: string,
    avatar: string,
    gameAccessionType: GameAccessionType
  ) => void;
  sendChatMessage: (message: ChatMessage) => void;
  leaveLobby: (gameCode: GameCode) => void;
  startGame: (gameCode: GameCode) => void;
  requestRound: (gameCode: GameCode) => void;
  submitExplanation: (gameCode: GameCode, submission: string) => void;
  submitVote: (gameCode: GameCode, vote: string) => void;
}
