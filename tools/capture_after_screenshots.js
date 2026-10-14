const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const websiteDir = path.resolve(__dirname, '..', 'website');
const cdpPort = 9345;
const tempUserData = path.join(os.tmpdir(), 'chrome-ss-after-' + Date.now());
const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');

fs.mkdirSync(tempUserData, { recursive: true });
fs.mkdirSync(screenshotsDir, { recursive: true });

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

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
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

  await wait(2500); // wait for preloader to finish

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result.value;
  }

  async function capture(name) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    const outPath = path.join(screenshotsDir, name);
    fs.writeFileSync(outPath, buf);
    console.log(`Saved screenshot: ${name}`);
  }

  // 1. Desktop 1366x800
  console.log('Capturing Desktop screenshots (1366x800)...');
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 800, deviceScaleFactor: 1, mobile: false });
  await wait(600);

  // Hero
  await evaluate('window.scrollTo({ top: 0, behavior: "instant" })');
  await wait(800);
  await capture('hero-desktop-after.png');

  // Tourist Guide
  await evaluate('document.querySelector("#tourist-guide-scene").scrollIntoView({ behavior: "instant" })');
  await wait(1800); // allow iframe to load scene
  await capture('tourist-desktop-after.png');

  // Footer
  await evaluate('document.querySelector("#foot").scrollIntoView({ behavior: "instant" })');
  await wait(800);
  await capture('footer-desktop-after.png');

  // 2. Mobile 390x780
  console.log('Capturing Mobile screenshots (390x780)...');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 2, mobile: true });
  await wait(600);

  // Hero
  await evaluate('window.scrollTo({ top: 0, behavior: "instant" })');
  await wait(800);
  await capture('hero-mobile-after.png');

  // Tourist Guide
  await evaluate('document.querySelector("#tourist-guide-scene").scrollIntoView({ behavior: "instant" })');
  await wait(1800);
  await capture('tourist-mobile-after.png');

  // Footer
  await evaluate('document.querySelector("#foot").scrollIntoView({ behavior: "instant" })');
  await wait(800);
  await capture('footer-mobile-after.png');

  ws.close();
}

run()
  .then(() => {
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    console.log('All after screenshots captured successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Screenshot capture failed:', err);
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    process.exit(1);
  });
