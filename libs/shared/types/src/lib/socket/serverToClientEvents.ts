import type { GameCode, Player } from '../game';
import { ChatMessage } from '../game/message';

export interface ServerToClientEvents {
  joined: (result: {
    gameCode: GameCode;
    players: Player[];
    player: Player;
    error: boolean;
  }) => void;
  left: (result: { players: Player[]; error: boolean }) => void;
  started: (result: { gameCode: GameCode; error: boolean }) => void;
  receiveMessage: (message: ChatMessage) => void;
}
