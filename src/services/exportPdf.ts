import jsPDF from 'jspdf';
import type { SystemAssessment, Question } from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';
import { CSL_RATIONALE, QUESTION_RATIONALE } from '../data/cslRationale';
import questionBankData from '../data/questionBank.sv-SE.json';

const allQuestions = questionBankData.questions as unknown as Question[];

/**
 * Exportera klassificeringsunderlag som PDF via jsPDF.
 */
export function exportPdf(assessment: SystemAssessment): void {
  const r = assessment.result;
  const doc = new jsPDF();
  let y = 20;

  const addLine = (text: string, fontSize = 10, bold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const wrapped = doc.splitTextToSize(text, 180);
    for (const row of wrapped) {
      if (y > 275) {
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
  addLine(`Anlaggning: ${assessment.facilityName || 'Ej angiven'}`, 11);
  addLine(`Bedomare: ${assessment.assessor || 'Ej angiven'}`, 11);
  addLine(`Datum: ${assessment.updatedAt.slice(0, 10)}`, 11);
  addGap(8);

  if (!r) {
    addLine('Ingen klassificering har genomforts annu.');
    doc.save(`csl-${assessment.systemName || 'system'}.pdf`);
    return;
  }

  // Status och nivå
  addLine(`Status: ${formatStatus(r.status)}`, 11, true);
  addLine(`Systemniva: ${CSL_LABELS[r.systemLevel]}`, 12, true);
  if (r.status === 'PRELIMINARY_BLOCKED') {
    addLine(`Lagsta motiverade niva: ${CSL_LABELS[r.minimumJustifiedLevel]}`);
    addLine(`Hogsta ej uteslutbar niva: ${CSL_LABELS[r.highestLevelNotRuledOut]}`);
  }
  addGap(8);

  // Sammanfattning
  addLine('Sammanfattning', 14, true);
  addGap();
  addLine(r.conciseRationale);
  addGap(6);

  // IAEA-motivering
  if (r.systemLevel !== 'UNRESOLVED') {
    const sysRat = CSL_RATIONALE[r.systemLevel];
    addLine('Regulatorisk grund', 12, true);
    addGap();
    addLine(sysRat.iaeaBasis);
    addGap();
    addLine(`Konsekvensbedomning: ${sysRat.consequence}`);
    addGap();
    addLine(`Skyddsbehov: ${sysRat.protectionNeed}`);
    addGap(8);
  }

  // Funktionsresultat
  addLine('Funktionsresultat', 14, true);
  addGap();
  for (const fr of r.functionResults) {
    const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;
    addLine(`${label}: ${CSL_LABELS[fr.candidateLevel]}`, 11, true);

    if (fr.candidateLevel !== 'UNRESOLVED') {
      const levelRat = CSL_RATIONALE[fr.candidateLevel];
      addLine(levelRat.consequence);
      for (const qid of fr.decisiveQuestionIds) {
        const qr = QUESTION_RATIONALE[qid];
        if (qr) {
          addLine(`  ${qid}: ${qr.yesImplication}`);
        }
      }
    }
    addGap(4);
  }
  addGap(4);

  // Blockerande oklarheter
  if (r.blockingQuestionIds.length > 0) {
    addLine('Blockerande oklarheter', 14, true);
    addGap();
    for (const qid of r.blockingQuestionIds) {
      const q = allQuestions.find((x) => x.id === qid);
      if (q) {
        addLine(`${qid}: ${q.text}`, 10, true);
        addLine(`  Utred: ${q.investigationHint}`);
        addLine(`  Vem kan svara: ${q.whoCanAnswer.join(', ')}`);
      } else {
        addLine(`- ${qid}`);
      }
      addGap(2);
    }
    addGap(4);
  }

  // Specialnoteringar
  const notes: string[] = [];
  if (r.manualReviewRequired) {
    notes.push(
      'Manuell granskning kravs: Kontrollfraga Q32 indikerar att systemet kan behova klassas hogre. Specialistgranskning rekommenderas.',
    );
  }
  const q28 = assessment.answers.find((a) => a.questionId === 'Q28');
  if (q28?.value === 'YES') {
    notes.push(
      'Analog/manuell fallback noterad: Funktionen kan delvis upprattahalles utan systemet. Verktyget sanker aldrig nivan automatiskt pa denna grund.',
    );
  }
  if (notes.length > 0) {
    addLine('Specialnoteringar', 14, true);
    addGap();
    for (const note of notes) {
      addLine(note);
      addGap(2);
    }
    addGap(4);
  }

  // Beslutslogg
  addLine('Beslutslogg', 14, true);
  addGap();
  for (const item of r.decisionTrace) {
    addLine(`[${item.step}]`, 10, true);
    addLine(item.message);
    addGap(2);
  }

  // Footer
  addGap(8);
  addLine(
    'Genererad av CSL-verktyget. Baserat pa IAEA NSS 17-T (Rev. 1). Ersatter inte verksamhetsansvarig bedomning eller formell faststallelse.',
    8,
  );

  doc.save(
    `csl-klassificering-${assessment.systemName || 'system'}-${new Date().toISOString().slice(0, 10)}.pdf`,
  );
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
      return 'Preliminar';
    case 'PRELIMINARY_BLOCKED':
      return 'Preliminar (blockerande oklarheter)';
    case 'FINAL':
      return 'Slutlig';
    default:
      return status;
  }
}
