import { Player } from './player';
import { Question } from './question';
import { Submission } from './submission';

export type RoundsAmount = 3 | 5 | 10;
export type ExplainTime = 30 | 45 | 60 | 120 | 150 | 180;
export const defaultRoundsAmount = 3;
export const defaultExplainTime: ExplainTime = 30;

export type VoteResult = { player: Player; totalVotes: number };

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

  getTotalReceivedVotesPerPlayer(): VoteResult[] {
    return this.submissions.map((s) => ({
      player: s.player,
      totalVotes: s.votes.length,
    }));
  }
}
