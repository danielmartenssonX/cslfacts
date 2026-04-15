import type { Answer, FacilityFunction, FunctionType, Question } from '../domain/types';
import functionCatalogData from '../data/functionCatalog.sv-SE.json';

const catalog = functionCatalogData.functions as FacilityFunction[];

/**
 * Bestäm vilka funktioner systemet stöder baserat på svar på funktionsfrågor.
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
 * Kontrollera om primärt system behöver väljas.
 * Verktyget modellerar ännu inte flera digitala tillgångar per funktion,
 * så denna kontroll returnerar alltid false. Q30 är informationsgivande.
 */
export function requiresPrimarySystemSelection(_functions: FacilityFunction[]): boolean {
  return false;
}
