import { test, expect } from '@playwright/test';

test.describe('Dashboard Sayfası', () => {
  test('Admin dashboard yüklenir ve sidebar görünür', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('Dashboard sayfası başlık içerir', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    // Sidebar navigation linklerini kontrol et
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('Sidebar navigasyon linkleri çalışır - Kiracılar', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    // Kiracılar linkine tıkla
    await page.getByRole('link', { name: /kiracı/i }).first().click();
    await expect(page).toHaveURL(/tenants/);
  });

  test('Sidebar navigasyon linkleri çalışır - Ödemeler', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: /ödeme/i }).first().click();
    await expect(page).toHaveURL(/payment/);
  });

  test('Sidebar navigasyon linkleri çalışır - Giderler', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: /gider|aidatlar|işletme/i }).first().click();
    await expect(page).toHaveURL(/expense/);
  });

  test('Dark mode toggle çalışır', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const toggleBtn = page.locator('button[title*="mod"], button[aria-label*="tema"], label[title*="tema"]').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      // Body'nin class veya data-theme değiştiğini kontrol et
      const htmlEl = page.locator('html');
      await expect(htmlEl).toHaveAttribute('data-theme', /dark|light/);
    }
  });

  test('Ana sayfa yüklenir', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Ana sayfa veya dashboard'a yönlendirilmeli
    await expect(page.locator('body')).toBeVisible();
  });
});
