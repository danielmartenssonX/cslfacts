import type { SystemAssessment, Question } from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS, COMPLIANCE_STATUS_LABELS } from '../domain/enums';
import { CSL_RATIONALE, buildFunctionRationale } from '../data/cslRationale';
import {
  CSL_REQUIREMENTS,
  getApplicableRequirements,
  getRequirementLevelLabel,
} from '../data/cslRequirements';
import questionBankData from '../data/questionBank.sv-SE.json';

const allQuestions = questionBankData.questions as unknown as Question[];

function answerLabel(value: string): string {
  switch (value) {
    case 'YES':
      return 'Ja';
    case 'NO':
      return 'Nej';
    case 'UNCLEAR':
      return 'Utreds';
    default:
      return value;
  }
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

export function exportToMarkdown(assessment: SystemAssessment): string {
  const r = assessment.result;
  const lines: string[] = [];

  // Rubrik och metadata
  lines.push(`# CSL-klassificering: ${assessment.systemName || 'Ej namngivet system'}`);
  lines.push('');
  lines.push('| | |');
  lines.push('|---|---|');
  lines.push(`| **Anläggning** | ${assessment.facilityName || 'Ej angiven'} |`);
  lines.push(`| **Bedömare** | ${assessment.assessor || 'Ej angiven'} |`);
  lines.push(`| **Datum** | ${assessment.updatedAt.slice(0, 10)} |`);
  lines.push(`| **Status** | ${r ? statusLabel(r.status) : 'Ingen bedömning genomförd'} |`);
  lines.push('');

  if (!r) {
    lines.push('*Ingen klassificering har genomförts ännu.*');
    return lines.join('\n');
  }

  // Systemnivå
  lines.push(`## Föreslagen systemnivå: ${CSL_LABELS[r.systemLevel]}`);
  lines.push('');

  if (r.status === 'BLOCKED') {
    lines.push(`| Lägsta motiverade nivå | ${CSL_LABELS[r.minimumJustifiedLevel]} |`);
    lines.push(`| Högsta ej uteslutbar nivå | ${CSL_LABELS[r.highestLevelNotRuledOut]} |`);
    lines.push('');
  }

  // Sammanfattning
  lines.push('## Sammanfattning');
  lines.push('');
  lines.push(r.conciseRationale);
  lines.push('');

  // IAEA-förankrad systemmotivering
  if (r.systemLevel !== 'REVIEW_REQUIRED') {
    const sysRationale = CSL_RATIONALE[r.systemLevel];
    lines.push('### Regulatorisk grund');
    lines.push('');
    lines.push(sysRationale.iaeaBasis);
    lines.push('');
    lines.push(`**Konsekvensbedömning:** ${sysRationale.consequence}`);
    lines.push('');
    lines.push(`**Skyddsbehov:** ${sysRationale.protectionNeed}`);
    lines.push('');
  }

  // Tillämpliga IAEA-krav
  {
    const reqs = getApplicableRequirements(r.systemLevel);
    lines.push('## Tillämpliga krav (IAEA NSS 17-T)');
    lines.push('');

    if (reqs.generic.length > 0) {
      lines.push(`### ${getRequirementLevelLabel('Generic')}`);
      lines.push('');
      for (const req of reqs.generic) {
        lines.push(`- **${req.paragraph}:** ${req.textSv}`);
      }
      lines.push('');
    }

    if (reqs.levelSpecific.length > 0) {
      lines.push(`### ${reqs.levelLabel}`);
      lines.push('');
      for (const req of reqs.levelSpecific) {
        lines.push(`- **${req.paragraph}:** ${req.textSv}`);
      }
      lines.push('');
    }

    if (r.systemLevel === 'REVIEW_REQUIRED') {
      lines.push('*Nivåspecifika krav kan inte fastställas förrän klassificeringen är slutförd.*');
      lines.push('');
    }
  }

  // Funktionsresultat med rika motiveringar
  lines.push('## Funktionsresultat');
  lines.push('');

  if (r.functionResults.length === 0) {
    lines.push('Inga funktioner har identifierats.');
  } else {
    for (const fr of r.functionResults) {
      const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;
      lines.push(`### ${label}`);
      lines.push('');
      lines.push(buildFunctionRationale(fr));
      lines.push('');
    }
  }

  // Mest stringent-regel
  if (r.functionResults.filter((f) => f.candidateLevel !== 'REVIEW_REQUIRED').length > 1) {
    lines.push('### Systemnivå — mest stringent nivå');
    lines.push('');
    lines.push(
      'Enligt IAEA NSS 17-T ska systemnivån motsvara den högsta skyddsnivå som någon av systemets funktioner kräver. ' +
        `Systemnivån har därför satts till ${CSL_LABELS[r.systemLevel]}.`,
    );
    lines.push('');
  }

  // Blockerande oklarheter
  if (r.blockingQuestionIds.length > 0) {
    lines.push('## Blockerande oklarheter');
    lines.push('');
    lines.push('Följande frågor måste besvaras innan klassificeringen kan fastställas:');
    lines.push('');
    for (const qid of r.blockingQuestionIds) {
      const q = allQuestions.find((x) => x.id === qid);
      if (q) {
        lines.push(`- **${qid}: ${q.text}**`);
        lines.push(`  Utred: ${q.investigationHint}`);
        lines.push(`  Vem kan svara: ${q.whoCanAnswer.join(', ')}`);
      } else {
        lines.push(`- ${qid}`);
      }
    }
    lines.push('');
  }

  // Specialnoteringar
  const specialNotes: string[] = [];

  if (r.manualReviewRequired) {
    specialNotes.push(
      '**Manuell granskning krävs:** Kontrollfråga Q32 indikerar att systemet kan behöva klassas högre än regelmotorns förslag. Specialistgranskning rekommenderas.',
    );
  }

  const q28 = assessment.answers.find((a) => a.questionId === 'Q28');
  if (q28?.value === 'YES') {
    specialNotes.push(
      '**Analog/manuell fallback noterad:** Funktionen kan delvis upprätthållas utan systemet. Enligt IAEA kan detta i vissa fall tala för en mindre stringent nivå, men verktyget sänker aldrig nivån automatiskt på denna grund. Eventuell sänkning kräver uttrycklig manuell motivering.',
    );
  }

  if (specialNotes.length > 0) {
    lines.push('## Specialnoteringar');
    lines.push('');
    for (const note of specialNotes) {
      lines.push(note);
      lines.push('');
    }
  }

  // Lagkravsnoteringar (QR01-QR05)
  {
    const regulatoryNotes: string[] = [];
    const qr01 = assessment.answers.find((a) => a.questionId === 'QR01');
    const qr02 = assessment.answers.find((a) => a.questionId === 'QR02');
    const qr03 = assessment.answers.find((a) => a.questionId === 'QR03');
    const qr04 = assessment.answers.find((a) => a.questionId === 'QR04');
    const qr05 = assessment.answers.find((a) => a.questionId === 'QR05');

    if (qr01?.value === 'YES' || qr01?.value === 'UNCLEAR') {
      regulatoryNotes.push(
        '**Säkerhetsskyddslagen (QR01):** Systemet behandlar eller kan behandla säkerhetsskyddsklassificerade uppgifter. Systemet ska bedömas i en Särskild säkerhetsskyddsbedömning (SSB) där föreskrivna krav på säkerhetsskyddsåtgärder fastställs.',
      );
    }
    if (qr02?.value === 'YES' || qr02?.value === 'UNCLEAR') {
      regulatoryNotes.push(
        '**Säkerhetskänslig verksamhet (QR02):** Systemet är av betydelse för säkerhetskänslig verksamhet. Systemet ska bedömas i en Särskild säkerhetsskyddsbedömning (SSB) där föreskrivna krav på säkerhetsskyddsåtgärder fastställs.',
      );
    }
    if (qr03?.value === 'YES') {
      regulatoryNotes.push(
        '**Exportkontroll (QR03):** Systemet behandlar exportkontrollklassificerad information. Systemet ska även kravställas utifrån exportkontrollagstiftningens särskilda kravställningar.',
      );
    } else if (qr03?.value === 'UNCLEAR') {
      regulatoryNotes.push(
        '**Exportkontroll (QR03):** Det är oklart om systemet behandlar exportkontrollklassificerad information. Detta bör klargöras.',
      );
    }
    if (qr04?.value === 'YES') {
      regulatoryNotes.push(
        '**GDPR (QR04):** Systemet behandlar personuppgifter. Systemet ska även kravställas utifrån dataskyddsförordningens (GDPR) särskilda kravställningar.',
      );
    } else if (qr04?.value === 'UNCLEAR') {
      regulatoryNotes.push(
        '**GDPR (QR04):** Det är oklart om systemet behandlar personuppgifter. Detta bör klargöras.',
      );
    }
    if (qr05?.value === 'YES') {
      regulatoryNotes.push(
        '**Cybersäkerhetslagstiftningen/NIS2 (QR05):** Systemet omfattas av cybersäkerhetslagstiftningen. Systemet ska även kravställas utifrån NIS2-direktivets särskilda kravställningar.',
      );
    } else if (qr05?.value === 'UNCLEAR') {
      regulatoryNotes.push(
        '**Cybersäkerhetslagstiftningen/NIS2 (QR05):** Det är oklart om systemet omfattas. Detta bör klargöras.',
      );
    }

    if (regulatoryNotes.length > 0) {
      lines.push('## Lagkravsnoteringar');
      lines.push('');
      lines.push(
        '*Följande lagkrav har identifierats utöver CSL-klassningen och bör beaktas vid kravställning.*',
      );
      lines.push('');
      for (const note of regulatoryNotes) {
        lines.push(note);
        lines.push('');
      }
    }
  }

  // Alla svar per sektion
  lines.push('## Svar');
  lines.push('');
  const sections = ['SCOPE', 'FUNCTION', 'CONSEQUENCE', 'CONTEXT'] as const;
  const sectionLabels: Record<string, string> = {
    SCOPE: 'Avgränsning och beroenden',
    FUNCTION: 'Funktioner',
    CONSEQUENCE: 'Konsekvensfrågor',
    CONTEXT: 'Kontext och komplettering',
  };

  for (const section of sections) {
    const sectionQs = allQuestions.filter((q) => q.section === section);
    const answeredInSection = sectionQs.filter((q) =>
      assessment.answers.some((a) => a.questionId === q.id),
    );
    if (answeredInSection.length === 0) continue;

    lines.push(`### ${sectionLabels[section]}`);
    lines.push('');
    for (const q of sectionQs) {
      const answer = assessment.answers.find((a) => a.questionId === q.id);
      if (!answer) continue;
      const marker = answer.value === 'YES' ? '✓' : answer.value === 'NO' ? '✗' : '?';
      lines.push(`- ${marker} **${q.id}:** ${q.text} → **${answerLabel(answer.value)}**`);
    }
    lines.push('');
  }

  // Beslutskedja
  lines.push('## Beslutskedja');
  lines.push('');
  lines.push('Steg-för-steg-redovisning av hur klassificeringen fastställts.');
  lines.push('');
  for (const item of r.decisionTrace) {
    lines.push(`### Steg ${item.order}: ${item.heading}`);
    lines.push('');
    lines.push(`**${item.conclusion}**`);
    if (item.reasoning) {
      lines.push('');
      lines.push(item.reasoning);
    }
    if (item.relatedQuestionIds && item.relatedQuestionIds.length > 0) {
      lines.push('');
      lines.push(`*Frågor: ${item.relatedQuestionIds.join(', ')}*`);
    }
    lines.push('');
  }

  // Kravredovisning (om den genomförts)
  if (assessment.requirementCompliance && assessment.requirementCompliance.length > 0) {
    const assessed = assessment.requirementCompliance.filter((c) => c.status !== 'NOT_ASSESSED');
    if (assessed.length > 0) {
      lines.push('## Kravredovisning');
      lines.push('');
      lines.push(
        `${assessed.length} av ${assessment.requirementCompliance.length} krav har bedömts.`,
      );
      lines.push('');
      for (const item of assessed) {
        const label = COMPLIANCE_STATUS_LABELS[item.status];
        const reqDef = CSL_REQUIREMENTS.find((r) => r.paragraph === item.requirementParagraph);
        lines.push(`### ${item.requirementParagraph} — ${label}`);
        lines.push('');
        if (reqDef) {
          lines.push(`> ${reqDef.textSv}`);
          lines.push('');
        }
        if (item.notes) {
          lines.push(`**Redovisning:** ${item.notes}`);
          lines.push('');
        }
      }
    }
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(
    '*Denna rapport är genererad av cslFacts, ett beslutsstöd baserat på IAEA Nuclear Security Series No. 17-T (Rev. 1). ' +
      'Verktyget ersätter inte verksamhetsansvarig bedömning, specialistgranskning eller formell fastställelse.*',
  );
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
