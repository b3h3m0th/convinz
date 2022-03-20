import { GameCode } from '../game';
import { ChatMessage } from '../game/message';

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
  sendMessage: (message: ChatMessage) => void;
}
