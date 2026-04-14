# TEST_MANIFEST

## Ändring

- ID: STEP-0-BOOTSTRAP
- Namn: Projektinitiering och grundpaketsvalidering
- Datum: 2026-04-14
- Ansvarig: Claude Code
- Relaterad spec/version: —
- Relaterade issues/buggar: Inga

## Syfte

Verifiera att grundpaketet kan installeras, byggas och att alla kvalitetsgrindar (format, lint, typecheck, build, forbidden APIs, unit/integration/component/a11y/smoke) passerar.

## Accepteranskriterier

- [ ] `npm run format:check` passerar
- [ ] `npm run lint` passerar
- [ ] `npm run typecheck` passerar
- [ ] `npm run build` passerar
- [ ] `npm run check:forbidden` passerar
- [ ] Alla bastester passerar
- [ ] Appen renderar en sekretessvarning och ett appskal

## Testnivåer

| Nivå             | Ingår | Kommentar                                   |
| ---------------- | ----- | ------------------------------------------- |
| Statisk kontroll | Ja    | format, lint, typecheck, build, forbidden   |
| Unit             | Ja    | reducer, deriveState                        |
| Integration      | Nej   | Inga integrationstester ännu                |
| Component        | Ja    | AppShell                                    |
| A11y             | Ja    | axe-kontroll                                |
| Smoke            | Ja    | Grundflöde                                  |
| E2E              | Nej   | Konfigurerat men ej prioriterat i bootstrap |

## Kommandon

```
npm run format:check
npm run lint
npm run typecheck
npm run build
npm run check:forbidden
npm run test:unit
npm run test:component
npm run test:a11y
npm run test:smoke
npm run verify
```

## Coverage-krav

Bootstrap-fas: coverage-trösklar konfigurerade men inte aktivt gated ännu (liten kodbas).

## Resultat

_Fylls i efter verifiering._

## Slutbedömning

- [ ] GODKÄND FÖR NÄSTA STEG
- [ ] EJ GODKÄND – FORTSÄTT FELSÖKA
