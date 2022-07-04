import { Player, Question, Round } from '@convinz/shared/types';
import { getRandomQuestion } from '@convinz/shared/util';
import { io } from '../../../main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onRequestRound: Listener = (socket) => {
  return socket.on('requestRound', (gameCode) => {
    const lobby = lobbies.findByGameCode(gameCode);
    const question = getRandomQuestion();
    const playerWithSolution = lobby.players.getRandom();

    const broadcastNewRound = (
      newQuestion: Question,
      playerWithSolution: Player
    ) => {
      if (!lobby.currentActionTimerInterval) {
        lobby.currentActionTimerInterval = setInterval(() => {
          io.to(gameCode).emit('explainTimerTickExpired', {
            ...lobby.explainTimer,
          });
          lobby.decrementExplainTimeLeft();
          if (lobby.explainTimer.timeLeft === -1) {
            lobby.clearCurrentActionTimerInterval();
            console.log('time over');
          }
        }, 1000);
      }

      // answer to player with solution
      io.to(playerWithSolution.id).emit('receivedRound', {
        gameCode,
        question: newQuestion.question,
        solution: newQuestion.solution,
        totalTime: lobby.config.explainTime,
      });

      // answer to all other players
      io.to(gameCode).except(playerWithSolution.id).emit('receivedRound', {
        gameCode,
        question: newQuestion.question,
        solution: null,
        totalTime: lobby.config.explainTime,
      });
    };

    if (
      !lobby.currentRound ||
      lobby.currentRound.submissions.length >= lobby.players.length
    ) {
      lobby.roundHistory.push(new Round(question));
    } else return;

    lobby.voteTimerExpiringEmitter.on('expired', () => {
      if (lobby.roundHistory.length >= lobby.config.roundsAmount) {
        io.to(gameCode).emit('gameEnded', {
          gameCode,
          gameResults: lobby.getTotalVotesPerPlayer(),
        });
        return;
      }

      const newQuestion = getRandomQuestion();
      const playerWithSolution = lobby.players.getRandom();
      lobby.roundHistory.push(new Round(newQuestion));

      lobby.clearCurrentActionTimerInterval();

      broadcastNewRound(newQuestion, playerWithSolution);
    });

    broadcastNewRound(question, playerWithSolution);
  });
};
