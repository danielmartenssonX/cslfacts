import type {
  DecisionTraceItem,
  ClassificationResult,
  FunctionAssessmentResult,
} from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';
import { CSL_RATIONALE, QUESTION_RATIONALE } from '../data/cslRationale';

/**
 * Bygg en detaljerad beslutslogg för hela klassificeringen.
 */
export function buildFullDecisionTrace(result: ClassificationResult): DecisionTraceItem[] {
  const trace: DecisionTraceItem[] = [];

  // Blockerande kontroll
  if (result.blockingQuestionIds.length > 0) {
    trace.push({
      step: 'BLOCKERANDE_KONTROLL',
      message: `${result.blockingQuestionIds.length} blockerande fråga(or) har svaret "Vet inte än": ${result.blockingQuestionIds.join(', ')}. Slutlig klassificering kan inte fastställas förrän dessa besvarats.`,
      relatedQuestionIds: result.blockingQuestionIds,
    });
  }

  // Per funktion med IAEA-motivering
  for (const fr of result.functionResults) {
    trace.push(buildFunctionTraceItem(fr));
  }

  // Systemnivå med IAEA-bas
  if (result.systemLevel === 'UNRESOLVED') {
    trace.push({
      step: 'SYSTEMNIVÅ',
      message:
        'Systemnivån kunde inte fastställas. Konsekvensbedömningen behöver kompletteras för de identifierade funktionerna.',
    });
  } else {
    const rationale = CSL_RATIONALE[result.systemLevel];
    const resolvedCount = result.functionResults.filter(
      (f) => f.candidateLevel !== 'UNRESOLVED',
    ).length;
    trace.push({
      step: 'SYSTEMNIVÅ',
      message: `Systemnivån har satts till ${CSL_LABELS[result.systemLevel]}. Detta är den mest stringenta nivån bland ${resolvedCount} bedömda funktion(er). ${rationale.iaeaBasis}`,
    });
  }

  // Manuell granskning
  if (result.manualReviewRequired) {
    trace.push({
      step: 'MANUELL_GRANSKNING',
      message:
        'Kontrollfråga Q32 indikerar att systemet kan behöva klassas högre än vad regelmotorn föreslår. Specialistgranskning rekommenderas innan nivån fastställs.',
      relatedQuestionIds: ['Q32'],
    });
  }

  return trace;
}

function buildFunctionTraceItem(fr: FunctionAssessmentResult): DecisionTraceItem {
  const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;

  if (fr.candidateLevel === 'UNRESOLVED') {
    return {
      step: `FUNKTION: ${label}`,
      message: `Ingen CSL-nivå kunde fastställas. Konsekvensbedömningen behöver kompletteras.`,
      relatedQuestionIds: fr.decisiveQuestionIds,
    };
  }

  const levelLabel = CSL_LABELS[fr.candidateLevel];
  const rationale = CSL_RATIONALE[fr.candidateLevel];

  // Bygg motivering från avgörande frågor
  const questionDetails = fr.decisiveQuestionIds
    .map((qid) => {
      const qr = QUESTION_RATIONALE[qid];
      return qr ? `${qid}: ${qr.yesImplication}` : qid;
    })
    .join(' ');

  return {
    step: `FUNKTION: ${label}`,
    message: `Kandidatnivå ${levelLabel}. ${rationale.consequence} ${questionDetails}`,
    relatedQuestionIds: fr.decisiveQuestionIds,
  };
}
