import type { Question } from '../domain/types';

/**
 * Hämta alla blockerande fråge-ID:n från frågebanken.
 */
export function getBlockingQuestionIds(questions: Question[]): string[] {
  return questions.filter((q) => q.blocking).map((q) => q.id);
}
