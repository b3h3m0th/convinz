import type { GameCode, Player } from '@convinz/shared/types';
import { io } from '../../main';

const players: Player[] = [];

export const addPlayer = (player: Player): Player => {
  // const numberOfUsersInRoom = players.filter(
  //   (user) => user.room === player.room
  // ).length;
  // if (numberOfUsersInRoom === 2) return { error: 'Room full' };

  players.push(player);
  return player;
};

export const removePlayer = (id: string) => {
  const removeIndex = players.findIndex((p) => p.id === id);

  if (removeIndex !== -1) return players.splice(removeIndex, 1)[0];
};

export const getPlayer = (id: string) => {
  return players.find((p) => p.id === id);
};

export const getPlayersInRoom = (room: GameCode) => {
  return players.filter((p) => p.room === room);
};

export const getConnectedRoomClientNicknames: (roomCode: string) => string[] = (
  roomCode: string
) => {
  const connectedClients = [];
  const room = io.sockets.adapter.rooms.get(roomCode);
  console.log(room);

  room &&
    room.forEach((s) =>
      connectedClients.push((io.sockets.sockets.get(s) as any).nickname)
    );

  // return connectedClients;
  return [];
};
