import { ArrowLeft } from 'lucide-react';
import { STEP_LABELS } from '../../domain/enums';

interface ProgressBarProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: boolean[];
  onBack?: () => void;
}

export default function ProgressBar({
  currentStep,
  onStepClick,
  completedSteps,
  onBack,
}: ProgressBarProps) {
  const lastStep = STEP_LABELS.length - 1;

  return (
    <nav aria-label="Stegindikator" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1">
        {/* Tillbaka-knapp — synlig på mobil, dold på desktop (sidopanelen har egen) */}
        {onBack && (
          <li className="mr-1 sm:hidden">
            <button
              onClick={onBack}
              className="flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-200"
              aria-label="Tillbaka till listan"
            >
              <ArrowLeft size={12} />
            </button>
          </li>
        )}
        {STEP_LABELS.map((label, i) => {
          const isActive = i === currentStep;
          const isCompleted = completedSteps[i];
          const isOptional = i === lastStep;

          return (
            <li key={i} className="flex items-center">
              {/* Visuell separator före valfritt steg */}
              {isOptional && (
                <span className="mx-1.5 hidden text-gray-300 sm:inline" aria-hidden="true">
                  |
                </span>
              )}
              <button
                onClick={() => onStepClick(i)}
                className={`rounded px-2 py-1 text-[10px] font-medium transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
                  isOptional
                    ? isActive
                      ? 'border border-dashed border-csl-primary bg-csl-primary/10 text-csl-primary'
                      : 'border border-dashed border-gray-300 bg-white text-gray-400 hover:border-csl-primary/30 hover:text-gray-600'
                    : isActive
                      ? 'bg-csl-primary text-white'
                      : isCompleted
                        ? 'bg-csl-success/10 text-csl-success hover:bg-csl-success/20'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="mr-0.5 sm:mr-1">{i + 1}.</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < lastStep - 1 && (
                <span className="mx-0.5 hidden text-gray-300 sm:inline" aria-hidden="true">
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
