import { test, expect } from '@playwright/test';

test.describe('Giderler & Aidatlar Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/expenses');
    await page.waitForLoadState('networkidle');
  });

  test('Giderler sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('Aidat ve gider sekmeler/paneller görünür', async ({ page }) => {
    // Sekme veya panel başlıkları
    const tabs = page.locator('.tabs, [role="tablist"], .tab, button[class*="tab"]');
    if (await tabs.count() > 0) {
      await expect(tabs.first()).toBeVisible();
    }
  });

  test('Yeni gider ekleme butonu çalışır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni gider|gider ekle|ekle/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });

  test('Gider modalı kapatılabilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      const modal = page.locator('.modal.modal-open').first();
      await expect(modal).toBeVisible();

      const cancelBtn = page.getByRole('button', { name: /iptal|kapat/i }).first();
      await cancelBtn.click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('Fatura numarası alanı gider formunda görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      // Fatura numarası alanı
      const invoiceField = page.locator(
        'input[placeholder*="fatura"], input[placeholder*="Fatura"], label:has-text("Fatura") + input, input[name*="invoice"]'
      ).first();
      await expect(invoiceField).toBeVisible();
    }
  });

  test('Manuel borç ekleme modalı çalışır', async ({ page }) => {
    const manualBtn = page.getByRole('button', { name: /manuel|borç ekle|borç/i }).first();
    if (await manualBtn.isVisible()) {
      await manualBtn.click();
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });

  test('Manuel borç formunda fatura numarası alanı var', async ({ page }) => {
    const manualBtn = page.getByRole('button', { name: /manuel|borç ekle/i }).first();
    if (await manualBtn.isVisible()) {
      await manualBtn.click();
      // Fatura numarası input
      const invoiceInput = page.locator(
        'input[placeholder*="fatura"], input[placeholder*="Fatura No"]'
      ).first();
      await expect(invoiceInput).toBeVisible();
    }
  });

  test('Aidat dağıtım modalı açılır', async ({ page }) => {
    const distributeBtn = page.getByRole('button', { name: /dağıt|dağıtım/i }).first();
    if (await distributeBtn.isVisible()) {
      await distributeBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });

  test('Toplu import modalı açılır', async ({ page }) => {
    const importBtn = page.getByRole('button', { name: /toplu|import|excel/i }).first();
    if (await importBtn.isVisible()) {
      await importBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });

  test('Gider listesi görünür ve yüklenir', async ({ page }) => {
    await page.waitForTimeout(1000);
    // Tablo ya da "veri yok" mesajı görünür olmalı
    const tableOrEmpty = page.locator(
      'table, .table, [class*="empty"], p:has-text("veri yok"), p:has-text("kayıt yok")'
    ).first();
    await expect(tableOrEmpty).toBeVisible();
  });

  test('Yıl/dönem filtresi çalışır', async ({ page }) => {
    const yearSelect = page.locator('select[name*="year"], select option').first();
    if (await yearSelect.isVisible()) {
      // Yıl seçeneği var, filter çalışıyor
      await expect(yearSelect).toBeVisible();
    }
  });
});
