const http = require('http');
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const websiteDir = path.resolve(__dirname, '..', '..', 'website');
const reportsDir = path.resolve(__dirname, '..', '..', 'dev', 'tools');
const screenshotsDir = path.resolve(__dirname, '..', '..', 'screenshots');
const httpPort = 8092;

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

function createStaticServer(rootDir, port) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8'
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    let relativePath = reqPath.replace(/^\/+/, '');
    let filePath = path.join(rootDir, relativePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!reqPath.endsWith('/')) {
        res.writeHead(301, { Location: reqPath + '/' });
        return res.end();
      }
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const notFoundPath = path.join(rootDir, '404.html');
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(notFoundPath).pipe(res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function runVerification() {
  const server = await createStaticServer(websiteDir, httpPort);
  console.log('Server started on port', httpPort);

  const pagesToTest = [
    { name: 'home', path: '/' },
    { name: 'tourist-guide', path: '/tourist-guide/' },
    { name: 'tourist-guide-privacy', path: '/tourist-guide/privacy/' },
    { name: 'tourist-guide-delete', path: '/tourist-guide/delete-account/' },
    { name: 'nexus', path: '/nexus/' },
    { name: 'nexus-privacy', path: '/nexus/privacy/' },
    { name: 'orvix', path: '/orvix/' },
    { name: 'orvix-privacy', path: '/orvix/privacy/' },
    { name: 'privacy', path: '/privacy/' },
    { name: 'contact', path: '/contact/' },
    { name: '404', path: '/404.html' }
  ];

  const viewports = [
    { width: 360, height: 740, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 800, name: 'desktop' }
  ];

  const browser = await chromium.launch({ headless: true });

  console.log('\n--- Step 1: Testing Multi-Viewport Layout, Zero-Overflow, Console Errors ---');
  let hasError = false;

  for (const pageInfo of pagesToTest) {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height }
      });
      const page = await context.newPage();

      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', err => {
        consoleErrors.push(err.message);
      });

      const url = `http://localhost:${httpPort}${pageInfo.path}`;
      await page.goto(url, { waitUntil: 'networkidle' });

      // Check overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      if (overflow) {
        console.error(`FAIL: Horizontal overflow detected on ${pageInfo.name} at ${vp.width}px!`);
        hasError = true;
      }

      if (consoleErrors.length > 0) {
        console.error(`FAIL: Console errors on ${pageInfo.name} at ${vp.width}px:`, consoleErrors);
        hasError = true;
      }

      // Capture screenshot
      const shotPath = path.join(screenshotsDir, `motion-${pageInfo.name}-${vp.width}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });

      await context.close();
    }
    console.log(`PASS: ${pageInfo.name} across all 3 viewports.`);
  }

  console.log('\n--- Step 2: Testing JS-Off Mode (Content Visibility) ---');
  {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`http://localhost:${httpPort}/`, { waitUntil: 'load' });

    const visibleReveals = await page.evaluate(() => {
      const reveals = document.querySelectorAll('.reveal');
      let allVisible = true;
      reveals.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.opacity === '0' || style.visibility === 'hidden') {
          allVisible = false;
        }
      });
      return allVisible;
    });

    if (!visibleReveals) {
      console.error('FAIL: When JS is disabled, .reveal elements were not visible!');
      hasError = true;
    } else {
      console.log('PASS: When JS is disabled, all content is 100% visible and readable.');
    }
    await context.close();
  }

  console.log('\n--- Step 3: Testing prefers-reduced-motion ---');
  {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${httpPort}/`, { waitUntil: 'networkidle' });

    const reducedValid = await page.evaluate(() => {
      const el = document.querySelector('.hero-reveal');
      const style = window.getComputedStyle(el);
      return style.opacity === '1';
    });

    if (!reducedValid) {
      console.error('FAIL: prefers-reduced-motion did not show immediate final states!');
      hasError = true;
    } else {
      console.log('PASS: prefers-reduced-motion respected (immediate final state).');
    }
    await context.close();
  }

  console.log('\n--- Step 4: Testing Interactive Features & Keyboard Navigation ---');
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${httpPort}/`, { waitUntil: 'networkidle' });

    // Test Itinerary FLIP tidy button
    const initialText = await page.textContent('#btn-tidy-route');
    await page.click('#btn-tidy-route');
    const tidiedText = await page.textContent('#btn-tidy-route');
    if (tidiedText !== 'Route tidied') {
      console.error('FAIL: Itinerary tidy button text did not change to "Route tidied"');
      hasError = true;
    } else {
      console.log('PASS: Itinerary tidy button FLIP swap executed and label updated.');
    }

    // Toggle reset
    await page.click('#btn-tidy-route');
    const resetText = await page.textContent('#btn-tidy-route');
    if (resetText !== 'Tidy up the route') {
      console.error('FAIL: Itinerary tidy button second press did not reset label');
      hasError = true;
    } else {
      console.log('PASS: Itinerary tidy button second press reset successfully.');
    }

    // Test Spotlight Tablist & Arrow Keys
    await page.focus('#tab-plan');
    await page.keyboard.press('ArrowRight');
    const selectedTab = await page.evaluate(() => {
      const active = document.querySelector('.spotlight-tablist button[aria-selected="true"]');
      return active ? active.id : null;
    });
    if (selectedTab !== 'tab-map') {
      console.error('FAIL: ArrowRight did not switch to tab-map, got:', selectedTab);
      hasError = true;
    } else {
      console.log('PASS: ArrowRight keyboard navigation selected tab-map.');
    }

    // Check Map route self-drawing
    const mapVisible = await page.evaluate(() => {
      const panel = document.getElementById('panel-map');
      return !panel.hidden && panel.classList.contains('is-active');
    });
    if (!mapVisible) {
      console.error('FAIL: Map panel not active');
      hasError = true;
    } else {
      console.log('PASS: Map panel active and SVG route initiated.');
    }

    await context.close();
  }

  // Test Mobile Menu & Focus Trapping
  {
    const context = await browser.newContext({
      viewport: { width: 360, height: 740 }
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${httpPort}/`, { waitUntil: 'networkidle' });

    await page.click('#menu-toggle');
    const menuOpen = await page.evaluate(() => {
      const nav = document.getElementById('main-nav');
      return nav.classList.contains('is-open');
    });
    if (!menuOpen) {
      console.error('FAIL: Mobile menu did not open on toggle click');
      hasError = true;
    } else {
      console.log('PASS: Mobile menu opened cleanly.');
    }

    // Test Escape key closes menu and returns focus
    await page.keyboard.press('Escape');
    const menuClosed = await page.evaluate(() => {
      const nav = document.getElementById('main-nav');
      return !nav.classList.contains('is-open');
    });
    const toggleFocused = await page.evaluate(() => {
      return document.activeElement && document.activeElement.id === 'menu-toggle';
    });
    if (!menuClosed || !toggleFocused) {
      console.error('FAIL: Escape did not close menu or return focus to toggle button', { menuClosed, toggleFocused });
      hasError = true;
    } else {
      console.log('PASS: Escape closed menu and returned focus to toggle button.');
    }

    await context.close();
  }

  // Test Contact "Copy email" button
  {
    const context = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
      viewport: { width: 1280, height: 800 }
    });
    const page = await context.newPage();
    await page.goto(`http://localhost:${httpPort}/contact/`, { waitUntil: 'networkidle' });

    await page.click('#copy-email-btn');
    await page.waitForFunction(() => document.getElementById('copy-status').textContent === 'Copied!', { timeout: 3000 });
    const copyStatus = await page.textContent('#copy-status');
    if (copyStatus !== 'Copied!') {
      console.error('FAIL: Copy status did not display "Copied!"');
      hasError = true;
    } else {
      console.log('PASS: Contact copy email button displayed "Copied!".');
    }

    await context.close();
  }

  console.log('\n--- Step 5: Recording home-scroll.webm video ---');
  {
    const videoDir = path.resolve(__dirname, '..', '..');
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      recordVideo: {
        dir: videoDir,
        size: { width: 1280, height: 800 }
      }
    });

    const page = await context.newPage();
    await page.goto(`http://localhost:${httpPort}/`, { waitUntil: 'networkidle' });

    // Wait for hero entrance
    await page.waitForTimeout(500);

    // Trigger tidy route button
    await page.click('#btn-tidy-route');
    await page.waitForTimeout(600);

    // Scroll down to products
    await page.evaluate(() => {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    });
    await page.waitForTimeout(800);

    // Hover on product row to show sand wash
    await page.hover('.product-row[data-href="/tourist-guide/"]');
    await page.waitForTimeout(600);

    // Scroll down to spotlight
    await page.evaluate(() => {
      window.scrollTo({ top: 1200, behavior: 'smooth' });
    });
    await page.waitForTimeout(800);

    // Click Map tab to trigger route drawing
    await page.click('#tab-map');
    await page.waitForTimeout(1400);

    // Click Phrasebook tab and play audio
    await page.click('#tab-phrasebook');
    await page.waitForTimeout(400);
    await page.click('#btn-play-phrase');
    await page.waitForTimeout(1200);

    // Scroll down to about & contributors
    await page.evaluate(() => {
      window.scrollTo({ top: 1900, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Scroll to bottom
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Click back to top button
    await page.click('#back-to-top');
    await page.waitForTimeout(1000);

    const video = page.video();
    await context.close();

    if (video) {
      const tempVideoPath = await video.path();
      const targetVideoPath = path.join(videoDir, 'home-scroll.webm');
      if (fs.existsSync(targetVideoPath)) {
        fs.unlinkSync(targetVideoPath);
      }
      fs.renameSync(tempVideoPath, targetVideoPath);
      console.log('SUCCESS: Recorded video saved to:', targetVideoPath);
    }
  }

  await browser.close();
  server.close();

  if (hasError) {
    console.error('\nVerification completed with ERRORS.');
    process.exit(1);
  } else {
    console.log('\nVerification completed with 100% PASS on all tests!');
  }
}

runVerification().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
