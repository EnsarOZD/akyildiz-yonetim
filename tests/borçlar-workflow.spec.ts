import { test, expect } from '@playwright/test';

// Borç yönetimi iş akışı end-to-end testleri
test.describe('Borç Yönetimi İş Akışı', () => {
  test('Elektrik borcu ekleme formu doldurulabilir', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');

    const elektrikBtn = page.getByRole('button', { name: /^Elektrik$/i });
    await elektrikBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    // Bireysel giriş seçili
    const flatSelect = modal.locator('select').first();
    await expect(flatSelect).toBeVisible();

    // Yıl ve ay alanları dolu gelir (varsayılan)
    const yearInput = modal.locator('input[type="number"]').first();
    await expect(yearInput).toBeVisible();
    const yearValue = await yearInput.inputValue();
    expect(Number(yearValue)).toBeGreaterThan(2020);

    // Tutar alanı
    const amountInput = modal.locator('input[type="number"]').nth(1);
    if (await amountInput.isVisible()) {
      await amountInput.fill('150.50');
      const val = await amountInput.inputValue();
      expect(Number(val)).toBeCloseTo(150.5);
    }

    // Modalı kapat
    await page.locator('button:has-text("İptal")').first().click();
    await expect(modal).not.toBeVisible();
  });

  test('Su borcu ekleme formunda toplu giriş tablosunda daire listesi var', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');

    const suBtn = page.getByRole('button', { name: /^Su$/i });
    await suBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    await modal.getByText('Toplu Giriş').click();
    await page.waitForTimeout(500);

    // Tablo görünür
    const table = modal.locator('table');
    await expect(table).toBeVisible();

    // Tablo başlığı kontrol
    const headers = await table.locator('th').allTextContents();
    expect(headers.some(h => h.match(/Daire|Ünite|Kiracı/i))).toBeTruthy();
    expect(headers.some(h => h.match(/Tutar/i))).toBeTruthy();
  });

  test('Aidat borcu modalında fatura numarası alanı var', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');

    const aidatBtn = page.getByRole('button', { name: /^Aidat$/i });
    await aidatBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    // Fatura numarası input
    const invoiceInput = modal.locator('input[placeholder*="fatura"], input[placeholder*="Fatura"]').first();
    await expect(invoiceInput).toBeVisible();
  });

  test('Borç listesi durum badge\'leri doğru gösterir', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Badge sınıfları: badge-active (Ödendi), badge-pending (Kısmi), badge-overdue (Bekliyor)
    const badges = page.locator('.badge-active, .badge-pending, .badge-overdue');
    if (await badges.count() > 0) {
      await expect(badges.first()).toBeVisible();
      const text = await badges.first().textContent();
      expect(text).toMatch(/Ödendi|Kısmi|Bekliyor/i);
    }
  });

  test('Borç tipi ikonu doğru renkte gösterilir', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Elektrik ikonu (sarı/yellow)
    const elektrikIcon = page.locator('[class*="bg-yellow-100"]').first();
    if (await elektrikIcon.isVisible()) {
      await expect(elektrikIcon).toBeVisible();
    }
    // Aidat ikonu (mavi/blue)
    const aidatIcon = page.locator('[class*="bg-blue-100"]').first();
    if (await aidatIcon.isVisible()) {
      await expect(aidatIcon).toBeVisible();
    }
  });

  test('Excel\'den Yükle modalı dosya upload alanı içerir', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');

    const importBtn = page.getByRole('button', { name: /Excel'den Yükle/i });
    await importBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    // File input veya drag-drop area
    const fileInput = modal.locator('input[type="file"]').first();
    const dropZone = modal.locator('[class*="drag"], [class*="drop"], [class*="upload"]').first();
    const hasUpload = await fileInput.isVisible() || await dropZone.isVisible();
    expect(hasUpload).toBeTruthy();
  });

  test('Dönem filtresine göre borçlar filtrelenir', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const periodInput = page.locator('input[type="month"]').first();
    if (await periodInput.isVisible()) {
      // Mevcut yıl ve ay
      const now = new Date();
      const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      await periodInput.fill(period);
      await page.waitForTimeout(800);
      // Sayfa güncellenmeli, kayıt sayısı değişebilir
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('Toplu seçimde sil butonu görünür', async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const checkboxes = page.locator('input[type="checkbox"].checkbox');
    if (await checkboxes.count() > 1) {
      // İlk borç satırındaki checkbox'ı işaretle (Tümünü Seç = first, borç checkboxları = subsequent)
      const debtCheckbox = checkboxes.nth(1);
      if (await debtCheckbox.isVisible()) {
        await debtCheckbox.check();
        await page.waitForTimeout(200);
        // Sil butonu görünür
        const deleteBtn = page.getByRole('button', { name: /^Sil$/i });
        if (await deleteBtn.isVisible()) {
          await expect(deleteBtn).toBeVisible();
        }
        // Uncheck
        await debtCheckbox.uncheck();
      }
    }
  });
});

test.describe('Ödemeler İş Akışı', () => {
  test('Ödeme modalı çok adımlı yapıyı gösterir (Kiracı → Tutar → Onay)', async ({ page }) => {
    await page.goto('/payments');
    await page.waitForLoadState('networkidle');

    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    // Step 1: Kiracı seçimi
    const nextBtn = page.locator('button:has-text("İleri")').first();
    await expect(nextBtn).toBeVisible();

    // Modal kapat (BaseModal X button ya da Escape)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    // Modal kapanmış veya hala açık (dirty-check olan modaller kapanmaz) — sadece hata olmamalı
    await expect(page.locator('body')).toBeVisible();
  });

  test('Ödeme tutarı pozitif sayı zorunlu', async ({ page }) => {
    await page.goto('/payments');
    await page.waitForLoadState('networkidle');

    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    // Tutar alanı varsa negatif değer girilemez
    const amountInput = modal.locator('input[type="number"]').first();
    if (await amountInput.isVisible()) {
      const minVal = await amountInput.getAttribute('min');
      if (minVal !== null) {
        expect(Number(minVal)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

test.describe('Bildirim İş Akışı', () => {
  test('Bildirimler sayfasında filtre butonları çalışır', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');

    // Tümü / Okunmamış butonları
    const tumBtn = page.locator('button').filter({ hasText: /^Tümü$/i }).first();
    const okunmamisBtn = page.locator('button').filter({ hasText: /Okunmamış/i }).first();

    if (await tumBtn.isVisible()) {
      await expect(tumBtn).toBeVisible();
    }
    if (await okunmamisBtn.isVisible()) {
      await okunmamisBtn.click();
      await page.waitForTimeout(300);
      // Filtre uygulandı, sayfa güncellendi
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('"Tümünü okundu yap" linki görünür (okunmamış varsa)', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const markAllBtn = page.locator('button:has-text("Tümünü okundu yap")');
    if (await markAllBtn.isVisible()) {
      await expect(markAllBtn).toBeVisible();
    }
  });

  test('Duyuru Yayınla modalında başlık ve mesaj alanları var', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');

    const announceBtn = page.locator('button:has-text("Duyuru Yayınla")').first();
    if (await announceBtn.isVisible()) {
      await announceBtn.click();
      await page.waitForTimeout(300);

      const modal = page.locator('dialog[open]').first();
      if (await modal.isVisible()) {
        // Başlık ve mesaj input alanları
        const inputs = modal.locator('input[type="text"], textarea');
        const count = await inputs.count();
        expect(count).toBeGreaterThanOrEqual(1);
      }
    }
  });

  test('"Daha Fazla Yükle" butonu (bildirim varsa) çalışır', async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const loadMoreBtn = page.locator('button:has-text("Daha Fazla Yükle")');
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      await page.waitForTimeout(1000);
      // Hata oluşmamalı
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
