import { Round } from '@convinz/shared/types';
import { getRandomQuestion } from '@convinz/shared/util';
import { io } from 'apps/api/src/main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onSubmitExplanation: Listener = (socket) => {
  return socket.on('submitExplanation', (gameCode, submission) => {
    const lobby = lobbies.findByGameCode(gameCode);

    lobby.currentRound.submissions.push({ [socket.id]: submission });

    socket.emit('receivedSubmission', {
      gameCode,
    });

    if (lobby.currentRound.submissions.length === lobby.players.length) {
      const question = getRandomQuestion();

      lobby.roundHistory.push(new Round(question));

      io.to(gameCode).emit('receivedRound', {
        gameCode: gameCode,
        question,
      });
    }
  });
};
