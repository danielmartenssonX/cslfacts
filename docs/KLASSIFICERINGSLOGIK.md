# CSL-verktygets klassificeringslogik

Komplett beskrivning av frågeflöde, svarshantering och bedömningslogik.
Avsett som underlag för oberoende granskning.

---

## 1. Översikt

Verktyget klassificerar digitala tillgångar vid kärntekniska anläggningar enligt IAEA Nuclear Security Series No. 17-T (Rev. 1), Annex II. Klassificeringen bygger på:

1. Identifiering av systemets **funktioner** (Q09–Q15)
2. Bedömning av **konsekvenser** om systemets integritet eller tillgänglighet komprometteras (Q16–Q24)
3. Tilldelning av en **CSL-nivå per funktion** baserat på konsekvenssvaren
4. Aggregering till en **systemnivå** (mest stringenta funktionsnivån vinner)

Klassificeringen är helt deterministisk — inga sannolikhetsbedömningar, poängmodeller eller AI-baserade slutledningar.

---

## 2. Frågebank — alla 32 frågor

### 2.1 Sektion SCOPE — Avgränsning och beroenden (Q01–Q08)

Dessa frågor kartlägger vad systemet är, var dess gränser går och vilka beroenden som finns. Alla har `appliesTo: ALL` (gäller oavsett funktionstyp). Inga skapar funktioner och inga styr CSL-nivå direkt.

| ID  | Frågetext                                                                                     | Blockerande |
| --- | --------------------------------------------------------------------------------------------- | :---------: |
| Q01 | Vet du vad systemet används till?                                                             |     Ja      |
| Q02 | Vet du vad som ingår i systemet och vad som ligger utanför?                                   |     Ja      |
| Q03 | Vet du vilka andra system det här systemet är beroende av?                                    |     Ja      |
| Q04 | Vet du vilka system som är beroende av detta system?                                          |     Ja      |
| Q05 | Vet du om leverantörer eller andra utanför verksamheten kan komma åt systemet?                |     Nej     |
| Q06 | Vet du om systemet använder flyttbara medier?                                                 |     Nej     |
| Q07 | Vet du om systemet har en tydlig huvudfunktion eller flera olika funktioner?                  |     Ja      |
| Q08 | Vet du om systemet kan klassificeras som ett sammanhållet system, eller om det bör delas upp? |     Ja      |

### 2.2 Sektion FUNCTION — Funktionsidentifiering (Q09–Q15)

Varje fråga som besvaras med "Ja" skapar en funktion av den angivna typen. Inga av dessa frågor är blockerande och ingen styr CSL-nivå direkt. Alla har `appliesTo: ALL`.

| ID  | Frågetext                                                                                                              | Skapar funktion        |
| --- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Q09 | Stöder systemet säker drift av anläggningen?                                                                           | SAFETY_OPERATION       |
| Q10 | Stöder systemet nödlägeshantering eller krishantering?                                                                 | EMERGENCY_MANAGEMENT   |
| Q11 | Stöder systemet fysiskt skydd eller skydd mot obehörigt intrång?                                                       | PHYSICAL_PROTECTION    |
| Q12 | Stöder systemet huvudprocessen eller den centrala anläggningsdriften?                                                  | MAIN_PROCESS           |
| Q13 | Stöder systemet underhåll eller teknisk förmåga på ett sätt som är viktigt för verksamheten?                           | MAINTENANCE_SUPPORT    |
| Q14 | Hanterar systemet känslig information som inte får spridas?                                                            | SENSITIVE_INFORMATION  |
| Q15 | Är systemet i huvudsak administrativt eller stödjande utan direkt koppling till säker drift, skydd eller huvudprocess? | ADMINISTRATIVE_SUPPORT |

### 2.3 Sektion CONSEQUENCE — Konsekvensfrågor (Q16–Q24)

Dessa frågor avgör CSL-nivån. Varje fråga har ett `appliesTo`-fält som anger vilka funktionstyper den gäller för. En fråga som inte gäller en viss funktionstyp hoppas över vid bedömning av den funktionen.

| ID  | Frågetext                                                                                                   | CSL-nivå | Blockerande | Gäller funktionstyper (appliesTo)                                         |
| --- | ----------------------------------------------------------------------------------------------------------- | :------: | :---------: | ------------------------------------------------------------------------- |
| Q16 | Kan fel i systemet bidra till att människor utanför anläggningen kan påverkas av en radiologisk händelse?   |  CSL 1   |     Ja      | SAFETY_OPERATION, MAIN_PROCESS, EMERGENCY_MANAGEMENT, OTHER               |
| Q17 | Kan fel i systemet försämra säkerheten i anläggningen under normal drift?                                   |  CSL 2   |     Ja      | SAFETY_OPERATION, MAIN_PROCESS                                            |
| Q18 | Kan fel i systemet göra det svårare att hantera en nödsituation?                                            |  CSL 2   |     Ja      | EMERGENCY_MANAGEMENT                                                      |
| Q19 | Kan fel i systemet försämra anläggningens fysiska skydd?                                                    |  CSL 2   |     Ja      | PHYSICAL_PROTECTION                                                       |
| Q20 | Kan fel i systemet störa anläggningens huvudprocess på ett allvarligt sätt?                                 |  CSL 2   |     Ja      | MAIN_PROCESS, SAFETY_OPERATION                                            |
| Q21 | Kan fel i systemet ge stora problem i drift eller underhåll även om säkerheten inte direkt påverkas?        |  CSL 3   |     Nej     | MAINTENANCE_SUPPORT, MAIN_PROCESS, ADMINISTRATIVE_SUPPORT                 |
| Q22 | Kan fel i systemet få tydlig negativ effekt på elproduktion eller anläggningens prestation?                 |  CSL 3   |     Nej     | MAIN_PROCESS, MAINTENANCE_SUPPORT                                         |
| Q23 | Skulle fel i systemet främst ge problem först längre fram, snarare än direkt?                               |  CSL 4   |     Nej     | ADMINISTRATIVE_SUPPORT, SENSITIVE_INFORMATION, MAINTENANCE_SUPPORT, OTHER |
| Q24 | Skulle ett fel i systemet i praktiken inte påverka säkerhet, tillgänglighet eller anläggningens prestation? |  CSL 5   |     Nej     | ADMINISTRATIVE_SUPPORT, SENSITIVE_INFORMATION, OTHER                      |

### 2.4 Sektion CONTEXT — Kontext och komplettering (Q25–Q32)

Kontextfrågor som ger ytterligare information men inte direkt styr CSL-nivåval (undantag: Q30 och Q31 är blockerande, Q32 flaggar manuell granskning).

| ID  | Frågetext                                                                                                           | Blockerande | Gäller funktionstyper                                       | Specialeffekt                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------- | :---------: | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| Q25 | Är det viktigaste skyddsbehovet att informationen hålls hemlig?                                                     |     Nej     | SENSITIVE_INFORMATION                                       | Ingen                                                                   |
| Q26 | Är det viktigaste skyddsbehovet att informationen är korrekt och går att lita på?                                   |     Nej     | SAFETY_OPERATION, MAIN_PROCESS, EMERGENCY_MANAGEMENT, OTHER | Ingen                                                                   |
| Q27 | Är det viktigt att systemet finns tillgängligt när det behövs?                                                      |     Nej     | ALL                                                         | Ingen                                                                   |
| Q28 | Går det att klara funktionen på ett säkert och fungerande sätt utan detta system under en tid?                      |     Nej     | ALL                                                         | Analog fallback noteras men sänker aldrig nivån automatiskt             |
| Q29 | Finns det ett annat system som faktiskt kan ta över samma uppgift?                                                  |     Nej     | ALL                                                         | Ingen                                                                   |
| Q30 | Är detta det primära systemet för den aktuella funktionen?                                                          |     Ja      | ALL                                                         | Om fler än 1 funktion identifierats och Q30 ej besvarats Ja → blockerar |
| Q31 | Är systemet så sammanblandat med andra funktioner att det är svårt att avgöra vad som egentligen ska klassificeras? |     Ja      | ALL                                                         | Ingen                                                                   |
| Q32 | Finns det någon tydlig anledning att tro att systemet bör klassas högre än den preliminära regeln visar?            |     Nej     | ALL                                                         | Ja eller Vet inte än → flaggar för specialistgranskning                 |

---

## 3. Svarshantering

### 3.1 Svarsalternativ

Varje fråga besvaras med ett av tre värden:

| Värde     | Etikett     | Effekt                                                                       |
| --------- | ----------- | ---------------------------------------------------------------------------- |
| `YES`     | Ja          | Kan aktivera funktioner (Q09–Q15) eller trigga CSL-nivå (Q16–Q24)            |
| `NO`      | Nej         | Frågan anses besvarad men ger ingen aktivering                               |
| `UNCLEAR` | Vet inte än | Skapar utredningspunkt. Om frågan är blockerande → förhindrar slutlig status |

### 3.2 Lagring av svar

Varje svar lagras som:

```
{
  questionId: "Q16",         // Vilken fråga
  value: "YES",              // Svarsalternativ
  functionId?: "f1",         // Valfritt: för vilken funktion svaret gäller
  comment?: "Bedömt av NN"   // Valfri kommentar
}
```

### 3.3 Globala vs funktionsspecifika svar

Svar kan vara **globala** (utan `functionId`) eller **funktionsspecifika** (med `functionId`).

Vid uppslagning för en viss funktion gäller:

1. Om ett svar med exakt matchande `functionId` finns → använd det
2. Annars, om ett globalt svar (utan `functionId`) finns → använd det
3. Annars → inget svar finns

I nuvarande version besvaras konsekvensfrågor (Q16–Q24) globalt av användaren. Mekanismen för funktionsspecifika svar finns implementerad men används ännu inte i gränssnittet.

### 3.4 Uppdatering av svar

När ett svar ändras:

- Om ett svar med samma `(questionId, functionId)`-par redan finns → ersätts det
- Annars → läggs det till som nytt svar

---

## 4. Funktionsidentifiering

### 4.1 Skapande av funktioner

När användaren besvarar Q09–Q15 med "Ja" skapas motsvarande funktion:

```
Q09 = Ja → SAFETY_OPERATION  (Säker drift)
Q10 = Ja → EMERGENCY_MANAGEMENT  (Nödlägeshantering)
Q11 = Ja → PHYSICAL_PROTECTION  (Fysiskt skydd)
Q12 = Ja → MAIN_PROCESS  (Huvudprocess)
Q13 = Ja → MAINTENANCE_SUPPORT  (Drift- och underhållsstöd)
Q14 = Ja → SENSITIVE_INFORMATION  (Känslig information)
Q15 = Ja → ADMINISTRATIVE_SUPPORT  (Administrativt stöd)
```

Funktioner som redan satts manuellt av användaren behålls.

### 4.2 Primärt system (Q30)

Om fler än en funktion identifieras ställs kravet att ett primärt system ska pekas ut. Om Q30 inte besvarats med "Ja" → läggs Q30 till som blockerande oklarhet.

**Notering:** Heuristiken `functions.length > 1` frågar egentligen om det finns flera funktioner i samma system, inte om flera digitala tillgångar stöder samma funktion. Denna förenkling kan ge falskt blockerande Q30 i fall där ett system naturligt har flera funktioner.

---

## 5. Klassificeringsmotor — konsekvensbedömning per funktion

### 5.1 appliesTo-kontroll

Innan en konsekvensfråga utvärderas kontrolleras om frågan gäller den aktuella funktionstypen:

```
questionApplies(fråga, funktionstyp):
  Om frågan har appliesTo = ['ALL'] → gäller
  Om funktionstypen finns i frågan appliesTo-lista → gäller
  Annars → frågan hoppas över (behandlas som om den inte besvarats)
```

### 5.2 Prioriterad trappa (per funktion)

Varje identifierad funktion utvärderas genom en strikt prioriterad kaskad. Den **första** nivån som matchar returneras — lägre nivåer evalueras aldrig:

```
Steg 1: Gäller Q16 denna funktionstyp? Och Q16 = Ja?
         → CSL 1 (AVBRYT — resterande frågor evalueras inte)

Steg 2: Gäller Q17 denna funktionstyp och Q17 = Ja?
    ELLER gäller Q18 denna funktionstyp och Q18 = Ja?
    ELLER gäller Q19 denna funktionstyp och Q19 = Ja?
    ELLER gäller Q20 denna funktionstyp och Q20 = Ja?
         → CSL 2 (alla Q17-Q20 som träffade samlas som avgörande frågor)

Steg 3: Gäller Q21 denna funktionstyp och Q21 = Ja?
    ELLER gäller Q22 denna funktionstyp och Q22 = Ja?
         → CSL 3

Steg 4: Gäller Q23 denna funktionstyp och Q23 = Ja?
         → CSL 4

Steg 5: Gäller Q24 denna funktionstyp och Q24 = Ja?
         → CSL 5

Inget matchade → UNRESOLVED (ingen nivå kunde fastställas)
```

### 5.3 Konsekvens av appliesTo-filtrering

Tabellen nedan visar vilka konsekvensfrågor som evalueras per funktionstyp:

| Funktionstyp           | Q16 | Q17 | Q18 | Q19 | Q20 | Q21 | Q22 | Q23 | Q24 | Möjliga nivåer          |
| ---------------------- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | ----------------------- |
| SAFETY_OPERATION       |  ✓  |  ✓  |     |     |  ✓  |     |     |     |     | CSL 1, 2, UNRESOLVED    |
| EMERGENCY_MANAGEMENT   |  ✓  |     |  ✓  |     |     |     |     |     |     | CSL 1, 2, UNRESOLVED    |
| PHYSICAL_PROTECTION    |     |     |     |  ✓  |     |     |     |     |     | CSL 2, UNRESOLVED       |
| MAIN_PROCESS           |  ✓  |  ✓  |     |     |  ✓  |  ✓  |  ✓  |     |     | CSL 1, 2, 3, UNRESOLVED |
| MAINTENANCE_SUPPORT    |     |     |     |     |     |  ✓  |  ✓  |  ✓  |     | CSL 3, 4, UNRESOLVED    |
| SENSITIVE_INFORMATION  |     |     |     |     |     |     |     |  ✓  |  ✓  | CSL 4, 5, UNRESOLVED    |
| ADMINISTRATIVE_SUPPORT |     |     |     |     |     |  ✓  |     |  ✓  |  ✓  | CSL 3, 4, 5, UNRESOLVED |
| OTHER                  |  ✓  |     |     |     |     |     |     |  ✓  |  ✓  | CSL 1, 4, 5, UNRESOLVED |

**Viktig konsekvens:** En funktionstyp kan aldrig nå en nivå som inte har en tillämplig fråga. Exempelvis:

- PHYSICAL_PROTECTION kan bara bli CSL 2 eller UNRESOLVED
- SENSITIVE_INFORMATION kan bara bli CSL 4, CSL 5 eller UNRESOLVED
- SAFETY_OPERATION kan inte bli CSL 3, 4 eller 5 — saknar tillämpliga frågor för dessa nivåer

---

## 6. Systemnivå — aggregering

### 6.1 Mest stringent nivå

Systemnivån sätts till den mest stringenta (lägst siffra) bland alla funktioners kandidatnivåer:

```
Prioritetsordning: CSL 1 > CSL 2 > CSL 3 > CSL 4 > CSL 5 > UNRESOLVED

Funktioner med UNRESOLVED ignoreras vid aggregering.
Om alla funktioner är UNRESOLVED → systemnivå = UNRESOLVED.
```

**Exempel:**

- Säker drift → CSL 2, Administrativt stöd → CSL 5 ⇒ Systemnivå = CSL 2
- Fysiskt skydd → CSL 2, Nödlägeshantering → CSL 2 ⇒ Systemnivå = CSL 2
- Drift- och underhållsstöd → CSL 3, Känslig information → CSL 4 ⇒ Systemnivå = CSL 3

### 6.2 IAEA-grund

Enligt IAEA NSS 17-T ska systemnivån motsvara den högsta skyddsnivå som någon av systemets funktioner kräver.

---

## 7. Blockeringsmekanismen

### 7.1 Vilka frågor blockerar

Frågor markerade med `blocking: true` i frågebanken:

**Från SCOPE:** Q01, Q02, Q03, Q04, Q07, Q08
**Från CONSEQUENCE:** Q16, Q17, Q18, Q19, Q20
**Från CONTEXT:** Q30, Q31

### 7.2 Hur blockering aktiveras

1. Alla blockerande frågor identifieras via frågemetadata
2. För varje blockerande fråga: om svaret = `UNCLEAR` → läggs frågan till som blockerande oklarhet
3. Om primärt system krävs (fler än 1 funktion) och Q30 inte besvarats med `Ja` → Q30 läggs till
4. Om minst en blockerande oklarhet finns:
   - Status = `PRELIMINARY_BLOCKED`
   - `highestLevelNotRuledOut` = CSL 1 (konservativt)
   - Klassificeringen kan inte fastställas som slutlig

### 7.3 Status-bestämning

```
Om blockerande oklarheter finns
  → PRELIMINARY_BLOCKED

Annars om systemnivå = UNRESOLVED (inga konsekvensfrågor besvarade med Ja)
  → PRELIMINARY

Annars (systemnivå fastställd, inga blockeringar)
  → FINAL
```

### 7.4 Intervall vid blockering

Vid `PRELIMINARY_BLOCKED` anges:

- **Lägsta motiverade nivå** (`minimumJustifiedLevel`) = den nivå som fastställts av besvarade frågor
- **Högsta ej uteslutbar nivå** (`highestLevelNotRuledOut`) = CSL 1 (alltid vid blockering — konservativt antagande)

---

## 8. Specialregler

### 8.1 Manuell granskning (Q32)

Om Q32 = "Ja" eller "Vet inte än":

- `manualReviewRequired` sätts till `true`
- En banner visas i appen
- Inkluderas i rapport och beslutskedja
- **Blockerar INTE** slutlig status (Q32 är inte blockerande)
- Avsedd att fånga fall där regelmotorn kan underskatta nivån

### 8.2 Analog fallback (Q28)

Om Q28 = "Ja":

- En notering inkluderas i rapporten
- Nivån sänks **aldrig** automatiskt
- Enligt IAEA kan analog fallback i vissa fall tala för en mindre stringent nivå, men verktyget delegerar detta till manuell motivering

### 8.3 Scope-sammanblandning (Q31)

Om Q31 = "Vet inte än":

- Blockerar slutlig status
- Innebär att systemet potentiellt bör delas upp innan klassning fastställs

---

## 9. Wizardsteg och beräkningstrigger

### 9.1 Steg-struktur

| Steg | Namn                      | Visar                                         | Komplett när                         |
| :--: | ------------------------- | --------------------------------------------- | ------------------------------------ |
|  0   | Grundfakta                | Systemnamn, beskrivning, anläggning, bedömare | Namn, anläggning och bedömare ifyllt |
|  1   | Avgränsning och beroenden | SCOPE-frågor (Q01–Q08)                        | Alla 8 SCOPE-frågor besvarade        |
|  2   | Funktioner                | FUNCTION-frågor (Q09–Q15)                     | Minst 1 funktionsfråga besvarad      |
|  3   | Konsekvensfrågor          | CONSEQUENCE-frågor (Q16–Q24)                  | Minst 1 konsekvensfråga besvarad     |
|  4   | Kontext och komplettering | CONTEXT-frågor (Q25–Q32)                      | Minst 1 kontextfråga besvarad        |
|  5   | Oklarheter                | Utredningspunkter för UNCLEAR-svar            | Alltid tillgängligt                  |
|  6   | Resultat                  | Klassificeringsresultat, beslutskedja, export | Resultat beräknat                    |

### 9.2 Beräkningstrigger

Klassificeringsmotorn körs varje gång användaren navigerar till steg 6 (Resultat). Oavsett om det sker genom "Nästa"-knappen, direkt stegklick eller "Föregående → Nästa" — navigering till steg 6 triggar alltid en fullständig omberäkning.

### 9.3 Utredningspunkter (steg 5)

Varje fråga besvarad med "Vet inte än" genererar en utredningspunkt med:

- Frågetext
- Om frågan blockerar slutlig status
- Utredningsledtråd (från `investigationHint`)
- Vilka roller som kan besvara frågan (från `whoCanAnswer`)

---

## 10. Fullständig bedömningskedja — exempel

**Scenario:** System stöder Säker drift (Q09=Ja) och Administrativt stöd (Q15=Ja). Q17=Ja, Q24=Ja.

```
1. Funktionsidentifiering
   Q09 = Ja → SAFETY_OPERATION skapas
   Q15 = Ja → ADMINISTRATIVE_SUPPORT skapas

2. Konsekvensbedömning: SAFETY_OPERATION
   Q16: appliesTo inkluderar SAFETY_OPERATION → evalueras → ej Ja → fortsätt
   Q17: appliesTo inkluderar SAFETY_OPERATION → evalueras → Ja → CSL 2
   (Q18-Q24 evalueras inte — kaskaden avbröt vid Q17)
   Resultat: CSL 2, avgörande fråga: Q17

3. Konsekvensbedömning: ADMINISTRATIVE_SUPPORT
   Q16: appliesTo inkluderar INTE ADMINISTRATIVE_SUPPORT → hoppas över
   Q17: appliesTo inkluderar INTE ADMINISTRATIVE_SUPPORT → hoppas över
   Q18: appliesTo inkluderar INTE ADMINISTRATIVE_SUPPORT → hoppas över
   Q19: appliesTo inkluderar INTE ADMINISTRATIVE_SUPPORT → hoppas över
   Q20: appliesTo inkluderar INTE ADMINISTRATIVE_SUPPORT → hoppas över
   Q21: appliesTo inkluderar ADMINISTRATIVE_SUPPORT → evalueras → ej Ja → fortsätt
   Q22: appliesTo inkluderar INTE ADMINISTRATIVE_SUPPORT → hoppas över
   Q23: appliesTo inkluderar ADMINISTRATIVE_SUPPORT → evalueras → ej Ja → fortsätt
   Q24: appliesTo inkluderar ADMINISTRATIVE_SUPPORT → evalueras → Ja → CSL 5
   Resultat: CSL 5, avgörande fråga: Q24

4. Systemnivå
   SAFETY_OPERATION → CSL 2
   ADMINISTRATIVE_SUPPORT → CSL 5
   Mest stringent = CSL 2
   Systemnivå = CSL 2

5. Blockeringskontroll
   Inga blockerande frågor med UNCLEAR
   2 funktioner → requiresPrimarySystemSelection = true
   Q30 ej besvarad med Ja → Q30 läggs till som blockerande
   Status = PRELIMINARY_BLOCKED

6. Resultat
   Systemnivå: CSL 2 (preliminär)
   Lägsta motiverade: CSL 2
   Högsta ej uteslutbar: CSL 1
   Blockerande: Q30
```

---

## 11. Kända begränsningar och designval

### 11.1 appliesTo-luckor i konsekvensvägar

Vissa funktionstyper har begränsade konsekvensvägar:

- **PHYSICAL_PROTECTION** kan bara nå CSL 2 (via Q19) eller UNRESOLVED. Har ingen väg till CSL 1, 3, 4 eller 5.
- **EMERGENCY_MANAGEMENT** kan nå CSL 1 (via Q16) eller CSL 2 (via Q18) eller UNRESOLVED. Har ingen väg till CSL 3, 4 eller 5.
- **SAFETY_OPERATION** kan nå CSL 1 (via Q16) eller CSL 2 (via Q17/Q20) eller UNRESOLVED. Har ingen väg till CSL 3, 4 eller 5.

**Konsekvens:** Om exempelvis en fysisk skyddsfunktion inte uppfyller CSL 2-kriteriet (Q19=Nej) blir den UNRESOLVED — den kan inte bli CSL 3, 4 eller 5.

### 11.2 Primärt system-heuristik

`requiresPrimarySystemSelection` returnerar `true` om fler än 1 funktion identifierats. Frågan (Q30) handlar egentligen om huruvida flera digitala tillgångar stöder samma funktion, inte om ett system har flera funktioner. Heuristiken kan ge falskt blockerande Q30.

### 11.3 highestLevelNotRuledOut vid blockering

Vid valfri blockering sätts `highestLevelNotRuledOut = CSL 1` oavsett vilka frågor som blockerar. En mer nyanserad beräkning skulle kunna analysera vilken nivå den blockerande frågan maximalt kan nå.

### 11.4 Globala konsekvenssvar

Alla konsekvensfrågor besvaras globalt — samma svar gäller alla funktioner. Om Q17=Ja gäller det alla funktioner vars `appliesTo` inkluderar Q17 (dvs. SAFETY_OPERATION och MAIN_PROCESS). Det finns inget gränssnitt för att ge funktionsspecifika konsekvenssvar, även om den underliggande mekanismen stöder det.

### 11.5 Kontextfrågor påverkar inte nivå

Q25–Q29 samlar information (skyddsbehov, fallback, redundans) men påverkar inte CSL-nivån direkt. De ger kontext för manuell granskning och rapportering.

---

## 12. Sammanfattning av beslutslogik

```
Steg 1: Användaren besvarar Q01–Q08 (avgränsning)
                    ↓
Steg 2: Användaren besvarar Q09–Q15 (funktionsidentifiering)
        Ja-svar → skapar funktioner
                    ↓
Steg 3: Användaren besvarar Q16–Q24 (konsekvensbedömning)
                    ↓
Steg 4: Användaren besvarar Q25–Q32 (kontext)
                    ↓
Steg 5: Navigering till Resultat triggar beräkning
                    ↓
    ┌─ Per funktion:
    │   Kaskad Q16→Q17-Q20→Q21-Q22→Q23→Q24
    │   (med appliesTo-filter per funktionstyp)
    │   → kandidatnivå per funktion
    └─
                    ↓
    Systemnivå = mest stringenta kandidatnivån
                    ↓
    Blockeringskontroll:
    Blockerande frågor med UNCLEAR → PRELIMINARY_BLOCKED
    Inga blockeringar + systemnivå fastställd → FINAL
    Inga blockeringar + systemnivå UNRESOLVED → PRELIMINARY
                    ↓
    Specialkontroller:
    Q32 = Ja/Oklart → flagga för specialistgranskning
    Q28 = Ja → notera analog fallback (sänker aldrig nivå)
    Q30 + fler funktioner + ej bekräftat → blockerar
```
