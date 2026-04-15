import type { ClassificationResult } from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';
import { CSL_RATIONALE, buildSystemRationale } from '../data/cslRationale';

/**
 * Skapa en kort beslutsförklaring för vanlig användare.
 */
export function writeConciseSummary(result: ClassificationResult): string {
  if (result.status === 'BLOCKED') {
    return `Bedömningen kan inte slutföras ännu. ${result.blockingQuestionIds.length} fråga(or) behöver besvaras innan klassificeringen kan fastställas.`;
  }

  if (result.status === 'REVIEW_REQUIRED') {
    return 'Bedömningen kräver specialistgranskning innan nivån kan fastställas som slutlig.';
  }

  if (result.systemLevel === 'REVIEW_REQUIRED') {
    return 'Ingen nivå har kunnat fastställas utifrån de svar som lämnats. Specialistgranskning krävs.';
  }

  const levelRationale = CSL_RATIONALE[result.systemLevel];
  const resolvedFunctions = result.functionResults.filter(
    (fr) => fr.candidateLevel !== 'REVIEW_REQUIRED',
  );

  const functionNames = resolvedFunctions
    .map((fr) => FUNCTION_TYPE_LABELS[fr.functionType])
    .join(', ');

  return `Systemet föreslås klassas som ${CSL_LABELS[result.systemLevel]}. ${levelRationale.iaeaBasis} Bedömda funktioner: ${functionNames}.`;
}

/**
 * Skapa en fördjupad motivering för specialist eller granskare.
 */
export function writeDetailedSummary(result: ClassificationResult): string {
  return buildSystemRationale(result.systemLevel, result.functionResults);
}
