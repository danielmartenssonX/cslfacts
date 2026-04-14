import { useMemo } from 'react';
import ManualReviewBanner from './components/results/ManualReviewBanner';
import { writeConciseSummary, writeDetailedSummary } from './services/summaryWriter';
import WizardShell from './components/wizard/WizardShell';
import StepHeader from './components/wizard/StepHeader';
import QuestionCard from './components/questions/QuestionCard';
import KnownFactsPanel from './components/sidebar/KnownFactsPanel';
import InvestigationPanel from './components/sidebar/InvestigationPanel';
import ResultSummary from './components/results/ResultSummary';
import { useAssessmentStore } from './state/assessmentStore';
import { getAnswer, getInvestigationItems, isStepComplete } from './state/selectors';
import { downloadJson } from './services/exportJson';
import { downloadMarkdown } from './services/exportMarkdown';
import { exportPdf } from './services/exportPdf';
import type { Question } from './domain/types';
import questionBankData from './data/questionBank.sv-SE.json';

const allQuestions = questionBankData.questions as unknown as Question[];

// ─── Stegkomponenter ─────────────────────────────────────────────

function Step0SystemInfo({
  state,
  setSystemInfo,
}: {
  state: ReturnType<typeof useAssessmentStore>['state'];
  setSystemInfo: ReturnType<typeof useAssessmentStore>['setSystemInfo'];
}) {
  return (
    <div className="space-y-4">
      <StepHeader step={0} subtitle="Ange grundläggande information om systemet." />
      <div className="max-w-xl space-y-4">
        <div>
          <label htmlFor="systemName" className="mb-1 block text-sm font-medium text-gray-700">
            Systemnamn
          </label>
          <input
            id="systemName"
            type="text"
            value={state.systemName}
            onChange={(e) =>
              setSystemInfo({
                systemName: e.target.value,
                systemDescription: state.systemDescription,
                facilityName: state.facilityName,
                assessor: state.assessor,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-csl-primary focus:outline-none focus:ring-1 focus:ring-csl-primary"
            placeholder="t.ex. Processövervakningssystem X"
          />
        </div>
        <div>
          <label
            htmlFor="systemDescription"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Systembeskrivning
          </label>
          <textarea
            id="systemDescription"
            value={state.systemDescription}
            onChange={(e) =>
              setSystemInfo({
                systemName: state.systemName,
                systemDescription: e.target.value,
                facilityName: state.facilityName,
                assessor: state.assessor,
              })
            }
            rows={3}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-csl-primary focus:outline-none focus:ring-1 focus:ring-csl-primary"
            placeholder="Kort beskrivning av systemets syfte och användning"
          />
        </div>
        <div>
          <label htmlFor="facilityName" className="mb-1 block text-sm font-medium text-gray-700">
            Anläggning
          </label>
          <input
            id="facilityName"
            type="text"
            value={state.facilityName}
            onChange={(e) =>
              setSystemInfo({
                systemName: state.systemName,
                systemDescription: state.systemDescription,
                facilityName: e.target.value,
                assessor: state.assessor,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-csl-primary focus:outline-none focus:ring-1 focus:ring-csl-primary"
            placeholder="t.ex. Ringhals 3"
          />
        </div>
        <div>
          <label htmlFor="assessor" className="mb-1 block text-sm font-medium text-gray-700">
            Bedömare
          </label>
          <input
            id="assessor"
            type="text"
            value={state.assessor}
            onChange={(e) =>
              setSystemInfo({
                systemName: state.systemName,
                systemDescription: state.systemDescription,
                facilityName: state.facilityName,
                assessor: e.target.value,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-csl-primary focus:outline-none focus:ring-1 focus:ring-csl-primary"
            placeholder="Namn"
          />
        </div>
      </div>
    </div>
  );
}

function QuestionSection({
  section,
  state,
  setAnswer,
  subtitle,
  step,
}: {
  section: string;
  state: ReturnType<typeof useAssessmentStore>['state'];
  setAnswer: ReturnType<typeof useAssessmentStore>['setAnswer'];
  subtitle: string;
  step: number;
}) {
  const questions = allQuestions.filter((q) => q.section === section);
  return (
    <div>
      <StepHeader step={step} subtitle={subtitle} />
      <div className="space-y-4">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            questionNumber={i + 1}
            currentValue={getAnswer(state, q.id)?.value}
            onAnswer={(value) => setAnswer(q.id, value)}
          />
        ))}
      </div>
    </div>
  );
}

function Step4Investigations({ state }: { state: ReturnType<typeof useAssessmentStore>['state'] }) {
  const items = getInvestigationItems(state, allQuestions);
  const blocking = items.filter((i) => i.blocksFinalization);
  const nonBlocking = items.filter((i) => !i.blocksFinalization);

  return (
    <div>
      <StepHeader
        step={4}
        subtitle="Frågor som besvarats med 'Vet inte än' samlas här som utredningspunkter."
      />

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Inga utredningspunkter. Alla frågor har besvarats.</p>
      ) : (
        <div className="space-y-6">
          {blocking.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-csl-warning">
                Blockerande utredningspunkter ({blocking.length})
              </h3>
              <div className="space-y-3">
                {blocking.map((item) => (
                  <div
                    key={item.questionId}
                    className="rounded-lg border border-csl-warning/30 bg-csl-warning/5 p-4"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      {item.questionId}: {item.questionText}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">{item.reason}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      <span className="font-medium">Saknas:</span> {item.missingInfo}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      <span className="font-medium">Vem kan svara:</span>{' '}
                      {item.whoCanAnswer.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nonBlocking.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-600">
                Övriga utredningspunkter ({nonBlocking.length})
              </h3>
              <div className="space-y-2">
                {nonBlocking.map((item) => (
                  <div key={item.questionId} className="rounded border bg-gray-50 p-3">
                    <p className="text-sm text-gray-800">
                      {item.questionId}: {item.questionText}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{item.missingInfo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Step5Results({
  state,
  enrichedResult,
  calculateResult,
}: {
  state: ReturnType<typeof useAssessmentStore>['state'];
  enrichedResult: import('./domain/types').ClassificationResult | null;
  calculateResult: ReturnType<typeof useAssessmentStore>['calculateResult'];
}) {
  if (!enrichedResult) {
    return (
      <div>
        <StepHeader step={5} subtitle="Beräkna klassificeringsresultatet." />
        <button
          onClick={() => calculateResult(allQuestions)}
          className="rounded bg-csl-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          Beräkna resultat
        </button>
      </div>
    );
  }

  return (
    <div>
      <StepHeader step={5} subtitle="Resultat och motivering." />
      <ResultSummary
        result={enrichedResult}
        questions={allQuestions}
        onExportJson={() => downloadJson(state)}
        onExportMarkdown={() => downloadMarkdown(state)}
        onExportPdf={() => exportPdf(state)}
      />
    </div>
  );
}

// ─── Huvudapp ────────────────────────────────────────────────────

export default function App() {
  const { state, setSystemInfo, setAnswer, setStep, calculateResult } = useAssessmentStore();

  const completedSteps = useMemo(
    () => Array.from({ length: 6 }, (_, i) => isStepComplete(state, i, allQuestions)),
    [state],
  );

  const investigationItems = useMemo(() => getInvestigationItems(state, allQuestions), [state]);

  // Berika resultatet med dynamisk motiveringstext
  const enrichedResult = useMemo(() => {
    if (!state.result) return null;
    return {
      ...state.result,
      conciseRationale: writeConciseSummary(state.result),
      detailedRationale: writeDetailedSummary(state.result),
    };
  }, [state.result]);

  const canGoNext = state.currentStep < 5;
  const canGoPrev = state.currentStep > 0;

  const handleNext = () => {
    if (state.currentStep === 4) {
      // Beräkna resultat automatiskt vid övergång till steg 5
      calculateResult(allQuestions);
    }
    setStep(Math.min(state.currentStep + 1, 5));
  };

  const handlePrev = () => setStep(Math.max(state.currentStep - 1, 0));

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <Step0SystemInfo state={state} setSystemInfo={setSystemInfo} />;
      case 1:
        return (
          <QuestionSection
            section="SCOPE"
            state={state}
            setAnswer={setAnswer}
            subtitle="Svara på frågor om systemets avgränsning och beroenden."
            step={1}
          />
        );
      case 2:
        return (
          <QuestionSection
            section="FUNCTION"
            state={state}
            setAnswer={setAnswer}
            subtitle="Identifiera vilka funktioner systemet stöder."
            step={2}
          />
        );
      case 3:
        return (
          <QuestionSection
            section="CONSEQUENCE"
            state={state}
            setAnswer={setAnswer}
            subtitle="Bedöm konsekvenserna av fel i systemet per funktion."
            step={3}
          />
        );
      case 4:
        return <Step4Investigations state={state} />;
      case 5:
        return (
          <Step5Results
            state={state}
            enrichedResult={enrichedResult}
            calculateResult={calculateResult}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-csl-background">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-shrink-0 space-y-4 overflow-y-auto border-r bg-white p-4 lg:block">
        <KnownFactsPanel state={state} questions={allQuestions} />
        <InvestigationPanel items={investigationItems} />
        <ManualReviewBanner visible={enrichedResult?.manualReviewRequired ?? false} />
      </aside>

      {/* Huvudinnehåll */}
      <div className="flex-1">
        <WizardShell
          currentStep={state.currentStep}
          onStepClick={setStep}
          completedSteps={completedSteps}
          onNext={handleNext}
          onPrev={handlePrev}
          canGoNext={canGoNext}
          canGoPrev={canGoPrev}
        >
          {renderStep()}
        </WizardShell>
      </div>
    </div>
  );
}
