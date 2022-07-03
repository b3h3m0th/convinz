import { GameCode } from './game';
import { Players } from './players';
import { defaultRoundsAmount, Round, RoundsAmount, VoteResult } from './round';
import {
  ActionTimer,
  defaultExplainTime,
  defaultVoteTime,
  VoteTimerEmitter,
} from './timer';

export class Lobby {
  public currentActionTimerInterval: NodeJS.Timer | null = null;
  public explainTimer: ActionTimer = {
    totalTime: defaultExplainTime,
    timeLeft: defaultExplainTime,
  };
  public voteTimer: ActionTimer = {
    totalTime: defaultVoteTime,
    timeLeft: defaultVoteTime,
  };
  public voteTimerExpiringEmitter = new VoteTimerEmitter();

  constructor(
    public gameCode: GameCode,
    public roundsAmount: RoundsAmount = defaultRoundsAmount,
    public roundHistory: Round[],
    public players: Players
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

  decrementExplainTimeLeft() {
    this.explainTimer.timeLeft--;
  }

  decrementVoteTimeLeft() {
    this.voteTimer.timeLeft--;

    if (this.voteTimer.timeLeft === 0) this.voteTimerExpiringEmitter.expired();
  }

  clearCurrentActionTimerInterval() {
    if (this.currentActionTimerInterval) {
      clearInterval(this.currentActionTimerInterval);
      this.currentActionTimerInterval = null;
    }
  }
}
