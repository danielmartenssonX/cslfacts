import { useMemo, useState } from 'react';
import { Plus, Trash2, ChevronRight, ArrowLeft, Info } from 'lucide-react';
import ManualReviewBanner from './components/results/ManualReviewBanner';
import ClassificationInfoView from './components/info/ClassificationInfoView';
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
import type { Question, SystemAssessment } from './domain/types';
import questionBankData from './data/questionBank.sv-SE.json';

const allQuestions = questionBankData.questions as unknown as Question[];

// ─── Assessment-lista ────────────────────────────────────────────

function statusLabel(assessment: SystemAssessment): string {
  if (!assessment.result) return 'Utkast';
  switch (assessment.result.status) {
    case 'FINAL':
      return 'Slutlig';
    case 'PRELIMINARY_BLOCKED':
      return 'Preliminär';
    case 'PRELIMINARY':
      return 'Preliminär';
    default:
      return 'Utkast';
  }
}

function statusColor(assessment: SystemAssessment): string {
  if (!assessment.result) return 'bg-gray-100 text-gray-600';
  switch (assessment.result.status) {
    case 'FINAL':
      return 'bg-csl-success/10 text-csl-success';
    case 'PRELIMINARY_BLOCKED':
      return 'bg-csl-warning/10 text-csl-warning';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function AssessmentListView({
  assessments,
  onCreate,
  onSelect,
  onRemove,
  onShowInfo,
}: {
  assessments: SystemAssessment[];
  onCreate: () => void;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onShowInfo: () => void;
}) {
  return (
    <div className="min-h-screen">
      {/* Hero med bakgrundsbild */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-csl-primary/80 via-csl-primary/60 to-csl-background" />
        <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-16">
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">CSL-verktyget</h1>
          <p className="mt-2 max-w-lg text-sm text-white/80">
            Klassificering av digitala tillgångar enligt IAEA NSS 17-T (Rev. 1).
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onCreate}
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-csl-primary shadow-lg transition-transform hover:scale-[1.02]"
            >
              <Plus size={18} />
              Ny klassning
            </button>
            <button
              onClick={onShowInfo}
              className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Info size={16} />
              Om klassningen
            </button>
          </div>
        </div>
      </div>

      {/* Klassningslista */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        {assessments.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-lg font-medium text-gray-500">Inga klassningar ännu</p>
            <p className="mt-2 text-sm text-gray-400">
              Klicka &quot;Ny klassning&quot; för att börja klassificera ett system.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments
              .slice()
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
              .map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow-panel transition-colors hover:border-csl-primary/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {assessment.systemName || 'Namnlöst system'}
                      </h3>
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${statusColor(assessment)}`}
                      >
                        {statusLabel(assessment)}
                      </span>
                    </div>
                    <div className="mt-1 flex gap-3 text-xs text-gray-500">
                      {assessment.facilityName && <span>{assessment.facilityName}</span>}
                      <span>
                        Ändrad {new Date(assessment.updatedAt).toLocaleDateString('sv-SE')}
                      </span>
                      <span>{assessment.answers.length} svar</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemove(assessment.id)}
                    className="shrink-0 rounded p-2 text-gray-400 hover:bg-red-50 hover:text-csl-danger"
                    title="Ta bort"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => onSelect(assessment.id)}
                    className="flex shrink-0 items-center gap-1 rounded bg-csl-primary/5 px-3 py-2 text-sm font-medium text-csl-primary hover:bg-csl-primary/10"
                  >
                    Öppna
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Stegkomponenter ─────────────────────────────────────────────

function Step0SystemInfo({
  state,
  setSystemInfo,
}: {
  state: SystemAssessment;
  setSystemInfo: (info: {
    systemName: string;
    systemDescription: string;
    facilityName: string;
    assessor: string;
  }) => void;
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
            placeholder="t.ex. Norrström K1"
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
  state,
  setAnswer,
  section,
  subtitle,
  step,
}: {
  state: SystemAssessment;
  setAnswer: (questionId: string, value: import('./domain/types').AnswerValue) => void;
  section: string;
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

function Step4Investigations({ state }: { state: SystemAssessment }) {
  const items = getInvestigationItems(state, allQuestions);
  const blocking = items.filter((i) => i.blocksFinalization);
  const nonBlocking = items.filter((i) => !i.blocksFinalization);

  return (
    <div>
      <StepHeader
        step={5}
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
  state: SystemAssessment;
  enrichedResult: import('./domain/types').ClassificationResult | null;
  calculateResult: (questions: Question[]) => void;
}) {
  return (
    <div>
      <StepHeader step={6} subtitle="Resultat och motivering." />

      {/* Knapp för att (om)beräkna resultatet */}
      <div className="mb-6">
        <button
          onClick={() => calculateResult(allQuestions)}
          className="rounded bg-csl-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          {enrichedResult ? 'Beräkna om' : 'Beräkna resultat'}
        </button>
      </div>

      {!enrichedResult ? (
        <p className="text-sm text-gray-500">
          Tryck &quot;Beräkna resultat&quot; för att se klassificeringen.
        </p>
      ) : (
        <ResultSummary
          result={enrichedResult}
          questions={allQuestions}
          onExportJson={() => downloadJson(state)}
          onExportMarkdown={() => downloadMarkdown(state)}
          onExportPdf={() => exportPdf(state)}
        />
      )}
    </div>
  );
}

// ─── Wizard-vy ───────────────────────────────────────────────────

function WizardView({
  state,
  backToList,
  onShowInfo,
  setSystemInfo,
  setAnswer,
  setStep,
  calculateResult,
}: {
  state: SystemAssessment;
  backToList: () => void;
  onShowInfo: () => void;
  setSystemInfo: (info: {
    systemName: string;
    systemDescription: string;
    facilityName: string;
    assessor: string;
  }) => void;
  setAnswer: (
    questionId: string,
    value: import('./domain/types').AnswerValue,
    functionId?: string,
    comment?: string,
  ) => void;
  setStep: (step: number) => void;
  calculateResult: (questions: Question[]) => void;
}) {
  const completedSteps = useMemo(
    () => Array.from({ length: 7 }, (_, i) => isStepComplete(state, i, allQuestions)),
    [state],
  );

  const investigationItems = useMemo(() => getInvestigationItems(state, allQuestions), [state]);

  const enrichedResult = useMemo(() => {
    if (!state.result) return null;
    return {
      ...state.result,
      conciseRationale: writeConciseSummary(state.result),
      detailedRationale: writeDetailedSummary(state.result),
    };
  }, [state.result]);

  const canGoNext = state.currentStep < 6;
  const canGoPrev = state.currentStep > 0;

  // Navigera till steg — omberäkna alltid resultat vid navigering till resultatsteget
  const goToStep = (target: number) => {
    if (target === 6) {
      calculateResult(allQuestions);
    }
    setStep(target);
  };

  const handleNext = () => goToStep(Math.min(state.currentStep + 1, 6));
  const handlePrev = () => goToStep(Math.max(state.currentStep - 1, 0));

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
        return (
          <QuestionSection
            section="CONTEXT"
            state={state}
            setAnswer={setAnswer}
            subtitle="Kompletterande frågor om skyddsbehov, tillgänglighet och systemavgränsning."
            step={4}
          />
        );
      case 5:
        return <Step4Investigations state={state} />;
      case 6:
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
      <aside className="hidden w-72 flex-shrink-0 space-y-4 overflow-y-auto border-r bg-white p-4 lg:block">
        <button
          onClick={backToList}
          className="flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-csl-primary hover:bg-csl-primary/5"
        >
          <ArrowLeft size={14} />
          Alla klassningar
        </button>
        <button
          onClick={onShowInfo}
          className="flex w-full items-center gap-1 rounded px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <Info size={14} />
          Om klassningen
        </button>
        <KnownFactsPanel state={state} questions={allQuestions} />
        <InvestigationPanel items={investigationItems} />
        <ManualReviewBanner visible={enrichedResult?.manualReviewRequired ?? false} />
      </aside>

      <div className="flex-1">
        <WizardShell
          currentStep={state.currentStep}
          onStepClick={goToStep}
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

// ─── Huvudapp ────────────────────────────────────────────────────

export default function App() {
  const store = useAssessmentStore();
  const [showInfo, setShowInfo] = useState(false);

  if (showInfo) {
    return <ClassificationInfoView onBack={() => setShowInfo(false)} />;
  }

  if (!store.activeAssessment) {
    return (
      <AssessmentListView
        assessments={store.assessments}
        onCreate={store.create}
        onSelect={store.select}
        onRemove={store.remove}
        onShowInfo={() => setShowInfo(true)}
      />
    );
  }

  return (
    <WizardView
      state={store.activeAssessment}
      backToList={store.backToList}
      onShowInfo={() => setShowInfo(true)}
      setSystemInfo={store.setSystemInfo}
      setAnswer={store.setAnswer}
      setStep={store.setStep}
      calculateResult={store.calculateResult}
    />
  );
}
