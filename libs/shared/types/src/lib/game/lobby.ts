import { GameCode } from './game';
import { Players } from './players';
import { defaultRoundsAmount, Round, RoundsAmount } from './round';

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
}
