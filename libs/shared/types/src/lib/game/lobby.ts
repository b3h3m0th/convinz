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

  getTotalReceivedVotesPerPlayer() {
    const resultsMatrix = this.roundHistory.reduce((acc, curr) => {
      const votesPerPlayerInRound: VoteResult =
        curr.getTotalReceivedVotesPerPlayer();

      return [...acc, votesPerPlayerInRound];
    }, [] as VoteResult);

    console.log(resultsMatrix);
  }
}
