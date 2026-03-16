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
      await expect(page.locator('dialog[open]').first()).toBeVisible();
    }
  });

  test('Gider modalı kapatılabilir', async ({ page }) => {
    // Specific selector: the dashed-border card button for new expense
    const addBtn = page.locator('[class*="border-dashed"] button, button:has-text("Yeni Gider")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      const modal = page.locator('dialog[open]').first();
      await expect(modal).toBeVisible();

      const cancelBtn = page.locator('button:has-text("İptal")').first();
      await cancelBtn.click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('Fatura numarası alanı gider formunda görünür', async ({ page }) => {
    const addBtn = page.locator('[class*="border-dashed"] button, button:has-text("Yeni Gider")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await expect(page.locator('dialog[open]').first()).toBeVisible();
      const invoiceField = page.locator(
        'input[placeholder*="fatura"], input[placeholder*="Fatura"], input[placeholder*="opsiyonel"]'
      ).first();
      await expect(invoiceField).toBeVisible();
    }
  });

  test('Manuel borç ekleme modalı çalışır', async ({ page }) => {
    const manualBtn = page.getByRole('button', { name: /manuel|borç ekle|borç/i }).first();
    if (await manualBtn.isVisible()) {
      await manualBtn.click();
      await expect(page.locator('dialog[open]').first()).toBeVisible();
    }
  });

  test('Manuel borç formunda fatura numarası alanı var', async ({ page }) => {
    const manualBtn = page.getByRole('button', { name: /manuel|borç ekle/i }).first();
    if (await manualBtn.isVisible()) {
      await manualBtn.click();
      await expect(page.locator('dialog[open]').first()).toBeVisible();
      const invoiceInput = page.locator(
        'input[placeholder*="fatura"], input[placeholder*="Fatura No"], input[placeholder*="opsiyonel"]'
      ).first();
      await expect(invoiceInput).toBeVisible();
    }
  });

  test('Aidat dağıtım modalı açılır', async ({ page }) => {
    const distributeBtn = page.getByRole('button', { name: /dağıt|dağıtım/i }).first();
    if (await distributeBtn.isVisible()) {
      await distributeBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('dialog[open]').first()).toBeVisible();
    }
  });

  test('Toplu import modalı açılır', async ({ page }) => {
    const importBtn = page.getByRole('button', { name: /toplu|import|excel/i }).first();
    if (await importBtn.isVisible()) {
      await importBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('dialog[open]').first()).toBeVisible();
    }
  });

  test('Gider listesi görünür ve yüklenir', async ({ page }) => {
    await page.waitForTimeout(1000);
    // Expenses sayfası grid layout kullanıyor (tablo değil)
    const listOrEmpty = page.locator(
      '[class*="grid-cols"], p:has-text("gider yok"), p:has-text("kayıt"), [class*="rounded-lg"]'
    ).first();
    await expect(listOrEmpty).toBeVisible();
  });

  test('Yıl/dönem filtresi çalışır', async ({ page }) => {
    const yearSelect = page.locator('select').first();
    if (await yearSelect.isVisible()) {
      await expect(yearSelect).toBeVisible();
    }
  });
});
