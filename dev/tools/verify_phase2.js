const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const websiteDir = fs.existsSync(path.resolve(__dirname, '..', 'website'))
  ? path.resolve(__dirname, '..', 'website')
  : path.resolve(__dirname, '..', '..', 'website');
const cdpPort = 9342;
const tempUserData = path.join(os.tmpdir(), 'chrome-verify-' + Date.now());

fs.mkdirSync(tempUserData, { recursive: true });

const serverProc = spawn('python', ['-m', 'http.server', '8000'], { cwd: websiteDir });

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

let chromeProc = null;

async function run() {
  await wait(1000);

  chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tempUserData}`,
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    'http://localhost:8000/index.html'
  ]);

  await wait(2000);
  let tabs = await getJson(`http://127.0.0.1:${cdpPort}/json`);
  const targetTab = tabs.find(t => t.url.includes('index.html')) || tabs[0];

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  const consoleErrors = [];
  const consoleWarnings = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description).join(' ');
      if (msg.params.type === 'error') {
        consoleErrors.push(text);
      } else if (msg.params.type === 'warning') {
        consoleWarnings.push(text);
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
    }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  console.log('--- 1. Testing Desktop (1366x800) ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 800, deviceScaleFactor: 1, mobile: false });
  await wait(2500); // Wait for preloader to complete

  // Check Title & Hero Heading
  const pageTitle = await evaluate('document.title');
  console.log('Page Title:', pageTitle);
  if (!pageTitle.includes('ARRIVA')) throw new Error('Incorrect page title: ' + pageTitle);

  const heroHeading = await evaluate('document.getElementById("h1")?.textContent');
  console.log('Hero Heading:', heroHeading);
  if (!heroHeading.includes('Ideas into innovation')) throw new Error('Missing hero heading text');

  // Check 3D World Canvas
  const hasCanvas = await evaluate('!!document.getElementById("world")');
  console.log('World 3D Canvas present:', hasCanvas);
  if (!hasCanvas) throw new Error('Missing #world canvas');

  // Check Monotonic data-scene order
  const sceneValues = await evaluate(`
    Array.from(document.querySelectorAll('[data-scene]')).map(el => ({
      id: el.id,
      scene: parseFloat(el.getAttribute('data-scene'))
    }))
  `);
  console.log('data-scene progression:', sceneValues.map(s => `${s.id}: ${s.scene}`).join(', '));
  for (let i = 1; i < sceneValues.length; i++) {
    if (sceneValues[i].scene < sceneValues[i - 1].scene) {
      throw new Error(`Non-monotonic scene progression: ${sceneValues[i-1].id} (${sceneValues[i-1].scene}) -> ${sceneValues[i].id} (${sceneValues[i].scene})`);
    }
  }

  // Check Tourist Guide Waypoints
  console.log('Testing Tourist Guide Interactive Waypoints...');
  await evaluate('document.querySelector("#tourist-guide").scrollIntoView({ behavior: "instant" })');
  await wait(1000);
  const pinCount = await evaluate('document.querySelectorAll(".topo-pin-card").length');
  console.log('Tourist Waypoint cards:', pinCount);
  if (pinCount < 4) throw new Error('Expected 4 waypoint cards, found: ' + pinCount);

  // Click second waypoint
  await evaluate('document.querySelectorAll(".topo-pin-card")[1]?.click()');
  await wait(500);
  const isSecondPinActive = await evaluate('document.querySelectorAll(".topo-pin-card")[1]?.classList.contains("active")');
  console.log('Waypoint click activates card:', isSecondPinActive);
  if (!isSecondPinActive) throw new Error('Waypoint click failed to activate card');

  // Check ORVIX Terminal Demo
  console.log('Testing ORVIX Live Terminal Demo...');
  await evaluate('document.querySelector("#orvix-demo").scrollIntoView({ behavior: "instant" })');
  await wait(2000);
  const terminalRan = await evaluate('document.getElementById("term-cmd-1")?.textContent.length > 0');
  console.log('Terminal sequence executed:', terminalRan);

  // Check FAQ Accordion Toggle
  console.log('Testing FAQ Accordion...');
  await evaluate('document.querySelector("#faq").scrollIntoView({ behavior: "instant" })');
  await wait(500);
  await evaluate('document.querySelector(".faq-q")?.click()');
  await wait(400);
  const isFaqOpen = await evaluate('document.querySelector(".faq-item")?.classList.contains("open")');
  console.log('FAQ accordion opens:', isFaqOpen);
  if (!isFaqOpen) throw new Error('FAQ item failed to open');

  console.log('\n--- 2. Testing Mobile (390x780) ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 2, mobile: true });
  await wait(1000);

  // Test Mobile Navigation Menu
  console.log('Testing mobile hamburger menu...');
  const menuBtnAriaBefore = await evaluate('document.getElementById("menu-btn")?.getAttribute("aria-expanded")');
  await evaluate('document.getElementById("menu-btn")?.click()');
  await wait(400);
  const menuBtnAriaAfter = await evaluate('document.getElementById("menu-btn")?.getAttribute("aria-expanded")');
  const navIsOpen = await evaluate('document.getElementById("nav")?.classList.contains("open")');
  console.log(`Menu button aria-expanded: ${menuBtnAriaBefore} -> ${menuBtnAriaAfter}, nav.open: ${navIsOpen}`);
  if (menuBtnAriaAfter !== 'true' || !navIsOpen) throw new Error('Mobile menu failed to open');

  // Close menu
  await evaluate('document.getElementById("menu-btn")?.click()');
  await wait(400);

  // Test Mobile Screens Gallery Horizontal Swipe Sync
  console.log('Testing mobile screens gallery scroll sync...');
  await evaluate('document.querySelector("#screens-gallery").scrollIntoView({ behavior: "instant" })');
  await wait(800);
  const galViewportExists = await evaluate('!!document.getElementById("gallery-viewport")');
  if (galViewportExists) {
    // Scroll viewport to second group
    await evaluate('document.getElementById("gallery-viewport").scrollLeft = 390');
    await evaluate('document.getElementById("gallery-viewport").dispatchEvent(new Event("scroll"))');
    await wait(300);
    const counterText = await evaluate('document.getElementById("gallery-counter")?.textContent');
    console.log('Mobile gallery counter after swipe:', counterText);
  }

  console.log('\n--- 3. Error Analysis ---');
  console.log('Recorded warnings:', consoleWarnings.length);
  console.log('Recorded errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    throw new Error(`Encountered browser console errors: ${consoleErrors.join('; ')}`);
  }

  ws.close();
}

run()
  .then(() => {
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    console.log('\nAll comprehensive verification checks passed cleanly!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\nVerification failed:', err.message);
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    process.exit(1);
  });
