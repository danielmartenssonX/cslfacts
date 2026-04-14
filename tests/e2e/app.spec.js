import { test, expect } from '@playwright/test';

test('appen laddar och visar sekretessvarning', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('secrecy-modal')).toBeVisible();
  await page.getByRole('button', { name: 'Jag förstår' }).click();
  await expect(page.getByTestId('secrecy-modal')).not.toBeVisible();
  await expect(page.getByTestId('content-region')).toBeVisible();
});
