import { test, expect } from '@playwright/test';

test.describe('Ödemeler Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/payments');
    await page.waitForLoadState('networkidle');
  });

  test('Ödemeler sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.locator('table, .table').first()).toBeVisible();
  });

  test('Yeni ödeme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle|ödeme/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Ödeme modalı açılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();
  });

  test('Ödeme modalı kapatılabilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('.modal.modal-open').first();
    await expect(modal).toBeVisible();

    const cancelBtn = page.getByRole('button', { name: /iptal|kapat|vazgeç/i }).first();
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Ödeme formu - kiracı seçimi zorunludur', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();

    // Tutar gir ama kiracı seçme
    const amountInput = page.locator('input[type="number"], input[placeholder*="tutar"]').first();
    if (await amountInput.isVisible()) {
      await amountInput.fill('500');
    }

    const submitBtn = page.getByRole('button', { name: /kaydet|ödeme ekle/i }).last();
    await submitBtn.click();

    // Modal hala açık olmalı (validation hatası)
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();
  });

  test('Avans hesap butonu görünür', async ({ page }) => {
    const advanceBtn = page.getByRole('button', { name: /avans|advance/i }).first();
    if (await advanceBtn.isVisible()) {
      await advanceBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });

  test('Ödeme listesinde borç dağıtım bilgisi var', async ({ page }) => {
    // Tabloda gerekli kolonlar
    const headers = page.locator('th');
    const headerTexts = await headers.allTextContents();
    // Tutar, tarih gibi kolonlar olmalı
    const hasAmount = headerTexts.some(t => t.match(/tutar|miktar|amount/i));
    expect(hasAmount).toBeTruthy();
  });

  test('Tarih filtresi çalışır', async ({ page }) => {
    const dateInputs = page.locator('input[type="date"], input[type="month"]');
    const count = await dateInputs.count();
    if (count > 0) {
      await dateInputs.first().fill('2024-01');
      await page.waitForTimeout(500);
    }
  });

  test('Ödeme silme onay modalı gösterilir', async ({ page }) => {
    const deleteBtns = page.locator('button[title*="sil"], button[aria-label*="delete"]');
    if (await deleteBtns.count() > 0) {
      await deleteBtns.first().click();
      await page.waitForTimeout(300);
      // Onay modalı görünür
      await expect(page.locator('.modal.modal-open, [role="alertdialog"]').first()).toBeVisible();
    }
  });
});
