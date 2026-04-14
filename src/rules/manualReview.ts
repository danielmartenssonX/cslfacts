import type { Answer, ClassificationResult } from '../domain/types';

/**
 * Kontrollera om manuell granskning behövs.
 * Q32 = YES eller UNCLEAR flaggar för specialistgranskning.
 * Q28 = YES (analog fallback) noteras men sänker aldrig automatiskt nivån.
 */
export function checkManualReviewFlags(answers: Answer[]): {
  manualReviewRequired: boolean;
  analogFallbackNoted: boolean;
  notes: string[];
} {
  const q32 = answers.find((a) => a.questionId === 'Q32');
  const q28 = answers.find((a) => a.questionId === 'Q28');

  const manualReviewRequired = q32?.value === 'YES' || q32?.value === 'UNCLEAR';
  const analogFallbackNoted = q28?.value === 'YES';

  const notes: string[] = [];

  if (manualReviewRequired) {
    notes.push(
      'Kontrollfråga Q32 indikerar att systemet kan behöva klassas högre. Specialistgranskning rekommenderas.',
    );
  }

  if (analogFallbackNoted) {
    notes.push(
      'Analog eller manuell fallback har noterats (Q28). Detta sänker inte nivån automatiskt men kan användas som motiveringsfaktor vid manuell granskning.',
    );
  }

  return { manualReviewRequired, analogFallbackNoted, notes };
}

/**
 * Kontrollera om en mindre stringent nivå har använts.
 * En mindre stringent nivå kräver explicit manuell motivering.
 */
export function validateLessStringentOverride(
  result: ClassificationResult,
  overrideLevel: string | null,
): { valid: boolean; message: string } {
  if (!overrideLevel) {
    return { valid: true, message: 'Ingen manuell åsidosättning.' };
  }

  return {
    valid: false,
    message:
      'Mindre stringent nivå har valts. Detta kräver explicit manuell motivering och flaggas i resultatet.',
  };
}
