import { test, expect } from '@playwright/test';

// Login sayfası testleri - auth state olmadan
test.describe('Login Sayfası (auth olmadan)', () => {
  // Bu test grubu için auth state'i temizle
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Login sayfası yüklenir', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('email')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('login-btn')).toBeVisible();
  });

  test('Boş form submit edilince hata veya validation gösterir', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-btn').click();
    // HTML5 validation veya custom error mesajı
    const emailInput = page.getByTestId('email');
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );
    expect(isInvalid).toBeTruthy();
  });

  test('Yanlış şifre ile giriş hata gösterir', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill('admin@email.com');
    await page.getByTestId('password').fill('yanlis_sifre_99999');
    await page.getByTestId('login-btn').click();
    await page.waitForTimeout(3000);
    // Hata mesajı görünür, login sayfasında kalmalı
    await expect(page).toHaveURL(/login/);
    const errorMsg = page.locator('.alert, .toast, .alert-error, [class*="error"]').first();
    await expect(errorMsg).toBeVisible();
  });

  test('Geçersiz email formatı HTML5 validation ile reddedilir', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('email').fill('gecersiz-email-format');
    await page.getByTestId('password').fill('password123');
    await page.getByTestId('login-btn').click();
    const emailInput = page.getByTestId('email');
    const isInvalid = await emailInput.evaluate(
      (el: HTMLInputElement) => !el.checkValidity()
    );
    expect(isInvalid).toBeTruthy();
  });

  test('Protected route kimlik doğrulamadan erişilince login sayfasına yönlendirir', async ({ page }) => {
    await page.goto('/tenants');
    await page.waitForURL(/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/login/);
  });

  test('Protected route /dashboard kimlik doğrulamadan erişilince yönlendirir', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL(/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/login/);
  });
});

// Giriş yapılmış state ile auth testleri
test.describe('Kimlik Doğrulama - Giriş Sonrası', () => {
  test('Admin olarak giriş yapılmış, dashboard erişilebilir', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page).not.toHaveURL(/login/);
  });

  test('Kullanıcı profil sayfası erişilebilir', async ({ page }) => {
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('Login sayfasına gidince dashboard\'a yönlendirir (zaten giriş yapılmışsa)', async ({ page }) => {
    await page.goto('/login');
    // Zaten auth state varsa dashboard'a yönlendirilmeli
    await page.waitForURL(/dashboard|\//, { timeout: 5000 });
    await expect(page).not.toHaveURL(/login/);
  });
});
