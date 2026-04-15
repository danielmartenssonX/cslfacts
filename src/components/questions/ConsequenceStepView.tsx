import { useMemo, useState } from 'react';
import type { AnswerValue, FacilityFunction, Question, SystemAssessment } from '../../domain/types';
import { FUNCTION_TYPE_LABELS } from '../../domain/enums';
import { resolveActiveFunctions } from '../../rules/functionResolution';
import { getAnswer } from '../../state/selectors';
import StepHeader from '../wizard/StepHeader';
import QuestionCard from './QuestionCard';

interface ConsequenceStepViewProps {
  state: SystemAssessment;
  setAnswer: (questionId: string, value: AnswerValue, functionId?: string) => void;
  questions: Question[];
}

/**
 * Kontrollera om en fråga gäller en viss funktionstyp.
 */
function questionAppliesTo(q: Question, functionType: string): boolean {
  if (q.appliesTo[0] === 'ALL') return true;
  return q.appliesTo.includes(functionType as never);
}

export default function ConsequenceStepView({
  state,
  setAnswer,
  questions,
}: ConsequenceStepViewProps) {
  // Lös funktioner dynamiskt från svar — inte beroende av state.functions
  // som bara sätts vid CALCULATE_RESULT
  const functions: FacilityFunction[] = useMemo(() => {
    if (state.functions.length > 0) return state.functions;
    return resolveActiveFunctions(state.answers, questions);
  }, [state.functions, state.answers, questions]);

  const consequenceQuestions = questions.filter((q) => q.section === 'CONSEQUENCE');

  // Aktiv flik
  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null);

  // Om inga funktioner identifierats
  if (functions.length === 0) {
    return (
      <div>
        <StepHeader step={3} subtitle="Bedöm konsekvenserna av fel i systemet per funktion." />
        <div className="rounded-lg border border-csl-warning/30 bg-csl-warning/5 p-6 text-center">
          <p className="text-sm font-medium text-csl-warning">
            Inga funktioner har identifierats ännu.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Gå tillbaka till steg 3 (Funktioner) och besvara frågorna Q09–Q15 för att identifiera
            vilka funktioner systemet stöder.
          </p>
        </div>
      </div>
    );
  }

  // Välj aktiv funktion — fallback till första
  const activeFunction = functions.find((f) => f.id === activeFunctionId) || functions[0];
  const applicableQuestions = consequenceQuestions.filter((q) =>
    questionAppliesTo(q, activeFunction.type),
  );

  return (
    <div>
      <StepHeader step={3} subtitle="Bedöm konsekvenserna av fel i systemet per funktion." />

      {/* Funktionsflikar */}
      <div className="mb-6 -mx-1 overflow-x-auto px-1 sm:overflow-visible">
        <div className="flex flex-wrap gap-1.5 sm:gap-2" role="tablist" aria-label="Funktioner">
          {functions.map((func) => {
            const isActive = func.id === activeFunction.id;
            const label = FUNCTION_TYPE_LABELS[func.type] || func.type;
            const funcQuestions = consequenceQuestions.filter((q) =>
              questionAppliesTo(q, func.type),
            );
            const answeredCount = funcQuestions.filter((q) =>
              state.answers.some(
                (a) => a.questionId === q.id && (a.functionId === func.id || !a.functionId),
              ),
            ).length;

            return (
              <button
                key={func.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFunctionId(func.id)}
                className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                  isActive
                    ? 'border-csl-primary bg-csl-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-csl-primary/30 hover:bg-csl-primary/5'
                }`}
              >
                {label}
                <span className={`ml-2 text-xs ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                  {answeredCount}/{funcQuestions.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Info om aktiv funktion */}
      <div className="mb-4 rounded border bg-gray-50 px-4 py-3">
        <p className="text-sm font-medium text-gray-900">
          {FUNCTION_TYPE_LABELS[activeFunction.type]}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{activeFunction.description}</p>
        <p className="mt-1 text-xs text-gray-400">
          {applicableQuestions.length} tillämpliga konsekvensfrågor för denna funktionstyp.
        </p>
      </div>

      {/* Konsekvensfrågor för aktiv funktion */}
      <div className="space-y-4" role="tabpanel">
        {applicableQuestions.map((q, i) => {
          // Hämta funktionsspecifikt svar, sedan globalt som fallback
          const specificAnswer = getAnswer(state, q.id, activeFunction.id);
          const globalAnswer = state.answers.find((a) => a.questionId === q.id && !a.functionId);
          const currentValue = specificAnswer?.value ?? globalAnswer?.value;

          return (
            <QuestionCard
              key={q.id}
              question={q}
              questionNumber={i + 1}
              currentValue={currentValue}
              onAnswer={(value) => setAnswer(q.id, value, activeFunction.id)}
            />
          );
        })}
      </div>

      {/* Notering om funktionsspecifika svar */}
      {functions.length > 1 && (
        <p className="mt-4 text-xs text-gray-400">
          Svaren lagras per funktion. Varje funktion bedöms separat i konsekvensbedömningen.
        </p>
      )}
    </div>
  );
}
