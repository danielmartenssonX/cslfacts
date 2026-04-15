import { useRef, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Info,
  BookOpen,
  Upload,
  Save,
  Shield,
} from 'lucide-react';

const IS_DEMO = import.meta.env.VITE_DEMO_MODE === 'true';
import ManualReviewBanner from './components/results/ManualReviewBanner';
import ClassificationInfoView from './components/info/ClassificationInfoView';
import { writeConciseSummary, writeDetailedSummary } from './services/summaryWriter';
import WizardShell from './components/wizard/WizardShell';
import StepHeader from './components/wizard/StepHeader';
import QuestionCard from './components/questions/QuestionCard';
import ConsequenceStepView from './components/questions/ConsequenceStepView';
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
import { EXAMPLE_ASSESSMENTS_META, buildExampleAssessment } from './data/exampleAssessments';
import RequirementComplianceView from './components/compliance/RequirementComplianceView';

const allQuestions = questionBankData.questions as unknown as Question[];

// ─── Assessment-lista ────────────────────────────────────────────

function statusLabel(assessment: SystemAssessment): string {
  if (!assessment.result) return 'Utkast';
  switch (assessment.result.status) {
    case 'FINAL':
      return 'Slutlig';
    case 'BLOCKED':
      return 'Blockerad';
    case 'REVIEW_REQUIRED':
      return 'Kräver granskning';
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
    case 'BLOCKED':
      return 'bg-csl-warning/10 text-csl-warning';
    case 'REVIEW_REQUIRED':
      return 'bg-purple-100/10 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

// ─── Ladda fil-knapp ────────────────────────────────────────────

function LoadFileButton({ onImportFile }: { onImportFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImportFile(file);
          if (inputRef.current) inputRef.current.value = '';
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
      >
        <Upload size={16} />
        Ladda sparad fil
      </button>
    </>
  );
}

// ─── Systembeskrivning & handledning ────────────────────────────

function AboutAndGuideSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 rounded-lg border-2 border-csl-primary/20 bg-csl-primary/5 px-5 py-4 text-left shadow-sm transition-colors hover:border-csl-primary/40 hover:bg-csl-primary/10"
      >
        <BookOpen size={20} className="shrink-0 text-csl-primary" />
        <div className="flex-1">
          <span className="text-sm font-semibold text-csl-primary">
            Om cslFacts &amp; användarhandledning
          </span>
          <p className="mt-0.5 text-xs text-gray-500">
            Systembeskrivning, steg-för-steg-guide och viktig information
          </p>
        </div>
        <span className="text-csl-primary">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 rounded-lg border bg-white p-6 shadow-panel">
          <div className="space-y-6 text-sm text-gray-700">
            {/* Vad är cslFacts */}
            <div>
              <h3 className="mb-2 font-semibold text-csl-primary">Vad är cslFacts?</h3>
              <p>
                cslFacts är ett beslutsstöd för klassificering av digitala tillgångar vid
                kärntekniska anläggningar. Verktyget operationaliserar IAEA Nuclear Security Series
                No. 17-T (Rev. 1) och hjälper användaren att systematiskt tilldela en Computer
                Security Level (CSL 1–5) till varje system baserat på dess funktioner och de
                konsekvenser som kan uppstå om systemets integritet eller tillgänglighet
                komprometteras.
              </p>
              <p className="mt-2">
                Klassificeringen är helt deterministisk — inga sannolikhetsbedömningar,
                poängmodeller eller AI-baserade slutledningar. Varje utfall kan spåras tillbaka till
                exakt vilka svar som gav vilken nivå.
              </p>
            </div>

            {/* Steg-för-steg */}
            <div>
              <h3 className="mb-2 font-semibold text-csl-primary">
                Så här fungerar det — steg för steg
              </h3>
              <ol className="space-y-2">
                <GuideStep
                  n={1}
                  title="Grundfakta"
                  text="Ange systemnamn, anläggning och bedömare. Beskriv kort vad systemet gör."
                />
                <GuideStep
                  n={2}
                  title="Avgränsning och beroenden"
                  text="Klargör systemets gränser, vad som ingår och vilka beroenden som finns uppströms och nedströms. Blockerande frågor måste besvaras Ja eller Nej."
                />
                <GuideStep
                  n={3}
                  title="Funktioner"
                  text='Identifiera vilka funktioner systemet stöder: säker drift, nödlägeshantering, fysiskt skydd, huvudprocess, drift/underhåll, känslig information, administrativt stöd eller kärnämneskontroll. Svara "Ja" på de som gäller.'
                />
                <GuideStep
                  n={4}
                  title="Konsekvensfrågor"
                  text="Bedöm konsekvenserna av att systemets integritet eller tillgänglighet komprometteras — separat per funktion. Frågorna är kopplade till CSL-nivåerna i IAEA Annex II."
                />
                <GuideStep
                  n={5}
                  title="Kontext och komplettering"
                  text="Besvara kompletterande frågor om skyddsbehov, analog fallback, redundans och primärt system. Q32 flaggar om regelmotorn kan underskatta nivån."
                />
                <GuideStep
                  n={6}
                  title="Oklarheter"
                  text='Här visas alla frågor du svarat "Vet inte än" på, med utredningsledtrådar och förslag på vem som kan svara. Blockerande oklarheter måste lösas innan slutlig klassning.'
                />
                <GuideStep
                  n={7}
                  title="Resultat"
                  text="Klassificeringsresultatet visas med motivering, beslutskedja och tillämpliga IAEA-krav. Exportera rapporten som JSON, Markdown eller PDF."
                />
                <GuideStep
                  n={8}
                  title="Kravredovisning (valfritt)"
                  text="Dokumentera hur systemet uppfyller de IAEA-krav som gäller för den tilldelade CSL-nivån. Markera varje krav som uppfyllt, delvis uppfyllt, ej uppfyllt eller att det måste utredas."
                />
              </ol>
            </div>

            {/* Spara och ladda */}
            <div>
              <h3 className="mb-2 font-semibold text-csl-primary">Spara och ladda</h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Alla bedömningar sparas automatiskt i webbläsaren (localStorage) medan du arbetar.
                  Du kan stänga appen och återkomma senare utan att förlora data.{' '}
                  <strong>Observera:</strong> localStorage är bundet till just denna webbläsare och
                  domän. Om du byter webbläsare, rensar webbläsardata, använder inkognitoläge eller
                  flyttar till en annan dator försvinner datan. Använd därför{' '}
                  <strong>&quot;Spara till fil&quot;</strong> regelbundet som säkerhetskopia.
                </li>
                <li>
                  Klicka <strong>&quot;Spara till fil&quot;</strong> (på startsidan eller i
                  wizardens nederkant) för att ladda ned en <code>cslfacts-data.json</code>-fil med
                  alla dina bedömningar. Filen innehåller all data — svar, resultat,
                  kravredovisning.
                </li>
                <li>
                  Klicka <strong>&quot;Ladda sparad fil&quot;</strong> på startsidan för att
                  återställa bedömningar från en tidigare sparad fil. Det fungerar även på en annan
                  dator.
                </li>
                <li>
                  {IS_DEMO
                    ? 'Denna demo-version körs hos render.com. Data lagras i webbläsarens localStorage på render.com:s domän och kan därför inte betraktas som lokal. Använd "Spara till fil" för att ladda ned data till din egen dator. För full lokal kontroll — kör cslFacts på din egen dator.'
                    : 'Inget skickas till någon server. All data stannar lokalt hos dig.'}
                </li>
              </ul>
            </div>

            {/* Viktigt att veta */}
            <div>
              <h3 className="mb-2 font-semibold text-csl-primary">Viktigt att veta</h3>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  cslFacts är ett <strong>beslutsstöd</strong>, inte ett beslut. Verktyget ersätter
                  inte verksamhetsansvarig bedömning, specialistgranskning eller formell
                  fastställelse.
                </li>
                <li>
                  Exempelklassificeringarna nedan är pedagogiska och baserade på IAEA Annex III
                  Table III-1. De är inte normativa mallar.
                </li>
                <li>
                  I kontextsteget finns en kontrollfråga (Q32) som frågar om det finns anledning att
                  tro att systemet bör klassas högre än vad verktygets regler föreslår. Om du svarar
                  &quot;Ja&quot; eller &quot;Vet inte än&quot; markeras bedömningen som &quot;Kräver
                  specialistgranskning&quot; — den kan då inte fastställas som slutlig förrän en
                  specialist har granskat och tagit ställning.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GuideStep({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-csl-primary text-xs font-bold text-white">
        {n}
      </span>
      <div>
        <span className="font-medium text-gray-900">{title}</span>
        <span className="text-gray-600"> — {text}</span>
      </div>
    </li>
  );
}

// ─── Assessment-lista ────────────────────────────────────────────

function AssessmentListView({
  assessments,
  onCreate,
  onSelect,
  onRemove,
  onShowInfo,
  onLoadExample,
  onImportFile,
  onSave,
}: {
  assessments: SystemAssessment[];
  onCreate: () => void;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onShowInfo: () => void;
  onLoadExample: (exampleId: string) => void;
  onImportFile: (file: File) => void;
  onSave: () => void;
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
          <h1 className="text-xl font-bold text-white drop-shadow-sm sm:text-3xl">cslFacts</h1>
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
            <LoadFileButton onImportFile={onImportFile} />
            {assessments.length > 0 && (
              <button
                onClick={onSave}
                className="flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Save size={16} />
                Spara till fil
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Systembeskrivning & handledning */}
      <AboutAndGuideSection />

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

        {/* Exempelklassificeringar */}
        <div className="mt-8 border-t pt-6">
          <h3 className="mb-1 text-sm font-semibold text-gray-700">
            Exempelklassificeringar (IAEA Annex III)
          </h3>
          <p className="mb-4 text-xs text-gray-500">
            Pedagogiska exempelobjekt baserade på IAEA NSS 17-T (Rev. 1), Annex III, Table III-1.
            Anpassade till appens nuvarande klassificeringslogik.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLE_ASSESSMENTS_META.map((ex) => (
              <button
                key={ex.id}
                onClick={() => onLoadExample(ex.id)}
                className="rounded-lg border bg-white p-3 text-left transition-colors hover:border-csl-primary/30 hover:bg-csl-primary/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{ex.displayNameSv}</span>
                  <span className="rounded bg-csl-primary/10 px-2 py-0.5 text-xs font-bold text-csl-primary">
                    {ex.targetCSL.replace('CSL', 'CSL ')}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{ex.fictionalName}</p>
              </button>
            ))}
          </div>
        </div>
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
  setRequirementCompliance,
  saveToFile,
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
  setRequirementCompliance: (
    paragraph: string,
    status: import('./domain/types').ComplianceStatus,
    notes: string,
  ) => void;
  saveToFile: () => void;
}) {
  const completedSteps = useMemo(
    () => Array.from({ length: 8 }, (_, i) => isStepComplete(state, i, allQuestions)),
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

  const canGoNext = state.currentStep < 7;
  const canGoPrev = state.currentStep > 0;

  // Navigera till steg — omberäkna alltid resultat vid navigering till resultatsteget
  const goToStep = (target: number) => {
    if (target === 6) {
      calculateResult(allQuestions);
    }
    setStep(target);
  };

  const handleNext = () => goToStep(Math.min(state.currentStep + 1, 7));
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
        return <ConsequenceStepView state={state} setAnswer={setAnswer} questions={allQuestions} />;
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
      case 7:
        return (
          <RequirementComplianceView
            state={state}
            setRequirementCompliance={setRequirementCompliance}
            onExportJson={() => downloadJson(state)}
            onExportMarkdown={() => downloadMarkdown(state)}
            onExportPdf={() => exportPdf(state)}
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
          onSave={saveToFile}
          onBack={backToList}
        >
          {renderStep()}
        </WizardShell>
      </div>
    </div>
  );
}

// ─── Huvudapp ────────────────────────────────────────────────────

// ─── Demo-läge: login + banner (bara vid VITE_DEMO_MODE=true) ───

const DEMO_ACCESS_CODE = '1234';

function DemoLoginScreen({ onAuthenticate }: { onAuthenticate: () => void }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === DEMO_ACCESS_CODE) {
      onAuthenticate();
    } else {
      setError(true);
      setCode('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-csl-primary">
      <form onSubmit={handleSubmit} className="w-full max-w-xs rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 flex justify-center">
          <div className="rounded-lg bg-csl-primary p-3 text-white">
            <Shield className="h-6 w-6" />
          </div>
        </div>
        <h1 className="mb-1 text-center text-lg font-semibold text-gray-900">cslFacts</h1>
        <p className="mb-6 text-center text-sm text-gray-500">Ange åtkomstkod</p>
        <input
          autoFocus
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => {
            setError(false);
            setCode(e.target.value.replace(/\D/g, ''));
          }}
          className={`mb-3 w-full rounded-lg border px-4 py-3 text-center text-2xl tracking-[0.5em] ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="····"
        />
        {error && <p className="mb-3 text-center text-sm text-red-600">Felaktig kod</p>}
        <button
          type="submit"
          disabled={code.length < 4}
          className="w-full rounded-lg bg-csl-primary px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          Logga in
        </button>
      </form>
    </div>
  );
}

function DemoBanner() {
  return (
    <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-semibold text-white">
      DEMO-VERSION — körs hos render.com — endast för demonstration och utvärdering
    </div>
  );
}

export default function App() {
  const store = useAssessmentStore();
  const [showInfo, setShowInfo] = useState(false);
  const [authenticated, setAuthenticated] = useState(!IS_DEMO);
  const [demoSecrecyDismissed, setDemoSecrecyDismissed] = useState(!IS_DEMO);

  if (IS_DEMO && !authenticated) {
    return <DemoLoginScreen onAuthenticate={() => setAuthenticated(true)} />;
  }

  // Sekretessvarning efter login i demo-läge
  if (IS_DEMO && !demoSecrecyDismissed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="mx-4 max-w-lg rounded-lg bg-white p-6 shadow-xl">
          <h2 className="mb-4 text-lg font-semibold text-csl-primary">Sekretessvarning</h2>
          <p className="mb-6 text-sm text-gray-700">
            Detta verktyg hanterar information som kan omfattas av sekretess. Ange inte uppgifter
            med högre sekretessgrad än vad miljön tillåter. I denna demo-version lagras data hos
            render.com.
          </p>
          <button
            onClick={() => setDemoSecrecyDismissed(true)}
            className="rounded bg-csl-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Jag förstår
          </button>
        </div>
      </div>
    );
  }

  if (showInfo) {
    return (
      <>
        {IS_DEMO && <DemoBanner />}
        <ClassificationInfoView onBack={() => setShowInfo(false)} />
      </>
    );
  }

  if (!store.activeAssessment) {
    return (
      <>
        {IS_DEMO && <DemoBanner />}
        <AssessmentListView
          assessments={store.assessments}
          onCreate={store.create}
          onSelect={store.select}
          onRemove={store.remove}
          onShowInfo={() => setShowInfo(true)}
          onLoadExample={(exampleId) => {
            const assessment = buildExampleAssessment(exampleId);
            if (assessment) {
              // Beräkna resultat direkt så att kravredovisningen syns
              store.loadExample(assessment);
              store.calculateResult(allQuestions);
            }
          }}
          onImportFile={store.importFromFile}
          onSave={store.saveToFile}
        />
      </>
    );
  }

  return (
    <>
      {IS_DEMO && <DemoBanner />}
      <WizardView
        state={store.activeAssessment}
        backToList={store.backToList}
        onShowInfo={() => setShowInfo(true)}
        setSystemInfo={store.setSystemInfo}
        setAnswer={store.setAnswer}
        setStep={store.setStep}
        calculateResult={store.calculateResult}
        setRequirementCompliance={store.setRequirementCompliance}
        saveToFile={store.saveToFile}
      />
    </>
  );
}
