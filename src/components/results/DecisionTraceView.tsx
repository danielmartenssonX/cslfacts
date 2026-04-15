import type { DecisionTraceItem } from '../../domain/types';

interface DecisionTraceViewProps {
  trace: DecisionTraceItem[];
}

/**
 * Normalisera trace-items: stöd både nytt format (heading/conclusion/reasoning)
 * och gammalt format (step/message) från sparade bedömningar.
 */
function normalize(
  item: DecisionTraceItem,
  index: number,
): {
  order: number;
  heading: string;
  conclusion: string;
  reasoning?: string;
  questionIds?: string[];
} {
  return {
    order: item.order ?? index + 1,
    heading: item.heading ?? item.step ?? `Steg ${index + 1}`,
    conclusion: item.conclusion ?? item.message ?? '',
    reasoning: item.reasoning,
    questionIds: item.relatedQuestionIds,
  };
}

export default function DecisionTraceView({ trace }: DecisionTraceViewProps) {
  if (trace.length === 0) return null;

  const items = trace.map((item, i) => normalize(item, i));

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-csl-primary">Beslutskedja</h3>
      <p className="mb-4 text-xs text-gray-500">
        Steg-för-steg-redovisning av hur klassificeringen fastställts.
      </p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.order} className="flex gap-3">
            {/* Stegnummer */}
            <div className="flex flex-col items-center">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-csl-primary text-xs font-bold text-white">
                {item.order}
              </span>
              {item.order < items.length && <div className="mt-1 w-px flex-1 bg-gray-200" />}
            </div>

            {/* Innehåll */}
            <div className="pb-2 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{item.heading}</p>
              <p className="mt-1 text-sm text-gray-800">{item.conclusion}</p>
              {item.reasoning && (
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{item.reasoning}</p>
              )}
              {item.questionIds && item.questionIds.length > 0 && (
                <p className="mt-1 text-xs text-gray-400">Frågor: {item.questionIds.join(', ')}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
