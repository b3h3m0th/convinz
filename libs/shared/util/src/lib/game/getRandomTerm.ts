import { terms } from '@convinz/shared/data';

export function getRandomTerm() {
  return terms[~~(Math.random() * terms.length)];
}
