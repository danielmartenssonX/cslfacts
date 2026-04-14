import { STEP_LABELS } from '../../domain/enums';

interface ProgressBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: boolean[];
}

export default function ProgressBar({
  currentStep,
  onStepClick,
  completedSteps,
}: ProgressBarProps) {
  return (
    <nav aria-label="Stegindikator" className="mb-6">
      <ol className="flex flex-wrap gap-1">
        {STEP_LABELS.map((label, i) => {
          const isActive = i === currentStep;
          const isCompleted = completedSteps[i];
          return (
            <li key={i} className="flex items-center">
              <button
                onClick={() => onStepClick(i)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-csl-primary text-white'
                    : isCompleted
                      ? 'bg-csl-success/10 text-csl-success hover:bg-csl-success/20'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="mr-1">{i + 1}.</span>
                {label}
              </button>
              {i < STEP_LABELS.length - 1 && (
                <span className="mx-1 text-gray-300" aria-hidden="true">
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
