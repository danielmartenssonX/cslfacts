import type {
  DecisionTraceItem,
  ClassificationResult,
  FunctionAssessmentResult,
} from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';
import { CSL_RATIONALE, QUESTION_RATIONALE } from '../data/cslRationale';

/**
 * Bygg en tydlig, numrerad beslutskedja som förklarar hela klassificeringen steg för steg.
 *
 * Funktioner som ger exakt samma nivå av exakt samma frågor grupperas till ett steg
 * för att undvika upprepning.
 */
export function buildFullDecisionTrace(result: ClassificationResult): DecisionTraceItem[] {
  const trace: DecisionTraceItem[] = [];
  let order = 1;

  // ── Steg 1: Identifierade funktioner ──────────────────────────

  const functionNames = result.functionResults.map(
    (fr) => FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType,
  );

  trace.push(
    makeItem(order++, 'Identifierade funktioner', {
      conclusion:
        result.functionResults.length === 0
          ? 'Inga funktioner identifierades för systemet.'
          : result.functionResults.length === 1
            ? `En funktion identifierades: ${functionNames[0]}.`
            : `${result.functionResults.length} funktioner identifierades: ${functionNames.join(', ')}.`,
      reasoning:
        'Funktionerna identifieras via frågorna Q09–Q15. Varje funktion bedöms separat i konsekvensbedömningen.',
    }),
  );

  // ── Steg 2+: Konsekvensbedömning (grupperad) ─────────────────

  const groups = groupFunctionResults(result.functionResults);

  for (const group of groups) {
    trace.push(buildGroupStep(order++, group));
  }

  // ── Systemnivå ────────────────────────────────────────────────

  if (result.systemLevel === 'REVIEW_REQUIRED') {
    trace.push(
      makeItem(order++, 'Systemnivå', {
        conclusion: 'Systemnivån kunde inte fastställas.',
        reasoning:
          'Konsekvensbedömningen behöver kompletteras för de identifierade funktionerna innan en nivå kan tilldelas.',
      }),
    );
  } else {
    const resolved = result.functionResults.filter((f) => f.candidateLevel !== 'REVIEW_REQUIRED');
    if (resolved.length <= 1) {
      trace.push(
        makeItem(order++, 'Systemnivå', {
          conclusion: `Systemnivån sätts till ${CSL_LABELS[result.systemLevel]}.`,
          reasoning: 'Baserat på den enda bedömda funktionens kandidatnivå.',
        }),
      );
    } else {
      // Visa bara nivåerna som skiljer sig
      const uniqueLevels = new Map<string, string[]>();
      for (const f of resolved) {
        const lvl = f.candidateLevel;
        const name = FUNCTION_TYPE_LABELS[f.functionType] || f.functionType;
        if (!uniqueLevels.has(lvl)) uniqueLevels.set(lvl, []);
        uniqueLevels.get(lvl)!.push(name);
      }
      const parts = Array.from(uniqueLevels.entries())
        .map(
          ([lvl, names]) => `${names.join(', ')} → ${CSL_LABELS[lvl as keyof typeof CSL_LABELS]}`,
        )
        .join('; ');

      trace.push(
        makeItem(order++, 'Systemnivå — mest stringent nivå', {
          conclusion: `Systemnivån sätts till ${CSL_LABELS[result.systemLevel]}.`,
          reasoning: `Funktionernas kandidatnivåer: ${parts}. Enligt IAEA NSS 17-T ska systemnivån motsvara den mest stringenta skyddsnivån bland alla funktioner.`,
        }),
      );
    }
  }

  // ── Blockerande oklarheter ────────────────────────────────────

  if (result.blockingQuestionIds.length > 0) {
    trace.push(
      makeItem(order++, 'Blockerande oklarheter', {
        conclusion: `${result.blockingQuestionIds.length} blockerande fråga(or) har svaret "Vet inte än" — klassificeringen är preliminär.`,
        reasoning: `Frågorna ${result.blockingQuestionIds.join(', ')} måste besvaras innan klassificeringen kan fastställas som slutlig.`,
        relatedQuestionIds: result.blockingQuestionIds,
      }),
    );
  }

  // ── Manuell granskning ────────────────────────────────────────

  if (result.manualReviewRequired) {
    trace.push(
      makeItem(order++, 'Flaggad för specialistgranskning', {
        conclusion: 'Bedömningen flaggas för manuell granskning.',
        reasoning:
          'Kontrollfråga Q32 indikerar att systemet kan behöva klassas högre än vad regelmotorn föreslår. En specialist bör granska innan nivån fastställs.',
        relatedQuestionIds: ['Q32'],
      }),
    );
  }

  // ── Slutsats ──────────────────────────────────────────────────

  trace.push(
    makeItem(order++, 'Slutsats', {
      conclusion: buildFinalConclusion(result),
    }),
  );

  return trace;
}

// ─── Gruppering av funktionsresultat ─────────────────────────────

interface FunctionGroup {
  level: string;
  functions: FunctionAssessmentResult[];
  decisiveQuestionIds: string[];
}

/**
 * Grupperar funktioner som fick samma nivå baserat på samma avgörande frågor.
 * Undviker upprepning av identiska motiveringar.
 */
function groupFunctionResults(results: FunctionAssessmentResult[]): FunctionGroup[] {
  const groups = new Map<string, FunctionGroup>();

  for (const fr of results) {
    // Nyckel = nivå + sorterade fråge-ID
    const key = `${fr.candidateLevel}|${[...fr.decisiveQuestionIds].sort().join(',')}`;
    if (!groups.has(key)) {
      groups.set(key, {
        level: fr.candidateLevel,
        functions: [],
        decisiveQuestionIds: [...fr.decisiveQuestionIds],
      });
    }
    groups.get(key)!.functions.push(fr);
  }

  return Array.from(groups.values());
}

function buildGroupStep(order: number, group: FunctionGroup): DecisionTraceItem {
  const names = group.functions.map(
    (fr) => FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType,
  );
  const nameList = names.join(', ');

  // Rubrik: visa funktion(er)
  const heading =
    group.functions.length === 1
      ? `Konsekvensbedömning: ${names[0]}`
      : `Konsekvensbedömning: ${nameList}`;

  if (group.level === 'REVIEW_REQUIRED') {
    return makeItem(order, heading, {
      conclusion: 'Ingen CSL-nivå kunde fastställas.',
      reasoning:
        'Konsekvensbedömningen behöver kompletteras — de avgörande frågorna saknar entydiga svar.',
      relatedQuestionIds: group.decisiveQuestionIds,
    });
  }

  const levelLabel = CSL_LABELS[group.level as keyof typeof CSL_LABELS];
  const rationale = CSL_RATIONALE[group.level as keyof typeof CSL_RATIONALE];

  // Motivering från avgörande frågor
  const questionReasons = group.decisiveQuestionIds
    .map((qid) => {
      const qr = QUESTION_RATIONALE[qid];
      return qr ? qr.yesImplication : null;
    })
    .filter(Boolean)
    .join(' ');

  const conclusion =
    group.functions.length === 1
      ? `Kandidatnivå: ${levelLabel}.`
      : `Alla ${group.functions.length} funktioner får kandidatnivå ${levelLabel}.`;

  return makeItem(order, heading, {
    conclusion,
    reasoning: questionReasons || rationale.consequence,
    relatedQuestionIds: group.decisiveQuestionIds,
  });
}

function buildFinalConclusion(result: ClassificationResult): string {
  if (result.status === 'BLOCKED') {
    return `Bedömningen kan inte slutföras. Systemnivån ligger i intervallet ${CSL_LABELS[result.minimumJustifiedLevel]} till ${CSL_LABELS[result.highestLevelNotRuledOut]} men kan inte fastställas förrän blockerande frågor besvarats.`;
  }
  if (result.status === 'REVIEW_REQUIRED') {
    return 'Bedömningen kräver specialistgranskning innan nivån kan fastställas som slutlig.';
  }
  if (result.systemLevel === 'REVIEW_REQUIRED') {
    return 'Ingen systemnivå har kunnat fastställas. Specialistgranskning krävs.';
  }
  return `Systemet föreslås klassas som ${CSL_LABELS[result.systemLevel]}.`;
}

/** Skapar ett DecisionTraceItem med bakåtkompatibilitet */
function makeItem(
  order: number,
  heading: string,
  opts: {
    conclusion: string;
    reasoning?: string;
    relatedQuestionIds?: string[];
  },
): DecisionTraceItem {
  return {
    order,
    heading,
    conclusion: opts.conclusion,
    reasoning: opts.reasoning,
    relatedQuestionIds: opts.relatedQuestionIds,
    // Bakåtkompatibilitet
    step: heading,
    message: opts.reasoning ? `${opts.conclusion} ${opts.reasoning}` : opts.conclusion,
  };
}
