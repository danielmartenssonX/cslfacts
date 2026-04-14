export type AnswerValue = 'YES' | 'NO' | 'UNCLEAR';

export type AssessmentStatus = 'DRAFT' | 'PRELIMINARY' | 'PRELIMINARY_BLOCKED' | 'FINAL';

export type CSL = 'CSL1' | 'CSL2' | 'CSL3' | 'CSL4' | 'CSL5' | 'UNRESOLVED';

export type FunctionType =
  | 'SAFETY_OPERATION'
  | 'EMERGENCY_MANAGEMENT'
  | 'PHYSICAL_PROTECTION'
  | 'MAIN_PROCESS'
  | 'MAINTENANCE_SUPPORT'
  | 'SENSITIVE_INFORMATION'
  | 'ADMINISTRATIVE_SUPPORT'
  | 'OTHER';

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
  candidateLevel?: Exclude<CSL, 'UNRESOLVED'>;
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
  step: string;
  message: string;
  relatedQuestionIds?: string[];
}

export interface FunctionAssessmentResult {
  functionId: string;
  functionType: FunctionType;
  candidateLevel: CSL;
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
  conciseRationale: string;
  detailedRationale: string;
  decisionTrace: DecisionTraceItem[];
}

export interface SystemAssessment {
  id: string;
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
}
