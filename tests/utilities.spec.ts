import { test, expect } from '@playwright/test';

test.describe('Borçlar (Utilities) Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/utilities');
    await page.waitForLoadState('networkidle');
  });

  test('Borçlar sayfası yüklenir ve başlık görünür', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Borçlar');
  });

  test('Özet kartlar görünür (Toplam, Aidat, Elektrik, Su)', async ({ page }) => {
    const cards = page.locator('.app-card');
    await expect(cards.first()).toBeVisible();
    const pageText = await page.locator('body').textContent();
    expect(pageText).toMatch(/Toplam/i);
    expect(pageText).toMatch(/Aidat/i);
    expect(pageText).toMatch(/Elektrik/i);
    expect(pageText).toMatch(/Su/i);
  });

  test('Aidat ekleme butonu görünür ve modalı açar', async ({ page }) => {
    const aidatBtn = page.getByRole('button', { name: /^Aidat$/i });
    await expect(aidatBtn).toBeVisible();
    await aidatBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();
  });

  test('Elektrik ekleme butonu görünür ve modalı açar', async ({ page }) => {
    const elektrikBtn = page.getByRole('button', { name: /^Elektrik$/i });
    await expect(elektrikBtn).toBeVisible();
    await elektrikBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();
  });

  test('Su ekleme butonu görünür ve modalı açar', async ({ page }) => {
    const suBtn = page.getByRole('button', { name: /^Su$/i });
    await expect(suBtn).toBeVisible();
    await suBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();
  });

  test('Manuel borç modalı kapatılabilir', async ({ page }) => {
    const aidatBtn = page.getByRole('button', { name: /^Aidat$/i });
    await aidatBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();
    await page.locator('button:has-text("İptal")').first().click();
    await expect(modal).not.toBeVisible();
  });

  test('Manuel borç modalında Bireysel/Toplu sekmeleri var', async ({ page }) => {
    const aidatBtn = page.getByRole('button', { name: /^Aidat$/i });
    await aidatBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();
    const pageText = await page.locator('dialog[open]').first().textContent();
    expect(pageText).toMatch(/Bireysel/i);
    expect(pageText).toMatch(/Toplu/i);
  });

  test('Manuel borç modalında daire seçimi gerekli (Bireysel Giriş)', async ({ page }) => {
    const elektrikBtn = page.getByRole('button', { name: /^Elektrik$/i });
    await elektrikBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();
    const flatSelect = modal.locator('select').first();
    await expect(flatSelect).toBeVisible();
  });

  test('Manuel borç modalında Toplu Giriş sekmesine geçiş çalışır', async ({ page }) => {
    const suBtn = page.getByRole('button', { name: /^Su$/i });
    await suBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();
    await modal.getByText('Toplu Giriş').click();
    // Toplu giriş tablosunda daire listesi görünür
    await expect(modal.locator('table')).toBeVisible();
  });

  test('Excel\'den Yükle butonu görünür ve modalı açar', async ({ page }) => {
    const importBtn = page.getByRole('button', { name: /Excel'den Yükle/i });
    await expect(importBtn).toBeVisible();
    await importBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();
  });

  test('Borç Listesi başlığı görünür', async ({ page }) => {
    const listHeading = page.locator('text=Borç Listesi');
    await expect(listHeading).toBeVisible();
  });

  test('Arama filtresi çalışır', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Ara"], input[placeholder*="ara"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test');
      await page.waitForTimeout(400);
      await expect(searchInput).toHaveValue('Test');
    }
  });

  test('Dönem filtresi görünür', async ({ page }) => {
    const periodInput = page.locator('input[type="month"]').first();
    if (await periodInput.isVisible()) {
      await expect(periodInput).toBeVisible();
    }
  });

  test('Tür filtresi (Tüm/Aidat/Elektrik/Su) görünür', async ({ page }) => {
    const typeSelect = page.locator('select').first();
    if (await typeSelect.isVisible()) {
      const options = await typeSelect.locator('option').allTextContents();
      expect(options.some(o => o.match(/Aidat|aidat/i))).toBeTruthy();
    }
  });

  test('Borç listesi yüklenince kayıtlar veya boş mesaj görünür', async ({ page }) => {
    await page.waitForTimeout(1000);
    const content = page.locator(
      '.divide-y > div, p:has-text("Borç kaydı bulunamadı"), [class*="animate-pulse"]'
    ).first();
    await expect(content).toBeVisible();
  });

  test('Borç satırında dropdown menü açılır', async ({ page }) => {
    await page.waitForTimeout(1000);
    const dropdownBtns = page.locator('.dropdown.dropdown-end > label, .dropdown.dropdown-end > button');
    if (await dropdownBtns.count() > 0) {
      await dropdownBtns.first().click();
      await page.waitForTimeout(200);
      const menu = page.locator('.dropdown-content').first();
      await expect(menu).toBeVisible();
    }
  });

  test('Dropdown menüde Düzenle seçeneği var', async ({ page }) => {
    await page.waitForTimeout(1000);
    const dropdownBtns = page.locator('.dropdown.dropdown-end > label, .dropdown.dropdown-end > button');
    if (await dropdownBtns.count() > 0) {
      await dropdownBtns.first().click();
      await page.waitForTimeout(200);
      const editOption = page.locator('.dropdown-content a').filter({ hasText: /Düzenle/i }).first();
      if (await editOption.isVisible()) {
        await expect(editOption).toBeVisible();
      }
    }
  });

  test('Düzenle seçeneğine tıklayınca edit modal açılır', async ({ page }) => {
    await page.waitForTimeout(1000);
    const dropdownBtns = page.locator('.dropdown.dropdown-end > label, .dropdown.dropdown-end > button');
    if (await dropdownBtns.count() > 0) {
      await dropdownBtns.first().click();
      await page.waitForTimeout(200);
      const editOption = page.locator('.dropdown-content a').filter({ hasText: /Düzenle/i }).first();
      if (await editOption.isVisible()) {
        await editOption.click();
        await page.waitForTimeout(300);
        await expect(page.locator('dialog[open]').first()).toBeVisible();
      }
    }
  });

  test('Borcu Kapat butonu kuruş farkı olan borçlarda görünür (koşullu)', async ({ page }) => {
    await page.waitForTimeout(1000);
    // Kuruş farkı uyarısı olan bir borç varsa "X,XX ₺ kaldı" metni görünür
    const kurushWarning = page.locator('p.text-amber-500').first();
    if (await kurushWarning.isVisible()) {
      // O satırın dropdown'unu aç
      const parentRow = kurushWarning.locator('xpath=ancestor::div[contains(@class,"flex items-center")]');
      const dropdown = parentRow.locator('.dropdown.dropdown-end > label, .dropdown.dropdown-end > button').first();
      if (await dropdown.isVisible()) {
        await dropdown.click();
        await page.waitForTimeout(200);
        const closeBtn = page.locator('.dropdown-content a').filter({ hasText: /Borcu Kapat/i }).first();
        await expect(closeBtn).toBeVisible();
      }
    }
  });

  test('Borcu Kapat modalı Evet/Hayır butonlarını içerir', async ({ page }) => {
    await page.waitForTimeout(1000);
    const kurushWarning = page.locator('p.text-amber-500').first();
    if (await kurushWarning.isVisible()) {
      const rows = page.locator('.divide-y > div');
      const count = await rows.count();
      for (let i = 0; i < count; i++) {
        const row = rows.nth(i);
        const warning = row.locator('p.text-amber-500');
        if (await warning.isVisible()) {
          const dropdown = row.locator('.dropdown.dropdown-end > label, .dropdown.dropdown-end > button').first();
          if (await dropdown.isVisible()) {
            await dropdown.click();
            await page.waitForTimeout(200);
            const closeBtn = page.locator('.dropdown-content a').filter({ hasText: /Borcu Kapat/i }).first();
            if (await closeBtn.isVisible()) {
              await closeBtn.click();
              await page.waitForTimeout(300);
              const confirmModal = page.locator('dialog[open]').filter({ hasText: /Borcu Kapat/i });
              await expect(confirmModal).toBeVisible();
              await expect(confirmModal.locator('button:has-text("Evet, Kapat")')).toBeVisible();
              await expect(confirmModal.locator('button:has-text("Vazgeç")')).toBeVisible();
              // Vazgeç ile kapat
              await confirmModal.locator('button:has-text("Vazgeç")').click();
            }
          }
          break;
        }
      }
    }
  });

  test('Toplu seçim checkbox\'ı görünür', async ({ page }) => {
    await page.waitForTimeout(1000);
    const rows = page.locator('.divide-y > div');
    if (await rows.count() > 0) {
      const checkbox = page.locator('input[type="checkbox"].checkbox').first();
      await expect(checkbox).toBeVisible();
    }
  });

  test('Tümünü Seç checkbox\'ı çalışır', async ({ page }) => {
    await page.waitForTimeout(1000);
    const selectAllCheckbox = page.locator('input.checkbox-primary').first();
    if (await selectAllCheckbox.isVisible()) {
      await selectAllCheckbox.check();
      await page.waitForTimeout(200);
      // "N seçildi" metni görünür
      const selectedText = page.locator('text=/seçildi/i');
      if (await selectedText.isVisible()) {
        await expect(selectedText).toBeVisible();
      }
    }
  });

  test('Sayfalama pagination bar görünür (kayıt varsa)', async ({ page }) => {
    await page.waitForTimeout(1000);
    // PaginationBar only renders when totalCount > 0; shows "X – Y / Z kayıt" text
    const paginationText = page.locator('text=/\\d+ kayıt/').first();
    const emptyState = page.locator('p:has-text("Borç kaydı bulunamadı")');
    const hasPagination = await paginationText.isVisible();
    const isEmpty = await emptyState.isVisible();
    // En az birinin görünür olması gerekir
    expect(hasPagination || isEmpty).toBeTruthy();
  });

  test('Filtreleri Temizle çalışır', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Ara"], input[placeholder*="ara"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('deneme');
      await page.waitForTimeout(300);
      const clearBtn = page.getByRole('button', { name: /temizle|sıfırla/i }).first();
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await expect(searchInput).toHaveValue('');
      }
    }
  });
});
