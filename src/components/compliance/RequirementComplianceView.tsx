import { useMemo } from 'react';
import type {
  ComplianceStatus,
  RequirementComplianceItem,
  SystemAssessment,
} from '../../domain/types';
import { CSL_LABELS, COMPLIANCE_STATUS_LABELS } from '../../domain/enums';
import {
  getApplicableRequirements,
  getRequirementLevelLabel,
  type CslRequirement,
} from '../../data/cslRequirements';
import StepHeader from '../wizard/StepHeader';

interface RequirementComplianceViewProps {
  state: SystemAssessment;
  setRequirementCompliance: (paragraph: string, status: ComplianceStatus, notes: string) => void;
  onExportJson: () => void;
  onExportMarkdown: () => void;
  onExportPdf: () => void;
}

const STATUS_OPTIONS: ComplianceStatus[] = [
  'NOT_ASSESSED',
  'COMPLIANT',
  'PARTIAL',
  'NON_COMPLIANT',
  'NOT_APPLICABLE',
  'NEEDS_INVESTIGATION',
];

function statusColor(status: ComplianceStatus): string {
  switch (status) {
    case 'COMPLIANT':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PARTIAL':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'NON_COMPLIANT':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'NOT_APPLICABLE':
      return 'bg-gray-50 text-gray-500 border-gray-200';
    case 'NEEDS_INVESTIGATION':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

export default function RequirementComplianceView({
  state,
  setRequirementCompliance,
  onExportJson,
  onExportMarkdown,
  onExportPdf,
}: RequirementComplianceViewProps) {
  const result = state.result;

  // Hämta tillämpliga krav baserat på systemnivå
  const { generic, levelSpecific, levelLabel } = useMemo(() => {
    if (!result) return { generic: [], levelSpecific: [], levelLabel: '' };
    return getApplicableRequirements(result.systemLevel);
  }, [result]);

  const allRequirements = useMemo(() => [...generic, ...levelSpecific], [generic, levelSpecific]);

  // Räkna bedömda krav
  const compliance = state.requirementCompliance ?? [];
  const assessedCount = compliance.filter((c) => c.status !== 'NOT_ASSESSED').length;

  if (!result) {
    return (
      <div>
        <StepHeader step={7} subtitle="Redovisa hur systemet uppfyller tillämpliga krav." />
        <div className="rounded-lg border border-csl-warning/30 bg-csl-warning/5 p-6 text-center">
          <p className="text-sm font-medium text-csl-warning">
            Ingen klassificering genomförd ännu.
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Slutför klassificeringen (steg 7) innan kravredovisningen kan påbörjas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepHeader step={7} subtitle="Redovisa hur systemet uppfyller tillämpliga krav." />

      {/* Valfritt-indikator */}
      <div className="mb-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
        <p className="text-xs font-medium text-gray-500">
          <span className="mr-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gray-600">
            Valfritt
          </span>
          Det här steget är frivilligt och påverkar inte klassificeringsresultatet. Använd det som
          stöd för att dokumentera hur systemet uppfyller de krav som följer av tilldelad CSL-nivå.
        </p>
      </div>

      {/* Sammanfattning */}
      <div className="mb-6 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Systemnivå: {CSL_LABELS[result.systemLevel]}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              {allRequirements.length} tillämpliga krav ({generic.length} generiska
              {levelSpecific.length > 0 && ` + ${levelSpecific.length} nivåspecifika`})
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-csl-primary">
              {assessedCount}/{allRequirements.length}
            </p>
            <p className="text-xs text-gray-500">bedömda</p>
          </div>
        </div>

        {/* Statusöversikt */}
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_OPTIONS.filter((s) => s !== 'NOT_ASSESSED').map((s) => {
            const count = compliance.filter((c) => c.status === s).length;
            if (count === 0) return null;
            return (
              <span
                key={s}
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusColor(s)}`}
              >
                {COMPLIANCE_STATUS_LABELS[s]}: {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Generiska krav */}
      {generic.length > 0 && (
        <RequirementGroup
          title={getRequirementLevelLabel('Generic')}
          requirements={generic}
          compliance={compliance}
          onUpdate={setRequirementCompliance}
        />
      )}

      {/* Nivåspecifika krav */}
      {levelSpecific.length > 0 && (
        <RequirementGroup
          title={levelLabel}
          requirements={levelSpecific}
          compliance={compliance}
          onUpdate={setRequirementCompliance}
        />
      )}

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

// ─── Kravgrupp ──────────────────────────────────────────────────

function RequirementGroup({
  title,
  requirements,
  compliance,
  onUpdate,
}: {
  title: string;
  requirements: CslRequirement[];
  compliance: RequirementComplianceItem[];
  onUpdate: (paragraph: string, status: ComplianceStatus, notes: string) => void;
}) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold text-csl-primary">{title}</h3>
      <div className="space-y-3">
        {requirements.map((req) => {
          const item = compliance.find((c) => c.requirementParagraph === req.paragraph);
          const currentStatus: ComplianceStatus = item?.status ?? 'NOT_ASSESSED';
          const currentNotes = item?.notes ?? '';

          return (
            <div key={req.paragraph} className="rounded-lg border bg-white p-4">
              {/* Rubrik + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-csl-primary">{req.paragraph}</p>
                  <p className="mt-1 text-sm text-gray-700">{req.textSv}</p>
                </div>
                <select
                  value={currentStatus}
                  onChange={(e) =>
                    onUpdate(req.paragraph, e.target.value as ComplianceStatus, currentNotes)
                  }
                  className={`shrink-0 rounded border px-2 py-1 text-xs font-medium ${statusColor(currentStatus)}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {COMPLIANCE_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Anteckningar */}
              <textarea
                value={currentNotes}
                onChange={(e) => onUpdate(req.paragraph, currentStatus, e.target.value)}
                placeholder="Beskriv hur kravet uppfylls, eventuella gap eller osäkerheter..."
                rows={2}
                className="mt-3 w-full rounded border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-csl-primary focus:outline-none focus:ring-1 focus:ring-csl-primary"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
