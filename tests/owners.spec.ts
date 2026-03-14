import { test, expect } from '@playwright/test';

test.describe('Mal Sahipleri Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/owners');
    await page.waitForLoadState('networkidle');
  });

  test('Mal sahipleri sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.locator('table, .table').first()).toBeVisible();
  });

  test('Yeni mal sahibi ekleme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Yeni mal sahibi modalı açılır ve kapatılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();

    const cancelBtn = page.getByRole('button', { name: /iptal|kapat|vazgeç/i }).first();
    await cancelBtn.click();
    await expect(page.locator('.modal.modal-open').first()).not.toBeVisible();
  });

  test('Mal sahibi form zorunlu alanları kontrol edilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();

    const submitBtn = page.getByRole('button', { name: /kaydet|ekle/i }).last();
    await submitBtn.click();
    // Form validation - modal hala açık olmalı
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();
  });

  test('Mal sahibi listesi görünür', async ({ page }) => {
    const tableOrList = page.locator('table, .table, .card').first();
    await expect(tableOrList).toBeVisible();
  });

  test('Mal sahibi düzenleme modalı açılır', async ({ page }) => {
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    if (count > 0) {
      const editBtn = rows.first().locator('button').first();
      if (await editBtn.isVisible()) {
        await editBtn.click();
        await page.waitForTimeout(300);
        await expect(page.locator('.modal.modal-open').first()).toBeVisible();
      }
    }
  });
});
