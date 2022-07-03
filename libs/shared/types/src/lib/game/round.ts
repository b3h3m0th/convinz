import { Player } from './player';
import { Question } from './question';
import { Submission } from './submission';

export type RoundsAmount = 3 | 5 | 10;
export const defaultRoundsAmount: RoundsAmount = 3;

export type VoteResult = { player: Player; totalVotes: number }[];

export class Round {
  constructor(
    public question: Question,
    public submissions: Submission[] = []
  ) {}

  getTotalVotesCount() {
    return this.submissions.reduce((acc, curr) => {
      return acc + curr.votes.length;
    }, 0);
  }

  getTotalReceivedVotesPerPlayer(): VoteResult {
    return this.submissions.map((s) => ({
      player: s.player,
      totalVotes: s.votes.length,
    }));
  }
}
