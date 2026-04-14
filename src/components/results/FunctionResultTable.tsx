import type { FunctionAssessmentResult } from '../../domain/types';
import { CSL_SHORT_LABELS, FUNCTION_TYPE_LABELS } from '../../domain/enums';

interface FunctionResultTableProps {
  results: FunctionAssessmentResult[];
}

export default function FunctionResultTable({ results }: FunctionResultTableProps) {
  if (results.length === 0) {
    return <p className="text-sm text-gray-500">Inga funktioner har bedömts ännu.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2 pr-4 font-medium text-gray-600">Funktion</th>
            <th className="pb-2 pr-4 font-medium text-gray-600">Kandidatnivå</th>
            <th className="pb-2 font-medium text-gray-600">Avgörande frågor</th>
          </tr>
        </thead>
        <tbody>
          {results.map((fr) => (
            <tr key={fr.functionId} className="border-b last:border-0">
              <td className="py-2 pr-4 text-gray-800">
                {FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType}
              </td>
              <td className="py-2 pr-4">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                    fr.candidateLevel === 'UNRESOLVED'
                      ? 'bg-gray-100 text-gray-500'
                      : fr.candidateLevel === 'CSL1'
                        ? 'bg-red-100 text-red-800'
                        : fr.candidateLevel === 'CSL2'
                          ? 'bg-orange-100 text-orange-800'
                          : fr.candidateLevel === 'CSL3'
                            ? 'bg-yellow-100 text-yellow-800'
                            : fr.candidateLevel === 'CSL4'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                  }`}
                >
                  {CSL_SHORT_LABELS[fr.candidateLevel]}
                </span>
              </td>
              <td className="py-2 text-gray-600">{fr.decisiveQuestionIds.join(', ') || '–'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
