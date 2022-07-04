import { Submission } from '@convinz/shared/types';
import { io } from '../../../main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onSubmitExplanation: Listener = (socket) => {
  return socket.on('submitExplanation', (gameCode, submission) => {
    const lobby = lobbies.findByGameCode(gameCode);

    lobby.currentRound.submissions.push(
      new Submission(submission, lobby.players.findById(socket.id))
    );

    socket.emit('receivedSubmission', {
      gameCode,
    });

    if (lobby.currentRound.submissions.length >= lobby.players.length) {
      lobby.clearCurrentActionTimerInterval();

      if (!lobby.currentActionTimerInterval) {
        lobby.currentActionTimerInterval = setInterval(() => {
          io.to(gameCode).emit('voteTimerTickExpired', {
            ...lobby.voteTimer,
          });
          lobby.decrementVoteTimeLeft();
          if (lobby.voteTimer.timeLeft === -1) {
            lobby.clearCurrentActionTimerInterval();
          }
        }, 1000);
      }

      io.to(gameCode).emit('startedVoting', {
        gameCode,
        submissions: lobby.currentRound.submissions,
      });
    }
  });
};
