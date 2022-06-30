import { io } from 'apps/api/src/main';
import { Listener } from '../types';

export const onSendChatMessage: Listener = (socket) => {
  return socket.on('sendChatMessage', (message) => {
    io.to(message.lobby).emit('receiveChatMessage', message);
  });
};
