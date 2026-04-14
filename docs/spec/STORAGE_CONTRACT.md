# STORAGE_CONTRACT

## Syfte

Detta dokument definierar kontraktet för `window.storage` i artifact-läge och motsvarande mock i lokal utveckling och test.

## Artifact-API (produktion)

I artifact-miljön exponerar `window.storage` följande asynkrona metoder:

```js
await window.storage.get(key, shared?)         // → { key, value, shared } | kastar vid miss
await window.storage.set(key, value, shared?)  // → { key, value, shared }
await window.storage.delete(key, shared?)      // → { key, deleted, shared }
await window.storage.list(prefix?, shared?)    // → { keys, shared }
```

### Viktiga beteenden

- `get(key)` kastar fel om nyckeln inte finns — returnerar **inte** null
- `set(key, value)` returnerar `{ key, value, shared }` vid lyckad skrivning
- `delete(key)` returnerar `{ key, deleted: true, shared }`
- `list(prefix?)` returnerar `{ keys: string[] }`
- Alla metoder returnerar promises
- `shared`-parametern styr om data delas mellan användare; CSL-verktyget använder `shared = false` (default)
- Nycklar: max 200 tecken, inga mellanslag, snedstreck eller citationstecken
- Värden: max 5 MB per nyckel, text/JSON

### Skillnader mot vanliga key-value-stores

- **Inget `clear()`** — rensa genom att lista nycklar och radera en i taget
- **Inget `keys()`** — använd `list(prefix?)`
- **`get()` kastar vid miss** — använd try/catch, inte null-check

## Lagringsnycklar

| Nyckel      | Innehåll                                                  |
| ----------- | --------------------------------------------------------- |
| `csl-index` | JSON-array: `{ id, title, status, version, updatedAt }[]` |
| `csl:{id}`  | JSON-objekt: fullständigt CSL-dokument                    |

_Fler nycklar definieras när funktionell spec anger domänmodell._

## Lokala lägen

### Dev-läge (src/main.jsx)

Om `window.storage` saknas installeras en localStorage-backad fallback med `csl:store:`-prefix.

### Test-läge (vitest.setup.js)

Deterministisk mock baserad på Map med `structuredClone`. Rensas mellan tester.

## Förbjudet

- `localStorage` (utom i dev-fallback i main.jsx)
- `sessionStorage`
- cookies
- extern synk
