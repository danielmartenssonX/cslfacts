import { ShieldAlert } from 'lucide-react';

interface ManualReviewBannerProps {
  visible: boolean;
}

export default function ManualReviewBanner({ visible }: ManualReviewBannerProps) {
  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-csl-info/30 bg-csl-info/5 p-4">
      <ShieldAlert size={20} className="mt-0.5 shrink-0 text-csl-info" />
      <div>
        <h3 className="text-sm font-semibold text-csl-info">Manuell granskning rekommenderas</h3>
        <p className="mt-1 text-sm text-gray-700">
          Kontrollfråga Q32 indikerar att systemet kan behöva klassas högre än vad regelmotorn
          föreslår. En specialist bör granska bedömningen innan nivån fastställs.
        </p>
      </div>
    </div>
  );
}
