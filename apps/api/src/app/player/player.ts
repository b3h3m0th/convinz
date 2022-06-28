import { GameCode, Player, Role } from '@convinz/shared/types';

export class Players extends Array<Player> {
  private static _instance: Players;

  private constructor() {
    super();
  }

  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  add(player: Player): Player {
    this.push(player);
    return player;
  }

  remove(id: string): Player {
    let playerToBeRemoved;
    const removeIndex = this.findIndex((p) => p.id === id);

    if (removeIndex !== -1) playerToBeRemoved = this.splice(removeIndex, 1)[0];
    return playerToBeRemoved;
  }

  findById(id: string): Player {
    return this.find((p) => p.id === id);
  }

  getPlayersInRoom(room: GameCode) {
    return this.filter((p) => p.room === room);
  }

  getCaptainInRoom(room: GameCode): Player {
    return this.filter((p) => p.room === room).filter(
      (p) => p.role === Role.CAPTAIN
    )[0];
  }

  getPlayerCountInRoom(room: GameCode): number {
    return this.filter((p) => p.room === room).length;
  }
}

export const players = Players.Instance;

// const players: Player[] = [];

// export const addPlayer = (player: Player): Player => {
//   players.push(player);
//   return player;
// };

// export const removePlayer = (id: string): Player => {
//   let playerToBeRemoved;
//   const removeIndex = players.findIndex((p) => p.id === id);

//   if (removeIndex !== -1) playerToBeRemoved = players.splice(removeIndex, 1)[0];
//   return playerToBeRemoved;
// };

// export const getPlayer = (id: string) => {
//   return players.find((p) => p.id === id);
// };

// export const getPlayersInRoom = (room: GameCode) => {
//   return players.filter((p) => p.room === room);
// };
