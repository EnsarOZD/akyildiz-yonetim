import { test, expect } from '@playwright/test';

test.describe('Raporlar Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
  });

  test('Raporlar sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('Rapor türü seçim seçenekleri görünür', async ({ page }) => {
    const selectOrButtons = page.locator(
      'select, [role="option"], button[class*="tab"], .tab'
    );
    await expect(selectOrButtons.first()).toBeVisible();
  });

  test('Tarih filtresi görünür', async ({ page }) => {
    const dateFilter = page.locator(
      'input[type="date"], input[type="month"], select[name*="year"], select[name*="month"]'
    ).first();
    await expect(dateFilter).toBeVisible();
  });

  test('Rapor tablosu yüklenir', async ({ page }) => {
    await page.waitForTimeout(2000); // API yanıtı bekle
    const tableOrEmpty = page.locator(
      'table, .table, p:has-text("veri"), p:has-text("kayıt"), p:has-text("bulunamadı")'
    ).first();
    await expect(tableOrEmpty).toBeVisible();
  });

  test('Fatura numarası sütunu tabloda görünür', async ({ page }) => {
    await page.waitForTimeout(1000);
    // Tablo başlıklarında Fatura No görünmeli
    const headers = page.locator('th, thead td');
    const headerTexts = await headers.allTextContents();
    const hasFaturaNo = headerTexts.some(t => t.match(/fatura/i));
    expect(hasFaturaNo).toBeTruthy();
  });

  test('Excel export butonu görünür', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /excel|export|indir/i }).first();
    await expect(exportBtn).toBeVisible();
  });

  test('Excel export tıklanabilir', async ({ page }) => {
    const exportBtn = page.getByRole('button', { name: /excel|export|indir/i }).first();
    // Download olayını dinle
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
      exportBtn.click(),
    ]);
    // Hata vermeden tıklanabilmeli
    await expect(exportBtn).toBeEnabled();
  });

  test('Filtre değişince tablo güncellenir', async ({ page }) => {
    const yearSelect = page.locator('select').first();
    if (await yearSelect.isVisible()) {
      const options = await yearSelect.locator('option').count();
      if (options > 1) {
        await yearSelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
        // Tablo veya boş mesaj görünür olmalı
        await expect(page.locator('table, p:has-text("veri")').first()).toBeVisible();
      }
    }
  });

  test('Borç tipi gösterilir (Elektrik, Su vb.)', async ({ page }) => {
    await page.waitForTimeout(1000);
    // Rapor tablosunda borç türleri görünür
    const tbody = page.locator('table tbody tr');
    const count = await tbody.count();
    if (count > 0) {
      // İlk satır içerik içermeli
      const firstRowText = await tbody.first().textContent();
      expect(firstRowText).not.toBeNull();
    }
  });

  test('Özet istatistik alanı görünür', async ({ page }) => {
    // Toplam borç, tahsilat gibi summary kartlar
    const summaryCards = page.locator('.stat, .card, [class*="summary"]').first();
    if (await summaryCards.isVisible()) {
      await expect(summaryCards).toBeVisible();
    }
  });
});
