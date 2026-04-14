import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
}

declare module 'jest-axe' {
  export function axe(html: Element | string): Promise<any>;
  export const toHaveNoViolations: Record<string, any>;
}
