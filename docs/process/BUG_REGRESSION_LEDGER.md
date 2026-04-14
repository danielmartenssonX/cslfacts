# BUG_REGRESSION_LEDGER

Syftet med detta dokument är att säkerställa att varje funnen bug:

1. dokumenteras,
2. får en verifierad rotorsaksanalys,
3. åtgärdas spårbart,
4. följs av minst ett permanent regressionstest,
5. inte återintroduceras utan att upptäckas.

## Klassificering

### Severity

| Nivå        | Betydelse                            |
| ----------- | ------------------------------------ |
| Blockerande | Hindrar användning av verktyget      |
| Allvarlig   | Felaktigt resultat eller dataförlust |
| Medel       | Funktionsfel utan dataförlust        |
| Låg         | Kosmetiskt eller marginellt          |

### Kategori

| Kategori   | Exempel                             |
| ---------- | ----------------------------------- |
| Domänlogik | Felaktig beräkning, felaktig status |
| UI         | Rendereringsfel, trasig layout      |
| State      | Race condition, inkonsistent state  |
| Storage    | Persistensfel, korrupt data         |
| Export     | Felaktig output                     |
| A11y       | Tillgänglighetsfel                  |
| Config     | Bygg-/lint-/testfel                 |

## Status

| Status          | Betydelse                         |
| --------------- | --------------------------------- |
| Öppen           | Registrerad, ej åtgärdad          |
| Under utredning | Rotorsak söks                     |
| Fixad           | Fix implementerad, ej verifierad  |
| Verifierad      | Fix bekräftad med regressionstest |
| Stängd          | Helt klar                         |

## Obligatoriska fält per bug

- ID
- Datum
- Severity
- Kategori
- Symptom
- Reproduktion
- Rotorsak
- Fix
- Regressionstest (filnamn + testnamn)
- Verifieringsresultat
- Status

## Mall

```
### BUG-NNN: Kort titel

- Datum:
- Severity:
- Kategori:
- Status:

**Symptom:**

**Reproduktion:**

**Rotorsak:**

**Fix:**

**Regressionstest:**

**Verifiering:**
```

---

## Registrerade buggar

_Inga buggar registrerade ännu._

---

## Praktisk arbetsregel för Claude Code

Vid varje hittad bug ska Claude Code omedelbart:

1. lägga in bugen i detta dokument,
2. klassificera den,
3. beskriva reproduktion,
4. göra rotorsaksanalys,
5. genomföra fix,
6. lägga till permanent regressionstest,
7. köra verifiering,
8. uppdatera status,
9. stänga bugen först när allt ovan är klart.

Detta är obligatoriskt arbetssätt, inte rekommendation.
