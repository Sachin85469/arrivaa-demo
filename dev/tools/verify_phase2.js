const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const websiteDir = path.resolve(__dirname, '..', 'website');
const cdpPort = 9342;
const tempUserData = path.join(os.tmpdir(), 'chrome-p2-' + Date.now());

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

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(msg.params.exceptionDetails.text);
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
    return res.result.value;
  }

  console.log('Testing Desktop 1366x800...');
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 800, deviceScaleFactor: 1, mobile: false });
  await wait(2500); // Wait for preloader

  // Check 1: Top of page - lazy loading: sylva iframe should NOT have src yet
  const topSrc = await evaluate('document.getElementById("sylva-iframe")?.getAttribute("src")');
  console.log('Top of page iframe src:', topSrc);
  if (topSrc && topSrc.includes('living-green.html')) {
    console.warn('Note: sylva iframe was already loaded (could be within 1 viewport rootMargin).');
  }

  // Scroll down to tourist guide scene
  console.log('Scrolling to tourist guide scene...');
  await evaluate('document.querySelector("#tourist-guide-scene").scrollIntoView({ behavior: "instant" })');
  await wait(1500);

  // Check 2: When visible, sylva iframe MUST have src loaded
  const loadedSrc = await evaluate('document.getElementById("sylva-iframe")?.getAttribute("src")');
  console.log('In-view iframe src:', loadedSrc);
  if (!loadedSrc || !loadedSrc.includes('living-green.html')) {
    throw new Error(`Expected sylva iframe src to be set to living-green.html, got: ${loadedSrc}`);
  }

  // Check 3: Check that pointer-events protection exists in CSS
  const hasCoarseRule = await evaluate(`
    Array.from(document.styleSheets).some(sheet => {
      try {
        return Array.from(sheet.cssRules).some(r => r.media && r.media.mediaText.includes('pointer: coarse'));
      } catch(e) { return false; }
    })
  `);
  console.log('Coarse pointer rule present in stylesheets:', hasCoarseRule);
  if (!hasCoarseRule) {
    throw new Error('Missing pointer: coarse media query rule in CSS');
  }

  // Check 4: Mobile 390x780 test
  console.log('Testing Mobile 390x780...');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 2, mobile: true });
  await wait(1000);
  await evaluate('document.querySelector("#tourist-guide-scene").scrollIntoView({ behavior: "instant" })');
  await wait(1000);

  const mobileIframePointerEvents = await evaluate(`
    window.getComputedStyle(document.getElementById('sylva-iframe')).pointerEvents
  `);
  console.log('Mobile computed pointerEvents for iframe:', mobileIframePointerEvents);

  console.log('Console errors recorded:', consoleErrors);
  if (consoleErrors.length > 0) {
    throw new Error(`Encountered console errors: ${consoleErrors.join(', ')}`);
  }

  ws.close();
}

run()
  .then(() => {
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    console.log('Phase 2 verification passed cleanly!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Phase 2 verification failed:', err);
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    process.exit(1);
  });
