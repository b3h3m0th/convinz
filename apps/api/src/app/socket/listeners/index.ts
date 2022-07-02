export * from './onDisconnecting';
export * from './onCreateLobby';
export * from './onJoinLobby';
export * from './onLeaveLobby';
export * from './onSendChatMessage';
export * from './onStartGame';
export * from './onRequestRound';
export * from './onSubmitExplanation';
export * from './onSubmitVote';

import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@convinz/shared/types';
import { Socket } from 'socket.io';
import { Listener } from '../types';

export const registerListeners = (
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  ...listeners: Listener[]
) => {
  listeners.forEach((l) => l(socket));
};
