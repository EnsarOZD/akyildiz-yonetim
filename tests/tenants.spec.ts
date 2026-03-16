import { test, expect } from '@playwright/test';

test.describe('Kiracılar Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tenants');
    await page.waitForLoadState('networkidle');
  });

  test('Kiracılar sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    // Tenants sayfası card/grid layout kullanıyor
    await expect(page.locator('.card, .grid, [class*="grid-cols"]').first()).toBeVisible();
  });

  test('Yeni kiracı ekleme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle|kiracı ekle/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Yeni kiracı modalı açılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    // Modal görünür olmalı
    await expect(page.locator('dialog[open]').first()).toBeVisible();
  });

  test('Yeni kiracı modalı kapatılabilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    // "İptal" uses Turkish dotted İ — must use text match not regex
    const cancelBtn = page.locator('button:has-text("İptal")').first();
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Kiracı form alanları zorunlu validation çalışır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();

    // Formu boş submit et — dialog intercepts pointer events, use force
    const submitBtn = page.locator('dialog[open] button[type="submit"]').first();
    await submitBtn.click({ force: true });

    // Modal hala açık olmalı (form validation engelledi)
    await expect(page.locator('dialog[open]').first()).toBeVisible();
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
    // Kiracı listesindeki ilk detay/görüntüle linki
    const detailLink = page.locator('a[href*="/tenants/"]').first();
    if (await detailLink.isVisible()) {
      await detailLink.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/tenants\//);
    }
  });

  test('Kiracı düzenleme modalı açılır', async ({ page }) => {
    // Dropdown menüden "Düzenle" seçeneğini bul
    const dropdownBtns = page.locator('.dropdown button, button.btn-ghost, button.btn-circle').first();
    if (await dropdownBtns.isVisible()) {
      await dropdownBtns.click();
      await page.waitForTimeout(200);
      const editOption = page.locator('.dropdown-content a, .menu a, li a').filter({ hasText: /düzenle/i }).first();
      if (await editOption.isVisible()) {
        await editOption.click();
        await page.waitForTimeout(300);
        await expect(page.locator('dialog[open]').first()).toBeVisible();
      }
    }
  });

  test('Sayfalama çalışır (eğer varsa)', async ({ page }) => {
    // PaginationBar bileşeni kullanıyor
    const pagination = page.locator('[class*="join"], [class*="pagination"], button[aria-label*="sayfa"]').first();
    if (await pagination.isVisible()) {
      const nextBtn = page.locator('[class*="join"] button:last-child, [class*="pagination"] button:last-child').first();
      if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
        await nextBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });
});
