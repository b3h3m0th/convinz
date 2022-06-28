import type { GameCode } from './game';
import type { Role } from './role';

export type ChatMessage = {
  sender: string | Role.SYSTEM;
  message: string;
  lobby: GameCode;
};
