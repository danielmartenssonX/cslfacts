# ARTIFACT_RUNTIME_ASSUMPTIONS

## Syfte

Detta dokument skiljer mellan lokal repo-miljö och avsedd artifact-miljö.

## Avsedd artifact-miljö

- React finns tillgängligt
- artifact-lagring finns via `window.storage`
- externa nätverksanrop är förbjudna
- applikationslogiken levereras som en sammanhållen artifact-komponent

## Lokal repo-miljö

- Vite används för lokal utveckling och test
- `src/main.jsx` och `src/index.css` är en lokal dev-harness
- om `window.storage` saknas installeras en lokal fallback i minnet
- testverktyg körs utanför artifact-miljön men måste respektera samma produktionsregler

## Bibliotek i repoet

- React
- Tailwind CSS
- Lucide React
- Vitest
- Playwright

## Viktig regel

Lokal repo-miljö får inte användas som ursäkt för att bryta produktionskraven i artifactet.
