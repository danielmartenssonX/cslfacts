import type { SystemAssessment, Answer, Question, InvestigationItem } from '../domain/types';
import { buildInvestigationItems } from '../services/investigationBuilder';
import { resolveActiveFunctions } from '../rules/functionResolution';

export function getAnswer(
  state: SystemAssessment,
  questionId: string,
  functionId?: string,
): Answer | undefined {
  return state.answers.find(
    (a) => a.questionId === questionId && (functionId ? a.functionId === functionId : true),
  );
}

export function getAnsweredCount(
  state: SystemAssessment,
  section: string,
  questions: Question[],
): number {
  const sectionQs = questions.filter((q) => q.section === section);
  return sectionQs.filter((q) => state.answers.some((a) => a.questionId === q.id)).length;
}

export function getTotalCount(section: string, questions: Question[]): number {
  return questions.filter((q) => q.section === section).length;
}

export function getInvestigationItems(
  state: SystemAssessment,
  questions: Question[],
): InvestigationItem[] {
  return buildInvestigationItems(state.answers, questions);
}

export function getBlockingInvestigationItems(
  state: SystemAssessment,
  questions: Question[],
): InvestigationItem[] {
  return getInvestigationItems(state, questions).filter((item) => item.blocksFinalization);
}

export function isStepComplete(
  state: SystemAssessment,
  step: number,
  questions: Question[],
): boolean {
  switch (step) {
    case 0: // Grundfakta
      return !!(state.systemName && state.facilityName && state.assessor);
    case 1: // Avgränsning
      return getAnsweredCount(state, 'SCOPE', questions) === getTotalCount('SCOPE', questions);
    case 2: // Funktioner
      return getAnsweredCount(state, 'FUNCTION', questions) > 0;
    case 3: {
      // Konsekvensfrågor — per funktion (löser funktioner dynamiskt)
      const activeFunctions =
        state.functions.length > 0
          ? state.functions
          : resolveActiveFunctions(state.answers, questions);
      if (activeFunctions.length === 0) return false;
      return activeFunctions.every((func) => {
        const applicable = questions.filter(
          (q) =>
            q.section === 'CONSEQUENCE' &&
            (q.appliesTo[0] === 'ALL' || q.appliesTo.includes(func.type as never)),
        );
        if (applicable.length === 0) return true; // Inga tillämpliga frågor → OK
        return applicable.some((q) =>
          state.answers.some(
            (a) => a.questionId === q.id && (a.functionId === func.id || !a.functionId),
          ),
        );
      });
    }
    case 4: // Kontext och komplettering
      return getAnsweredCount(state, 'CONTEXT', questions) > 0;
    case 5: // Oklarheter
      return true; // Alltid tillgängligt
    case 6: // Resultat
      return state.result !== null;
    case 7: // Kravredovisning (valfritt steg — alltid tillgängligt)
      return true;
    default:
      return false;
  }
}
