import { describe, expect, it } from 'vitest';
import {
  DEFAULT_BLOCKING_QUESTION_IDS,
  getBlockingQuestionIds,
  getUnclearBlockingAnswers,
} from '../../src/rules/blockingRules';
import type { Answer, Question } from '../../src/domain/types';

describe('blockingRules', () => {
  it('DEFAULT_BLOCKING_QUESTION_IDS innehåller förväntade ID:n', () => {
    expect(DEFAULT_BLOCKING_QUESTION_IDS).toContain('Q01');
    expect(DEFAULT_BLOCKING_QUESTION_IDS).toContain('Q16');
    expect(DEFAULT_BLOCKING_QUESTION_IDS).toContain('Q30');
    expect(DEFAULT_BLOCKING_QUESTION_IDS).toContain('Q31');
    expect(DEFAULT_BLOCKING_QUESTION_IDS).not.toContain('Q05');
    expect(DEFAULT_BLOCKING_QUESTION_IDS).not.toContain('Q24');
  });

  it('getBlockingQuestionIds extraherar blockerande frågor', () => {
    const questions: Partial<Question>[] = [
      { id: 'Q01', blocking: true },
      { id: 'Q05', blocking: false },
      { id: 'Q16', blocking: true },
    ];
    const ids = getBlockingQuestionIds(questions as Question[]);
    expect(ids).toEqual(['Q01', 'Q16']);
  });

  it('getUnclearBlockingAnswers returnerar blockerande UNCLEAR-svar', () => {
    const answers: Answer[] = [
      { questionId: 'Q01', value: 'UNCLEAR' },
      { questionId: 'Q05', value: 'UNCLEAR' },
      { questionId: 'Q16', value: 'YES' },
      { questionId: 'Q17', value: 'UNCLEAR' },
    ];
    const blocking = ['Q01', 'Q16', 'Q17'];
    const result = getUnclearBlockingAnswers(answers, blocking);
    expect(result).toEqual(['Q01', 'Q17']);
  });

  it('returnerar tom array om inga UNCLEAR finns bland blockerande', () => {
    const answers: Answer[] = [
      { questionId: 'Q01', value: 'YES' },
      { questionId: 'Q16', value: 'NO' },
    ];
    const result = getUnclearBlockingAnswers(answers, ['Q01', 'Q16']);
    expect(result).toEqual([]);
  });
});
