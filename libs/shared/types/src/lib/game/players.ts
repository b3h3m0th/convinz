import { GameCode } from './game';
import { Player } from './player';
import { Role } from './role';

export class Players extends Array<Player> {
  constructor(public gameCode: GameCode, players?: Player[]) {
    super();
    players && this.push(...players);
  }

  remove(id: string) {
    let playerToBeRemoved;
    const removeIndex = this.findIndex((p) => p.id === id);

    if (removeIndex !== -1) playerToBeRemoved = this.splice(removeIndex, 1)[0];

    return playerToBeRemoved;
  }

  findById(id: string) {
    return this.find((p) => p.id === id);
  }

  get captain(): Player {
    return this.filter((p) => p.role === Role.CAPTAIN)[0];
  }
}
