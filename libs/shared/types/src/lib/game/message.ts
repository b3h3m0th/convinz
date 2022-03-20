import { GameCode } from './gameCode';

export type ChatMessage = {
  sender: string;
  message: string;
  lobby: GameCode;
};
