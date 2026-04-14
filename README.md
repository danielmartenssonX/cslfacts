# CSL-verktyget

Lokalt klassificeringsverktyg for system hos en karnteknisk tillstandshavare enligt IAEA Nuclear Security Series No. 17-T (Rev. 1), med fokus pa Annex II:s exempel for karnkraftverk.

## Syfte

Verktyget hjalper en vanlig verksamhetskunnig anvandare att:

- beskriva ett system
- ange vilka funktioner systemet stoder
- besvara enkla fragor
- fanga vad som ar oklart
- fa en preliminar eller slutlig CSL-klassificering med motivering

## Grundide

Verktyget bygger pa dessa principer:

- **Funktion forst** — klassificering utgar fran vilka funktioner systemet stoder
- **Deterministisk regelmotor** — ingen LLM, ingen dolda poang, ingen sannolikhetsbaserad slutledning
- **Tydliga hjalptexter** — alla fragor ar skrivna pa lattbegriplig svenska
- **Blockerande oklarheter stoppar faststallande** — Vet inte an skapar utredningspunkter
- **Mest stringent niva vinner** — CSL1 ar hogst, CSL5 ar lagst

## Teknisk stack

- React 18, TypeScript, Vite
- Tailwind CSS
- Vitest + Testing Library + Playwright
- ESLint + Prettier
- jsPDF (PDF-export)
- Zod

## Kom igang lokalt

```bash
npm install
npm run dev
```

Oppna `http://127.0.0.1:5173` i webblasaren.

## Bygga for produktion

```bash
npm run build
npm run preview
```

## Kora tester

```bash
npm run test          # Alla tester
npm run test:unit     # Enhetstester
npm run test:component # Komponenttester
npm run test:a11y     # Tillganglighetstester
npm run verify        # Alla kvalitetsgrindar
```

## Projektstruktur

```
src/
  domain/          Typer och enums
  data/            Fragebank och funktionskatalog (JSON)
  rules/           Regelmotor, blockeringsregler, funktionsupplosning
  services/        Export (JSON, Markdown, PDF), utredningslistbyggare
  state/           useReducer-baserad state management
  components/
    wizard/        WizardShell, ProgressBar, StepHeader
    questions/     QuestionCard, AnswerButtons, HelpPanel
    sidebar/       KnownFactsPanel, InvestigationPanel
    results/       ResultSummary, FunctionResultTable, DecisionTraceView, BlockingIssuesView
tests/
  unit/            classificationEngine, blockingRules, investigationBuilder
  component/       AppShell
  a11y/            axe-kontroller
  smoke/           Grundflode
  e2e/             Playwright
docs/
  process/         Kvalitetsdokument (workflow, manifest, done criteria, etc.)
  spec/            Teknisk spec, storage-kontrakt, runtime-antaganden
```

## Hur wizarden fungerar

| Steg            | Innehall                                                     |
| --------------- | ------------------------------------------------------------ |
| 1. Grundfakta   | Systemnamn, anlaggning, bedomare                             |
| 2. Avgransning  | 8 fragor om scope och beroenden                              |
| 3. Funktioner   | 7 fragor som identifierar vilka funktioner systemet stoder   |
| 4. Konsekvenser | 9 fragor om vad som hander vid fel i systemet                |
| 5. Oklarheter   | Utredningslista med blockerande och icke-blockerande punkter |
| 6. Resultat     | Klassificering, motivering, beslutslogg och export           |

## Svarsalternativ

Varje fraga har exakt tre svar:

- **Ja** — lagras som `YES`
- **Nej** — lagras som `NO`
- **Vet inte an** — lagras som `UNCLEAR`, skapar utredningspunkt

## Klassningsregler

| Regel                           | Resultat                   |
| ------------------------------- | -------------------------- |
| Q16 = Ja                        | CSL 1                      |
| Q17-Q20 = Ja (om inte CSL 1)    | CSL 2                      |
| Q21-Q22 = Ja (om inte CSL 1-2)  | CSL 3                      |
| Q23 = Ja (om inte CSL 1-3)      | CSL 4                      |
| Q24 = Ja (om inte CSL 1-4)      | CSL 5                      |
| Blockerande fraga = Vet inte an | PRELIMINARY_BLOCKED        |
| Flera funktioner                | Mest stringent niva vinner |

## Export

Verktyget exporterar till:

- **JSON** — fullstandigt dataunderlag
- **Markdown** — lasbart klassificeringsunderlag
- **PDF** — via jsPDF, direkt nedladdning

## Viktig begransning

Detta ar ett beslutsstod. Det ersatter inte verksamhetsansvarig bedomning, specialistgranskning eller formell faststallelse enligt lokala krav.
