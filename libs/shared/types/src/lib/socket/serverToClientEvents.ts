import type { GameCode, Player } from '../game';
import { ChatMessage } from '../game/message';

export interface ServerToClientEvents {
  joined: (players: Player[], gameCode: GameCode) => void;
  left: (players: Player[], gameCode: GameCode) => void;
  started: (gameCode: GameCode) => void;
  receiveMessage: (message: ChatMessage) => void;
}
