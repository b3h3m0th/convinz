import type { GameCode } from '../game';
import { ChatMessage } from '../game/message';

export interface ServerToClientEvents {
  joined: (
    nickname: string,
    connectedClientNicknames: string[],
    gameCode: GameCode
  ) => void;
  receiveMessage: (message: ChatMessage) => void;
}
