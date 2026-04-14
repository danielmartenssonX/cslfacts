import React from 'react';
import ReactDOM from 'react-dom/client';
import CSLApp from './CSLApp.jsx';
import './index.css';

/**
 * Storage-fallback: localStorage-backad implementation som matchar STORAGE_CONTRACT.md.
 * Används när window.storage inte injiceras av en artifact-värd.
 * get() kastar vid miss, set/delete/list returnerar kontraktsformat.
 */
function installStorageFallback() {
  if (window.storage) {
    return;
  }

  const PREFIX = 'csl:store:';

  window.storage = {
    async get(key) {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) {
        throw new Error(`Key not found: ${key}`);
      }
      return { key, value: JSON.parse(raw), shared: false };
    },
    async set(key, value) {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(PREFIX + key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix) {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (fullKey && fullKey.startsWith(PREFIX)) {
          const appKey = fullKey.slice(PREFIX.length);
          if (!prefix || appKey.startsWith(prefix)) {
            keys.push(appKey);
          }
        }
      }
      return { keys, shared: false };
    },
  };
}

installStorageFallback();

ReactDOM.createRoot(/** @type {HTMLElement} */ (document.getElementById('root'))).render(
  <React.StrictMode>
    <CSLApp />
  </React.StrictMode>,
);
