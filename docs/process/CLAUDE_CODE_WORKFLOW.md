# CLAUDE_CODE_WORKFLOW

Detta dokument definierar det obligatoriska arbetsflödet för all utveckling i Claude Code för CSL-verktyget.

Syftet är att säkerställa att utvecklingen sker:

- systematiskt,
- spårbart,
- testdrivet eller teststyrt,
- regressionssäkert,
- och med kvalitet före allt.

Detta dokument är den operativa huvudrutinen och ska användas tillsammans med:

- `TEST_MANIFEST.md`
- `CHANGE_IMPACT_TEMPLATE.md`
- `REGRESSION_MATRIX.md`
- `DONE_CRITERIA.md`
- `STEP_BY_STEP_TEST_BLUEPRINT.md`
- `BUG_REGRESSION_LEDGER.md`

Om något i arbetsflödet här krockar med kvalitet, korrekthet eller säkerhet, ska kvalitet och korrekthet väga tyngst.

# 1. Grundprinciper

## 1.1 Kvalitet före allt

Ingen ändring får betraktas som klar enbart för att koden "fungerar" i ett happy path-scenario.

En ändring är först klar när den:

- uppfyller krav,
- är testad,
- är regressionstestad,
- har dokumenterad påverkan,
- inte lämnar kända kritiska risker efter sig.

## 1.2 Inget antagande utan verifiering

Claude Code får inte:

- anta att något fungerar,
- påstå att tester passerat utan att de faktiskt har körts,
- hoppa över regression som krävs,
- lämna kända allvarliga fel oåtgärdade,
- gå vidare på ostabil grund.

## 1.3 Minsta säkra ändring

Varje ändring ska vara så liten som möjligt men så fullständig som nödvändigt.

Undvik:

- att blanda flera riskfyllda ändringar i samma steg,
- att samtidigt ändra datamodell, UI och export om det inte krävs,
- att "passa på" att förbättra orelaterade delar.

## 1.4 Permanent lärande av buggar

Varje bug ska:

- registreras,
- få rotorsaksanalys,
- få minst ett permanent regressionstest,
- verifieras innan stängning.

## 1.5 Dokumenten är bindande

Samtliga styrdokument i repo-roten är obligatoriska arbetsinstrument, inte referensmaterial.

# 2. Dokumentens roller

## 2.1 TEST_MANIFEST.md

Det operativa testkontraktet för aktuell ändring.

Används för att dokumentera:

- accepteranskriterier,
- testplan,
- testnivåer,
- kommandon,
- coverage,
- resultat,
- slutbeslut.

## 2.2 CHANGE_IMPACT_TEMPLATE.md

Förändringsanalysen före implementation.

Används för att dokumentera:

- vad som påverkas,
- riskytor,
- ändringskategori,
- testomfång,
- regressionsbehov.

## 2.3 REGRESSION_MATRIX.md

Regler för när riktad regression respektive full regression krävs.

## 2.4 DONE_CRITERIA.md

Obligatorisk checklista för att avgöra om en ändring är klar.

## 2.5 STEP_BY_STEP_TEST_BLUEPRINT.md

Baslinje för testkrav per steg och tvärgående funktioner.

## 2.6 BUG_REGRESSION_LEDGER.md

Obligatorisk bugjournal med rotorsak, fix och permanent regressionstest.

# 3. Standardflöde för varje utvecklingsuppgift

Varje ny uppgift, bugfix eller ändring ska genomföras i exakt denna ordning.

## Steg A – Läs in kontext

Innan arbete påbörjas ska Claude Code:

1. läsa aktuell specifikation,
2. läsa detta workflow-dokument,
3. läsa relevanta styrdokument,
4. identifiera vilken del av systemet som påverkas,
5. identifiera om uppgiften är:
   - feature,
   - bugfix,
   - refaktorering,
   - testförstärkning,
   - dokumentationsändring,
   - styling/mikrocopy.

## Steg B – Repo-verifiering

Innan första implementation i en session ska Claude Code identifiera och dokumentera:

- package manager
- build command
- lint command
- typecheck command
- unit test command
- integration/component test command
- E2E command
- coverage command
- accessibility command om det finns
- smoke command
- full regression command

Om något saknas ska det noteras uttryckligen.

Ingen fullständig verifiering får påstås om kommandostöd saknas.

## Steg C – Fyll i CHANGE_IMPACT_TEMPLATE.md

Innan kodändring ska Claude Code fylla i eller uppdatera:

- ändrings-ID
- kort namn
- ändringskategori
- syfte
- påverkade filer
- påverkade domänobjekt
- påverkade UI-steg
- påverkade riskytor
- troliga felmoder
- måste-förbli-sant
- om full regression krävs
- exakta kommandon som ska köras

Ingen implementation får börja innan detta är gjort.

## Steg D – Fyll i TEST_MANIFEST.md

Innan kodändring ska Claude Code skriva:

- accepteranskriterier
- testnivåer
- testfall
- kommandon
- coverage-krav
- stopprisker

Accepteranskriterierna ska täcka:

- funktionellt beteende
- negativa scenarier
- edge cases
- UX
- tillgänglighet
- säkerhet/sekretess
- regression

## Steg E – Kontroll mot STEP_BY_STEP_TEST_BLUEPRINT.md

Claude Code ska kontrollera vilket steg eller tvärgående område som berörs och säkerställa att blueprintens minimikrav för det området ingår i testplanen.

## Steg F – Implementera minsta säkra ändring

Först nu får implementation påbörjas.

Regler:

- ändra minsta nödvändiga yta,
- håll domäninvarianter intakta,
- undvik orelaterade ändringar,
- skriv eller uppdatera tester innan ändringen anses klar.

## Steg G – Kör verifiering

Efter implementation ska alla relevanta kommandon köras.

Minimikrav:

- formattering
- lint
- typecheck
- build
- relevanta tester
- smoke suite
- regression enligt matrisen

Vid kritisk ändring ska full regression köras.

## Steg H – Hantera fel

Om något test, build-steg eller kvalitetsgrind faller ska Claude Code:

1. stoppa,
2. analysera rotorsaken,
3. åtgärda problemet,
4. köra om relevanta tester,
5. därefter köra regression igen.

Det är förbjudet att gå vidare med:

- kända kritiska fel,
- fladdriga tester,
- oklar testtäckning,
- coverage under gräns,
- blockerande a11y-fel,
- regressionsfel.

## Steg I – Registrera buggar

Om ett fel hittas under arbetet ska det registreras i `BUG_REGRESSION_LEDGER.md`.

Obligatoriskt:

- klassificering
- symptom
- reproduktion
- rotorsak
- fix
- permanent regressionstest
- verifieringsresultat
- status

## Steg J – Uppdatera TEST_MANIFEST.md med resultat

Efter körd verifiering ska Claude Code dokumentera:

- vilka kommandon som körts
- vilka sviter som passerat/fallit
- coverage
- funna fel
- åtgärder
- kända kvarstående risker

## Steg K – Kontrollera DONE_CRITERIA.md

Ingen ändring får godkännas innan samtliga relevanta rutor i `DONE_CRITERIA.md` är uppfyllda.

## Steg L – Slutbeslut

Endast ett av följande får beslutas:

- `GODKÄND FÖR NÄSTA STEG`
- `EJ GODKÄND – FORTSÄTT FELSÖKA`

# 4. Ändringskategorier och arbetsregler

## 4.1 Typ A – Kritisk domänlogik

Exempel:

- datamodell
- deriveState
- reducer/actions
- villkorslogik
- härledda statusar
- lifecycle
- storage
- export

Krav:

- full statisk kontroll
- starka enhetstester
- integrationstester
- smoke suite
- full regression
- coverage enligt höga gränser
- tydlig dokumentation i manifest och ledger vid bug

## 4.2 Typ B – Kritisk UI-logik

Exempel:

- stegkomponenter
- formulärlogik
- readonly-lägen
- status-/warning-logik
- tabellbeteenden med affärslogik

Krav:

- statisk kontroll
- komponenttester
- integrationstester
- smoke suite
- riktad regression
- full regression om delad state eller shared logic påverkas

## 4.3 Typ C – Delad komponent / designsystem

Exempel:

- inputs
- alerts
- modals
- badges
- shared tables
- layoutkomponenter med semantisk påverkan

Krav:

- statisk kontroll
- komponenttester
- a11y-kontroller
- smoke suite
- regression på alla relevanta användningsytor

## 4.4 Typ D – Lokal mikrocopy / isolerad styling

Exempel:

- textjustering
- margin/padding
- lokal färg- eller layoutjustering utan semantisk effekt

Krav:

- lint/typecheck/build
- snabb riktad kontroll
- smoke suite

Om osäkerhet finns ska ändringen klassas upp, inte ned.

# 5. När full regression alltid krävs

Full regression krävs alltid när ändringen påverkar något av följande:

- datamodell
- reducer/actions
- deriveState
- villkorslogik
- härledda statusar
- lifecycle
- storage
- export
- global navigation shell
- shared critical components
- accessibility-bärande struktur

Om Claude Code tvekar ska svaret vara: kör full regression.

# 6. Obligatoriska kvalitetsgrindar

Varje ändring måste passera dessa grindar i relevant omfattning.

## 6.1 Statisk kvalitet

- formattering passerar
- lint passerar
- strict typecheck passerar
- build passerar
- förbjudna API:er används inte
- inga känsliga console.log i produktionskod

## 6.2 Enhetstester

Ska täcka all kritisk logik.

## 6.3 Integrationstester

Ska täcka att delarna fungerar tillsammans.

## 6.4 Komponenttester

Ska täcka kritiska komponenter i realistiska tillstånd.

## 6.5 E2E-/flödestester

Ska täcka verkliga användarresor.

## 6.6 Tillgänglighetstester

Ska täcka centrala flöden och kritiska komponenter.

## 6.7 Säkerhets-/sekretesskontroller

Ska uttryckligen verifiera att verktygets egensäkerhet hålls.

## 6.8 Regressionsgrind

Måste passera enligt `REGRESSION_MATRIX.md`.

# 7. Coverage-regler

Coverage är en grind, inte en dekorativ siffra.

## Globala minimikrav

- line coverage: minst 90 %
- branch coverage: minst 85 %
- function coverage: minst 90 %
- statement coverage: minst 90 %

## Skärpta krav för kritiska moduler

- deriveState: minst 95 % branch, i praktiken nära total täckning
- reducer/actions: minst 95 % line och 95 % branch
- villkorsmotorer: minst 95 % line och 95 % branch

Om coverage-gräns underskrids är ändringen inte godkänd.

# 8. Smoke suite

Smoke suite ska alltid köras efter varje ändring.

Minimikrav:

1. appen renderar
2. secrecy warning visas
3. grundflöde fungerar
4. spara/återladda fungerar
5. inga kritiska console errors
6. inga blockerande a11y-fel i huvudflödet

# 9. Bughantering

När en bug upptäcks gäller följande omedelbart:

1. Registrera bugen i `BUG_REGRESSION_LEDGER.md`
2. Klassificera severity och kategori
3. Dokumentera reproduktion
4. Gör rotorsaksanalys
5. Implementera fix
6. Lägg till permanent regressionstest
7. Kör verifiering
8. Kör regression enligt matrisen
9. Stäng först när allt är verifierat

Ingen bug får stängas på symptomnivå utan rotorsak.

# 10. Särskilda regler för readonly och snapshot

Om systemet innehåller lifecycle och immutable snapshots gäller extra hårda krav.

Claude Code ska alltid verifiera att:

- readonly-vy inte kan skriva
- snapshot-data inte muteras via UI
- snapshot-data inte muteras via reducer eller indirekt state
- export från snapshot speglar snapshot, inte arbetskopian

Varje bug här ska behandlas som högrisk.

# 11. Särskilda regler för export

Export är ett högriskområde eftersom det påverkar beslutsunderlag.

Claude Code ska alltid verifiera:

- korrekt metadatahuvud
- rätt struktur
- inga interna debugfält
- inga oavsiktliga metadata
- korrekt innehåll i alla lägen

Varje exportbug kräver permanent regressionstest.

# 12. Särskilda regler för villkorslogik

Villkorslogik för härledda statusar ska alltid behandlas som högrisk.

Claude Code ska:

- använda tabellstyrda tester när det passar,
- testa positiva och negativa scenarier,
- testa gränsfall,
- lägga till regressionstest för varje hittad logikbug.

# 13. Arbetscykel i praktiken

För varje uppgift ska Claude Code arbeta enligt denna minnesregel:

## 13.1 Tänk först

- förstå uppgiften
- förstå riskerna
- förstå vilka delar som påverkas

## 13.2 Dokumentera först

- fyll i change impact
- fyll i test manifest

## 13.3 Bygg sedan

- implementera minsta säkra lösning

## 13.4 Bevisa sedan

- kör kommandon
- verifiera resultat
- kör regression

## 13.5 Lås först därefter

- uppdatera dokumentation
- kontrollera done criteria
- fatta slutbeslut

# 14. Obligatoriskt rapportformat efter varje arbetscykel

Efter varje arbetscykel ska Claude Code rapportera i exakt denna struktur:

## Levererad del

Kort beskrivning av vad som byggdes eller ändrades.

## Ändringskategori

Typ A / B / C / D och varför.

## Påverkansanalys

- Påverkade filer:
- Påverkade domänobjekt:
- Påverkade UI-steg:
- Påverkade riskytor:
- Kräver full regression: ja/nej
- Motivering:

## Accepteranskriterier

Punktlista.

## Testplan

- Statisk kontroll:
- Enhetstester:
- Integrationstester:
- Komponenttester:
- E2E-/flödestester:
- Tillgänglighetstester:
- Säkerhets-/sekretesskontroller:
- Regressionssviter:

## Körda kommandon

Lista exakt vilka kommandon som kördes.

## Testresultat

För varje svit:

- körd/ej körd
- antal tester
- resultat
- coverage
- funna fel
- åtgärd

## Kända risker

Endast verkliga kvarstående risker.

## Beslut

Exakt ett av följande:

- GODKÄND FÖR NÄSTA STEG
- EJ GODKÄND – FORTSÄTT FELSÖKA

# 15. Förbjudna beteenden

Claude Code får inte:

- hoppa direkt till kod utan påverkan och testplan
- påstå att något är verifierat utan körda kommandon
- hoppa över bugjournal vid upptäckt fel
- ignorera fladdriga tester
- ignorera coverage-brister
- blanda flera stora riskändringar i samma steg utan tydlig motivering
- lämna kvar dolda tekniska skulder i kritisk logik
- använda ord som "klart", "färdigt" eller "godkänt" utan att DONE_CRITERIA faktiskt är uppfyllt

# 16. Startsekvens för nytt arbete

När Claude Code får ett nytt utvecklingsuppdrag ska det börja i denna ordning:

1. Läs specifikationen
2. Läs detta dokument
3. Läs övriga styrdokument
4. Gör repo-verifiering
5. Fyll i `CHANGE_IMPACT_TEMPLATE.md`
6. Fyll i `TEST_MANIFEST.md`
7. Kontrollera krav i `STEP_BY_STEP_TEST_BLUEPRINT.md`
8. Implementera
9. Kör verifiering
10. Registrera eventuella buggar i `BUG_REGRESSION_LEDGER.md`
11. Uppdatera dokumentation
12. Kontrollera `DONE_CRITERIA.md`
13. Fatta beslut

# 17. Slutregel

Om det finns tvekan om:

- korrekthet,
- täckning,
- regressionssäkerhet,
- readonly-skydd,
- export,
- eller domänsäkerhet,

så är ändringen **inte redo**.

Då gäller alltid:

**EJ GODKÄND – FORTSÄTT FELSÖKA**
