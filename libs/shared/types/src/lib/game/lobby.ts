import { GameCode } from './game';
import { Players } from './players';
import { defaultRoundsAmount, Round, RoundsAmount, VoteResult } from './round';
import {
  ActionTimer,
  defaultExplainTime,
  defaultVoteTime,
  ExplainTime,
  VoteTime,
  VoteTimerEmitter,
} from './timer';

export type LobbyCreateConfig = {
  roundsAmount: RoundsAmount;
  explainTime: ExplainTime;
  voteTime: VoteTime;
};

export class Lobby {
  public currentActionTimerInterval: NodeJS.Timer | null = null;
  public explainTimer: ActionTimer = {
    totalTime: this.config.explainTime,
    timeLeft: this.config.explainTime,
  };
  public voteTimer: ActionTimer = {
    totalTime: this.config.voteTime,
    timeLeft: this.config.voteTime,
  };
  public voteTimerExpiringEmitter = new VoteTimerEmitter();

  constructor(
    public gameCode: GameCode,
    public roundHistory: Round[],
    public players: Players,
    public config: LobbyCreateConfig = {
      roundsAmount: defaultRoundsAmount,
      explainTime: defaultExplainTime,
      voteTime: defaultVoteTime,
    }
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

    if (this.voteTimer.timeLeft === -1) this.voteTimerExpiringEmitter.expired();
  }

  clearCurrentActionTimerInterval() {
    if (this.currentActionTimerInterval) {
      clearInterval(this.currentActionTimerInterval);
      this.currentActionTimerInterval = null;
    }

    this.explainTimer = {
      totalTime: this.config.explainTime,
      timeLeft: this.config.explainTime,
    };
    this.voteTimer = {
      totalTime: this.config.voteTime,
      timeLeft: this.config.voteTime,
    };
  }
}
