import { io } from 'apps/api/src/main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onStartGame: Listener = (socket) => {
  return socket.on('startGame', (gameCode) => {
    const captain = lobbies.findByGameCode(gameCode).players.captain;

    io.to(gameCode).emit('startedGame', {
      starterPlayer: captain,
      gameCode: gameCode,
      error: false,
    });
  });
};
