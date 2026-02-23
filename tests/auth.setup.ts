import { test as setup, expect } from '@playwright/test';

const email = process.env.E2E_EMAIL || 'admin@email.com';
const password = process.env.E2E_PASSWORD || 'admin1234';

setup('authenticate', async ({ page }) => {
    await page.goto('/login');

    await page.getByTestId('email').fill(email);
    await page.getByTestId('password').fill(password);
    await page.getByTestId('login-btn').click();

    await expect(page.getByTestId('sidebar')).toBeVisible();

    await page.context().storageState({ path: 'playwright/.auth/state.json' });
});
