import type { ClassificationResult, Question } from '../../domain/types';
import { CSL_LABELS } from '../../domain/enums';
import FunctionResultTable from './FunctionResultTable';
import BlockingIssuesView from './BlockingIssuesView';
import DecisionTraceView from './DecisionTraceView';
import ManualReviewBanner from './ManualReviewBanner';

interface ResultSummaryProps {
  result: ClassificationResult;
  questions: Question[];
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onExportPdf: () => void;
}

function statusLabel(status: string): string {
  switch (status) {
    case 'DRAFT':
      return 'Utkast';
    case 'PRELIMINARY':
      return 'Preliminär';
    case 'PRELIMINARY_BLOCKED':
      return 'Preliminär (blockerande oklarheter)';
    case 'FINAL':
      return 'Slutlig';
    default:
      return status;
  }
}

function statusColor(status: string): string {
  switch (status) {
    case 'FINAL':
      return 'bg-csl-success/10 text-csl-success border-csl-success/30';
    case 'PRELIMINARY_BLOCKED':
      return 'bg-csl-warning/10 text-csl-warning border-csl-warning/30';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

export default function ResultSummary({
  result,
  questions,
  onExportJson,
  onExportMarkdown,
  onExportPdf,
}: ResultSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Statusbanner */}
      <div className={`rounded-lg border p-4 ${statusColor(result.status)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase">Status</p>
            <p className="text-lg font-bold">{statusLabel(result.status)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase">Föreslagen systemnivå</p>
            <p className="text-lg font-bold">{CSL_LABELS[result.systemLevel]}</p>
          </div>
        </div>
      </div>

      {/* Preliminärt intervall */}
      {result.status === 'PRELIMINARY_BLOCKED' && (
        <div className="rounded border bg-gray-50 p-3 text-sm">
          <p>
            <span className="font-medium">Lägsta motiverade nivå:</span>{' '}
            {CSL_LABELS[result.minimumJustifiedLevel]}
          </p>
          <p>
            <span className="font-medium">Högsta nivå som ej kan uteslutas:</span>{' '}
            {CSL_LABELS[result.highestLevelNotRuledOut]}
          </p>
        </div>
      )}

      <ManualReviewBanner visible={result.manualReviewRequired} />

      <BlockingIssuesView blockingQuestionIds={result.blockingQuestionIds} questions={questions} />

      {/* Enkel motivering */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-csl-primary">Motivering</h3>
        <p className="text-sm text-gray-700">{result.conciseRationale}</p>
      </div>

      {/* Funktionsresultat */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-csl-primary">Funktionsresultat</h3>
        <FunctionResultTable results={result.functionResults} />
      </div>

      {/* Fördjupad motivering */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-csl-primary">Fördjupad motivering</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">{result.detailedRationale}</p>
      </div>

      {/* Beslutslogg */}
      <DecisionTraceView trace={result.decisionTrace} />

      {/* Export */}
      <div className="flex gap-3 border-t pt-4">
        <button
          onClick={onExportJson}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Exportera JSON
        </button>
        <button
          onClick={onExportMarkdown}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Exportera Markdown
        </button>
        <button
          onClick={onExportPdf}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Exportera PDF
        </button>
      </div>
    </div>
  );
}
