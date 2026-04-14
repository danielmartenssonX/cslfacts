import { execSync } from 'node:child_process';

execSync('npx vitest run tests/smoke --reporter=basic', { stdio: 'inherit' });
