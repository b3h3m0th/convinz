import { Round } from '@convinz/shared/types';
import { getRandomQuestion } from '@convinz/shared/util';
import { io } from 'apps/api/src/main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onRequestRound: Listener = (socket) => {
  return socket.on('requestRound', (gameCode) => {
    const question = getRandomQuestion();
    const lobby = lobbies.findByGameCode(gameCode);

    if (
      !lobby.currentRound ||
      lobby.currentRound.submissions.length === lobby.players.length
    ) {
      lobby.roundHistory.push(new Round(question));
    }

    io.to(gameCode).emit('receivedRound', {
      gameCode: gameCode,
      question,
    });
  });
};
