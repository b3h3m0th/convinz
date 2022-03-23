import type { GameCode, Player } from '@convinz/shared/types';

const players: Player[] = [];

export const addPlayer = (player: Player): Player => {
  players.push(player);
  return player;
};

export const removePlayer = (id: string) => {
  let playerToBeRemoved;
  const removeIndex = players.findIndex((p) => p.id === id);

  if (removeIndex !== -1) playerToBeRemoved = players.splice(removeIndex, 1)[0];
  return playerToBeRemoved;
};

export const getPlayer = (id: string) => {
  return players.find((p) => p.id === id);
};

export const getPlayersInRoom = (room: GameCode) => {
  return players.filter((p) => p.room === room);
};
