import { describe, expect, it } from 'vitest';
import { getBlockingQuestionIds } from '../../src/rules/blockingRules';
import type { Question } from '../../src/domain/types';
import questionBankData from '../../src/data/questionBank.sv-SE.json';

const allQuestions = questionBankData.questions as unknown as Question[];

describe('blockingRules', () => {
  it('identifierar blockerande frågor från frågebanken', () => {
    const ids = getBlockingQuestionIds(allQuestions);
    expect(ids).toContain('Q01');
    expect(ids).toContain('Q16');
    expect(ids).toContain('Q16b');
    expect(ids).toContain('Q18b');
    expect(ids).toContain('Q31');
  });

  it('Q30 är INTE blockerande', () => {
    const ids = getBlockingQuestionIds(allQuestions);
    expect(ids).not.toContain('Q30');
  });

  it('Q32 är INTE blockerande', () => {
    const ids = getBlockingQuestionIds(allQuestions);
    expect(ids).not.toContain('Q32');
  });

  it('getBlockingQuestionIds extraherar blockerande frågor från godtycklig lista', () => {
    const questions: Partial<Question>[] = [
      { id: 'Q01', blocking: true },
      { id: 'Q05', blocking: false },
      { id: 'Q16', blocking: true },
    ];
    const ids = getBlockingQuestionIds(questions as Question[]);
    expect(ids).toEqual(['Q01', 'Q16']);
  });
});
