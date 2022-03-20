import { GameCode } from '../game';
import { ChatMessage } from '../game/message';

export interface ClientToServerEvents {
  create: (
    nickname: string,
    cb: (result: {
      gameCode: GameCode;
      nicknames: string[];
      error: boolean;
    }) => void
  ) => void;
  join: (
    code: string,
    nickname: string,
    cb: (result: {
      gameCode: GameCode;
      nicknames: string[];
      error: boolean;
    }) => void
  ) => void;
  leave: (
    code: GameCode,
    cb: (result: { nicknames: string[]; error: boolean }) => void
  ) => void;
  sendMessage: (message: ChatMessage) => void;
}
