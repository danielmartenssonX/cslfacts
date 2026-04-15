import type { ReactNode } from 'react';
import { Save } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface WizardShellProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: boolean[];
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  onSave?: () => void;
  onBack?: () => void;
}

export default function WizardShell({
  currentStep,
  onStepClick,
  completedSteps,
  children,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  onSave,
  onBack,
}: WizardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white px-6 py-4 shadow-panel">
        <h1 className="text-lg font-bold text-csl-primary">cslFacts</h1>
        <p className="text-xs text-csl-muted">
          Klassificering av digitala tillgångar enligt IAEA NSS 17-T (Rev. 1)
        </p>
      </header>

      <div className="flex-1 px-6 py-4">
        <ProgressBar
          currentStep={currentStep}
          onStepClick={onStepClick}
          completedSteps={completedSteps}
          onBack={onBack}
        />

        <div className="mx-auto max-w-content">{children}</div>
      </div>

      <footer className="border-t bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-2">
          <button
            onClick={onPrev}
            disabled={!canGoPrev}
            className="rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 sm:px-4 sm:text-sm"
          >
            Föregående
          </button>

          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 rounded border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:border-csl-primary/30 hover:bg-csl-primary/5 hover:text-csl-primary sm:px-4 sm:text-sm"
              title="Spara alla bedömningar till fil"
            >
              <Save size={14} />
              Spara
            </button>
          )}

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="rounded bg-csl-primary px-3 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40 sm:px-4 sm:text-sm"
          >
            Nästa
          </button>
        </div>
      </footer>
    </div>
  );
}
