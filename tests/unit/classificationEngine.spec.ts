import { describe, expect, it } from 'vitest';
import {
  classifyAssessment,
  buildAppliesToMap,
  type AppliesToMap,
} from '../../src/rules/classificationEngine';
import { getBlockingQuestionIds } from '../../src/rules/blockingRules';
import type { FunctionType, Question } from '../../src/domain/types';
import questionBankData from '../../src/data/questionBank.sv-SE.json';

const allQuestions = questionBankData.questions as unknown as Question[];
const appliesTo: AppliesToMap = buildAppliesToMap(allQuestions);
const blockingIds = getBlockingQuestionIds(allQuestions);

const fn = (id: string, type: FunctionType) => ({ id, type });

function classify(overrides: Partial<Parameters<typeof classifyAssessment>[0]>) {
  return classifyAssessment({
    functions: [],
    answers: [],
    blockingQuestionIds: blockingIds,
    appliesTo,
    questions: allQuestions,
    ...overrides,
  });
}

describe('classificationEngine — nivåtrappa', () => {
  // ─── SAFETY_OPERATION ─────────────────────────────────────────
  it('SAFETY_OPERATION → CSL1 via Q16', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [{ questionId: 'Q16', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL1');
    expect(r.functionResults[0].levelSource).toBe('RULE_ENGINE');
  });

  it('SAFETY_OPERATION → CSL2 via Q17', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [
        { questionId: 'Q16', value: 'NO' },
        { questionId: 'Q17', value: 'YES' },
      ],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL2');
  });

  it('SAFETY_OPERATION → CSL3 via Q21b', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [{ questionId: 'Q21b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL3');
  });

  it('SAFETY_OPERATION → CSL4 via Q23b', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [{ questionId: 'Q23b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL4');
  });

  it('SAFETY_OPERATION → CSL5 via Q24b', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [{ questionId: 'Q24b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL5');
  });

  // ─── PHYSICAL_PROTECTION ──────────────────────────────────────
  it('PHYSICAL_PROTECTION → CSL1 via Q16b', () => {
    const r = classify({
      functions: [fn('f1', 'PHYSICAL_PROTECTION')],
      answers: [{ questionId: 'Q16b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL1');
  });

  it('PHYSICAL_PROTECTION → CSL2 via Q19', () => {
    const r = classify({
      functions: [fn('f1', 'PHYSICAL_PROTECTION')],
      answers: [{ questionId: 'Q19', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL2');
  });

  it('PHYSICAL_PROTECTION → CSL3 via Q21b', () => {
    const r = classify({
      functions: [fn('f1', 'PHYSICAL_PROTECTION')],
      answers: [{ questionId: 'Q21b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL3');
  });

  // ─── NMAC ─────────────────────────────────────────────────────
  it('NMAC → CSL1 via Q16b', () => {
    const r = classify({
      functions: [fn('f1', 'NUCLEAR_MATERIAL_ACCOUNTING_AND_CONTROL')],
      answers: [{ questionId: 'Q16b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL1');
  });

  it('NMAC → CSL2 via Q18b', () => {
    const r = classify({
      functions: [fn('f1', 'NUCLEAR_MATERIAL_ACCOUNTING_AND_CONTROL')],
      answers: [{ questionId: 'Q18b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL2');
  });

  it('NMAC → CSL5 via Q24b', () => {
    const r = classify({
      functions: [fn('f1', 'NUCLEAR_MATERIAL_ACCOUNTING_AND_CONTROL')],
      answers: [{ questionId: 'Q24b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL5');
  });

  // ─── SENSITIVE_INFORMATION ────────────────────────────────────
  it('SENSITIVE_INFORMATION → CSL3 via Q21b', () => {
    const r = classify({
      functions: [fn('f1', 'SENSITIVE_INFORMATION')],
      answers: [{ questionId: 'Q21b', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL3');
  });

  it('SENSITIVE_INFORMATION → CSL4 via Q23', () => {
    const r = classify({
      functions: [fn('f1', 'SENSITIVE_INFORMATION')],
      answers: [{ questionId: 'Q23', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL4');
  });

  it('SENSITIVE_INFORMATION → CSL5 via Q24', () => {
    const r = classify({
      functions: [fn('f1', 'SENSITIVE_INFORMATION')],
      answers: [{ questionId: 'Q24', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL5');
  });

  // ─── MAINTENANCE_SUPPORT → CSL2 via Q20 ───────────────────────
  it('MAINTENANCE_SUPPORT → CSL2 via Q20', () => {
    const r = classify({
      functions: [fn('f1', 'MAINTENANCE_SUPPORT')],
      answers: [{ questionId: 'Q20', value: 'YES' }],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL2');
  });
});

describe('classificationEngine — REVIEW_REQUIRED', () => {
  it('ger REVIEW_REQUIRED om inga konsekvensfrågor besvarats', () => {
    const r = classify({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [],
      blockingQuestionIds: [],
    });
    expect(r.functionResults[0].candidateLevel).toBe('REVIEW_REQUIRED');
    expect(r.functionResults[0].levelSource).toBe('PENDING');
    expect(r.status).toBe('REVIEW_REQUIRED');
  });

  it('SENSITIVE_INFORMATION utan matchande svar → REVIEW_REQUIRED', () => {
    const r = classify({
      functions: [fn('f1', 'SENSITIVE_INFORMATION')],
      answers: [],
      blockingQuestionIds: [],
    });
    expect(r.functionResults[0].candidateLevel).toBe('REVIEW_REQUIRED');
  });
});

describe('classificationEngine — appliesTo', () => {
  it('Q19 påverkar inte ADMINISTRATIVE_SUPPORT', () => {
    const r = classify({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [
        { questionId: 'Q19', value: 'YES' },
        { questionId: 'Q24', value: 'YES' },
      ],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL5');
  });

  it('Q16 påverkar inte PHYSICAL_PROTECTION', () => {
    const r = classify({
      functions: [fn('f1', 'PHYSICAL_PROTECTION')],
      answers: [
        { questionId: 'Q16', value: 'YES' },
        { questionId: 'Q19', value: 'YES' },
      ],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL2');
    expect(r.functionResults[0].decisiveQuestionIds).toContain('Q19');
    expect(r.functionResults[0].decisiveQuestionIds).not.toContain('Q16');
  });

  it('olika funktioner får olika nivåer', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION'), fn('f2', 'ADMINISTRATIVE_SUPPORT')],
      answers: [
        { questionId: 'Q17', value: 'YES' },
        { questionId: 'Q24', value: 'YES' },
      ],
    });
    expect(
      r.functionResults.find((f) => f.functionType === 'SAFETY_OPERATION')?.candidateLevel,
    ).toBe('CSL2');
    expect(
      r.functionResults.find((f) => f.functionType === 'ADMINISTRATIVE_SUPPORT')?.candidateLevel,
    ).toBe('CSL5');
    expect(r.systemLevel).toBe('CSL2');
  });
});

describe('classificationEngine — blockering', () => {
  it('Q16=UNCLEAR blockerar vid SAFETY_OPERATION', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [{ questionId: 'Q16', value: 'UNCLEAR' }],
    });
    expect(r.status).toBe('BLOCKED');
    expect(r.blockingQuestionIds).toContain('Q16');
  });

  it('Q16=UNCLEAR blockerar INTE vid ADMINISTRATIVE_SUPPORT (ej tillämplig)', () => {
    const r = classify({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [
        { questionId: 'Q16', value: 'UNCLEAR' },
        { questionId: 'Q24', value: 'YES' },
      ],
    });
    // Q16 gäller ej ADMINISTRATIVE_SUPPORT → ska inte blockera
    expect(r.blockingQuestionIds).not.toContain('Q16');
    expect(r.status).toBe('FINAL');
  });

  it('Q30=UNCLEAR blockerar INTE (ej längre blockerande)', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION'), fn('f2', 'MAIN_PROCESS')],
      answers: [
        { questionId: 'Q17', value: 'YES' },
        { questionId: 'Q30', value: 'UNCLEAR' },
      ],
    });
    expect(r.blockingQuestionIds).not.toContain('Q30');
  });
});

describe('classificationEngine — Q32 specialistgranskning', () => {
  it('Q32=YES → status REVIEW_REQUIRED, inte FINAL', () => {
    const r = classify({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [
        { questionId: 'Q24', value: 'YES' },
        { questionId: 'Q32', value: 'YES' },
      ],
    });
    expect(r.manualReviewRequired).toBe(true);
    expect(r.status).toBe('REVIEW_REQUIRED');
    expect(r.status).not.toBe('FINAL');
  });

  it('Q32=UNCLEAR → status REVIEW_REQUIRED', () => {
    const r = classify({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [
        { questionId: 'Q24', value: 'YES' },
        { questionId: 'Q32', value: 'UNCLEAR' },
      ],
    });
    expect(r.status).toBe('REVIEW_REQUIRED');
  });
});

describe('classificationEngine — highestLevelNotRuledOut', () => {
  it('beräknas baserat på faktisk blockerande fråga, inte alltid CSL1', () => {
    // Bara Q31 (CONTEXT, ingen candidateLevel) blockerar → borde inte ge CSL1
    const r = classify({
      functions: [fn('f1', 'ADMINISTRATIVE_SUPPORT')],
      answers: [
        { questionId: 'Q24', value: 'YES' },
        { questionId: 'Q31', value: 'UNCLEAR' },
      ],
    });
    expect(r.status).toBe('BLOCKED');
    // Q31 har ingen candidateLevel → highestLevelNotRuledOut = minimumJustifiedLevel
    expect(r.highestLevelNotRuledOut).toBe(r.minimumJustifiedLevel);
  });
});

describe('classificationEngine — mest stringent', () => {
  it('systemnivå = mest stringenta bland funktioner', () => {
    const r = classify({
      functions: [fn('f1', 'MAINTENANCE_SUPPORT'), fn('f2', 'SAFETY_OPERATION')],
      answers: [
        { questionId: 'Q21', value: 'YES' },
        { questionId: 'Q17', value: 'YES' },
      ],
    });
    expect(r.systemLevel).toBe('CSL2');
  });
});

describe('classificationEngine — analog fallback', () => {
  it('Q28=YES noterar fallback men sänker inte nivå', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [
        { questionId: 'Q17', value: 'YES' },
        { questionId: 'Q28', value: 'YES' },
      ],
    });
    expect(r.systemLevel).toBe('CSL2');
    expect(r.analogFallbackNoted).toBe(true);
  });
});

describe('classificationEngine — per-funktions-svar', () => {
  it('funktionsspecifikt svar övertrumfar globalt', () => {
    const r = classify({
      functions: [fn('f1', 'SAFETY_OPERATION')],
      answers: [
        { questionId: 'Q17', value: 'NO' }, // globalt
        { questionId: 'Q17', value: 'YES', functionId: 'f1' }, // specifikt
      ],
    });
    expect(r.functionResults[0].candidateLevel).toBe('CSL2');
  });
});
