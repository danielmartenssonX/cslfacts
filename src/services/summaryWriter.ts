import type { ClassificationResult } from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';

/**
 * Skapa en kort beslutsförklaring för vanlig användare.
 */
export function writeConciseSummary(result: ClassificationResult): string {
  if (result.status === 'PRELIMINARY_BLOCKED') {
    return `Bedömningen kan inte slutföras ännu. ${result.blockingQuestionIds.length} fråga(or) behöver besvaras först.`;
  }

  if (result.systemLevel === 'UNRESOLVED') {
    return 'Ingen nivå har kunnat fastställas utifrån de svar som lämnats.';
  }

  const functionSummaries = result.functionResults
    .filter((fr) => fr.candidateLevel !== 'UNRESOLVED')
    .map((fr) => `${FUNCTION_TYPE_LABELS[fr.functionType]}: ${CSL_LABELS[fr.candidateLevel]}`)
    .join(', ');

  return `Systemet föreslås klassas som ${CSL_LABELS[result.systemLevel]}. Funktioner: ${functionSummaries}.`;
}

/**
 * Skapa en fördjupad motivering för specialist eller granskare.
 */
export function writeDetailedSummary(result: ClassificationResult): string {
  const parts: string[] = [];

  parts.push(`Status: ${result.status}`);
  parts.push(`Systemnivå: ${CSL_LABELS[result.systemLevel]}`);

  if (result.status === 'PRELIMINARY_BLOCKED') {
    parts.push(`Lägsta motiverade nivå: ${CSL_LABELS[result.minimumJustifiedLevel]}`);
    parts.push(`Högsta ej uteslutbar nivå: ${CSL_LABELS[result.highestLevelNotRuledOut]}`);
  }

  for (const fr of result.functionResults) {
    const label = FUNCTION_TYPE_LABELS[fr.functionType];
    parts.push(
      `${label}: ${CSL_LABELS[fr.candidateLevel]} (avgörande: ${fr.decisiveQuestionIds.join(', ') || 'inga'})`,
    );
    if (fr.notes.length > 0) {
      parts.push(`  Noteringar: ${fr.notes.join('; ')}`);
    }
  }

  if (result.manualReviewRequired) {
    parts.push('Manuell specialistgranskning krävs.');
  }

  return parts.join('\n');
}
