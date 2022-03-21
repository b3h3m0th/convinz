import { GameCode } from './game';

export type ChatMessage = {
  sender: string;
  message: string;
  lobby: GameCode;
};
