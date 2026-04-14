import { useReducer, useCallback } from 'react';
import type {
  Answer,
  AnswerValue,
  FacilityFunction,
  SystemAssessment,
  ClassificationResult,
} from '../domain/types';
import type { Question } from '../domain/types';
import { classifyAssessment } from '../rules/classificationEngine';
import { getBlockingQuestionIds } from '../rules/blockingRules';
import {
  resolveActiveFunctions,
  requiresPrimarySystemSelection,
} from '../rules/functionResolution';
import { buildFullDecisionTrace } from '../rules/decisionTrace';

// ─── Actions ─────────────────────────────────────────────────────
type Action =
  | {
      type: 'SET_SYSTEM_INFO';
      payload: {
        systemName: string;
        systemDescription: string;
        facilityName: string;
        assessor: string;
      };
    }
  | {
      type: 'SET_ANSWER';
      payload: { questionId: string; value: AnswerValue; functionId?: string; comment?: string };
    }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_FUNCTIONS'; payload: FacilityFunction[] }
  | { type: 'CALCULATE_RESULT'; payload: { questions: Question[] } }
  | { type: 'RESET' };

// ─── Initial state ───────────────────────────────────────────────
function createId(): string {
  return `csl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createInitialAssessment(): SystemAssessment {
  const now = new Date().toISOString();
  return {
    id: createId(),
    systemName: '',
    systemDescription: '',
    facilityName: '',
    assessor: '',
    createdAt: now,
    updatedAt: now,
    currentStep: 0,
    functions: [],
    answers: [],
    result: null,
  };
}

// ─── Reducer ─────────────────────────────────────────────────────
function assessmentReducer(state: SystemAssessment, action: Action): SystemAssessment {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'SET_SYSTEM_INFO':
      return {
        ...state,
        ...action.payload,
        updatedAt: now,
      };

    case 'SET_ANSWER': {
      const { questionId, value, functionId, comment } = action.payload;
      const existing = state.answers.findIndex(
        (a) => a.questionId === questionId && a.functionId === functionId,
      );
      const newAnswer: Answer = { questionId, value, functionId, comment };
      const answers =
        existing >= 0
          ? state.answers.map((a, i) => (i === existing ? newAnswer : a))
          : [...state.answers, newAnswer];
      return { ...state, answers, updatedAt: now };
    }

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_FUNCTIONS':
      return { ...state, functions: action.payload, updatedAt: now };

    case 'CALCULATE_RESULT': {
      const { questions } = action.payload;
      const blockingIds = getBlockingQuestionIds(questions);
      const activeFunctions =
        state.functions.length > 0
          ? state.functions
          : resolveActiveFunctions(state.answers, questions);
      const needsPrimary = requiresPrimarySystemSelection(activeFunctions);
      const q30 = state.answers.find((a) => a.questionId === 'Q30');
      const primaryConfirmed = q30?.value === 'YES';

      const result = classifyAssessment({
        functions: activeFunctions.map((f) => ({ id: f.id, type: f.type })),
        answers: state.answers,
        blockingQuestionIds: blockingIds,
        requiresPrimarySystemSelection: needsPrimary,
        primarySystemConfirmed: primaryConfirmed,
      });

      // Ersätt beslutsloggen med den fullständiga versionen
      const fullTrace = buildFullDecisionTrace(result);
      const finalResult: ClassificationResult = { ...result, decisionTrace: fullTrace };

      return {
        ...state,
        functions: activeFunctions,
        result: finalResult,
        updatedAt: now,
      };
    }

    case 'RESET':
      return createInitialAssessment();

    default:
      return state;
  }
}

// ─── Hook ────────────────────────────────────────────────────────
export function useAssessmentStore() {
  const [state, dispatch] = useReducer(assessmentReducer, undefined, createInitialAssessment);

  const setSystemInfo = useCallback(
    (info: {
      systemName: string;
      systemDescription: string;
      facilityName: string;
      assessor: string;
    }) => dispatch({ type: 'SET_SYSTEM_INFO', payload: info }),
    [],
  );

  const setAnswer = useCallback(
    (questionId: string, value: AnswerValue, functionId?: string, comment?: string) =>
      dispatch({ type: 'SET_ANSWER', payload: { questionId, value, functionId, comment } }),
    [],
  );

  const setStep = useCallback((step: number) => dispatch({ type: 'SET_STEP', payload: step }), []);

  const calculateResult = useCallback(
    (questions: Question[]) => dispatch({ type: 'CALCULATE_RESULT', payload: { questions } }),
    [],
  );

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return { state, setSystemInfo, setAnswer, setStep, calculateResult, reset };
}
