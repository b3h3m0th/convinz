import { Player, Role } from '@convinz/shared/types';
import { io } from 'apps/api/src/main';
import { lobbies } from '../../game';
import { Listener } from '../types';

export const onJoinLobby: Listener = (socket) => {
  return socket.on(
    'joinLobby',
    async (gameCode, nickname, gameAccessionType) => {
      const alreadyConnectedClients = lobbies.findByGameCode(gameCode).players;

      if (alreadyConnectedClients.length < 1) {
        io.to(gameCode).emit('joinedLobby', {
          gameCode: gameCode,
          players: alreadyConnectedClients,
          error: false,
        });
        return;
      }

      await socket.join(gameCode);
      const newPlayer = new Player(socket.id, nickname, gameCode, Role.MEMBER);

      lobbies.findByGameCode(gameCode).players.push(newPlayer);

      const connectedClientsAfterSelfJoin =
        lobbies.findByGameCode(gameCode).players;

      // answer to new player
      socket.emit('joinedLobby', {
        gameCode: gameCode,
        error: false,
        players: connectedClientsAfterSelfJoin,
        player: newPlayer,
        joinedPlayer: newPlayer,
      });

      // broadcast to already connected players
      socket.to(gameCode).emit('joinedLobby', {
        gameCode: gameCode,
        error: false,
        players: connectedClientsAfterSelfJoin,
        joinedPlayer: newPlayer,
      });
    }
  );
};
