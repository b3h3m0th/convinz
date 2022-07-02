import { Round } from '@convinz/shared/types';
import { getRandomQuestion } from '@convinz/shared/util';
import { io } from '../../../main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onSubmitVote: Listener = (socket) => {
  return socket.on('submitVote', (gameCode, voteForPlayer) => {
    const lobby = lobbies.findByGameCode(gameCode);

    lobby.currentRound.submissions
      .find((s) => s.player.id === voteForPlayer.id)
      .addVote(lobby.players.findById(socket.id));

    io.to(gameCode).emit('updatedVoting', {
      gameCode,
      submissions: lobby.currentRound.submissions,
    });

    if (lobby.currentRound.getTotalVotesCount() >= lobby.players.length) {
      const newQuestion = getRandomQuestion();

      lobby.roundHistory.push(new Round(newQuestion));
    }
  });
};
