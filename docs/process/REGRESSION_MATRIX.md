# REGRESSION_MATRIX

## Regler

### Full regression krävs alltid vid ändring i:

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

### Riktad regression + smoke kan räcka vid:

- isolerad komponent utan global påverkan
- lokal styling utan semantisk effekt
- mikrocopy utan logikpåverkan

## Regressionsytor per område

| Område              | Min regression             | Full regression krävs | Kommentar                            |
| ------------------- | -------------------------- | --------------------- | ------------------------------------ |
| Datamodell          | Unit + integration + smoke | Ja                    | Alla härledda beroenden kan påverkas |
| deriveState         | Unit + integration + smoke | Ja                    | Kritisk domänlogik                   |
| Reducer/actions     | Unit + integration + smoke | Ja                    | Global statepåverkan                 |
| Storage             | Unit + integration + smoke | Ja                    | Persistens och konsistens            |
| Export              | Unit + integration + smoke | Ja                    | Formellt underlag                    |
| Shared UI component | Component + a11y + smoke   | Ibland                | Full regression om global användning |
| Styling endast      | Build + smoke              | Nej, normalt inte     | Bara om ingen semantisk påverkan     |

_Fler områden läggs till när funktionell spec definierar domänsteg._

## Smoke suite

Följande måste alltid passera efter varje ändring:

1. Appen renderar.
2. Sekretessvarning visas.
3. Grundflöde fungerar.
4. Spara och återladda fungerar.
5. Inga kritiska console errors.
6. Inga blockerande a11y-fel i huvudflödet.

## Kritiska permanenta regressionsfall

Varje gång en bug hittas i något av dessa områden ska ett permanent regressionstest läggas till:

- deriveState
- villkorslogik
- härledda statusar
- lifecycle
- readonly protection
- export
- storage
