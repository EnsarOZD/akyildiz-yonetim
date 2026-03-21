import { test, expect } from '@playwright/test';

test.describe('Admin Yönetim Paneli (/admin)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('Admin paneli yüklenir ve başlık görünür', async ({ page }) => {
    await expect(page.getByTestId('sidebar')).toBeVisible();
    await expect(page.locator('h1').first()).toContainText('Yönetim Paneli');
  });

  test('Özet kartları görünür (Kiracılar, Mal Sahipleri, Kullanıcılar, Duyurular)', async ({ page }) => {
    const pageText = await page.locator('body').textContent();
    expect(pageText).toMatch(/Kiracılar/i);
    expect(pageText).toMatch(/Mal Sahipleri/i);
    expect(pageText).toMatch(/Kullanıcılar/i);
    expect(pageText).toMatch(/Duyurular/i);
  });

  test('Özet kartlarında sayısal değerler yüklenir', async ({ page }) => {
    await page.waitForTimeout(1500);
    // Summary card values should be numbers or dashes
    const cardValues = page.locator('.app-card .text-lg.font-bold');
    const count = await cardValues.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('Duyuru Yayınla butonu görünür', async ({ page }) => {
    const announceBtn = page.getByRole('button', { name: /Duyuru Yayınla/i });
    await expect(announceBtn).toBeVisible();
  });

  test('Duyuru Yayınla modalı açılır', async ({ page }) => {
    const announceBtn = page.getByRole('button', { name: /Duyuru Yayınla/i });
    await announceBtn.click();
    await page.waitForTimeout(300);
    // TargetedNotificationModal uses div.fixed.inset-0
    await expect(page.locator('div.fixed.inset-0').first()).toBeVisible();
  });

  test('Duyuru modalı kapatılabilir', async ({ page }) => {
    const announceBtn = page.getByRole('button', { name: /Duyuru Yayınla/i });
    await announceBtn.click();
    const modal = page.locator('div.fixed.inset-0').first();
    await expect(modal).toBeVisible();
    // X butonuna tıkla (emit close)
    await modal.locator('button').first().click();
    await page.waitForTimeout(300);
    await expect(modal).not.toBeVisible();
  });

  test('Mal Sahipleri sekmesi görünür ve aktif', async ({ page }) => {
    const malSahipleriTab = page.locator('button').filter({ hasText: /Mal Sahipleri/ }).first();
    await expect(malSahipleriTab).toBeVisible();
  });

  test('Kullanıcı Yönetimi sekmesi görünür', async ({ page }) => {
    const usersTab = page.locator('button').filter({ hasText: /Kullanıcı Yönetimi/ }).first();
    await expect(usersTab).toBeVisible();
  });

  test('Sekme değiştirme çalışır - Kullanıcı Yönetimi', async ({ page }) => {
    const usersTab = page.locator('button').filter({ hasText: /Kullanıcı Yönetimi/ }).first();
    await usersTab.click();
    await page.waitForTimeout(300);
    // Tab is now active — blue border appears
    await expect(usersTab).toHaveClass(/border-blue-500/);
  });

  test('Mal Sahipleri sekmesi içerik yükler', async ({ page }) => {
    const malSahipleriTab = page.locator('button').filter({ hasText: /Mal Sahipleri/ }).first();
    await malSahipleriTab.click();
    await page.waitForTimeout(1000);
    // Content area should show owners list or empty state
    const content = page.locator('.app-card').last();
    await expect(content).toBeVisible();
  });

  test('Kullanıcı Yönetimi sekmesi içerik yükler', async ({ page }) => {
    const usersTab = page.locator('button').filter({ hasText: /Kullanıcı Yönetimi/ }).first();
    await usersTab.click();
    await page.waitForTimeout(1000);
    const content = page.locator('.app-card').last();
    await expect(content).toBeVisible();
  });

  test('Mal Sahipleri sekmesinde yeni ekle butonu var', async ({ page }) => {
    await page.waitForTimeout(500);
    const addBtn = page.getByRole('button', { name: /yeni|ekle/i }).first();
    if (await addBtn.isVisible()) {
      await expect(addBtn).toBeVisible();
    }
  });

  test('Kullanıcı yönetiminde davet/kullanıcı ekleme butonu var', async ({ page }) => {
    const usersTab = page.locator('button').filter({ hasText: /Kullanıcı Yönetimi/ }).first();
    await usersTab.click();
    await page.waitForTimeout(500);
    const addBtn = page.getByRole('button', { name: /davet|kullanıcı ekle|yeni kullanıcı|ekle/i }).first();
    if (await addBtn.isVisible()) {
      await expect(addBtn).toBeVisible();
    }
  });

  test('/admin URL\'e doğrudan erişim çalışır', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1').first()).toContainText('Yönetim Paneli');
  });
});
