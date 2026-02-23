import { test, expect } from '@playwright/test';

test('baseURL debug', async ({ page }) => {
  console.log('BASE URL:', test.info().config.use?.baseURL);
  await page.goto('/');
  console.log('CURRENT URL:', page.url());
  await expect(page.url()).toContain('localhost');
});