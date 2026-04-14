import { execSync } from 'node:child_process';

const steps = [
  { label: 'Format check', cmd: 'npm run format:check' },
  { label: 'Lint', cmd: 'npm run lint' },
  { label: 'Type check', cmd: 'npm run typecheck' },
  { label: 'Build', cmd: 'npm run build' },
  { label: 'Forbidden API check', cmd: 'npm run check:forbidden' },
  { label: 'Test coverage', cmd: 'npm run test:coverage' },
  { label: 'E2E tests', cmd: 'npm run test:e2e' },
];

for (const { label, cmd } of steps) {
  console.log(`\n── ${label} ──`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    console.error(`\nFEL: "${label}" misslyckades.`);
    process.exit(1);
  }
}

console.log('\nAlla verifieringssteg passerade.');
