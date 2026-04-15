import { useState } from 'react';
import type { ClassificationResult, Question } from '../../domain/types';
import { CSL_LABELS } from '../../domain/enums';
import { CSL_RATIONALE } from '../../data/cslRationale';
import { getApplicableRequirements, getRequirementLevelLabel } from '../../data/cslRequirements';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
    case 'BLOCKED':
      return 'Blockerad (oklarheter kvarstår)';
    case 'REVIEW_REQUIRED':
      return 'Kräver specialistgranskning';
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
    case 'BLOCKED':
      return 'bg-csl-warning/10 text-csl-warning border-csl-warning/30';
    case 'REVIEW_REQUIRED':
      return 'bg-purple-100/10 text-purple-700 border-purple-300';
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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
      {(result.status === 'BLOCKED' || result.status === 'REVIEW_REQUIRED') && (
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

      {/* Sammanfattning */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-csl-primary">Sammanfattning</h3>
        <p className="text-sm text-gray-700">{result.conciseRationale}</p>
      </div>

      {/* Regulatorisk grund för systemnivån */}
      {result.systemLevel !== 'REVIEW_REQUIRED' && (
        <div className="rounded-lg border border-csl-primary/20 bg-csl-primary/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-csl-primary">
            Regulatorisk grund — {CSL_LABELS[result.systemLevel]}
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            {CSL_RATIONALE[result.systemLevel].iaeaBasis}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">Konsekvensbedömning</p>
              <p className="text-sm text-gray-700">
                {CSL_RATIONALE[result.systemLevel].consequence}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">Skyddsbehov</p>
              <p className="text-sm text-gray-700">
                {CSL_RATIONALE[result.systemLevel].protectionNeed}
              </p>
            </div>
          </div>
          {result.functionResults.filter((f) => f.candidateLevel !== 'REVIEW_REQUIRED').length >
            1 && (
            <p className="mt-3 text-xs text-gray-500 italic">
              Systemnivån motsvarar den mest stringenta nivån bland alla bedömda funktioner, i
              enlighet med IAEA NSS 17-T.
            </p>
          )}
        </div>
      )}

      {/* Tillämpliga IAEA-krav */}
      <RequirementsSection systemLevel={result.systemLevel} />

      {/* Funktionsresultat med expanderbar IAEA-motivering */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-csl-primary">
          Funktionsresultat
          <span className="ml-2 text-xs font-normal text-gray-400">
            (klicka för att visa motivering)
          </span>
        </h3>
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

// ─── Tillämpliga krav-komponent ─────────────────────────────────

function RequirementsSection({ systemLevel }: { systemLevel: import('../../domain/types').CSL }) {
  const [expanded, setExpanded] = useState(false);
  const reqs = getApplicableRequirements(systemLevel);
  const totalCount = reqs.generic.length + reqs.levelSpecific.length;

  if (totalCount === 0 && systemLevel === 'REVIEW_REQUIRED') {
    return (
      <div className="rounded border bg-gray-50 p-3">
        <p className="text-sm text-gray-500 italic">
          Tillämpliga krav kan inte fastställas förrän klassificeringen är slutförd.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-2 flex w-full items-center justify-between text-left"
      >
        <h3 className="text-sm font-semibold text-csl-primary">
          Tillämpliga krav (IAEA NSS 17-T)
          <span className="ml-2 text-xs font-normal text-gray-400">{totalCount} krav</span>
        </h3>
        <span className="text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {expanded && (
        <div className="space-y-4 rounded-lg border bg-gray-50/50 p-4">
          {/* Generiska krav */}
          {reqs.generic.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                {getRequirementLevelLabel('Generic')}
              </p>
              <ul className="space-y-1">
                {reqs.generic.map((req) => (
                  <li key={req.paragraph} className="text-sm text-gray-700">
                    <span className="font-medium text-csl-primary">{req.paragraph}:</span>{' '}
                    {req.textSv}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nivåspecifika krav */}
          {reqs.levelSpecific.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                {reqs.levelLabel}
              </p>
              <ul className="space-y-1">
                {reqs.levelSpecific.map((req) => (
                  <li key={req.paragraph} className="text-sm text-gray-700">
                    <span className="font-medium text-csl-primary">{req.paragraph}:</span>{' '}
                    {req.textSv}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
