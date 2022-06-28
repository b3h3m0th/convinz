import { GameCode } from './game';
import { Role } from './role';

export class Player {
  constructor(
    public id: string,
    public nickname: string,
    public room: GameCode,
    public role: Role
  ) {}
}

export const defaultPlayer = new Player('', '', '', Role.MEMBER);
