import { Player, Role } from '@convinz/shared/types';
import { generateGameCode } from '@convinz/shared/util';
import { lobbies } from '../../game';
import { Listener } from '../types/listener';

export const onCreateLobby: Listener = (socket) => {
  return socket.on('createLobby', async (nickname, avatar, config) => {
    const gameCode = generateGameCode();
    await socket.join(gameCode);

    const newPlayer = new Player(
      socket.id,
      nickname,
      gameCode,
      Role.CAPTAIN,
      avatar
    );
    lobbies.create(gameCode, [newPlayer], config);

    const lobby = lobbies.findByGameCode(gameCode);

    socket.emit('joinedLobby', {
      gameCode: gameCode,
      error: false,
      players: lobby.players,
      player: newPlayer,
      joinedPlayer: newPlayer,
    });
  });
};
