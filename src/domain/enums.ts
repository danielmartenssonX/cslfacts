import type { CSL, FunctionType } from './types';

export const CSL_LABELS: Record<CSL, string> = {
  CSL1: 'CSL 1 – Högsta skyddsnivå',
  CSL2: 'CSL 2 – Hög skyddsnivå',
  CSL3: 'CSL 3 – Medelhög skyddsnivå',
  CSL4: 'CSL 4 – Grundskyddsnivå',
  CSL5: 'CSL 5 – Lägsta skyddsnivå',
  UNRESOLVED: 'Ej fastställd',
};

export const CSL_SHORT_LABELS: Record<CSL, string> = {
  CSL1: 'CSL 1',
  CSL2: 'CSL 2',
  CSL3: 'CSL 3',
  CSL4: 'CSL 4',
  CSL5: 'CSL 5',
  UNRESOLVED: '–',
};

export const FUNCTION_TYPE_LABELS: Record<FunctionType, string> = {
  SAFETY_OPERATION: 'Säker drift',
  EMERGENCY_MANAGEMENT: 'Nödlägeshantering',
  PHYSICAL_PROTECTION: 'Fysiskt skydd',
  MAIN_PROCESS: 'Huvudprocess',
  MAINTENANCE_SUPPORT: 'Drift- och underhållsstöd',
  SENSITIVE_INFORMATION: 'Känslig information',
  ADMINISTRATIVE_SUPPORT: 'Administrativt stöd',
  OTHER: 'Övrigt',
};

export const STEP_LABELS = [
  'Grundfakta',
  'Avgränsning och beroenden',
  'Funktioner',
  'Konsekvensfrågor',
  'Kontext och komplettering',
  'Oklarheter',
  'Resultat',
] as const;

export const CSL_ORDER: CSL[] = ['CSL1', 'CSL2', 'CSL3', 'CSL4', 'CSL5', 'UNRESOLVED'];
