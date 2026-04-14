import { STEP_LABELS } from '../../domain/enums';

interface StepHeaderProps {
  step: number;
  subtitle?: string;
}

export default function StepHeader({ step, subtitle }: StepHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-csl-primary">
        Steg {step + 1}: {STEP_LABELS[step]}
      </h2>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
    </div>
  );
}
