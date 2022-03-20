import { GameCode } from '../game';

export interface ClientToServerEvents {
  join: (code: string) => void;
  create: () => void;
  sendMessage: (message: string, lobby: GameCode) => void;
}
