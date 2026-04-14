import type { Answer, FacilityFunction, FunctionType, Question } from '../domain/types';
import functionCatalogData from '../data/functionCatalog.sv-SE.json';

const catalog = functionCatalogData.functions as FacilityFunction[];

/**
 * Bestäm vilka funktioner systemet stöder baserat på svar på funktionsfrågor (Q09-Q15).
 * Frågor med createsFunctions och answer = YES skapar motsvarande funktion.
 */
export function resolveActiveFunctions(
  answers: Answer[],
  questions: Question[],
): FacilityFunction[] {
  const activeTypes = new Set<FunctionType>();

  for (const q of questions) {
    if (!q.createsFunctions || q.createsFunctions.length === 0) continue;
    const answer = answers.find((a) => a.questionId === q.id);
    if (answer?.value === 'YES') {
      for (const ft of q.createsFunctions) {
        activeTypes.add(ft);
      }
    }
  }

  return catalog.filter((f) => activeTypes.has(f.type));
}

/**
 * Kontrollera om flera digitala tillgångar stöder samma funktion,
 * dvs. om primärt system måste pekas ut.
 */
export function requiresPrimarySystemSelection(functions: FacilityFunction[]): boolean {
  // Heuristik: om fler än en funktion av samma typ identifieras
  // I denna version delegeras detta till Q30
  return functions.length > 1;
}
