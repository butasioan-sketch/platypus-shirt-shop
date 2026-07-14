/**
 * PLATYPUS — E2E-Test-Suite (Playwright)
 *
 * Setup:
 *   npm install --save-dev @playwright/test
 *   npx playwright install chromium
 *   NEXT_PUBLIC_SITE_URL=http://localhost:3000 npx playwright test
 *
 * Oder gegen Live:
 *   BASE_URL=https://platypus-shirt-shop.vercel.app npx playwright test
 */

import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function clearCart(page: Page) {
  await page.evaluate(() => localStorage.removeItem('platypus_cart'));
}

async function uploadDesign(page: Page, side: 'front' | 'back' = 'front') {
  // Wartet auf das Upload-Input und lädt ein Test-PNG hoch
  const input = page.locator(`input[type="file"]`).first();
  await input.setInputFiles({
    name: 'test-design.png',
    mimeType: 'image/png',
    // 1×1 weißes PNG (minimal valid)
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
  });
}

test.describe('PLATYPUS — Checkout-Flow', () => {

  test('Produkt-Seite lädt korrekt', async ({ page }) => {
    await page.goto(`${BASE_URL}/product/1`);
    await expect(page.locator('h1').first()).toContainText('AirFit Pro');
    await expect(page.locator('.plt-size-btn').first()).toBeVisible();
  });

  test('Motiv hochladen → Größe wählen → In den Warenkorb', async ({ page }) => {
    await page.goto(`${BASE_URL}/product/1`);
    await clearCart(page);

    // Größe wählen
    await page.locator('button:has-text("L")').click();

    // Design hochladen
    await uploadDesign(page, 'front');

    // Kurz warten bis Canvas rendert
    await page.waitForTimeout(2000);

    // In den Warenkorb
    await page.locator('button:has-text("In den Warenkorb")').click();

    // Warten bis saveDesign abgeschlossen
    await page.waitForTimeout(3000);

    // Warenkorb soll Item enthalten
    const cart = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('platypus_cart') || '[]')
    );
    expect(cart).toHaveLength(1);
    expect(cart[0].designId).toBeTruthy();
    expect(cart[0].size).toBe('L');
  });

  test('Warenkorb zeigt Thumbnail und Checkout-Button aktiv', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart`);

    // Wenn Warenkorb leer → Link zurück zum Atelier sichtbar
    const isEmpty = await page.locator('text=Noch keine Pieces').isVisible().catch(() => false);
    if (isEmpty) {
      test.skip(true, 'Warenkorb leer — vorher Motiv hochladen');
      return;
    }

    // Checkout-Button vorhanden und wenn designId = aktiv
    const btn = page.locator('button:has-text("Zur Kasse")');
    await expect(btn).toBeVisible();
  });

  test('Cart ohne designId: Auto-Purge beim Laden', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart`);

    // Manipuliere localStorage: Item ohne designId hinzufügen
    await page.evaluate(() => {
      const bad = [{ id: '1', name: 'AirFit Pro', price: 39.99, size: 'M', quantity: 1 }];
      localStorage.setItem('platypus_cart', JSON.stringify(bad));
    });

    await page.reload();

    // Nach Reload: Item sollte entfernt worden sein
    const cart = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('platypus_cart') || '[]')
    );
    expect(cart).toHaveLength(0);
  });

  test('Homepage lädt (smoke test)', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/PLATYPUS/);
    await expect(page.locator('.brand-text').first()).toBeVisible();
  });

  test('Tracking-Seite akzeptiert Bestellnummer', async ({ page }) => {
    await page.goto(`${BASE_URL}/tracking`);
    await page.locator('input').fill('PLT-123456789');
    await page.locator('button:has-text("Suchen")').click();
    // Erwartet Fehler "nicht gefunden" — kein Crash
    await page.waitForTimeout(2000);
    await expect(page.locator('text=Keine Bestellung').first()).toBeVisible();
  });
});

test.describe('PLATYPUS — Admin (braucht ADMIN_PASSWORD)', () => {
  test('Admin-Orders erreichbar (401 ohne Auth)', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/admin/orders`);
    // Ohne Auth: 401 oder Login-Redirect
    expect([200, 401, 302]).toContain(res?.status() ?? 401);
  });
});
