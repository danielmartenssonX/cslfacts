import type { AnswerValue } from '../../domain/types';

interface AnswerButtonsProps {
  currentValue?: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  answerHelp: { yes: string; no: string; unclear: string };
}

const OPTIONS: { value: AnswerValue; label: string; key: 'yes' | 'no' | 'unclear' }[] = [
  { value: 'YES', label: 'Ja', key: 'yes' },
  { value: 'NO', label: 'Nej', key: 'no' },
  { value: 'UNCLEAR', label: 'Vet inte än', key: 'unclear' },
];

export default function AnswerButtons({ currentValue, onAnswer, answerHelp }: AnswerButtonsProps) {
  return (
    <div className="space-y-2">
      {OPTIONS.map((opt) => {
        const isSelected = currentValue === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className={`w-full rounded border px-4 py-3 text-left text-sm transition-colors ${
              isSelected
                ? opt.value === 'YES'
                  ? 'border-csl-success bg-csl-success/5 text-csl-success'
                  : opt.value === 'NO'
                    ? 'border-csl-danger bg-csl-danger/5 text-csl-danger'
                    : 'border-csl-warning bg-csl-warning/5 text-csl-warning'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={isSelected}
          >
            <span className="font-medium">{opt.label}</span>
            <span className="ml-2 text-xs opacity-70">{answerHelp[opt.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
