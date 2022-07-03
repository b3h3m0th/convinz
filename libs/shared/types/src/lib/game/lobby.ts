import { GameCode } from './game';
import { Players } from './players';
import { defaultRoundsAmount, Round, RoundsAmount, VoteResult } from './round';

export class Lobby {
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
}
