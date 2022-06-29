import type { GameCode } from './game';
import { Player } from './player';
import type { Role } from './role';

export type ChatMessage = {
  sender: Player | Role.SYSTEM;
  message: string;
  lobby: GameCode;
};
