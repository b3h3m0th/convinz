import { Listener } from '../types/listener';

export const onDisconnecting: Listener = (socket) => {
  return socket.on('disconnecting', (reason) => {
    console.log('disconnect', reason);
  });
};
