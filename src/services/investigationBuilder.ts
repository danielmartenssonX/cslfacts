import type { Answer, InvestigationItem, Question } from '../domain/types';

export function buildInvestigationItems(
  answers: Answer[],
  questions: Question[],
): InvestigationItem[] {
  return answers
    .filter((a) => a.value === 'UNCLEAR')
    .map((a) => {
      const q = questions.find((x) => x.id === a.questionId);

      if (!q) {
        throw new Error(`Question not found for answer: ${a.questionId}`);
      }

      return {
        questionId: q.id,
        questionText: q.text,
        reason: q.blocking
          ? 'Den här frågan måste besvaras innan klassificeringen kan fastställas.'
          : 'Den här frågan behövs för bättre motivering och säkrare bedömning.',
        missingInfo: q.investigationHint,
        whoCanAnswer: q.whoCanAnswer,
        status: 'NOT_STARTED' as const,
        blocksFinalization: q.blocking,
      };
    });
}
