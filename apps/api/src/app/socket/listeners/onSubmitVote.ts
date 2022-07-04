import { Round } from '@convinz/shared/types';
import { getRandomQuestion } from '@convinz/shared/util';
import { io } from '../../../main';
import { lobbies } from '../../game';
import { Listener } from '../types';

const hasPlayerAlreadyVoted = (playerId: string, round: Round) => {
  let hasAlreadyVoted = false;
  round.submissions.forEach((s) =>
    s.votes.find((v) => v.id === playerId && (hasAlreadyVoted = true))
  );
  return hasAlreadyVoted;
};

export const onSubmitVote: Listener = (socket) => {
  return socket.on('submitVote', (gameCode, voteForPlayer) => {
    const lobby = lobbies.findByGameCode(gameCode);

    if (hasPlayerAlreadyVoted(socket.id, lobby.currentRound)) return;

    lobby.currentRound.submissions
      .find((s) => s.player.id === voteForPlayer.id)
      .addVote(lobby.players.findById(socket.id));

    io.to(gameCode).emit('updatedVoting', {
      gameCode,
      submissions: lobby.currentRound.submissions,
    });

    if (lobby.roundHistory.length >= lobby.config.roundsAmount) {
      io.to(gameCode).emit('gameEnded', {
        gameCode,
        gameResults: lobby.getTotalVotesPerPlayer(),
      });
      return;
    }

    if (lobby.players.length === lobby.currentRound.getTotalVotesCount()) {
      lobby.clearCurrentActionTimerInterval();

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

      const newQuestion = getRandomQuestion();
      lobby.roundHistory.push(new Round(newQuestion));

      const playerWithSolution = lobby.players.getRandom();

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
    }
  });
};
