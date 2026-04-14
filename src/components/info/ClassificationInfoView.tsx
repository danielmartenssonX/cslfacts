import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Layers,
  BookOpen,
  Scale,
  Users,
  Info,
} from 'lucide-react';
import DecisionFlowDiagram from './DecisionFlowDiagram';

interface ClassificationInfoViewProps {
  onBack: () => void;
}

export default function ClassificationInfoView({ onBack }: ClassificationInfoViewProps) {
  return (
    <div className="min-h-screen">
      {/* Hero med bakgrundsbild */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-csl-primary/80 via-csl-primary/60 to-csl-background" />
        <div className="relative mx-auto max-w-4xl px-6 pb-10 pt-10">
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white hover:underline"
          >
            <ArrowLeft size={16} />
            Tillbaka
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">Om klassningsmodellen</h1>
          <p className="mt-2 max-w-lg text-sm text-white/80">
            Full transparens kring hur CSL-verktyget klassificerar digitala tillgångar.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="space-y-10">
          {/* Sektion 1: Översikt */}
          <section>
            <SectionHeader icon={<BookOpen size={20} />} title="Översikt" />
            <div className="prose-sm space-y-3 text-sm text-gray-700">
              <p>
                Verktyget operationaliserar{' '}
                <strong>IAEA Nuclear Security Series No. 17-T (Rev. 1)</strong>, särskilt Annex II:s
                exempel för tilldelning av Computer Security Levels (CSL) i kärnkraftverk.
                Frågestrukturen i verktyget är en deterministisk tolkning av dessa principer — inte
                ett frågebatteri som ges direkt av IAEA.
              </p>
              <p>
                Klassningen utgår från vilka <strong>funktioner</strong> ett system stöder och från
                de möjliga konsekvenserna om systemets{' '}
                <strong>integritet eller tillgänglighet</strong> komprometteras. Det finns inga
                dolda poängmodeller, ingen AI-baserad slutledning och inga sannolikhetsbedömningar.
                Varje utfall kan spåras tillbaka till exakt vilka svar som gav vilken nivå.
              </p>
              <p>
                Grundprincipen är <strong>funktion först</strong>: i IAEA:s modell identifieras
                först anläggningens funktioner, dessa tilldelas system, och systemen ärver den
                skyddsnivå som funktionen kräver. Verktyget stödjer klassning av{' '}
                <strong>system utifrån de funktioner de utför</strong>.
              </p>
            </div>

            {/* Informationsruta: Säkerhetsklass ≠ CSL */}
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-csl-info/30 bg-csl-info/5 p-4">
              <Info size={18} className="mt-0.5 shrink-0 text-csl-info" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-gray-900">
                  Säkerhetsklass och CSL är inte samma sak
                </p>
                <p className="mt-1">
                  <strong>Säkerhetsklass</strong> (safety class) anger hur viktig en komponents
                  funktion är för den nukleära säkerheten — den styrs av deterministisk
                  säkerhetsanalys och regleras i nationella föreskrifter (t.ex. SSMFS).{' '}
                  <strong>CSL</strong> (Computer Security Level) anger vilken nivå av{' '}
                  <em>datasäkerhetsskydd</em> ett digitalt system behöver — den styrs av vilka
                  konsekvenser som uppstår om systemets integritet eller tillgänglighet
                  komprometteras.
                </p>
                <p className="mt-2">
                  Det finns ingen automatisk 1:1-koppling mellan de två. Ett system utan formell
                  säkerhetsklass kan ändå kräva en stringent CSL om det har stor betydelse för
                  fysiskt skydd, nödlägeshantering eller känslig information. Omvänt behöver ett
                  system med hög säkerhetsklass inte nödvändigtvis ha högsta CSL om det saknar
                  digitala beroenden som kan komprometteras utifrån.
                </p>
              </div>
            </div>
          </section>

          {/* Sektion 2: Beslutsflöde */}
          <section>
            <SectionHeader icon={<Layers size={20} />} title="Beslutsflöde" />
            <p className="mb-6 text-sm text-gray-600">
              Diagrammet visar hur konsekvensfrågor (Q16–Q24) avgör CSL-nivån för varje funktion.
              Frågorna utvärderas uppifrån och ner — den första frågan som besvaras med
              &quot;Ja&quot; avgör kandidatnivån.
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
                    description="Högsta skyddsnivå. Komprometterad integritet eller tillgänglighet kan leda till radiologiska konsekvenser utanför anläggningen."
                    questions="Q16"
                  />
                  <CslRow
                    level="CSL 2"
                    color="bg-orange-100 text-orange-800"
                    description="Hög skyddsnivå. Komprometterad integritet eller tillgänglighet kan försämra säkerhet under normal drift, försvåra nödlägeshantering, försämra fysiskt skydd eller allvarligt störa huvudprocessen."
                    questions="Q17, Q18, Q19, Q20"
                  />
                  <CslRow
                    level="CSL 3"
                    color="bg-yellow-100 text-yellow-800"
                    description="Medelhög skyddsnivå. Komprometterad integritet eller tillgänglighet kan ge stora drift- eller underhållsproblem, eller tydlig negativ effekt på anläggningens prestanda."
                    questions="Q21, Q22"
                  />
                  <CslRow
                    level="CSL 4"
                    color="bg-blue-100 text-blue-800"
                    description="Grundskyddsnivå. Komprometterad integritet eller tillgänglighet kan ge negativa effekter som inte märks direkt men som över tid påverkar verksamheten."
                    questions="Q23"
                  />
                  <CslRow
                    level="CSL 5"
                    color="bg-green-100 text-green-800"
                    description="Lägsta skyddsnivå. Komprometterad integritet eller tillgänglighet bedöms inte kunna påverka säkerhet, tillgänglighet eller anläggningens prestanda."
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
                description="Funktioner där skyddsbehovet främst gäller att information inte sprids. Informationsskyddsaspekterna bygger på övriga delar av 17-T, inte enbart Annex II:s nivåtrappa som främst fokuserar på integritet och tillgänglighet."
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
                  Blockerande frågor härledda ur IAEA-modellen
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
                </div>
              </div>
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                  Verktygsspecifika kontroller
                </p>
                <p className="mb-2 text-xs text-gray-500">
                  Dessa blockeringar är tillagda i verktyget för att fånga scope-problem och
                  uppklassningsbehov — de härleds inte direkt ur Annex II.
                </p>
                <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  <BlockingItem id="Q31" text="Scope-sammanblandning" />
                  <BlockingItem id="Q32" text="Möjlig uppklassning (flaggar manuell granskning)" />
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
                title="Analog fallback sänker aldrig automatiskt (verktygsregel)"
                description="Om en funktion delvis kan upprätthållas manuellt eller analogt kan detta i vissa fall tala för en mindre stringent nivå enligt IAEA. I detta verktyg sänks nivån dock aldrig automatiskt på den grunden. En eventuell sänkning kräver uttrycklig manuell motivering och granskning."
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
