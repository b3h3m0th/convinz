import type { GameCode, Player } from '@convinz/shared/types';

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
