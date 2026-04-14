import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Layers,
  BookOpen,
  Scale,
  Users,
} from 'lucide-react';
import DecisionFlowDiagram from './DecisionFlowDiagram';

interface ClassificationInfoViewProps {
  onBack: () => void;
}

export default function ClassificationInfoView({ onBack }: ClassificationInfoViewProps) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-csl-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Tillbaka
        </button>
        <h1 className="text-2xl font-bold text-csl-primary">Om klassningsmodellen</h1>
        <p className="mt-2 text-sm text-gray-600">
          Full transparens kring hur CSL-verktyget klassificerar digitala tillgångar.
        </p>
      </div>

      <div className="space-y-10">
        {/* Sektion 1: Översikt */}
        <section>
          <SectionHeader icon={<BookOpen size={20} />} title="Översikt" />
          <div className="prose-sm space-y-3 text-sm text-gray-700">
            <p>
              Verktyget bygger på <strong>IAEA Nuclear Security Series No. 17-T (Rev. 1)</strong>,
              med fokus på Annex II:s exempel för kärnkraftverk. Klassningen avgör vilken skyddsnivå
              (Computer Security Level, CSL) ett digitalt system ska ha.
            </p>
            <p>
              Klassningen är <strong>helt deterministisk</strong>. Det finns inga dolda
              poängmodeller, ingen AI-baserad slutledning och inga sannolikhetsbedömningar. Varje
              utfall kan spåras tillbaka till exakt vilka svar som gav vilken nivå.
            </p>
            <p>
              Grundprincipen är <strong>funktion först</strong>: klassificeringen utgår från vilka
              funktioner systemet stöder, inte från teknisk implementation.
            </p>
          </div>
        </section>

        {/* Sektion 2: Beslutsflöde */}
        <section>
          <SectionHeader icon={<Layers size={20} />} title="Beslutsflöde" />
          <p className="mb-6 text-sm text-gray-600">
            Diagrammet visar hur konsekvensfrågor (Q16–Q24) avgör CSL-nivån för varje funktion.
            Frågorna utvärderas uppifrån och ner — den första frågan som besvaras med &quot;Ja&quot;
            avgör kandidatnivån.
          </p>
          <DecisionFlowDiagram />
        </section>

        {/* Sektion 3: CSL-nivåer */}
        <section>
          <SectionHeader icon={<ShieldCheck size={20} />} title="CSL-nivåer" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-semibold text-gray-900">Nivå</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-900">Beskrivning</th>
                  <th className="pb-3 font-semibold text-gray-900">Avgörande frågor</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <CslRow
                  level="CSL 1"
                  color="bg-red-100 text-red-800"
                  description="Högsta skyddsnivå. Systemet kan bidra till att människor utanför anläggningen påverkas av en radiologisk händelse."
                  questions="Q16"
                />
                <CslRow
                  level="CSL 2"
                  color="bg-orange-100 text-orange-800"
                  description="Hög skyddsnivå. Systemet kan försämra säkerhet under normal drift, försvåra nödlägeshantering, försämra fysiskt skydd eller störa huvudprocessen allvarligt."
                  questions="Q17, Q18, Q19, Q20"
                />
                <CslRow
                  level="CSL 3"
                  color="bg-yellow-100 text-yellow-800"
                  description="Medelhög skyddsnivå. Systemet kan ge stora drift- eller underhållsproblem, eller tydlig negativ effekt på prestanda."
                  questions="Q21, Q22"
                />
                <CslRow
                  level="CSL 4"
                  color="bg-blue-100 text-blue-800"
                  description="Grundskyddsnivå. Systemet kan ge långsiktig negativ effekt som inte märks direkt."
                  questions="Q23"
                />
                <CslRow
                  level="CSL 5"
                  color="bg-green-100 text-green-800"
                  description="Lägsta skyddsnivå. Systemet har i praktiken ingen relevant påverkan på säkerhet, tillgänglighet eller prestanda."
                  questions="Q24"
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* Sektion 4: Funktionstyper */}
        <section>
          <SectionHeader icon={<Users size={20} />} title="Funktionstyper" />
          <p className="mb-4 text-sm text-gray-600">
            Systemet identifierar vilka funktioner som stöds via frågorna Q09–Q15. Varje funktion
            bedöms separat med konsekvensfrågor.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <FunctionCard
              title="Säker drift"
              description="Funktioner som behövs för att anläggningen ska kunna drivas säkert."
              question="Q09"
            />
            <FunctionCard
              title="Nödlägeshantering"
              description="Funktioner som används vid allvarlig händelse eller nödläge."
              question="Q10"
            />
            <FunctionCard
              title="Fysiskt skydd"
              description="Funktioner som skyddar mot intrång, sabotage eller obehörigt tillträde."
              question="Q11"
            />
            <FunctionCard
              title="Huvudprocess"
              description="Funktioner som stöder den centrala anläggningsprocessen."
              question="Q12"
            />
            <FunctionCard
              title="Drift- och underhållsstöd"
              description="Funktioner som stöder underhåll, felsökning eller återställning."
              question="Q13"
            />
            <FunctionCard
              title="Känslig information"
              description="Funktioner där skyddsbehovet främst gäller att information inte sprids."
              question="Q14"
            />
            <FunctionCard
              title="Administrativt stöd"
              description="Stödfunktioner utan direkt koppling till säker drift eller huvudprocess."
              question="Q15"
            />
          </div>
        </section>

        {/* Sektion 5: Blockerande frågor */}
        <section>
          <SectionHeader icon={<AlertTriangle size={20} />} title="Blockerande frågor" />
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              Vissa frågor <strong>måste</strong> besvaras innan klassificeringen kan fastställas.
              Om en blockerande fråga besvaras med &quot;Vet inte än&quot; blir resultatet
              <strong> preliminärt</strong> och en utredningspunkt skapas automatiskt.
            </p>
            <div className="rounded-lg border bg-gray-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                Blockerande frågor
              </p>
              <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                <BlockingItem id="Q01" text="Vad systemet används till" />
                <BlockingItem id="Q02" text="Systemgräns och avgränsning" />
                <BlockingItem id="Q03" text="Systemberoenden (uppströms)" />
                <BlockingItem id="Q04" text="Systemberoenden (nedströms)" />
                <BlockingItem id="Q07" text="En eller flera funktioner" />
                <BlockingItem id="Q08" text="Sammanhållet eller delas upp" />
                <BlockingItem id="Q16" text="Radiologisk händelse" />
                <BlockingItem id="Q17" text="Säkerhet under normal drift" />
                <BlockingItem id="Q18" text="Nödlägeshantering" />
                <BlockingItem id="Q19" text="Fysiskt skydd" />
                <BlockingItem id="Q20" text="Huvudprocess allvarligt" />
                <BlockingItem id="Q30" text="Primärt system" />
                <BlockingItem id="Q31" text="Scope-sammanblandning" />
              </div>
            </div>
          </div>
        </section>

        {/* Sektion 6: Specialregler */}
        <section>
          <SectionHeader icon={<Scale size={20} />} title="Specialregler" />
          <div className="space-y-4">
            <RuleCard
              title="Mest stringent nivå vinner"
              description="Om ett system stöder flera funktioner och dessa ger olika CSL-nivåer, blir systemnivån den mest stringenta (lägsta siffran). Exempel: om en funktion ger CSL 2 och en annan CSL 4, blir systemnivån CSL 2."
            />
            <RuleCard
              title="Analog fallback sänker aldrig automatiskt"
              description="Om användaren anger att en funktion kan upprätthållas manuellt eller analogt (Q28), noteras detta men nivån sänks aldrig automatiskt. Lägre nivå kräver explicit manuell motivering."
            />
            <RuleCard
              title="Manuell granskning (Q32)"
              description="Om kontrollfråga Q32 besvaras med 'Ja' eller 'Vet inte än' flaggas bedömningen för specialistgranskning. Detta innebär att regelmotorn kan underskatta nivån."
            />
            <RuleCard
              title="Primärt system måste pekas ut (Q30)"
              description="Om flera digitala tillgångar stöder samma funktion måste ett primärt system pekas ut. Q30 är blockerande — utan svar kan klassningen inte fastställas."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Hjälpkomponenter ────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-csl-primary">
      {icon}
      {title}
    </h2>
  );
}

function CslRow({
  level,
  color,
  description,
  questions,
}: {
  level: string;
  color: string;
  description: string;
  questions: string;
}) {
  return (
    <tr>
      <td className="py-3 pr-4">
        <span className={`inline-block rounded px-2 py-1 text-xs font-bold ${color}`}>{level}</span>
      </td>
      <td className="py-3 pr-4 text-gray-700">{description}</td>
      <td className="py-3 font-mono text-xs text-gray-500">{questions}</td>
    </tr>
  );
}

function FunctionCard({
  title,
  description,
  question,
}: {
  title: string;
  description: string;
  question: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <span className="text-xs text-gray-400">{question}</span>
      </div>
      <p className="mt-1 text-xs text-gray-600">{description}</p>
    </div>
  );
}

function BlockingItem({ id, text }: { id: string; text: string }) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="font-mono text-xs font-bold text-csl-warning">{id}</span>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function RuleCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border-l-4 border-csl-primary bg-white p-4 shadow-panel">
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}
