import { GameCode } from './game';
import { Role } from './role';

export enum PlayerActionStatus {
  loadingQuestion = 'loadingQuestion',
  explaining = 'explaining',
  waitingForOtherPlayers = 'waitingForOtherPlayers',
  voting = 'voting',
}

export class Player {
  constructor(
    public id: string,
    public nickname: string,
    public room: GameCode,
    public role: Role,
    public avatar: string
  ) {}
}

export const defaultPlayer = new Player('', '', '', Role.MEMBER, '');
