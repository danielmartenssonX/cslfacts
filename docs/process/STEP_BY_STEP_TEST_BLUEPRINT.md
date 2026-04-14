# STEP_BY_STEP_TEST_BLUEPRINT

Detta dokument definierar obligatoriska testkrav per utvecklingssteg för CSL-verktyget.

## Steg 0 – Bootstrap och grundpaket

### Minimikrav

- Appen renderar utan fel
- Sekretessvarning visas och kan stängas
- Sidopanel och innehållsyta renderas
- Alla kvalitetsgrindar passerar (format, lint, typecheck, build, forbidden APIs)
- Grundläggande a11y-kontroll passerar

### Testtyper

- Smoke: app renderar, varning stängs
- Component: shell-struktur
- Unit: reducer, deriveState
- A11y: axe-kontroll

---

_Fler steg definieras när funktionell specifikation finns._

---

## Tvärgående områden

### Storage

- Spara och hämta fungerar
- Felhantering vid saknade nycklar
- Lista nycklar med prefix

### Export

_Definieras när exportfunktion specificeras._

### Tillgänglighet

- Alla formulärfält har label
- Modaler fångar fokus
- Tabbordning är logisk
- Färg är inte enda informationsbärare

### Readonly/snapshot

_Definieras om lifecycle med snapshots implementeras._

---

## Praktisk arbetsordning

1. Identifiera berört steg eller tvärgående område
2. Kontrollera minimikraven ovan
3. Säkerställ att testplanen täcker minimikraven
4. Komplettera med edge cases och negativa scenarier
5. Dokumentera i TEST_MANIFEST.md
