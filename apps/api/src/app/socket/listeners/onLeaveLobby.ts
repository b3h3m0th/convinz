import { Role, defaultPlayer } from '@convinz/shared/types';
import { Listener } from '..';
import { lobbies } from '../../game';

export const onLeaveLobby: Listener = (socket) => {
  return socket.on('leaveLobby', async (gameCode) => {
    const leftPlayer = lobbies
      .findByGameCode(gameCode)
      .players.remove(socket.id);
    const connectedClients = lobbies.findByGameCode(gameCode).players;

    if (leftPlayer.role === Role.CAPTAIN && connectedClients.length > 0) {
      connectedClients[0].role = Role.CAPTAIN;
    }

    // answer to left player
    socket.emit('leftLobby', {
      error: false,
      players: connectedClients,
      player: defaultPlayer,
      leftPlayer: leftPlayer,
    });

    // broadcast to already connected players
    socket.to(gameCode).emit('leftLobby', {
      error: false,
      players: connectedClients,
      leftPlayer: leftPlayer,
    });

    socket.leave(gameCode);
  });
};
