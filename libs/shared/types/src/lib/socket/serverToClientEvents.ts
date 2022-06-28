import type { GameCode, Player } from '../game';
import { ChatMessage } from '../game/message';

export interface ServerToClientEvents {
  joinedLobby: (result: {
    gameCode: GameCode;
    players: Player[];
    player: Player;
    error: boolean;
  }) => void;
  leftLobby: (result: {
    player: Player;
    players: Player[];
    error: boolean;
  }) => void;
  startedGame: (result: { gameCode: GameCode; error: boolean }) => void;
  receiveChatMessage: (message: ChatMessage) => void;
}
