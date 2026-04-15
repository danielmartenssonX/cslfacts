import type { CSL, FunctionAssessmentResult } from '../domain/types';
import { CSL_LABELS, FUNCTION_TYPE_LABELS } from '../domain/enums';

// ─── IAEA-förankrade motiveringar per CSL-nivå ──────────────────

export interface CslLevelRationale {
  level: string;
  iaeaBasis: string;
  consequence: string;
  protectionNeed: string;
}

export const CSL_RATIONALE: Record<Exclude<CSL, 'UNRESOLVED'>, CslLevelRationale> = {
  CSL1: {
    level: 'CSL 1 – Högsta skyddsnivå',
    iaeaBasis:
      'Enligt IAEA NSS 17-T (Rev. 1), Annex II: Om komprometterad integritet eller tillgänglighet hos en digital tillgång kan leda till radiologiska konsekvenser utanför anläggningsområdet ska den tilldelas den högsta skyddsnivån.',
    consequence:
      'Fel, manipulation eller bortfall i systemet kan bidra till händelseförlopp med potentiella radiologiska konsekvenser utanför anläggningen.',
    protectionNeed:
      'Kräver högsta nivå av datasäkerhetsskydd inklusive strikt åtkomstkontroll, kontinuerlig övervakning, härdning, och robust incidenthantering.',
  },
  CSL2: {
    level: 'CSL 2 – Hög skyddsnivå',
    iaeaBasis:
      'Enligt IAEA NSS 17-T (Rev. 1), Annex II: Om komprometterad integritet eller tillgänglighet kan påverka säker drift, nödlägeshantering, fysiskt skydd eller allvarligt störa huvudprocessen ska systemet tilldelas en hög skyddsnivå.',
    consequence:
      'Komprometterad integritet eller tillgänglighet kan försämra säkerheten under normal drift, försvåra hantering av nödsituationer, försämra det fysiska skyddet, eller allvarligt störa anläggningens huvudprocess.',
    protectionNeed:
      'Kräver hög nivå av datasäkerhetsskydd med åtkomstkontroll, övervakning, segmentering och regelbunden säkerhetsgranskning.',
  },
  CSL3: {
    level: 'CSL 3 – Medelhög skyddsnivå',
    iaeaBasis:
      'Enligt IAEA NSS 17-T (Rev. 1), Annex II: Om komprometterad integritet eller tillgänglighet kan ge stora drift- eller underhållsproblem, eller tydlig negativ effekt på anläggningens prestanda, utan att direkt påverka den nukleära säkerheten.',
    consequence:
      'Komprometterad integritet eller tillgänglighet kan leda till betydande operativa eller underhållsmässiga problem, eller märkbar negativ effekt på produktionskapacitet eller anläggningens prestanda.',
    protectionNeed:
      'Kräver medelhög nivå av datasäkerhetsskydd med åtkomstkontroll, loggning och periodisk granskning.',
  },
  CSL4: {
    level: 'CSL 4 – Grundskyddsnivå',
    iaeaBasis:
      'Enligt IAEA NSS 17-T (Rev. 1), Annex II: Om komprometterad integritet eller tillgänglighet inte ger omedelbara effekter men kan ge negativa konsekvenser på längre sikt.',
    consequence:
      'Komprometterad integritet eller tillgänglighet kan ge negativa effekter som inte märks direkt men som över tid påverkar verksamheten, exempelvis genom gradvis försämrad planering, uppföljning eller dokumentation.',
    protectionNeed:
      'Kräver grundläggande datasäkerhetsskydd med standardiserad åtkomstkontroll och regelbunden uppdatering.',
  },
  CSL5: {
    level: 'CSL 5 – Lägsta skyddsnivå',
    iaeaBasis:
      'Enligt IAEA NSS 17-T (Rev. 1), Annex II: Om komprometterad integritet eller tillgänglighet bedöms inte kunna påverka säkerhet, tillgänglighet eller anläggningens prestanda.',
    consequence:
      'Systemet bedöms inte ha relevant påverkan på nukleär säkerhet, fysiskt skydd, nödlägeshantering eller anläggningens operativa förmåga.',
    protectionNeed:
      'Kräver grundläggande god praxis för datasäkerhet, i linje med organisationens generella IT-säkerhetskrav.',
  },
};

// ─── Motivering per avgörande fråga ─────────────────────────────

export interface QuestionRationale {
  yesImplication: string;
  cslLevel: Exclude<CSL, 'UNRESOLVED'>;
}

export const QUESTION_RATIONALE: Record<string, QuestionRationale> = {
  Q16: {
    yesImplication:
      'Systemet bedöms kunna bidra till händelseförlopp med radiologiska konsekvenser utanför anläggningen. Enligt IAEA NSS 17-T Annex II motiverar detta den högsta skyddsnivån (CSL 1).',
    cslLevel: 'CSL1',
  },
  Q17: {
    yesImplication:
      'Komprometterad integritet eller tillgänglighet kan försämra säkerheten i anläggningen under normal drift. Enligt Annex II motiverar detta CSL 2.',
    cslLevel: 'CSL2',
  },
  Q18: {
    yesImplication:
      'Komprometterad integritet eller tillgänglighet kan försvåra hanteringen av en nödsituation. Enligt Annex II motiverar detta CSL 2.',
    cslLevel: 'CSL2',
  },
  Q19: {
    yesImplication:
      'Komprometterad integritet eller tillgänglighet kan försämra anläggningens fysiska skydd mot obehörigt tillträde eller sabotage. Enligt Annex II motiverar detta CSL 2.',
    cslLevel: 'CSL2',
  },
  Q20: {
    yesImplication:
      'Komprometterad integritet eller tillgänglighet kan allvarligt störa anläggningens huvudprocess. Enligt Annex II motiverar detta CSL 2.',
    cslLevel: 'CSL2',
  },
  Q21: {
    yesImplication:
      'Komprometterad integritet eller tillgänglighet kan ge stora drift- eller underhållsproblem utan att direkt påverka den nukleära säkerheten. Enligt Annex II motiverar detta CSL 3.',
    cslLevel: 'CSL3',
  },
  Q22: {
    yesImplication:
      'Komprometterad integritet eller tillgänglighet kan ge tydlig negativ effekt på anläggningens produktion eller prestanda. Enligt Annex II motiverar detta CSL 3.',
    cslLevel: 'CSL3',
  },
  Q23: {
    yesImplication:
      'Komprometterad integritet eller tillgänglighet kan ge negativa effekter som inte märks direkt men påverkar verksamheten på längre sikt. Enligt Annex II motiverar detta CSL 4.',
    cslLevel: 'CSL4',
  },
  Q24: {
    yesImplication:
      'Systemet bedöms i praktiken inte kunna påverka säkerhet, tillgänglighet eller anläggningens prestanda. Enligt Annex II motiverar detta den lägsta skyddsnivån (CSL 5).',
    cslLevel: 'CSL5',
  },
};

// ─── Bygga rik motivering per funktionsresultat ─────────────────

export function buildFunctionRationale(fr: FunctionAssessmentResult): string {
  const label = FUNCTION_TYPE_LABELS[fr.functionType] || fr.functionType;

  if (fr.candidateLevel === 'UNRESOLVED') {
    return `${label}: Ingen CSL-nivå kunde fastställas utifrån tillgängliga svar. Konsekvensbedömningen behöver kompletteras.`;
  }

  const levelRationale = CSL_RATIONALE[fr.candidateLevel];
  const questionMotivations = fr.decisiveQuestionIds
    .map((qid) => QUESTION_RATIONALE[qid])
    .filter(Boolean)
    .map((qr) => `  • ${qr.yesImplication}`);

  const parts: string[] = [];
  parts.push(`${label}: ${CSL_LABELS[fr.candidateLevel]}`);
  parts.push('');
  parts.push(`Motivering: ${levelRationale.iaeaBasis}`);
  parts.push('');
  parts.push(`Konsekvensbedömning: ${levelRationale.consequence}`);
  parts.push('');
  if (questionMotivations.length > 0) {
    parts.push('Avgörande svar:');
    parts.push(...questionMotivations);
    parts.push('');
  }
  parts.push(`Skyddsbehov: ${levelRationale.protectionNeed}`);

  return parts.join('\n');
}

// ─── Systemsammanfattning ────────────────────────────────────────

export function buildSystemRationale(
  systemLevel: CSL,
  functionResults: FunctionAssessmentResult[],
): string {
  if (systemLevel === 'UNRESOLVED') {
    return 'Systemnivån kunde inte fastställas. Konsekvensbedömningen behöver kompletteras för de identifierade funktionerna.';
  }

  const levelRationale = CSL_RATIONALE[systemLevel];
  const resolvedFunctions = functionResults.filter((fr) => fr.candidateLevel !== 'UNRESOLVED');

  if (resolvedFunctions.length === 0) {
    return 'Inga funktioner har bedömts ännu.';
  }

  const parts: string[] = [];

  if (resolvedFunctions.length === 1) {
    parts.push(
      `Systemet har tilldelats ${levelRationale.level} baserat på den identifierade funktionens konsekvensbedömning.`,
    );
  } else {
    const levelCounts = new Map<string, number>();
    for (const fr of resolvedFunctions) {
      levelCounts.set(fr.candidateLevel, (levelCounts.get(fr.candidateLevel) || 0) + 1);
    }
    const summary = Array.from(levelCounts.entries())
      .map(([level, count]) => `${count} funktion(er) → ${CSL_LABELS[level as CSL]}`)
      .join(', ');

    parts.push(
      `Systemet har tilldelats ${levelRationale.level} som den mest stringenta nivån bland ${resolvedFunctions.length} bedömda funktioner (${summary}).`,
    );
    parts.push(
      'Enligt IAEA NSS 17-T ska systemnivån motsvara den högsta skyddsnivå som någon av systemets funktioner kräver.',
    );
  }

  parts.push('');
  parts.push(levelRationale.iaeaBasis);
  parts.push('');
  parts.push(`Konsekvensbedömning: ${levelRationale.consequence}`);
  parts.push('');
  parts.push(`Skyddsbehov: ${levelRationale.protectionNeed}`);

  return parts.join('\n');
}
