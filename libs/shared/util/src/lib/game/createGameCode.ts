import type { GameCode } from '@convinz/shared/types';
import { customAlphabet } from 'nanoid';

export const gameCodeLength = 8 as const;

export function generateGameCode(): GameCode {
  const nanoid = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    gameCodeLength
  );
  return `${nanoid(gameCodeLength).toUpperCase()}`;
}
