import { useReducer, useCallback, useEffect } from 'react';
import type {
  Answer,
  AnswerValue,
  CSL,
  FacilityFunction,
  SystemAssessment,
  ClassificationResult,
} from '../domain/types';
import type { Question } from '../domain/types';
import { classifyAssessment, buildAppliesToMap } from '../rules/classificationEngine';
import { getBlockingQuestionIds } from '../rules/blockingRules';
import { resolveActiveFunctions } from '../rules/functionResolution';
import { buildFullDecisionTrace } from '../rules/decisionTrace';

// ─── App-state med flera assessments ─────────────────────────────
export interface AppState {
  assessments: SystemAssessment[];
  activeId: string | null;
}

// ─── Actions ─────────────────────────────────────────────────────
type Action =
  | { type: 'CREATE_ASSESSMENT' }
  | { type: 'SELECT_ASSESSMENT'; payload: string }
  | { type: 'DELETE_ASSESSMENT'; payload: string }
  | { type: 'BACK_TO_LIST' }
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
  | { type: 'LOAD_EXAMPLE'; payload: { assessment: SystemAssessment } }
  | {
      type: 'SET_REQUIREMENT_COMPLIANCE';
      payload: {
        paragraph: string;
        status: import('../domain/types').ComplianceStatus;
        notes: string;
      };
    }
  | { type: 'IMPORT_STATE'; payload: { assessments: SystemAssessment[] } };

// ─── Hjälpfunktioner ─────────────────────────────────────────────
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

function updateActiveAssessment(
  state: AppState,
  updater: (assessment: SystemAssessment) => SystemAssessment,
): AppState {
  if (!state.activeId) return state;
  return {
    ...state,
    assessments: state.assessments.map((a) => (a.id === state.activeId ? updater(a) : a)),
  };
}

// ─── Reducer ─────────────────────────────────────────────────────
function appReducer(state: AppState, action: Action): AppState {
  const now = new Date().toISOString();

  switch (action.type) {
    case 'CREATE_ASSESSMENT': {
      const newAssessment = createInitialAssessment();
      return {
        assessments: [...state.assessments, newAssessment],
        activeId: newAssessment.id,
      };
    }

    case 'SELECT_ASSESSMENT':
      return { ...state, activeId: action.payload };

    case 'DELETE_ASSESSMENT':
      return {
        assessments: state.assessments.filter((a) => a.id !== action.payload),
        activeId: state.activeId === action.payload ? null : state.activeId,
      };

    case 'BACK_TO_LIST':
      return { ...state, activeId: null };

    case 'SET_SYSTEM_INFO':
      return updateActiveAssessment(state, (a) => ({
        ...a,
        ...action.payload,
        updatedAt: now,
      }));

    case 'SET_ANSWER':
      return updateActiveAssessment(state, (a) => {
        const { questionId, value, functionId, comment } = action.payload;
        const existing = a.answers.findIndex(
          (ans) => ans.questionId === questionId && ans.functionId === functionId,
        );
        const newAnswer: Answer = { questionId, value, functionId, comment };
        const answers =
          existing >= 0
            ? a.answers.map((ans, i) => (i === existing ? newAnswer : ans))
            : [...a.answers, newAnswer];
        return { ...a, answers, updatedAt: now };
      });

    case 'SET_STEP':
      return updateActiveAssessment(state, (a) => ({ ...a, currentStep: action.payload }));

    case 'SET_FUNCTIONS':
      return updateActiveAssessment(state, (a) => ({
        ...a,
        functions: action.payload,
        updatedAt: now,
      }));

    case 'CALCULATE_RESULT':
      return updateActiveAssessment(state, (a) => {
        const { questions } = action.payload;
        const blockingIds = getBlockingQuestionIds(questions);
        const activeFunctions =
          a.functions.length > 0 ? a.functions : resolveActiveFunctions(a.answers, questions);

        const appliesTo = buildAppliesToMap(questions);
        const result = classifyAssessment({
          functions: activeFunctions.map((f) => ({ id: f.id, type: f.type })),
          answers: a.answers,
          blockingQuestionIds: blockingIds,
          appliesTo,
          questions,
        });

        const fullTrace = buildFullDecisionTrace(result);
        const finalResult: ClassificationResult = { ...result, decisionTrace: fullTrace };

        return { ...a, functions: activeFunctions, result: finalResult, updatedAt: now };
      });

    case 'LOAD_EXAMPLE': {
      const ex = action.payload.assessment;
      return {
        assessments: [...state.assessments, ex],
        activeId: ex.id,
      };
    }

    case 'SET_REQUIREMENT_COMPLIANCE':
      return updateActiveAssessment(state, (a) => {
        const { paragraph, status, notes } = action.payload;
        const items = [...(a.requirementCompliance ?? [])];
        const idx = items.findIndex((i) => i.requirementParagraph === paragraph);
        const item = { requirementParagraph: paragraph, status, notes };
        if (idx >= 0) {
          items[idx] = item;
        } else {
          items.push(item);
        }
        return { ...a, requirementCompliance: items, updatedAt: now };
      });

    case 'IMPORT_STATE':
      return {
        assessments: action.payload.assessments.map(migrateAssessment),
        activeId: null,
      };

    default:
      return state;
  }
}

// ─── localStorage-persistens ─────────────────────────────────────
const STORAGE_KEY = 'csl-verktyget-assessments';
const OLD_STORAGE_KEY = 'csl-verktyget-state';

// ─── Migrering v1 → v2 ──────────────────────────────────────────
function migrateCSL(level: string): string {
  return level === 'UNRESOLVED' ? 'REVIEW_REQUIRED' : level;
}

function migrateAssessment(a: SystemAssessment): SystemAssessment {
  if (a.schemaVersion && a.schemaVersion >= 2) return a;
  const migrated = { ...a, schemaVersion: 2 };
  // Ta bort funktioner med type OTHER (borttagen)
  migrated.functions = migrated.functions.filter((f) => f.type !== ('OTHER' as unknown));
  if (migrated.result) {
    const r = { ...migrated.result };
    // Status: PRELIMINARY_BLOCKED → BLOCKED
    if ((r.status as string) === 'PRELIMINARY_BLOCKED') {
      r.status = 'BLOCKED';
    }
    // CSL-fält: UNRESOLVED → REVIEW_REQUIRED
    r.systemLevel = migrateCSL(r.systemLevel) as CSL;
    r.minimumJustifiedLevel = migrateCSL(r.minimumJustifiedLevel) as CSL;
    r.highestLevelNotRuledOut = migrateCSL(r.highestLevelNotRuledOut) as CSL;
    r.functionResults = r.functionResults.map((fr) => ({
      ...fr,
      candidateLevel: migrateCSL(fr.candidateLevel) as CSL,
      levelSource:
        fr.levelSource ?? (fr.candidateLevel === 'REVIEW_REQUIRED' ? 'PENDING' : 'RULE_ENGINE'),
    }));
    // Nya fält med defaults
    r.analogFallbackNoted = r.analogFallbackNoted ?? false;
    migrated.result = r;
  }
  return migrated;
}

function loadPersistedState(): AppState {
  try {
    // Migration: konvertera gammal single-assessment till array
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw) as SystemAssessment;
      if (oldParsed.id && Array.isArray(oldParsed.answers)) {
        localStorage.removeItem(OLD_STORAGE_KEY);
        const migrated: AppState = { assessments: [oldParsed], activeId: null };
        persistState(migrated);
        return migrated;
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { assessments: [], activeId: null };
    const parsed = JSON.parse(raw) as AppState;
    if (!Array.isArray(parsed.assessments)) return { assessments: [], activeId: null };
    // Migrera v1 → v2: UNRESOLVED→REVIEW_REQUIRED, PRELIMINARY_BLOCKED→BLOCKED
    const migrated = parsed.assessments.map(migrateAssessment);
    return { assessments: migrated, activeId: null };
  } catch {
    return { assessments: [], activeId: null };
  }
}

function persistState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignorera kvotfel
  }
}

// ─── Hook ────────────────────────────────────────────────────────
export function useAssessmentStore() {
  const [state, dispatch] = useReducer(appReducer, undefined, loadPersistedState);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const activeAssessment = state.activeId
    ? (state.assessments.find((a) => a.id === state.activeId) ?? null)
    : null;

  const create = useCallback(() => dispatch({ type: 'CREATE_ASSESSMENT' }), []);
  const select = useCallback(
    (id: string) => dispatch({ type: 'SELECT_ASSESSMENT', payload: id }),
    [],
  );
  const remove = useCallback(
    (id: string) => dispatch({ type: 'DELETE_ASSESSMENT', payload: id }),
    [],
  );
  const backToList = useCallback(() => dispatch({ type: 'BACK_TO_LIST' }), []);

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

  const loadExample = useCallback(
    (assessment: SystemAssessment) => dispatch({ type: 'LOAD_EXAMPLE', payload: { assessment } }),
    [],
  );

  const setRequirementCompliance = useCallback(
    (paragraph: string, status: import('../domain/types').ComplianceStatus, notes: string) =>
      dispatch({ type: 'SET_REQUIREMENT_COMPLIANCE', payload: { paragraph, status, notes } }),
    [],
  );

  // ─── Filbaserad sparning/laddning ───────────────────────────
  const saveToFile = useCallback(() => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cslfacts-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importFromFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string) as AppState;
        if (Array.isArray(parsed.assessments)) {
          dispatch({ type: 'IMPORT_STATE', payload: { assessments: parsed.assessments } });
        }
      } catch {
        // Ogiltig fil — ignorera tyst
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    assessments: state.assessments,
    activeAssessment,
    activeId: state.activeId,
    create,
    select,
    remove,
    backToList,
    setSystemInfo,
    setAnswer,
    setStep,
    calculateResult,
    loadExample,
    setRequirementCompliance,
    saveToFile,
    importFromFile,
  };
}
