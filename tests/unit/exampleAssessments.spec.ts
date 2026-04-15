import { describe, expect, it } from 'vitest';
import {
  EXAMPLE_ASSESSMENTS_META,
  buildExampleAssessment,
} from '../../src/data/exampleAssessments';
import { classifyAssessment, buildAppliesToMap } from '../../src/rules/classificationEngine';
import { getBlockingQuestionIds } from '../../src/rules/blockingRules';
import { resolveActiveFunctions } from '../../src/rules/functionResolution';
import type { Question } from '../../src/domain/types';
import questionBankData from '../../src/data/questionBank.sv-SE.json';

const allQuestions = questionBankData.questions as unknown as Question[];
const appliesTo = buildAppliesToMap(allQuestions);
const blockingIds = getBlockingQuestionIds(allQuestions);

/**
 * Kör klassificeringsmotorn på ett exempelobjekt och returnera resultat.
 */
function classifyExample(exampleId: string) {
  const assessment = buildExampleAssessment(exampleId);
  if (!assessment) throw new Error(`Exempel ${exampleId} hittades inte`);

  const functions = resolveActiveFunctions(assessment.answers, allQuestions);
  if (functions.length === 0) throw new Error(`Inga funktioner lösta för ${exampleId}`);

  return classifyAssessment({
    functions: functions.map((f) => ({ id: f.id, type: f.type })),
    answers: assessment.answers,
    blockingQuestionIds: blockingIds,
    appliesTo,
    questions: allQuestions,
  });
}

describe('exampleAssessments — IAEA Annex III', () => {
  it('har 7 exempelobjekt', () => {
    expect(EXAMPLE_ASSESSMENTS_META).toHaveLength(7);
  });

  it('alla exempel kan byggas till SystemAssessment', () => {
    for (const meta of EXAMPLE_ASSESSMENTS_META) {
      const assessment = buildExampleAssessment(meta.id);
      expect(assessment).not.toBeNull();
      expect(assessment!.answers.length).toBeGreaterThan(0);
      expect(assessment!.systemName).toBeTruthy();
    }
  });

  // ─── Verifiering av förväntat klassificeringsresultat ─────────

  it('EX_CSL1_RSK1 → CSL1 FINAL', () => {
    const r = classifyExample('EX_CSL1_RSK1');
    expect(r.systemLevel).toBe('CSL1');
    expect(r.status).toBe('FINAL');
  });

  it('EX_CSL2_RBG2 → CSL2 FINAL', () => {
    const r = classifyExample('EX_CSL2_RBG2');
    expect(r.systemLevel).toBe('CSL2');
    expect(r.status).toBe('FINAL');
  });

  it('EX_CSL3_DIS3 → CSL3 FINAL', () => {
    const r = classifyExample('EX_CSL3_DIS3');
    expect(r.systemLevel).toBe('CSL3');
    expect(r.status).toBe('FINAL');
  });

  it('EX_CSL3_BAS3 → CSL3 FINAL', () => {
    const r = classifyExample('EX_CSL3_BAS3');
    expect(r.systemLevel).toBe('CSL3');
    expect(r.status).toBe('FINAL');
  });

  it('EX_CSL4_KIT4 → CSL4 FINAL', () => {
    const r = classifyExample('EX_CSL4_KIT4');
    expect(r.systemLevel).toBe('CSL4');
    expect(r.status).toBe('FINAL');
  });

  it('EX_CSL4_IKS4 → CSL4 FINAL', () => {
    const r = classifyExample('EX_CSL4_IKS4');
    expect(r.systemLevel).toBe('CSL4');
    expect(r.status).toBe('FINAL');
  });

  it('EX_CSL5_PME5 → CSL5 FINAL', () => {
    const r = classifyExample('EX_CSL5_PME5');
    expect(r.systemLevel).toBe('CSL5');
    expect(r.status).toBe('FINAL');
  });

  // ─── Inga exempel ska blockeras eller kräva granskning ────────

  it('inga exempel är blockerade', () => {
    for (const meta of EXAMPLE_ASSESSMENTS_META) {
      const r = classifyExample(meta.id);
      expect(r.status).not.toBe('BLOCKED');
      expect(r.blockingQuestionIds).toHaveLength(0);
    }
  });

  it('inga exempel kräver manuell granskning', () => {
    for (const meta of EXAMPLE_ASSESSMENTS_META) {
      const r = classifyExample(meta.id);
      expect(r.manualReviewRequired).toBe(false);
    }
  });
});
