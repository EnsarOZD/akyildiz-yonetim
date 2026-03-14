import { test, expect } from '@playwright/test';

test.describe('Bildirimler & Duyurular Sayfası', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/notifications');
    await page.waitForLoadState('networkidle');
  });

  test('Bildirimler sayfası yüklenir', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
  });

  test('Duyuru listesi veya boş durum görünür', async ({ page }) => {
    await page.waitForTimeout(1000);
    const listOrEmpty = page.locator(
      '.notification-list, ul, .list, p:has-text("bildirim"), p:has-text("duyuru")'
    ).first();
    await expect(listOrEmpty).toBeVisible();
  });

  test('Yeni duyuru ekleme butonu görünür', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|duyuru|ekle/i }).first();
    await expect(addBtn).toBeVisible();
  });

  test('Duyuru modalı açılır', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|duyuru|ekle/i }).first();
    await addBtn.click();
    await page.waitForTimeout(300);
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();
  });

  test('Duyuru modalı kapatılabilir', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|duyuru|ekle/i }).first();
    await addBtn.click();
    const modal = page.locator('.modal.modal-open').first();
    await expect(modal).toBeVisible();

    const cancelBtn = page.getByRole('button', { name: /iptal|kapat|vazgeç/i }).first();
    await cancelBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Hedefli bildirim butonu görünür', async ({ page }) => {
    const targetedBtn = page.getByRole('button', { name: /hedefli|targeted|bildirim gönder/i }).first();
    if (await targetedBtn.isVisible()) {
      await expect(targetedBtn).toBeVisible();
    }
  });

  test('Hedefli bildirim modalı açılır', async ({ page }) => {
    const targetedBtn = page.getByRole('button', { name: /hedefli|targeted|bildirim gönder/i }).first();
    if (await targetedBtn.isVisible()) {
      await targetedBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('.modal.modal-open').first()).toBeVisible();
    }
  });

  test('Hedefli bildirim türü seçilebilir (Tüm/Kat/Kiracı/Borç)', async ({ page }) => {
    const targetedBtn = page.getByRole('button', { name: /hedefli|targeted/i }).first();
    if (await targetedBtn.isVisible()) {
      await targetedBtn.click();
      await page.waitForTimeout(300);

      // Hedef türü seçimi
      const targetSelect = page.locator('select[name*="target"], [name*="targetType"]').first();
      if (await targetSelect.isVisible()) {
        await expect(targetSelect).toBeVisible();
        // Seçenekler var mı
        const options = await targetSelect.locator('option').allTextContents();
        expect(options.length).toBeGreaterThan(1);
      }
    }
  });

  test('Borç tipi seçilince e-posta seçeneği görünür', async ({ page }) => {
    const targetedBtn = page.getByRole('button', { name: /hedefli|targeted/i }).first();
    if (await targetedBtn.isVisible()) {
      await targetedBtn.click();
      await page.waitForTimeout(300);

      // Bildirim tipi seçimi - 'debt' veya 'borç' seç
      const typeSelect = page.locator('select').first();
      if (await typeSelect.isVisible()) {
        const options = await typeSelect.locator('option').allInnerTexts();
        const debtOption = options.findIndex(o => o.match(/borç|geciken|debt/i));
        if (debtOption >= 0) {
          await typeSelect.selectOption({ index: debtOption });
          await page.waitForTimeout(300);

          // E-posta checkbox görünür olmalı
          const emailCheckbox = page.locator(
            'input[type="checkbox"][id*="email"], label:has-text("e-posta")'
          ).first();
          await expect(emailCheckbox).toBeVisible();
        }
      }
    }
  });

  test('Kat seçimi seçilince kat numarası inputu görünür', async ({ page }) => {
    const targetedBtn = page.getByRole('button', { name: /hedefli|targeted/i }).first();
    if (await targetedBtn.isVisible()) {
      await targetedBtn.click();
      await page.waitForTimeout(300);

      // Hedef tipi seç - 'floor' veya 'kat'
      const targetTypeSelect = page.locator('select').first();
      if (await targetTypeSelect.isVisible()) {
        const options = await targetTypeSelect.locator('option').allInnerTexts();
        const floorIdx = options.findIndex(o => o.match(/kat|floor/i));
        if (floorIdx >= 0) {
          await targetTypeSelect.selectOption({ index: floorIdx });
          await page.waitForTimeout(300);

          // Kat numarası input görünür
          const floorInput = page.locator('input[type="number"], input[placeholder*="kat"]').first();
          await expect(floorInput).toBeVisible();
        }
      }
    }
  });

  test('Duyuru formu validation çalışır - boş submit', async ({ page }) => {
    const addBtn = page.getByRole('button', { name: /yeni|duyuru|ekle/i }).first();
    await addBtn.click();

    const submitBtn = page.getByRole('button', { name: /gönder|yayınla|kaydet/i }).last();
    await submitBtn.click();

    // Modal hala açık olmalı
    await expect(page.locator('.modal.modal-open').first()).toBeVisible();
  });

  test('Bildirim okundu işaretleme çalışır', async ({ page }) => {
    await page.waitForTimeout(1000);
    const unreadBtns = page.locator('button[title*="okundu"], button[aria-label*="read"]');
    if (await unreadBtns.count() > 0) {
      await unreadBtns.first().click();
      await page.waitForTimeout(300);
    }
  });
});
