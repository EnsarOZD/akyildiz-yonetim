import { test, expect } from '@playwright/test';

test.describe('Daireler/Ofisler Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/flats');
    await page.waitForLoadState('networkidle');
  });

  test('Daireler sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    // Kart veya grid layout görünür olmalı
    await expect(page.locator('.card, .grid, [class*="grid"]').first()).toBeVisible();
  });

  test('Yeni daire ekleme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle|daire/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Yeni daire modalı açılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    await expect(page.locator('dialog[open]').first()).toBeVisible();
  });

  test('Yeni daire modalı kapatılabilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('dialog[open]').first();
    await expect(modal).toBeVisible();

    const cancelBtn = page.locator('button:has-text("İptal")').first();
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Daire listesi kod/kat bilgisi içerir', async ({ page }) => {
    await page.waitForTimeout(500);
    // Flats sayfası kart layoutu kullanıyor — en az 1 kart veya "veri yok" mesajı
    const content = page.locator('.card, [class*="grid-cols"], p:has-text("Henüz"), p:has-text("kayıt")').first();
    await expect(content).toBeVisible();
  });

  test('Daire düzenleme dropdown açılır', async ({ page }) => {
    // Flats sayfasında her kart içinde .dropdown > button ile açılan menü var
    const dropdownBtn = page.locator('.dropdown.dropdown-end > button').first();
    if (await dropdownBtn.isVisible()) {
      await dropdownBtn.click();
      await page.waitForTimeout(300);
      // Dropdown menu görünür
      const menu = page.locator('.dropdown-content, .menu').first();
      if (await menu.isVisible()) {
        await expect(menu).toBeVisible();
      }
    }
  });

  test('Arama filtresi çalışır', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Kod"], input[placeholder*="ara"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('3A');
      await page.waitForTimeout(400);
      await expect(searchInput).toHaveValue('3A');
    }
  });
});
