import { defaultRoundsAmount, Round } from '@convinz/shared/types';
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

    if (lobby.currentRound.getTotalVotesCount() >= lobby.players.length) {
      if (lobby.roundHistory.length >= defaultRoundsAmount) {
        io.to(gameCode).emit('gameEnded', {
          gameCode,
          gameResults: lobby.getTotalVotesPerPlayer(),
        });
        return;
      }

      const newQuestion = getRandomQuestion();

      lobby.roundHistory.push(new Round(newQuestion));

      const playerWithSolution = lobby.players.getRandom();

      // answer to player with solution
      io.to(playerWithSolution.id).emit('receivedRound', {
        gameCode,
        question: newQuestion.question,
        solution: newQuestion.solution,
      });

      // answer to all other players
      io.to(gameCode).except(playerWithSolution.id).emit('receivedRound', {
        gameCode,
        question: newQuestion.question,
        solution: null,
      });
    }
  });
};
