import { test, expect } from '@playwright/test';

test.describe('Daireler/Ofisler Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/flats');
    await page.waitForLoadState('networkidle');
  });

  test('Daireler sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    // Tablo, grid veya kartlar görünür olmalı
    await expect(page.locator('table, .table, .grid, .card').first()).toBeVisible();
  });

  test('Yeni daire ekleme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle|daire/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Yeni daire modalı açılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();
  });

  test('Yeni daire modalı kapatılabilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('.modal.modal-open').first();
    await expect(modal).toBeVisible();

    const cancelBtn = page.getByRole('button', { name: /iptal|kapat|vazgeç/i }).first();
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Daire listesi kat/numara bilgisi içerir', async ({ page }) => {
    const content = page.locator('table, .table, .grid').first();
    await expect(content).toBeVisible();
    // Kat veya numara başlığı
    const headers = page.locator('th, .font-bold, [class*="header"]');
    const headerTexts = await headers.allTextContents();
    const hasKatOrNumara = headerTexts.some(t =>
      t.match(/kat|numara|daire|no/i)
    );
    expect(hasKatOrNumara).toBeTruthy();
  });

  test('Daire düzenleme modalı açılır', async ({ page }) => {
    const editBtns = page.locator('button[title*="düzenle"], button[aria-label*="edit"]');
    if (await editBtns.count() > 0) {
      await editBtns.first().click();
      await page.waitForTimeout(300);
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });
});
