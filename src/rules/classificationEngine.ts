import type {
  Answer,
  ClassificationResult,
  CSL,
  FunctionAssessmentResult,
  FunctionType,
  Question,
} from '../domain/types';

// ─── Nivåordning (mest stringent först) ─────────────────────────
const LEVEL_ORDER: CSL[] = ['CSL1', 'CSL2', 'CSL3', 'CSL4', 'CSL5', 'REVIEW_REQUIRED'];

const moreStringent = (a: CSL, b: CSL): CSL => {
  const ia = LEVEL_ORDER.indexOf(a);
  const ib = LEVEL_ORDER.indexOf(b);
  return ia <= ib ? a : b;
};

// ─── Svarskontroll ──────────────────────────────────────────────

function findAnswer(
  answers: Answer[],
  questionId: string,
  functionId?: string,
): Answer | undefined {
  if (functionId) {
    // Prioritera funktionsspecifikt svar; faller tillbaka till globalt
    const specific = answers.find(
      (a) => a.questionId === questionId && a.functionId === functionId,
    );
    if (specific) return specific;
    return answers.find((a) => a.questionId === questionId && !a.functionId);
  }
  return answers.find((a) => a.questionId === questionId);
}

// ─── appliesTo-kontroll ─────────────────────────────────────────

export type AppliesToMap = Record<string, FunctionType[] | ['ALL']>;

export function buildAppliesToMap(questions: Question[]): AppliesToMap {
  const map: AppliesToMap = {};
  for (const q of questions) {
    map[q.id] = q.appliesTo;
  }
  return map;
}

function questionApplies(
  appliesTo: AppliesToMap,
  questionId: string,
  functionType: FunctionType,
): boolean {
  const targets = appliesTo[questionId];
  if (!targets) return true;
  if (targets[0] === 'ALL') return true;
  return (targets as FunctionType[]).includes(functionType);
}

function yes(
  answers: Answer[],
  q: string,
  functionId: string | undefined,
  functionType: FunctionType,
  appliesTo: AppliesToMap,
): boolean {
  if (!questionApplies(appliesTo, q, functionType)) return false;
  return findAnswer(answers, q, functionId)?.value === 'YES';
}

function unclear(answers: Answer[], q: string, _functionId?: string): boolean {
  return findAnswer(answers, q, _functionId)?.value === 'UNCLEAR';
}

// ─── Datadriven nivåkaskad ──────────────────────────────────────
// Varje nivå listas med sina fråge-ID:n. Kaskaden itereras i ordning;
// den första nivån där minst en tillämplig fråga besvarats Ja vinner.

const LEVEL_QUESTIONS: { level: Exclude<CSL, 'REVIEW_REQUIRED'>; questionIds: string[] }[] = [
  { level: 'CSL1', questionIds: ['Q16', 'Q16b'] },
  { level: 'CSL2', questionIds: ['Q17', 'Q18', 'Q18b', 'Q19', 'Q20'] },
  { level: 'CSL3', questionIds: ['Q21', 'Q21b', 'Q22'] },
  { level: 'CSL4', questionIds: ['Q23', 'Q23b'] },
  { level: 'CSL5', questionIds: ['Q24', 'Q24b'] },
];

// ─── Klassificering per funktion ────────────────────────────────

export function classifyFunction(
  functionId: string,
  functionType: FunctionType,
  answers: Answer[],
  appliesTo: AppliesToMap,
): FunctionAssessmentResult {
  const y = (q: string) => yes(answers, q, functionId, functionType, appliesTo);

  for (const tier of LEVEL_QUESTIONS) {
    const hits = tier.questionIds.filter((qid) => y(qid));
    if (hits.length > 0) {
      return {
        functionId,
        functionType,
        candidateLevel: tier.level,
        levelSource: 'RULE_ENGINE',
        decisiveQuestionIds: hits,
        notes: [],
      };
    }
  }

  // Ingen nivå kunde fastställas → kräver specialistgranskning
  return {
    functionId,
    functionType,
    candidateLevel: 'REVIEW_REQUIRED',
    levelSource: 'PENDING',
    decisiveQuestionIds: [],
    notes: ['Ingen nivå kunde fastställas utifrån tillgängliga svar. Specialistgranskning krävs.'],
  };
}

// ─── Beräkna highestLevelNotRuledOut ────────────────────────────
// Baseras på vilka blockerande frågor med candidateLevel som är oklara
// och som gäller minst en aktiv funktionstyp.

function computeHighestLevelNotRuledOut(
  blockingHits: string[],
  currentLevel: CSL,
  appliesTo: AppliesToMap,
  activeFunctionTypes: FunctionType[],
  questions: Question[],
): CSL {
  let highest: CSL = currentLevel;
  for (const qid of blockingHits) {
    const q = questions.find((x) => x.id === qid);
    if (!q?.candidateLevel) continue;
    const applies = activeFunctionTypes.some((ft) => questionApplies(appliesTo, qid, ft));
    if (applies) {
      highest = moreStringent(highest, q.candidateLevel);
    }
  }
  return highest;
}

// ─── Tillämplig blockering ──────────────────────────────────────
// Blockerande frågor med UNCLEAR som gäller minst en aktiv funktion.

function getApplicableBlockingHits(
  answers: Answer[],
  blockingQuestionIds: string[],
  activeFunctionTypes: FunctionType[],
  appliesTo: AppliesToMap,
): string[] {
  return blockingQuestionIds.filter((qid) => {
    if (!unclear(answers, qid)) return false;
    const targets = appliesTo[qid];
    if (!targets || targets[0] === 'ALL') return true;
    return activeFunctionTypes.some((ft) => (targets as FunctionType[]).includes(ft));
  });
}

// ─── Klassificering av hela bedömningen ─────────────────────────

export function classifyAssessment(params: {
  functions: { id: string; type: FunctionType }[];
  answers: Answer[];
  blockingQuestionIds: string[];
  appliesTo: AppliesToMap;
  questions: Question[];
}): ClassificationResult {
  const { functions, answers, blockingQuestionIds, appliesTo, questions } = params;

  const activeFunctionTypes = functions.map((f) => f.type);

  // Blockerande frågor — bara de som gäller aktiva funktioner
  const blockingHits = getApplicableBlockingHits(
    answers,
    blockingQuestionIds,
    activeFunctionTypes,
    appliesTo,
  );

  // Klassificera varje funktion
  const functionResults = functions.map((f) => classifyFunction(f.id, f.type, answers, appliesTo));

  // Aggregera systemnivå (mest stringent)
  let systemLevel: CSL = 'REVIEW_REQUIRED';
  for (const fr of functionResults) {
    if (fr.candidateLevel === 'REVIEW_REQUIRED') continue;
    systemLevel =
      systemLevel === 'REVIEW_REQUIRED'
        ? fr.candidateLevel
        : moreStringent(systemLevel, fr.candidateLevel);
  }

  // Manuell granskning (Q32)
  const manualReviewRequired =
    findAnswer(answers, 'Q32')?.value === 'YES' || findAnswer(answers, 'Q32')?.value === 'UNCLEAR';

  // Analog fallback (Q28)
  const analogFallbackNoted = findAnswer(answers, 'Q28')?.value === 'YES';

  // Nivåintervall
  const minimumJustifiedLevel: CSL = systemLevel;
  const highestLevelNotRuledOut =
    blockingHits.length > 0
      ? computeHighestLevelNotRuledOut(
          blockingHits,
          systemLevel,
          appliesTo,
          activeFunctionTypes,
          questions,
        )
      : systemLevel;

  // ─── Statusbestämning ───────────────────────────────────────
  // BLOCKED: tillämpliga blockerande frågor har oklara svar
  // REVIEW_REQUIRED: Q32 flaggar eller motor kan inte fastställa nivå
  // FINAL: allt löst, inget specialistbehov
  let status: 'DRAFT' | 'PRELIMINARY' | 'BLOCKED' | 'REVIEW_REQUIRED' | 'FINAL';
  if (blockingHits.length > 0) {
    status = 'BLOCKED';
  } else if (manualReviewRequired) {
    status = 'REVIEW_REQUIRED';
  } else if (systemLevel === 'REVIEW_REQUIRED') {
    status = 'REVIEW_REQUIRED';
  } else if (functionResults.some((fr) => fr.candidateLevel === 'REVIEW_REQUIRED')) {
    status = 'REVIEW_REQUIRED';
  } else {
    status = 'FINAL';
  }

  const conciseRationale =
    status === 'FINAL'
      ? `Systemet har klassats som ${systemLevel} utifrån de funktioner det stöder och de konsekvenser som besvarats med Ja.`
      : status === 'BLOCKED'
        ? 'Klassificeringen kan inte slutföras. Blockerande frågor har oklara svar.'
        : status === 'REVIEW_REQUIRED'
          ? 'Bedömningen kräver specialistgranskning innan nivån kan fastställas som slutlig.'
          : 'Resultatet är preliminärt — fler frågor behöver besvaras.';

  const detailedRationale =
    status === 'FINAL'
      ? `Systemnivån har satts till ${systemLevel} eftersom detta är den mest stringenta kandidatnivån bland de identifierade funktionerna.`
      : status === 'REVIEW_REQUIRED'
        ? 'Regelmotorn kan inte fastställa en slutlig nivå. Specialistgranskning krävs innan klassificeringen kan fastställas.'
        : 'Slutlig klassificering kan inte fastställas ännu. Blockerande oklarheter eller ofullständig konsekvensbedömning återstår.';

  return {
    status,
    systemLevel,
    minimumJustifiedLevel,
    highestLevelNotRuledOut,
    functionResults,
    blockingQuestionIds: blockingHits,
    manualReviewRequired,
    analogFallbackNoted,
    conciseRationale,
    detailedRationale,
    decisionTrace: [],
  };
}
