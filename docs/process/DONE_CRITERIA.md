# DONE_CRITERIA

En ändring är inte klar förrän samtliga punkter nedan är uppfyllda.

## 1. Förarbete klart

- [ ] Påverkansanalys dokumenterad
- [ ] Ändringskategori satt
- [ ] Accepteranskriterier formulerade
- [ ] Testplan dokumenterad
- [ ] Relevanta kommandon identifierade

## 2. Implementation klar

- [ ] Minsta säkra lösning implementerad
- [ ] Ingen orelaterad komplexitet införd
- [ ] Kod följer specifikationen
- [ ] Kod följer gällande säkerhets-/sekretesskrav

## 3. Statisk kvalitet passerad

- [ ] Formattering passerar
- [ ] Lint passerar
- [ ] Typecheck passerar
- [ ] Build passerar
- [ ] Inga förbjudna API:er används
- [ ] Inga känsliga console.log i produktionskod

## 4. Tester passerade

- [ ] Relevanta enhetstester passerar
- [ ] Relevanta integrationstester passerar
- [ ] Relevanta komponenttester passerar
- [ ] Relevanta E2E-/flödestester passerar
- [ ] Relevanta tillgänglighetstester passerar
- [ ] Relevanta säkerhets-/sekretesskontroller passerar
- [ ] Smoke suite passerar
- [ ] Full regression passerar när den krävs

## 5. Coverage passerad

- [ ] Global line coverage minst 90 %
- [ ] Global branch coverage minst 85 %
- [ ] Global function coverage minst 90 %
- [ ] Global statement coverage minst 90 %
- [ ] Kritiska moduler når sina högre gränser

## 6. Regression och bugdisciplin

- [ ] Varje bugfix har fått minst ett regressionstest
- [ ] Inga kända blockerande eller allvarliga fel kvarstår
- [ ] Inga fladdriga tester kvarstår
- [ ] Ingen regressionsavvikelse ignoreras

## 7. Domänsäkerhet

- [ ] Readonly-lägen kan inte mutera data
- [ ] Härledd logik ger konsekventa resultat
- [ ] Statuskedjor kan inte hamna i ogiltiga tillstånd
- [ ] Export innehåller rätt data och struktur
- [ ] Storage beter sig konsekvent vid återladdning/fel

## 8. Dokumentation klar

- [ ] TEST_MANIFEST uppdaterad med resultat
- [ ] Funna fel och åtgärder dokumenterade
- [ ] Körda kommandon dokumenterade
- [ ] Beslut tydligt dokumenterat

## Slutbeslut

Exakt ett av följande får markeras:

- [ ] GODKÄND FÖR NÄSTA STEG
- [ ] EJ GODKÄND – FORTSÄTT FELSÖKA

Regel:
Ingen får markera "GODKÄND FÖR NÄSTA STEG" om någon ruta ovan är omarkerad.
