import { GameCode } from '../game';

export interface ClientToServerEvents {
  create: (
    nickname: string,
    cb: (result: {
      gameCode: GameCode;
      error: boolean;
      nicknames: string[];
    }) => void
  ) => void;
  join: (
    code: string,
    nickname: string,
    cb: (result: {
      gameCode: GameCode;
      error: boolean;
      nicknames: string[];
    }) => void
  ) => void;
  leave: (cb: (result: { error: boolean }) => void) => void;
  sendMessage: (message: string, lobby: GameCode) => void;
}
