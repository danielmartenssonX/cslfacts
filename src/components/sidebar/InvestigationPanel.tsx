import type { InvestigationItem } from '../../domain/types';
import { AlertTriangle } from 'lucide-react';

interface InvestigationPanelProps {
  items: InvestigationItem[];
}

export default function InvestigationPanel({ items }: InvestigationPanelProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-csl-primary">Utredningslista</h3>
        <p className="text-xs text-gray-500">Inga utredningspunkter ännu.</p>
      </div>
    );
  }

  const blocking = items.filter((i) => i.blocksFinalization);
  const nonBlocking = items.filter((i) => !i.blocksFinalization);

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-csl-primary">
        Utredningslista ({items.length})
      </h3>

      {blocking.length > 0 && (
        <div className="mb-3">
          <p className="mb-1 flex items-center gap-1 text-xs font-medium text-csl-warning">
            <AlertTriangle size={12} />
            Blockerande ({blocking.length})
          </p>
          <ul className="space-y-1">
            {blocking.map((item) => (
              <li
                key={item.questionId}
                className="rounded border border-csl-warning/20 bg-csl-warning/5 px-2 py-1 text-xs"
              >
                <span className="font-medium">{item.questionId}:</span> {item.missingInfo}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nonBlocking.length > 0 && (
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">
            Icke-blockerande ({nonBlocking.length})
          </p>
          <ul className="space-y-1">
            {nonBlocking.map((item) => (
              <li key={item.questionId} className="text-xs text-gray-600">
                <span className="font-medium">{item.questionId}:</span> {item.missingInfo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
