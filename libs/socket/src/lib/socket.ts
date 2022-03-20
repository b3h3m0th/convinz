import { io, ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@convinz/shared/types';

const connectionOptions: Partial<ManagerOptions & SocketOptions> = {
  forceNew: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,
  transports: ['websocket'],
};

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3333',
  connectionOptions
);
