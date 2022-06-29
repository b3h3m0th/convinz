import { questions } from '@convinz/shared/data';

export function getRandomQuestion() {
  return questions[~~(Math.random() * questions.length)];
}
