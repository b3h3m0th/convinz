import type { GameCode } from '@convinz/shared/types';
import { nanoid } from 'nanoid';

export const gameCodeLength = 8 as const;

export function generateGameCode(): GameCode {
  return `${nanoid(gameCodeLength).toUpperCase()}`;
}
