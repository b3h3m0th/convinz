import { Round } from '@convinz/shared/types';
import { getRandomQuestion } from '@convinz/shared/util';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onSubmitVote: Listener = (socket) => {
  return socket.on('submitVote', (gameCode) => {
    const lobby = lobbies.findByGameCode(gameCode);

    if (lobby.currentRound.getTotalVotesCount() >= lobby.players.length - 1) {
      const newQuestion = getRandomQuestion();

      lobby.roundHistory.push(new Round(newQuestion));

      console.log(lobby.currentRound);
    }
  });
};
