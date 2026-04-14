import type { DecisionTraceItem } from '../../domain/types';

interface DecisionTraceViewProps {
  trace: DecisionTraceItem[];
}

export default function DecisionTraceView({ trace }: DecisionTraceViewProps) {
  if (trace.length === 0) return null;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-csl-primary">Beslutslogg</h3>
      <ol className="space-y-2">
        {trace.map((item, i) => (
          <li key={i} className="rounded border bg-gray-50 px-3 py-2 text-sm">
            <span className="font-medium text-csl-primary">{item.step}</span>
            <p className="mt-0.5 text-gray-700">{item.message}</p>
            {item.relatedQuestionIds && item.relatedQuestionIds.length > 0 && (
              <p className="mt-0.5 text-xs text-gray-400">
                Relaterade frågor: {item.relatedQuestionIds.join(', ')}
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
