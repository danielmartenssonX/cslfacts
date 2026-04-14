import type {
  Answer,
  ClassificationResult,
  CSL,
  DecisionTraceItem,
  FunctionAssessmentResult,
  FunctionType,
} from '../domain/types';

const LEVEL_ORDER: CSL[] = ['CSL1', 'CSL2', 'CSL3', 'CSL4', 'CSL5', 'UNRESOLVED'];

const moreStringent = (a: CSL, b: CSL): CSL => {
  const ia = LEVEL_ORDER.indexOf(a);
  const ib = LEVEL_ORDER.indexOf(b);
  return ia <= ib ? a : b;
};

function findAnswer(
  answers: Answer[],
  questionId: string,
  functionId?: string,
): Answer | undefined {
  return answers.find(
    (a) => a.questionId === questionId && (functionId ? a.functionId === functionId : true),
  );
}

function yes(answers: Answer[], q: string, functionId?: string): boolean {
  return findAnswer(answers, q, functionId)?.value === 'YES';
}

function unclear(answers: Answer[], q: string, _functionId?: string): boolean {
  return findAnswer(answers, q, _functionId)?.value === 'UNCLEAR';
}

export function classifyFunction(
  functionId: string,
  functionType: FunctionType,
  answers: Answer[],
): FunctionAssessmentResult {
  const decisiveQuestionIds: string[] = [];
  const notes: string[] = [];

  // CSL1: Q16 = Ja
  if (yes(answers, 'Q16', functionId)) {
    decisiveQuestionIds.push('Q16');
    return { functionId, functionType, candidateLevel: 'CSL1', decisiveQuestionIds, notes };
  }

  // CSL2: Q17-Q20 = Ja
  if (
    yes(answers, 'Q17', functionId) ||
    yes(answers, 'Q18', functionId) ||
    yes(answers, 'Q19', functionId) ||
    yes(answers, 'Q20', functionId)
  ) {
    if (yes(answers, 'Q17', functionId)) decisiveQuestionIds.push('Q17');
    if (yes(answers, 'Q18', functionId)) decisiveQuestionIds.push('Q18');
    if (yes(answers, 'Q19', functionId)) decisiveQuestionIds.push('Q19');
    if (yes(answers, 'Q20', functionId)) decisiveQuestionIds.push('Q20');
    return { functionId, functionType, candidateLevel: 'CSL2', decisiveQuestionIds, notes };
  }

  // CSL3: Q21-Q22 = Ja
  if (yes(answers, 'Q21', functionId) || yes(answers, 'Q22', functionId)) {
    if (yes(answers, 'Q21', functionId)) decisiveQuestionIds.push('Q21');
    if (yes(answers, 'Q22', functionId)) decisiveQuestionIds.push('Q22');
    return { functionId, functionType, candidateLevel: 'CSL3', decisiveQuestionIds, notes };
  }

  // CSL4: Q23 = Ja
  if (yes(answers, 'Q23', functionId)) {
    decisiveQuestionIds.push('Q23');
    return { functionId, functionType, candidateLevel: 'CSL4', decisiveQuestionIds, notes };
  }

  // CSL5: Q24 = Ja
  if (yes(answers, 'Q24', functionId)) {
    decisiveQuestionIds.push('Q24');
    return { functionId, functionType, candidateLevel: 'CSL5', decisiveQuestionIds, notes };
  }

  notes.push('Ingen nivå kunde fastställas utifrån tillgängliga svar.');
  return { functionId, functionType, candidateLevel: 'UNRESOLVED', decisiveQuestionIds, notes };
}

export function classifyAssessment(params: {
  functions: { id: string; type: FunctionType }[];
  answers: Answer[];
  blockingQuestionIds: string[];
  requiresPrimarySystemSelection: boolean;
  primarySystemConfirmed: boolean;
}): ClassificationResult {
  const {
    functions,
    answers,
    blockingQuestionIds,
    requiresPrimarySystemSelection,
    primarySystemConfirmed,
  } = params;

  const decisionTrace: DecisionTraceItem[] = [];
  const blockingHits = blockingQuestionIds.filter((q) => unclear(answers, q));

  if (requiresPrimarySystemSelection && !primarySystemConfirmed && !blockingHits.includes('Q30')) {
    blockingHits.push('Q30');
  }

  const functionResults = functions.map((f) => classifyFunction(f.id, f.type, answers));

  let systemLevel: CSL = 'UNRESOLVED';

  for (const fr of functionResults) {
    if (fr.candidateLevel === 'UNRESOLVED') continue;
    systemLevel =
      systemLevel === 'UNRESOLVED'
        ? fr.candidateLevel
        : moreStringent(systemLevel, fr.candidateLevel);
  }

  const manualReviewRequired = yes(answers, 'Q32') || unclear(answers, 'Q32');

  const minimumJustifiedLevel: CSL = systemLevel;
  let highestLevelNotRuledOut: CSL = systemLevel === 'UNRESOLVED' ? 'CSL1' : systemLevel;

  if (blockingHits.length > 0) {
    highestLevelNotRuledOut = 'CSL1';
    decisionTrace.push({
      step: 'BLOCKING_CHECK',
      message: 'Blockerande frågor har svarsvärdet Vet inte än. Resultatet kan inte fastställas.',
      relatedQuestionIds: blockingHits,
    });
  }

  decisionTrace.push({
    step: 'FUNCTION_RESULTS',
    message: 'Funktionsresultat har beräknats.',
    relatedQuestionIds: functionResults.flatMap((f) => f.decisiveQuestionIds),
  });

  const status =
    blockingHits.length > 0
      ? 'PRELIMINARY_BLOCKED'
      : systemLevel === 'UNRESOLVED'
        ? 'PRELIMINARY'
        : 'FINAL';

  const conciseRationale =
    status === 'FINAL'
      ? `Systemet har klassats som ${systemLevel} utifrån de funktioner det stöder och de konsekvenser som besvarats med Ja.`
      : 'Resultatet är preliminärt eftersom viktiga frågor ännu inte är tillräckligt besvarade.';

  const detailedRationale =
    status === 'FINAL'
      ? `Systemnivån har satts till ${systemLevel} eftersom detta är den mest stringenta kandidatnivån bland de identifierade funktionerna.`
      : 'Slutlig klassificering kan inte fastställas ännu. Blockerande oklarheter eller ofullständig konsekvensbedömning återstår.';

  return {
    status,
    systemLevel,
    minimumJustifiedLevel,
    highestLevelNotRuledOut,
    functionResults,
    blockingQuestionIds: blockingHits,
    manualReviewRequired,
    conciseRationale,
    detailedRationale,
    decisionTrace,
  };
}
