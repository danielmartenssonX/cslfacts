export type AnswerValue = 'YES' | 'NO' | 'UNCLEAR';

export type AssessmentStatus = 'DRAFT' | 'PRELIMINARY' | 'BLOCKED' | 'REVIEW_REQUIRED' | 'FINAL';

export type CSL = 'CSL1' | 'CSL2' | 'CSL3' | 'CSL4' | 'CSL5' | 'REVIEW_REQUIRED';

export type LevelSource = 'RULE_ENGINE' | 'SPECIALIST_REVIEW' | 'PENDING';

export type FunctionType =
  | 'SAFETY_OPERATION'
  | 'EMERGENCY_MANAGEMENT'
  | 'PHYSICAL_PROTECTION'
  | 'MAIN_PROCESS'
  | 'MAINTENANCE_SUPPORT'
  | 'SENSITIVE_INFORMATION'
  | 'ADMINISTRATIVE_SUPPORT'
  | 'NUCLEAR_MATERIAL_ACCOUNTING_AND_CONTROL';

export interface Question {
  id: string;
  section: 'SCOPE' | 'FUNCTION' | 'CONSEQUENCE' | 'CONTEXT';
  text: string;
  helpText: string;
  exampleText: string;
  answerHelp: {
    yes: string;
    no: string;
    unclear: string;
  };
  blocking: boolean;
  appliesTo: FunctionType[] | ['ALL'];
  whoCanAnswer: string[];
  investigationHint: string;
  createsFunctions?: FunctionType[];
  candidateLevel?: Exclude<CSL, 'REVIEW_REQUIRED'>;
  notes?: string;
}

export interface Answer {
  questionId: string;
  value: AnswerValue;
  functionId?: string;
  comment?: string;
}

export interface FacilityFunction {
  id: string;
  type: FunctionType;
  title: string;
  description: string;
}

export interface InvestigationItem {
  questionId: string;
  questionText: string;
  reason: string;
  missingInfo: string;
  whoCanAnswer: string[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
  blocksFinalization: boolean;
}

export interface DecisionTraceItem {
  /** Numrerat steg, t.ex. 1, 2, 3 */
  order: number;
  /** Läsbar rubrik, t.ex. "Identifierade funktioner" */
  heading: string;
  /** Kort slutsats för steget */
  conclusion: string;
  /** Valfri förklaring av logiken bakom slutsatsen */
  reasoning?: string;
  /** Fråge-ID:n som påverkade steget */
  relatedQuestionIds?: string[];

  // Bakåtkompatibilitet med befintlig kod
  /** @deprecated Använd heading */
  step: string;
  /** @deprecated Använd conclusion */
  message: string;
}

export interface FunctionAssessmentResult {
  functionId: string;
  functionType: FunctionType;
  candidateLevel: CSL;
  levelSource: LevelSource;
  decisiveQuestionIds: string[];
  notes: string[];
}

export interface ClassificationResult {
  status: AssessmentStatus;
  systemLevel: CSL;
  minimumJustifiedLevel: CSL;
  highestLevelNotRuledOut: CSL;
  functionResults: FunctionAssessmentResult[];
  blockingQuestionIds: string[];
  manualReviewRequired: boolean;
  analogFallbackNoted: boolean;
  conciseRationale: string;
  detailedRationale: string;
  decisionTrace: DecisionTraceItem[];
}

// ─── Kravredovisning ────────────────────────────────────────────

export type ComplianceStatus =
  | 'NOT_ASSESSED'
  | 'COMPLIANT'
  | 'PARTIAL'
  | 'NON_COMPLIANT'
  | 'NOT_APPLICABLE'
  | 'NEEDS_INVESTIGATION';

export interface RequirementComplianceItem {
  requirementParagraph: string;
  status: ComplianceStatus;
  notes: string;
}

// ─── Bedömning ──────────────────────────────────────────────────

export interface SystemAssessment {
  id: string;
  schemaVersion?: number;
  systemName: string;
  systemDescription: string;
  facilityName: string;
  assessor: string;
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  functions: FacilityFunction[];
  answers: Answer[];
  result: ClassificationResult | null;
  requirementCompliance?: RequirementComplianceItem[];
}
