import { Info } from 'lucide-react';

interface HelpPanelProps {
  helpText: string;
  exampleText: string;
  whoCanAnswer: string[];
  investigationHint: string;
  blocking: boolean;
}

export default function HelpPanel({
  helpText,
  exampleText,
  whoCanAnswer,
  investigationHint,
  blocking,
}: HelpPanelProps) {
  return (
    <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
      <div className="flex items-start gap-2">
        <Info size={16} className="mt-0.5 shrink-0 text-csl-info" />
        <p className="text-gray-700">{helpText}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500">Exempel</p>
        <p className="text-gray-600">{exampleText}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-gray-500">Vem kan svara?</p>
        <p className="text-gray-600">{whoCanAnswer.join(', ')}</p>
      </div>

      {blocking && (
        <div className="rounded border border-csl-warning/30 bg-csl-warning/5 px-3 py-2">
          <p className="text-xs font-medium text-csl-warning">
            Blockerande fråga — måste besvaras för att klassificeringen ska kunna fastställas.
          </p>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-gray-500">Om du inte kan svara</p>
        <p className="text-gray-600">{investigationHint}</p>
      </div>
    </div>
  );
}
