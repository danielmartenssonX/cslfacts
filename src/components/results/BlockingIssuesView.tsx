import { AlertTriangle } from 'lucide-react';
import type { Question } from '../../domain/types';

interface BlockingIssuesViewProps {
  blockingQuestionIds: string[];
  questions: Question[];
}

export default function BlockingIssuesView({
  blockingQuestionIds,
  questions,
}: BlockingIssuesViewProps) {
  if (blockingQuestionIds.length === 0) return null;

  return (
    <div className="rounded-lg border border-csl-warning/30 bg-csl-warning/5 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-csl-warning">
        <AlertTriangle size={16} />
        Blockerande oklarheter ({blockingQuestionIds.length})
      </h3>
      <ul className="space-y-2">
        {blockingQuestionIds.map((qid) => {
          const q = questions.find((x) => x.id === qid);
          return (
            <li key={qid} className="text-sm">
              <span className="font-medium text-csl-warning">{qid}:</span>{' '}
              <span className="text-gray-700">{q?.text || 'Okänd fråga'}</span>
              {q && <p className="mt-0.5 text-xs text-gray-500">{q.investigationHint}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
