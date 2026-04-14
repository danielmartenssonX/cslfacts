import type { SystemAssessment } from '../domain/types';

export function exportToJson(assessment: SystemAssessment): string {
  return JSON.stringify(assessment, null, 2);
}

export function downloadJson(assessment: SystemAssessment): void {
  const json = exportToJson(assessment);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `csl-klassificering-${assessment.systemName || 'system'}-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
