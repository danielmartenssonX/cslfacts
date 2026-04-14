import type { Answer, Question } from '../domain/types';

export const DEFAULT_BLOCKING_QUESTION_IDS = [
  'Q01',
  'Q02',
  'Q03',
  'Q04',
  'Q07',
  'Q08',
  'Q16',
  'Q17',
  'Q18',
  'Q19',
  'Q20',
  'Q30',
  'Q31',
];

export function getBlockingQuestionIds(questions: Question[]): string[] {
  return questions.filter((q) => q.blocking).map((q) => q.id);
}

export function getUnclearBlockingAnswers(
  answers: Answer[],
  blockingQuestionIds: string[],
): string[] {
  return answers
    .filter((a) => blockingQuestionIds.includes(a.questionId) && a.value === 'UNCLEAR')
    .map((a) => a.questionId);
}
