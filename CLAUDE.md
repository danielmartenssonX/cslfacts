# CSL-verktyget — Projektinstruktioner för Claude Code

## Uppdrag

Implementera CSL-verktyget enligt teknisk specifikation, UX-specifikationen och processdokumenten.

## Dokumentprioritet

Vid konflikt gäller denna ordning:

1. `docs/spec/TECHNICAL_SPEC.md`
2. `docs/design/UX_DESIGN_SPEC.md`
3. `docs/process/*.md`

## Vad single-file-kravet betyder

Single-file-kravet gäller den levererbara artifact-applikationen:

- appens produktionslogik ska samlas i `src/CSLApp.jsx`

Detta förhindrar **inte** separata filer för:

- testfiler
- setupfiler
- verifieringsskript
- bygg- och testkonfiguration
- lokal dev-harness (`src/main.jsx`, `src/index.css`, `src/testIds.js`)

## Arkitekturregler

- React med hooks
- `useReducer` för central state
- `deriveState()` för computed properties
- Tailwind CSS för UI-styling
- persistent storage via `window.storage`
- inga externa nätverksanrop
- inga externa fonter
- ingen `localStorage`, `sessionStorage` eller cookies
- inga analytics- eller telemetribibliotek

## Runtime-antaganden

Se:

- `docs/spec/STORAGE_CONTRACT.md`
- `docs/spec/ARTIFACT_RUNTIME_ASSUMPTIONS.md`

## Arbetssätt

Följ alltid:

- `docs/process/CLAUDE_CODE_WORKFLOW.md`
- `docs/process/TEST_MANIFEST.md`
- `docs/process/CHANGE_IMPACT_TEMPLATE.md`
- `docs/process/REGRESSION_MATRIX.md`
- `docs/process/DONE_CRITERIA.md`
- `docs/process/STEP_BY_STEP_TEST_BLUEPRINT.md`
- `docs/process/BUG_REGRESSION_LEDGER.md`

## Repo-verifiering

Använd repoets faktiska kommandon från `package.json`.
Gissa inte kommandon när scripts redan finns.

## Kodregler

- All användartext ska vara på svenska
- Ingen debug-loggning av användardata
- Förklara huvudsektioner i koden med korta kommentarer
- Ändra minsta möjliga yta per arbetscykel
- Lägg till regressionstest för varje bugfix

## Startordning

1. Läs `docs/spec/TECHNICAL_SPEC.md`
2. Läs `docs/design/UX_DESIGN_SPEC.md`
3. Läs `docs/process/CLAUDE_CODE_WORKFLOW.md`
4. Gör repo-verifiering
5. Fyll i `CHANGE_IMPACT_TEMPLATE.md`
6. Fyll i `TEST_MANIFEST.md`
7. Implementera
8. Kör verifiering och regression

## Viktig regel

Fråga inte om lov att fortsätta mellan delsteg som redan omfattas av workflow-dokumentet.
Fortsätt så länge aktuell grind är grön och inget uttryckligt verksamhetsbeslut krävs.
