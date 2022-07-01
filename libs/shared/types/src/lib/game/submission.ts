import { Player } from './player';

export class Submission {
  constructor(
    public explanation: string,
    public player: Player,
    public votes: string[] = []
  ) {}

  addVote(playerId: string) {
    this.votes.push(playerId);
  }
}
