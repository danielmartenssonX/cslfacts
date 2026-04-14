import type {
  DecisionTraceItem,
  ClassificationResult,
  FunctionAssessmentResult,
} from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';

/**
 * Bygg en detaljerad beslutslogg för hela klassificeringen.
 */
export function buildFullDecisionTrace(result: ClassificationResult): DecisionTraceItem[] {
  const trace: DecisionTraceItem[] = [];

  // Blockerande kontroll
  if (result.blockingQuestionIds.length > 0) {
    trace.push({
      step: 'BLOCKING_CHECK',
      message: `${result.blockingQuestionIds.length} blockerande fråga(or) har svaret "Vet inte än": ${result.blockingQuestionIds.join(', ')}. Slutlig klassificering kan inte fastställas.`,
      relatedQuestionIds: result.blockingQuestionIds,
    });
  }

  // Per funktion
  for (const fr of result.functionResults) {
    trace.push(buildFunctionTraceItem(fr));
  }

  // Systemnivå
  trace.push({
    step: 'SYSTEM_LEVEL',
    message:
      result.systemLevel === 'UNRESOLVED'
        ? 'Systemnivån kunde inte fastställas.'
        : `Systemnivån blev ${CSL_LABELS[result.systemLevel]} som den mest stringenta av funktionernas kandidatnivåer.`,
  });

  // Manuell granskning
  if (result.manualReviewRequired) {
    trace.push({
      step: 'MANUAL_REVIEW',
      message: 'Manuell specialistgranskning krävs (Q32 indikerar möjlig uppklassning).',
      relatedQuestionIds: ['Q32'],
    });
  }

  return trace;
}

function buildFunctionTraceItem(fr: FunctionAssessmentResult): DecisionTraceItem {
  const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;
  const levelLabel = CSL_LABELS[fr.candidateLevel];

  if (fr.candidateLevel === 'UNRESOLVED') {
    return {
      step: `FUNCTION_${fr.functionId}`,
      message: `${label}: Ingen nivå kunde fastställas.`,
      relatedQuestionIds: fr.decisiveQuestionIds,
    };
  }

  return {
    step: `FUNCTION_${fr.functionId}`,
    message: `${label}: Kandidatnivå ${levelLabel} baserat på ${fr.decisiveQuestionIds.join(', ')}.`,
    relatedQuestionIds: fr.decisiveQuestionIds,
  };
}
