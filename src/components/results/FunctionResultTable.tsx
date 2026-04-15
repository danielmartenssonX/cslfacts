import type { FunctionAssessmentResult } from '../../domain/types';
import { CSL_SHORT_LABELS, FUNCTION_TYPE_LABELS } from '../../domain/enums';
import { CSL_RATIONALE, QUESTION_RATIONALE } from '../../data/cslRationale';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FunctionResultTableProps {
  results: FunctionAssessmentResult[];
}

function cslBadgeColor(level: string): string {
  switch (level) {
    case 'CSL1':
      return 'bg-red-100 text-red-800';
    case 'CSL2':
      return 'bg-orange-100 text-orange-800';
    case 'CSL3':
      return 'bg-yellow-100 text-yellow-800';
    case 'CSL4':
      return 'bg-blue-100 text-blue-800';
    case 'CSL5':
      return 'bg-green-100 text-green-800';
    case 'REVIEW_REQUIRED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-500';
  }
}

export default function FunctionResultTable({ results }: FunctionResultTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  if (results.length === 0) {
    return <p className="text-sm text-gray-500">Inga funktioner har bedömts ännu.</p>;
  }

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {results.map((fr) => {
        const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;
        const expanded = expandedIds.has(fr.functionId);
        const resolved = fr.candidateLevel !== 'REVIEW_REQUIRED';
        const rationale = resolved ? CSL_RATIONALE[fr.candidateLevel] : null;

        return (
          <div key={fr.functionId} className="rounded-lg border bg-white">
            {/* Kompakt rad — alltid synlig */}
            <button
              onClick={() => toggle(fr.functionId)}
              className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800">{label}</span>
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${cslBadgeColor(fr.candidateLevel)}`}
                >
                  {CSL_SHORT_LABELS[fr.candidateLevel]}
                </span>
              </div>
              {resolved && (
                <span className="text-gray-400">
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              )}
            </button>

            {/* Expanderad IAEA-motivering */}
            {expanded && resolved && rationale && (
              <div className="border-t bg-gray-50/50 px-4 py-3 space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Regulatorisk grund (IAEA NSS 17-T)
                </p>
                <p className="text-sm text-gray-700">{rationale.iaeaBasis}</p>

                <p className="text-xs font-semibold uppercase text-gray-500 mt-3">
                  Konsekvensbedömning
                </p>
                <p className="text-sm text-gray-700">{rationale.consequence}</p>

                {fr.decisiveQuestionIds.length > 0 && (
                  <>
                    <p className="text-xs font-semibold uppercase text-gray-500 mt-3">
                      Avgörande svar
                    </p>
                    <ul className="space-y-1">
                      {fr.decisiveQuestionIds.map((qid) => {
                        const qr = QUESTION_RATIONALE[qid];
                        return (
                          <li key={qid} className="text-sm text-gray-700">
                            <span className="font-medium text-csl-primary">{qid}:</span>{' '}
                            {qr ? qr.yesImplication : 'Ingen motiveringstext tillgänglig.'}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                <p className="text-xs font-semibold uppercase text-gray-500 mt-3">Skyddsbehov</p>
                <p className="text-sm text-gray-700">{rationale.protectionNeed}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
