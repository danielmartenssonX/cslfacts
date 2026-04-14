import { useReducer } from 'react';
import { TEST_IDS } from './testIds.js';

// ─── Initial state ───────────────────────────────────────────────
export function createInitialState() {
  return {
    documents: {},
    index: [],
    activeId: null,
    currentStep: 0,
    secrecyDismissed: false,
  };
}

// ─── Reducer ─────────────────────────────────────────────────────
export function cslReducer(state, action) {
  switch (action.type) {
    case 'DISMISS_SECRECY':
      return { ...state, secrecyDismissed: true };
    default:
      return state;
  }
}

// ─── Derived state ───────────────────────────────────────────────
export function deriveState(state) {
  return {
    hasActiveDocument: state.activeId !== null,
    documentCount: state.index.length,
  };
}

// ─── Huvudkomponent ──────────────────────────────────────────────
export default function CSLApp() {
  const [state, dispatch] = useReducer(cslReducer, undefined, createInitialState);
  const derived = deriveState(state);

  return (
    <div data-testid={TEST_IDS.appShell} className="min-h-screen bg-csl-background">
      {!state.secrecyDismissed && (
        <div
          data-testid={TEST_IDS.secrecyModal}
          role="dialog"
          aria-modal="true"
          aria-label="Sekretessvarning"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <div className="mx-4 max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-csl-primary">Sekretessvarning</h2>
            <p className="mb-6 text-sm text-gray-700">
              Detta verktyg hanterar information som kan omfattas av sekretess. Ange inte uppgifter
              med högre sekretessgrad än vad miljön tillåter.
            </p>
            <button
              onClick={() => dispatch({ type: 'DISMISS_SECRECY' })}
              className="rounded bg-csl-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Jag förstår
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside data-testid={TEST_IDS.sidebar} className="w-64 border-r bg-white p-4">
          <h1 className="text-lg font-bold text-csl-primary">CSL-verktyget</h1>
          <p className="mt-2 text-xs text-csl-muted">{derived.documentCount} dokument</p>
        </aside>
        <main data-testid={TEST_IDS.contentRegion} className="flex-1 p-6">
          <p className="text-gray-500">Välkommen till CSL-verktyget.</p>
        </main>
      </div>
    </div>
  );
}
