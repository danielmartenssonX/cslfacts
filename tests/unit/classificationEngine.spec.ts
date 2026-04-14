import { describe, expect, it } from 'vitest';
import { classifyAssessment } from '../../src/rules/classificationEngine';
import { DEFAULT_BLOCKING_QUESTION_IDS } from '../../src/rules/blockingRules';
import type { FunctionType } from '../../src/domain/types';

const fn = (id: string, type: FunctionType) => ({ id, type });

describe('classificationEngine', () => {
  it('ger CSL1 när Q16 = YES', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [{ questionId: 'Q16', functionId: 'f1', value: 'YES' }],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL1');
    expect(result.status).toBe('FINAL');
  });

  it('ger CSL2 när Q17 = YES och Q16 inte är YES', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [
        { questionId: 'Q16', functionId: 'f1', value: 'NO' },
        { questionId: 'Q17', functionId: 'f1', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL2');
  });

  it('ger CSL2 när Q18 = YES (nödlägeshantering)', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'EMERGENCY_MANAGEMENT')],
      answers: [
        { questionId: 'Q16', functionId: 'f1', value: 'NO' },
        { questionId: 'Q18', functionId: 'f1', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL2');
  });

  it('ger CSL2 när Q19 = YES (fysiskt skydd)', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'PHYSICAL_PROTECTION')],
      answers: [
        { questionId: 'Q16', functionId: 'f1', value: 'NO' },
        { questionId: 'Q19', functionId: 'f1', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL2');
  });

  it('ger CSL2 när Q20 = YES (huvudprocess)', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'MAIN_PROCESS')],
      answers: [
        { questionId: 'Q16', functionId: 'f1', value: 'NO' },
        { questionId: 'Q20', functionId: 'f1', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL2');
  });

  it('ger CSL3 när Q21 = YES och högre nivåer inte träffar', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'MAINTENANCE_SUPPORT')],
      answers: [
        { questionId: 'Q16', functionId: 'f1', value: 'NO' },
        { questionId: 'Q17', functionId: 'f1', value: 'NO' },
        { questionId: 'Q18', functionId: 'f1', value: 'NO' },
        { questionId: 'Q19', functionId: 'f1', value: 'NO' },
        { questionId: 'Q20', functionId: 'f1', value: 'NO' },
        { questionId: 'Q21', functionId: 'f1', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL3');
  });

  it('ger CSL3 när Q22 = YES', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'MAIN_PROCESS')],
      answers: [{ questionId: 'Q22', functionId: 'f1', value: 'YES' }],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL3');
  });

  it('ger CSL4 när endast Q23 = YES', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [{ questionId: 'Q23', functionId: 'f1', value: 'YES' }],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL4');
  });

  it('ger CSL5 när endast Q24 = YES', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [{ questionId: 'Q24', functionId: 'f1', value: 'YES' }],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL5');
  });

  it('stoppar fastställande när blockerande fråga är UNCLEAR', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [{ questionId: 'Q16', functionId: 'f1', value: 'UNCLEAR' }],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.status).toBe('PRELIMINARY_BLOCKED');
    expect(result.blockingQuestionIds).toContain('Q16');
  });

  it('väljer mest stringent nivå när flera funktioner finns', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'MAINTENANCE_SUPPORT'), fn('f2', 'SAFETY_OPERATION')],
      answers: [
        { questionId: 'Q21', functionId: 'f1', value: 'YES' },
        { questionId: 'Q17', functionId: 'f2', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL2');
  });

  it('kräver primärt system när flera digitala tillgångar stöder samma funktion', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'MAIN_PROCESS')],
      answers: [{ questionId: 'Q20', functionId: 'f1', value: 'YES' }],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: true,
      primarySystemConfirmed: false,
    });

    expect(result.status).toBe('PRELIMINARY_BLOCKED');
    expect(result.blockingQuestionIds).toContain('Q30');
  });

  it('sänker inte nivå automatiskt bara för att analog fallback finns', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [
        { questionId: 'Q17', functionId: 'f1', value: 'YES' },
        { questionId: 'Q28', functionId: 'f1', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('CSL2');
  });

  it('flaggar manuell granskning när Q32 = YES', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [
        { questionId: 'Q24', functionId: 'f1', value: 'YES' },
        { questionId: 'Q32', value: 'YES' },
      ],
      blockingQuestionIds: DEFAULT_BLOCKING_QUESTION_IDS,
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.manualReviewRequired).toBe(true);
  });

  it('ger UNRESOLVED om inga konsekvensfrågor besvarats med YES', () => {
    const result = classifyAssessment({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [],
      blockingQuestionIds: [],
      requiresPrimarySystemSelection: false,
      primarySystemConfirmed: true,
    });

    expect(result.systemLevel).toBe('UNRESOLVED');
    expect(result.status).toBe('PRELIMINARY');
  });
});
