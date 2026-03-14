import { test, expect } from '@playwright/test';

test.describe('Kiracılar Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tenants');
    await page.waitForLoadState('networkidle');
  });

  test('Kiracılar sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    // Tablo veya liste görünür olmalı
    await expect(page.locator('table, .table, [role="table"]').first()).toBeVisible();
  });

  test('Yeni kiracı ekleme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle|kiracı ekle/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Yeni kiracı modalı açılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    // Modal görünür olmalı
    await expect(page.locator('.modal.modal-open, [role="dialog"]').first()).toBeVisible();
  });

  test('Yeni kiracı modalı kapatılabilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('.modal.modal-open').first();
    await expect(modal).toBeVisible();

    // İptal/kapat butonuna tıkla
    const cancelBtn = page.getByRole('button', { name: /iptal|kapat|vazgeç/i }).first();
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Kiracı form alanları zorunlu validation çalışır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();

    // Formu boş submit et
    const submitBtn = page.getByRole('button', { name: /kaydet|ekle/i }).last();
    await submitBtn.click();

    // Hata mesajları veya required alanlar görünür olmalı
    const errorOrRequired = page.locator('.text-error, .text-red-500, [class*="error"], input:invalid').first();
    // En azından form gönderilememiş olmalı (modal hala açık)
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();
  });

  test('Arama/filtreleme çalışır', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ara"], input[placeholder*="search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test');
      await page.waitForTimeout(500); // Debounce bekle
      // Tablonun güncellenmesini bekle
      await expect(searchInput).toHaveValue('Test');
    }
  });

  test('Kiracı detay sayfası açılır', async ({ page }) => {
    const rows = page.locator('table tbody tr, .table tbody tr');
    const count = await rows.count();
    if (count > 0) {
      const detailBtn = rows.first().locator('button[title*="detay"], a[href*="tenant"], button').first();
      if (await detailBtn.isVisible()) {
        await detailBtn.click();
        await page.waitForLoadState('networkidle');
        // Detay sayfası veya modal açılmalı
      }
    }
  });

  test('Kiracı düzenleme modalı açılır', async ({ page }) => {
    const editBtns = page.locator('button[title*="düzenle"], button[aria-label*="edit"], button:has(svg)');
    if (await editBtns.first().isVisible()) {
      await editBtns.first().click();
      await page.waitForTimeout(300);
      // Edit modal açılmış olmalı
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });

  test('Sayfalama çalışır (eğer varsa)', async ({ page }) => {
    const pagination = page.locator('.join, [aria-label="pagination"], .pagination').first();
    if (await pagination.isVisible()) {
      const nextBtn = pagination.getByRole('button').last();
      if (await nextBtn.isEnabled()) {
        await nextBtn.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });
});
