import type { GameCode, Player, Question } from '../game';
import { ChatMessage } from '../game/message';

export interface ServerToClientEvents {
  joinedLobby: (result: {
    gameCode: GameCode;
    players: Player[];
    joinedPlayer?: Player;
    player?: Player;
    error: boolean;
  }) => void;
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
  receiveRound: (result: { gameCode: GameCode; question: Question }) => void;
  receiveChatMessage: (message: ChatMessage) => void;
}
