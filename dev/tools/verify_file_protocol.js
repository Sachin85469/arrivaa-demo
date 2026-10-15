const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const websiteIndex = fs.existsSync(path.resolve(__dirname, '..', 'website', 'index.html'))
  ? path.resolve(__dirname, '..', 'website', 'index.html')
  : path.resolve(__dirname, '..', '..', 'website', 'index.html');
const fileUrl = 'file:///' + websiteIndex.replace(/\\/g, '/');
const cdpPort = 9349;
const tempUserData = path.join(os.tmpdir(), 'chrome-file-' + Date.now());
const screenshotsDir = fs.existsSync(path.resolve(__dirname, '..', 'screenshots'))
  ? path.resolve(__dirname, '..', 'screenshots')
  : path.resolve(__dirname, '..', '..', 'screenshots');

fs.mkdirSync(tempUserData, { recursive: true });
fs.mkdirSync(screenshotsDir, { recursive: true });

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
  await wait(500);

  // Normal Chrome launch without flags that bypass security, simulating double-clicking index.html
  chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tempUserData}`,
    '--disable-gpu',
    '--no-first-run',
    fileUrl
  ]);

  await wait(2000);
  let tabs = await getJson(`http://127.0.0.1:${cdpPort}/json`);
  const targetTab = tabs.find(t => t.url.includes('index.html')) || tabs[0];

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  const consoleMessages = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      consoleMessages.push({
        type: msg.params.type,
        text: msg.params.args.map(a => a.value || a.description).join(' ')
      });
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleMessages.push({
        type: 'exception',
        text: msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || '')
      });
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

  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 800, deviceScaleFactor: 1, mobile: false });
  await wait(3000); // wait for preloader

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  console.log('--- Testing file:// direct opening ---');
  const title = await evaluate('document.title');
  console.log('Document title:', title);

  const heroHeading = await evaluate('document.getElementById("h1")?.textContent');
  console.log('Hero heading:', heroHeading);

  const threeLoaded = await evaluate('typeof THREE !== "undefined"');
  console.log('THREE loaded on window:', threeLoaded);

  const worldCanvas = await evaluate('!!document.getElementById("world")');
  console.log('World canvas exists:', worldCanvas);

  const isWebGL = await evaluate(`(() => {
    try {
      const c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch(e) { return e.message; }
  })()`);
  console.log('WebGL supported:', isWebGL);

  const worldApi = await evaluate('typeof window.WORLD !== "undefined" && typeof window.WORLD.set === "function"');
  console.log('window.WORLD API initialized:', worldApi);

  // Scroll to tourist guide section
  console.log('Scrolling to tourist guide section...');
  await evaluate('document.querySelector("#tourist-guide")?.scrollIntoView({ behavior: "instant" })');
  await evaluate('window.dispatchEvent(new Event("scroll"))');
  await wait(1500);

  const pinCount = await evaluate('document.querySelectorAll(".topo-pin-card").length');
  console.log('Waypoint pin cards found:', pinCount);

  // Capture screenshot under file://
  const res = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(res.data, 'base64');
  const outPath = path.join(screenshotsDir, 'tourist-desktop-file-protocol.png');
  fs.writeFileSync(outPath, buf);
  console.log('Saved screenshot: tourist-desktop-file-protocol.png');

  console.log('\n--- Console Messages Recorded ---');
  for (const cm of consoleMessages) {
    console.log(`[${cm.type}] ${cm.text}`);
  }

  const errors = consoleMessages.filter(m => m.type === 'error' || m.type === 'exception');
  if (errors.length > 0) {
    throw new Error(`Encountered console errors under file://: ${errors.map(e => e.text).join('; ')}`);
  }

  ws.close();
}

run()
  .then(() => {
    if (chromeProc) chromeProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    console.log('\nFile protocol verification completed successfully.');
    process.exit(0);
  })
  .catch(err => {
    console.error('File protocol verification error:', err);
    if (chromeProc) chromeProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    process.exit(1);
  });
