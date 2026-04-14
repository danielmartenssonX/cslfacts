import type { SystemAssessment, Question } from '../../domain/types';
import { FUNCTION_TYPE_LABELS } from '../../domain/enums';

interface KnownFactsPanelProps {
  state: SystemAssessment;
  questions: Question[];
}

export default function KnownFactsPanel({ state, questions }: KnownFactsPanelProps) {
  const answeredYes = state.answers.filter((a) => a.value === 'YES');
  const answeredNo = state.answers.filter((a) => a.value === 'NO');
  const answeredUnclear = state.answers.filter((a) => a.value === 'UNCLEAR');

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-csl-primary">Kända fakta</h3>

      {state.systemName && (
        <div className="mb-2 text-xs">
          <span className="font-medium text-gray-500">System:</span>{' '}
          <span className="text-gray-800">{state.systemName}</span>
        </div>
      )}

      {state.functions.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500">Identifierade funktioner:</p>
          <ul className="mt-1 space-y-0.5">
            {state.functions.map((f) => (
              <li key={f.id} className="text-xs text-gray-700">
                • {FUNCTION_TYPE_LABELS[f.type] || f.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-1 text-xs">
        <p className="text-csl-success">{answeredYes.length} svar: Ja</p>
        <p className="text-csl-danger">{answeredNo.length} svar: Nej</p>
        <p className="text-csl-warning">{answeredUnclear.length} svar: Vet inte än</p>
        <p className="text-gray-500">{questions.length - state.answers.length} obesvarade</p>
      </div>
    </div>
  );
}
