/**
 * PDF-export via webbläsarens print-to-PDF.
 * Ingen extern PDF-generator behövs — användaren använder Ctrl+P / Cmd+P.
 */
export function triggerPrintToPdf(): void {
  window.print();
}
