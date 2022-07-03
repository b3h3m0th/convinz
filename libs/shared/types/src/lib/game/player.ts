import { GameCode } from './game';
import { Role } from './role';

export const minPlayerAmount = 3 as const;

export enum PlayerActionStatus {
  loadingQuestion = 'loadingQuestion',
  explaining = 'explaining',
  waitingForOtherPlayersToSubmitExplanation = 'waitingForOtherPlayersToSubmitExplanation',
  waitingForOtherPlayersToVote = 'waitingForOtherPlayersToVote',
  voting = 'voting',
  viewingResults = 'viewingResults',
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
