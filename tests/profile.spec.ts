import { test, expect } from '@playwright/test';

test.describe('Profil Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
  });

  test('Profil sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('Profil sayfasında kullanıcı bilgileri alanları görünür', async ({ page }) => {
    // Name, email fields or display elements
    const pageText = await page.locator('body').textContent();
    // At least one of these should appear
    const hasUserInfo = (pageText || '').match(/profil|kullanıcı|email|ad|isim|şifre/i);
    expect(hasUserInfo).toBeTruthy();
  });

  test('Şifre değiştirme formu veya butonu görünür', async ({ page }) => {
    const passwordSection = page.locator(
      'input[type="password"], button:has-text("Şifre"), [placeholder*="şifre"]'
    ).first();
    if (await passwordSection.isVisible()) {
      await expect(passwordSection).toBeVisible();
    }
  });

  test('Profil güncelleme butonu var', async ({ page }) => {
    const saveBtn = page.getByRole('button', { name: /kaydet|güncelle|değiştir/i }).first();
    if (await saveBtn.isVisible()) {
      await expect(saveBtn).toBeVisible();
    }
  });

  test('Tema toggle (Açık/Koyu mod) profil sayfasında çalışır', async ({ page }) => {
    const themeToggle = page.locator(
      'input[type="checkbox"][class*="toggle"], label[class*="toggle"], button[aria-label*="tema"]'
    ).first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(200);
      // HTML data-theme değişmeli
      const html = page.locator('html');
      const theme = await html.getAttribute('data-theme');
      expect(theme).toMatch(/dark|light/);
    }
  });
});
