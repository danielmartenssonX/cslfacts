import { useState } from 'react';
import App from './App';

// ─── Sekretessvarning ────────────────────────────────────────────
function SecrecyModal({ onDismiss }) {
  return (
    <div
      data-testid="secrecy-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Sekretessvarning"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="mx-4 max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-csl-primary">Sekretessvarning</h2>
        <p className="mb-6 text-sm text-gray-700">
          Detta verktyg hanterar information som kan omfattas av sekretess. Ange inte uppgifter med
          högre sekretessgrad än vad miljön tillåter.
        </p>
        <button
          onClick={onDismiss}
          className="rounded bg-csl-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Jag förstår
        </button>
      </div>
    </div>
  );
}

// ─── Huvudkomponent ──────────────────────────────────────────────
const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';

export default function CSLApp() {
  // I demo-läge hanteras sekretessvarningen inne i App (efter login)
  const [secrecyDismissed, setSecrecyDismissed] = useState(IS_DEMO);

  return (
    <div data-testid="app-shell" className="min-h-screen bg-csl-background">
      {!secrecyDismissed && <SecrecyModal onDismiss={() => setSecrecyDismissed(true)} />}
      {secrecyDismissed && <App />}
    </div>
  );
}

// Exportera för tester
export { SecrecyModal };
