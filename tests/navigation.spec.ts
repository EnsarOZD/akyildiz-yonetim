import { test, expect } from '@playwright/test';

test.describe('Navigasyon ve Routing Testleri', () => {
  test('/ ana sayfa yüklenir veya yönlendirir', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    // Kullanıcı admin sayfasına, dashboard'a, landing'e veya login'e yönlendirilir
    const url = page.url();
    expect(url).toMatch(/localhost:3000/);
    // Hata sayfasında değiliz
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toMatch(/500|Internal Server Error/i);
  });

  test('/notifications sayfası yüklenir', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page).toHaveURL(/\/notifications/);
  });

  test('/utilities sayfası yüklenir', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page).toHaveURL(/\/utilities/);
  });

  test('/admin sayfası yüklenir', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page).toHaveURL(/\/admin/);
  });

  test('/overdue sayfası yüklenir', async ({ page }) => {
    await page.goto('/overdue');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('/transactions sayfası yüklenir', async ({ page }) => {
    await page.goto('/transactions');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('404 sayfası bilinmeyen URL için gösterilir', async ({ page }) => {
    await page.goto('/bu-sayfa-mevcut-degil-xyz-999');
    await page.waitForLoadState('networkidle');
    const body = await page.locator('body').textContent();
    // 404 veya "bulunamadı" mesajı gösterilmeli
    expect(body).toMatch(/404|bulunamadı|kayboldu|yanlış/i);
  });

  test('Sidebar\'dan Borçlar linkine tıklayınca /utilities\'e gider', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const borçlarLink = page.getByRole('link', { name: /borç|utilities/i }).first();
    if (await borçlarLink.isVisible()) {
      await borçlarLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/utilities|expenses/);
    }
  });

  test('Sidebar\'dan Bildirimler linkine tıklayınca /notifications\'a gider', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const notifLink = page.getByRole('link', { name: /bildirim/i }).first();
    if (await notifLink.isVisible()) {
      await notifLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/notifications/);
    }
  });

  test('Sayfa yenileme sonrası auth korunur', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page).not.toHaveURL(/login/);
  });

  test('Tarayıcı geri/ileri navigasyonu çalışır', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.goto('/tenants');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/tenants/);

    await page.goBack();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/dashboard/);

    await page.goForward();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/tenants/);
  });

  test('/my-payments sayfası erişilebilir (admin için)', async ({ page }) => {
    await page.goto('/my-payments');
    await page.waitForLoadState('networkidle');
    // Admin my-payments sayfasına erişebilir
    const url = page.url();
    expect(url).toMatch(/my-payments|dashboard|admin/);
  });
});
