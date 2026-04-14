import type { SystemAssessment } from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';

export function exportToMarkdown(assessment: SystemAssessment): string {
  const r = assessment.result;
  const lines: string[] = [];

  lines.push(`# CSL-klassificering: ${assessment.systemName}`);
  lines.push('');
  lines.push(`**Anläggning:** ${assessment.facilityName}`);
  lines.push(`**Bedömare:** ${assessment.assessor}`);
  lines.push(`**Datum:** ${assessment.updatedAt.slice(0, 10)}`);
  lines.push('');

  if (!r) {
    lines.push('*Ingen klassificering har genomförts ännu.*');
    return lines.join('\n');
  }

  lines.push(`## Status: ${formatStatus(r.status)}`);
  lines.push('');
  lines.push(`**Föreslagen systemnivå:** ${CSL_LABELS[r.systemLevel]}`);
  lines.push('');

  if (r.status === 'PRELIMINARY_BLOCKED') {
    lines.push(`**Lägsta motiverade nivå:** ${CSL_LABELS[r.minimumJustifiedLevel]}`);
    lines.push(`**Högsta nivå som ej kan uteslutas:** ${CSL_LABELS[r.highestLevelNotRuledOut]}`);
    lines.push('');
  }

  // Enkel motivering
  lines.push('## Motivering');
  lines.push('');
  lines.push(r.conciseRationale);
  lines.push('');

  // Funktionsresultat
  lines.push('## Funktionsresultat');
  lines.push('');
  lines.push('| Funktion | Kandidatnivå | Avgörande frågor |');
  lines.push('|----------|-------------|-----------------|');
  for (const fr of r.functionResults) {
    const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;
    const level = CSL_LABELS[fr.candidateLevel];
    const qs = fr.decisiveQuestionIds.join(', ') || '–';
    lines.push(`| ${label} | ${level} | ${qs} |`);
  }
  lines.push('');

  // Blockerande frågor
  if (r.blockingQuestionIds.length > 0) {
    lines.push('## Blockerande oklarheter');
    lines.push('');
    for (const qid of r.blockingQuestionIds) {
      lines.push(`- ${qid}`);
    }
    lines.push('');
  }

  // Manuell granskning
  if (r.manualReviewRequired) {
    lines.push('## Manuell granskning krävs');
    lines.push('');
    lines.push('Kontrollfråga Q32 indikerar att specialistgranskning bör genomföras.');
    lines.push('');
  }

  // Fördjupad motivering
  lines.push('## Fördjupad motivering');
  lines.push('');
  lines.push(r.detailedRationale);
  lines.push('');

  // Beslutslogg
  lines.push('## Beslutslogg');
  lines.push('');
  for (const item of r.decisionTrace) {
    const refs = item.relatedQuestionIds ? ` (${item.relatedQuestionIds.join(', ')})` : '';
    lines.push(`- **${item.step}:** ${item.message}${refs}`);
  }
  lines.push('');

  return lines.join('\n');
}

export function downloadMarkdown(assessment: SystemAssessment): void {
  const md = exportToMarkdown(assessment);
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `csl-klassificering-${assessment.systemName || 'system'}-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatStatus(status: string): string {
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
