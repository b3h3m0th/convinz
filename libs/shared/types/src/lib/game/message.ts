import { GameCode } from './game';
import { Role } from './role';

export type ChatMessage = {
  sender: string | Role.SYSTEM;
  message: string;
  lobby: GameCode;
};
