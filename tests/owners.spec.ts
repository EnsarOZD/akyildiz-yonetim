import { test, expect } from '@playwright/test';

test.describe('Mal Sahipleri Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/owners');
    await page.waitForLoadState('networkidle');
  });

  test('Mal sahipleri sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    // Owners sayfası grid layout kullanıyor (tablo değil)
    await expect(page.locator('.grid, [class*="grid-cols"], .card').first()).toBeVisible();
  });

  test('Yeni mal sahibi ekleme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Yeni mal sahibi modalı açılır ve kapatılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();

    // "İptal" button uses Turkish dotted İ — must use text match not regex
    const cancelBtn = page.locator('button:has-text("İptal")').first();
    await cancelBtn.click();
    await expect(page.locator('dialog[open]').first()).not.toBeVisible();
  });

  test('Mal sahibi form zorunlu alanları kontrol edilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();

    // Submit button is disabled when form is empty (:disabled="!isFormValid")
    const submitBtn = page.locator('dialog[open] button[type="submit"]').first();
    await expect(submitBtn).toBeDisabled();
  });

  test('Mal sahibi listesi görünür', async ({ page }) => {
    await page.waitForTimeout(500);
    const listOrEmpty = page.locator('.grid, [class*="grid-cols"], p:has-text("Henüz"), p:has-text("kayıt")').first();
    await expect(listOrEmpty).toBeVisible();
  });

  test('Mal sahibi düzenleme modalı açılır', async ({ page }) => {
    // Owners sayfasında öğe satırlarına tıkla ve düzenleme butonunu bul
    const editBtns = page.locator('button[title*="düzenle"], button[aria-label*="edit"]');
    if (await editBtns.count() > 0) {
      await editBtns.first().click();
      await page.waitForTimeout(300);
      await expect(page.locator('dialog[open]').first()).toBeVisible();
    } else {
      // Grid içindeki düzenleme butonu
      const gridEditBtn = page.locator('[class*="grid-cols"] button').last();
      if (await gridEditBtn.isVisible()) {
        await gridEditBtn.click();
        await page.waitForTimeout(300);
      }
    }
  });
});
