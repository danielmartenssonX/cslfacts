import '@testing-library/jest-dom/vitest';

beforeEach(() => {
  const store = new Map();
  window.storage = {
    async get(key) {
      if (!store.has(key)) {
        throw new Error(`Key not found: ${key}`);
      }
      return { key, value: structuredClone(store.get(key)), shared: false };
    },
    async set(key, value) {
      store.set(key, structuredClone(value));
      return { key, value, shared: false };
    },
    async delete(key) {
      store.delete(key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix) {
      const keys = [...store.keys()].filter((k) => (prefix ? k.startsWith(prefix) : true));
      return { keys, shared: false };
    },
  };
});
