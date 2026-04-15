import type { CSL, FunctionType } from './types';

export const CSL_LABELS: Record<CSL, string> = {
  CSL1: 'CSL 1 – Högsta skyddsnivå',
  CSL2: 'CSL 2 – Hög skyddsnivå',
  CSL3: 'CSL 3 – Medelhög skyddsnivå',
  CSL4: 'CSL 4 – Grundskyddsnivå',
  CSL5: 'CSL 5 – Lägsta skyddsnivå',
  REVIEW_REQUIRED: 'Kräver specialistgranskning',
};

export const CSL_SHORT_LABELS: Record<CSL, string> = {
  CSL1: 'CSL 1',
  CSL2: 'CSL 2',
  CSL3: 'CSL 3',
  CSL4: 'CSL 4',
  CSL5: 'CSL 5',
  REVIEW_REQUIRED: 'Granskning',
};

export const FUNCTION_TYPE_LABELS: Record<FunctionType, string> = {
  SAFETY_OPERATION: 'Säker drift',
  EMERGENCY_MANAGEMENT: 'Nödlägeshantering',
  PHYSICAL_PROTECTION: 'Fysiskt skydd',
  MAIN_PROCESS: 'Huvudprocess',
  MAINTENANCE_SUPPORT: 'Drift- och underhållsstöd',
  SENSITIVE_INFORMATION: 'Känslig information',
  ADMINISTRATIVE_SUPPORT: 'Administrativt stöd',
  NUCLEAR_MATERIAL_ACCOUNTING_AND_CONTROL: 'Kärnämneskontroll (NMAC)',
};

export const STEP_LABELS = [
  'Grundfakta',
  'Avgränsning och beroenden',
  'Funktioner',
  'Konsekvensfrågor',
  'Kontext och komplettering',
  'Oklarheter',
  'Resultat',
  'Kravredovisning (valfritt)',
] as const;

export const COMPLIANCE_STATUS_LABELS: Record<import('./types').ComplianceStatus, string> = {
  NOT_ASSESSED: 'Ej bedömt',
  COMPLIANT: 'Uppfyllt',
  PARTIAL: 'Delvis uppfyllt',
  NON_COMPLIANT: 'Ej uppfyllt',
  NOT_APPLICABLE: 'Ej tillämpligt',
  NEEDS_INVESTIGATION: 'Måste utredas',
};

export const CSL_ORDER: CSL[] = ['CSL1', 'CSL2', 'CSL3', 'CSL4', 'CSL5', 'REVIEW_REQUIRED'];
