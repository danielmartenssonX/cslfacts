/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './tests/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        csl: {
          primary: '#0f4c5c',
          surface: '#ffffff',
          background: '#f0f4f5',
          danger: '#c0392b',
          warning: '#d4740a',
          success: '#27774e',
          info: '#2563eb',
          muted: '#6b7280',
        },
      },
      boxShadow: {
        panel: '0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.10)',
      },
      maxWidth: {
        content: '1680px',
      },
    },
  },
  plugins: [],
};
