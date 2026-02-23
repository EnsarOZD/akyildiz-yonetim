import { test, expect } from '@playwright/test';

test('dashboard açılıyor mu', async ({ page }) => {
    await page.goto('/dashboard'); // senin manager route’un
    await expect(page.getByTestId('sidebar')).toBeVisible();
});

test('tenants sayfası açılıyor mu', async ({ page }) => {
    await page.goto('/tenants');
    await expect(page.getByTestId('sidebar')).toBeVisible();
});

test('expenses sayfası açılıyor mu', async ({ page }) => {
    await page.goto('/expenses');
    await expect(page.getByTestId('sidebar')).toBeVisible();
});
