import { Round, Submission } from '@convinz/shared/types';
import { getRandomQuestion } from '@convinz/shared/util';
import { io } from '../../../main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onRequestRound: Listener = (socket) => {
  return socket.on('requestRound', (gameCode) => {
    const lobby = lobbies.findByGameCode(gameCode);
    const question = getRandomQuestion();

    if (
      !lobby.currentRound ||
      lobby.currentRound.submissions.length >= lobby.players.length
    ) {
      lobby.roundHistory.push(new Round(question));
    }

    if (lobby.currentRound.submissions.length >= 1) return;

    const playerWithSolution = lobby.players.getRandom();

    // answer to player with solution
    io.to(playerWithSolution.id).emit('receivedRound', {
      gameCode,
      question: question.question,
      solution: question.solution,
    });

    // answer to all other players
    io.to(gameCode).except(playerWithSolution.id).emit('receivedRound', {
      gameCode,
      question: question.question,
      solution: null,
    });
  });
};