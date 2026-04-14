import type { ReactNode } from 'react';
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
}: WizardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white px-6 py-4 shadow-panel">
        <h1 className="text-lg font-bold text-csl-primary">CSL-verktyget</h1>
        <p className="text-xs text-csl-muted">
          Klassificering av digitala tillgångar enligt IAEA NSS 17-T (Rev. 1)
        </p>
      </header>

      <div className="flex-1 px-6 py-4">
        <ProgressBar
          currentStep={currentStep}
          onStepClick={onStepClick}
          completedSteps={completedSteps}
        />

        <div className="mx-auto max-w-content">{children}</div>
      </div>

      <footer className="border-t bg-white px-6 py-3">
        <div className="mx-auto flex max-w-content justify-between">
          <button
            onClick={onPrev}
            disabled={!canGoPrev}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Föregående
          </button>
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="rounded bg-csl-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Nästa
          </button>
        </div>
      </footer>
    </div>
  );
}
