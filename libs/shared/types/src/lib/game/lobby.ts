import { GameCode } from './game';
import { Players } from './players';
import {
  defaultExplainTime,
  defaultRoundsAmount,
  Round,
  RoundsAmount,
  VoteResult,
} from './round';

export class Lobby {
  public currentActionTimerInterval?: NodeJS.Timer;

  constructor(
    public gameCode: GameCode,
    public roundsAmount: RoundsAmount = defaultRoundsAmount,
    public roundHistory: Round[],
    public players: Players,
    public timeLeftForCurrentAction: number = defaultExplainTime
  ) {}

  get currentRound() {
    return this.roundHistory[this.roundHistory.length - 1];
  }

  getTotalVotesPerPlayer(): VoteResult[] {
    return Object.values(
      this.roundHistory.reduce((acc, curr) => {
        curr
          .getTotalReceivedVotesPerPlayer()
          ?.forEach(({ player, totalVotes }) => {
            acc[player.id] ??= { player, totalVotes: 0 };
            acc[player.id].totalVotes += totalVotes;
          });
        return acc;
      }, {} as any)
    );
  }

  decrementTimeLeftForCurrentAction() {
    return this.timeLeftForCurrentAction--;
  }

  clearCurrentActionTimerInterval() {
    if (this.currentActionTimerInterval) {
      clearInterval(this.currentActionTimerInterval);
    }
  }
}
