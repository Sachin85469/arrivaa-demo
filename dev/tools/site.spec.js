const { test, expect } = require('@playwright/test');

test.describe('ARRIVA Website Comprehensive Verification', () => {
  test('core layout and interactions across viewports', async ({ page, isMobile, viewport }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => {
      consoleErrors.push(err.message);
    });

    await page.goto('http://localhost:8000/index.html');
    await page.waitForTimeout(2000);

    await expect(page).toHaveTitle(/ARRIVA/);
    const hero = page.locator('#h1');
    await expect(hero).toBeVisible();

    const canvas = page.locator('#world');
    await expect(canvas).toBeAttached();

    const noOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth;
    });
    expect(noOverflow).toBe(true);

    const waypointCards = page.locator('.topo-pin-card');
    await expect(waypointCards).toHaveCount(4);
    await waypointCards.nth(1).click();
    await expect(waypointCards.nth(1)).toHaveClass(/active/);

    await waypointCards.nth(2).focus();
    await page.keyboard.press('Enter');
    await expect(waypointCards.nth(2)).toHaveClass(/active/);

    const termBox = page.locator('#orvix-demo');
    await termBox.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const replayBtn = page.locator('#replay-term-btn');
    if (await replayBtn.isVisible()) {
      await replayBtn.click();
      const skipBtn = page.locator('#skip-term-btn');
      if (await skipBtn.isVisible()) await skipBtn.click();
      const cmd1Text = await page.locator('#term-cmd-1').textContent();
      expect(cmd1Text).not.toContain('ncnu');
      expect(cmd1Text).toContain('ollama serve');
    }

    const faqSection = page.locator('#faq');
    await faqSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const closedFaqAnswers = page.locator('.faq-item:not(.open) .faq-a');
    const closedCount = await closedFaqAnswers.count();
    for (let i = 0; i < closedCount; i++) {
      await expect(closedFaqAnswers.nth(i)).toBeHidden();
    }

    if (viewport.width <= 1060) {
      const menuBtn = page.locator('#menu-btn');
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();
      const nav = page.locator('#nav');
      await expect(nav).toHaveClass(/open/);
      await expect(menuBtn).toHaveAttribute('aria-expanded', 'true');

      await page.keyboard.press('Escape');
      await expect(nav).not.toHaveClass(/open/);
      await expect(menuBtn).toHaveAttribute('aria-expanded', 'false');
    }

    expect(consoleErrors).toHaveLength(0);
  });
});
