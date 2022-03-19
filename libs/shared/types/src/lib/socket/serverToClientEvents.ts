import type { GameCode } from '../game';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerToClientEvents {
  created: (gameCode: GameCode) => void;
}
