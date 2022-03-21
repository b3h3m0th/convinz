import { GameCode } from './game';

export class Player {
  constructor(
    public id: string,
    public nickname: string,
    public room: GameCode
  ) {}
}
