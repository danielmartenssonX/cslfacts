import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const forbidden = [
  { pattern: /\bfetch\s*\(/, label: 'fetch()' },
  { pattern: /\bXMLHttpRequest\b/, label: 'XMLHttpRequest' },
  { pattern: /\bWebSocket\b/, label: 'WebSocket' },
  { pattern: /\blocalStorage\b/, label: 'localStorage' },
  { pattern: /\bsessionStorage\b/, label: 'sessionStorage' },
  { pattern: /\bdocument\.cookie\b/, label: 'document.cookie' },
  { pattern: /googletag|gtag\(/, label: 'analytics' },
  { pattern: /fonts\.googleapis\.com|fonts\.gstatic\.com/, label: 'externa fonter' },
];

/** @param {string} dir */
function collectFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      return collectFiles(full);
    }
    return ['.js', '.jsx', '.ts', '.tsx', '.css', '.html'].includes(extname(full)) ? [full] : [];
  });
}

const files = collectFiles(root);
const hits = [];

for (const file of files) {
  // Hoppa över main.jsx – den innehåller storage-fallback som använder localStorage
  if (file.endsWith('main.jsx')) {
    continue;
  }
  const content = readFileSync(file, 'utf8');
  for (const rule of forbidden) {
    if (rule.pattern.test(content)) {
      hits.push(`${file}: förbjudet API eller källa: ${rule.label}`);
    }
  }
}

if (hits.length > 0) {
  console.error('Förbjudna API:er eller externa källor hittades:\n');
  for (const hit of hits) {
    console.error(`  - ${hit}`);
  }
  process.exit(1);
}

console.log('OK: inga förbjudna API:er eller externa källor hittades i src/.');
