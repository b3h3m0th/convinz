import type { GameCode } from '@convinz/shared/types';
import { nanoid } from 'nanoid';

export function createGameCode(): GameCode {
  return `${nanoid(8).toUpperCase()}`;
}
