import { useState } from 'react';
import type { AnswerValue, Question } from '../../domain/types';
import AnswerButtons from './AnswerButtons';
import HelpPanel from './HelpPanel';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentValue?: AnswerValue;
  onAnswer: (value: AnswerValue) => void;
  questionNumber: number;
}

export default function QuestionCard({
  question,
  currentValue,
  onAnswer,
  questionNumber,
}: QuestionCardProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div
      className="rounded-lg border bg-white p-5 shadow-panel"
      data-testid={`question-${question.id}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <span className="text-xs font-medium text-csl-muted">
            {questionNumber}. {question.id}
          </span>
          <h3 className="mt-1 text-sm font-semibold text-gray-900">{question.text}</h3>
        </div>
        {question.blocking && (
          <span className="ml-2 shrink-0 rounded bg-csl-warning/10 px-2 py-0.5 text-xs font-medium text-csl-warning">
            Blockerande
          </span>
        )}
      </div>

      <AnswerButtons
        currentValue={currentValue}
        onAnswer={onAnswer}
        answerHelp={question.answerHelp}
      />

      <button
        onClick={() => setShowHelp(!showHelp)}
        className="mt-3 flex items-center gap-1 text-xs text-csl-info hover:underline"
      >
        {showHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showHelp ? 'Dölj hjälp' : 'Visa hjälp och vägledning'}
      </button>

      {showHelp && (
        <HelpPanel
          helpText={question.helpText}
          exampleText={question.exampleText}
          whoCanAnswer={question.whoCanAnswer}
          investigationHint={question.investigationHint}
          blocking={question.blocking}
        />
      )}
    </div>
  );
}
