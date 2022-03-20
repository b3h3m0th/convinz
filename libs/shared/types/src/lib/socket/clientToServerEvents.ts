import { GameCode } from '../game';

export interface ClientToServerEvents {
  join: (code: string, nickname: string) => void;
  create: (nickname: string) => void;
  sendMessage: (message: string, lobby: GameCode) => void;
}
