import jsPDF from 'jspdf';
import type { SystemAssessment } from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';

/**
 * Exportera klassificeringsunderlag som PDF via jsPDF.
 */
export function exportPdf(assessment: SystemAssessment): void {
  const r = assessment.result;
  const doc = new jsPDF();
  let y = 20;

  const addLine = (text: string, fontSize = 10, bold = false) => {
    doc.setFontSize(fontSize);
    if (bold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    const wrapped = doc.splitTextToSize(text, 180);
    for (const row of wrapped) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(row, 14, y);
      y += fontSize * 0.5 + 2;
    }
  };

  const addGap = (size = 4) => {
    y += size;
  };

  // Rubrik
  addLine('CSL-klassificeringsunderlag', 16, true);
  addGap(6);
  addLine(`System: ${assessment.systemName || 'Ej angivet'}`, 11);
  addLine(`Anläggning: ${assessment.facilityName || 'Ej angiven'}`, 11);
  addLine(`Bedömare: ${assessment.assessor || 'Ej angiven'}`, 11);
  addLine(`Datum: ${assessment.updatedAt.slice(0, 10)}`, 11);
  addGap(8);

  if (!r) {
    addLine('Ingen klassificering har genomförts ännu.');
    doc.save(`csl-${assessment.systemName || 'system'}.pdf`);
    return;
  }

  // Status och nivå
  addLine('Status och resultat', 14, true);
  addGap();
  addLine(`Status: ${formatStatus(r.status)}`);
  addLine(`Systemnivå: ${CSL_LABELS[r.systemLevel]}`);
  if (r.status === 'PRELIMINARY_BLOCKED') {
    addLine(`Lägsta motiverade nivå: ${CSL_LABELS[r.minimumJustifiedLevel]}`);
    addLine(`Högsta ej uteslutbar nivå: ${CSL_LABELS[r.highestLevelNotRuledOut]}`);
  }
  addLine(`Manuell granskning krävs: ${r.manualReviewRequired ? 'Ja' : 'Nej'}`);
  addGap(8);

  // Motivering
  addLine('Kort motivering', 14, true);
  addGap();
  addLine(r.conciseRationale);
  addGap(8);

  addLine('Fördjupad motivering', 14, true);
  addGap();
  addLine(r.detailedRationale);
  addGap(8);

  // Funktionsresultat
  addLine('Funktionsresultat', 14, true);
  addGap();
  for (const fr of r.functionResults) {
    const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;
    const level = CSL_LABELS[fr.candidateLevel];
    const qs = fr.decisiveQuestionIds.join(', ') || 'inga';
    addLine(`${label}: ${level} (avgörande: ${qs})`);
  }
  addGap(8);

  // Blockerande frågor
  if (r.blockingQuestionIds.length > 0) {
    addLine('Blockerande oklarheter', 14, true);
    addGap();
    for (const qid of r.blockingQuestionIds) {
      addLine(`- ${qid}`);
    }
    addGap(8);
  }

  // Beslutslogg
  addLine('Beslutslogg', 14, true);
  addGap();
  for (const item of r.decisionTrace) {
    addLine(`[${item.step}] ${item.message}`);
  }

  doc.save(`csl-${assessment.systemName || 'system'}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Fallback: print-to-PDF via webbläsaren.
 */
export function triggerPrintToPdf(): void {
  window.print();
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
