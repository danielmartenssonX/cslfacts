interface StorageResult {
  key: string;
  value: unknown;
  shared: boolean;
}

interface StorageDeleteResult {
  key: string;
  deleted: boolean;
  shared: boolean;
}

interface StorageListResult {
  keys: string[];
  shared: boolean;
}

interface StorageAPI {
  get(key: string, shared?: boolean): Promise<StorageResult>;
  set(key: string, value: unknown, shared?: boolean): Promise<StorageResult>;
  delete(key: string, shared?: boolean): Promise<StorageDeleteResult>;
  list(prefix?: string, shared?: boolean): Promise<StorageListResult>;
}

interface Window {
  storage: StorageAPI;
}

declare module 'jest-axe' {
  export function axe(html: Element | string): Promise<any>;
  export const toHaveNoViolations: Record<string, any>;
}
