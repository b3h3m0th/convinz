import { Player } from './player';

export class Submission {
  constructor(
    public explanation: string,
    public player: Player,
    public votes: Player[] = []
  ) {}

  addVote(player: Player) {
    this.votes.push(player);
  }
}
