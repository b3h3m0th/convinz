import type {
  GameCode,
  Player,
  Question,
  Round,
  Submission,
  VoteResult,
} from '../game';
import { ChatMessage } from '../game/message';

export interface ServerToClientEvents {
  joinedLobby: (result: {
    gameCode: GameCode;
    players: Player[];
    joinedPlayer?: Player;
    player?: Player;
    error: boolean;
  }) => void;
  receiveChatMessage: (message: ChatMessage) => void;
  leftLobby: (result: {
    player?: Player;
    players: Player[];
    leftPlayer?: Player;
    error: boolean;
  }) => void;
  startedGame: (result: {
    starterPlayer: Player;
    gameCode: GameCode;
    error: boolean;
  }) => void;
  receivedRound: (result: {
    gameCode: GameCode;
    question: string;
    solution: string;
  }) => void;
  receivedSubmission: (result: { gameCode: GameCode }) => void;
  startedVoting: (result: {
    gameCode: GameCode;
    submissions: Submission[];
  }) => void;
  updatedVoting: (result: {
    gameCode: GameCode;
    submissions: Submission[];
  }) => void;
  gameEnded: (result: {
    gameCode: GameCode;
    gameResults: VoteResult[];
  }) => void;
}
