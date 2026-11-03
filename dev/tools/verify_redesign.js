const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const os = require('os');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const websiteDir = fs.existsSync(path.resolve(__dirname, '..', '..', 'website'))
  ? path.resolve(__dirname, '..', '..', 'website')
  : path.resolve(__dirname, '..', 'website');
const screenshotsDir = fs.existsSync(path.resolve(__dirname, '..', '..', 'screenshots'))
  ? path.resolve(__dirname, '..', '..', 'screenshots')
  : path.resolve(__dirname, '..', 'screenshots');
const cdpPort = 9444;
const httpPort = 8089;
const tempUserData = path.join(os.tmpdir(), 'chrome-verify-' + Date.now());

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

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, res => {
      resolve({ statusCode: res.statusCode, location: res.headers.location });
    }).on('error', err => resolve({ error: err.message }));
  });
}

// Simple native Node static server with trailing slash & index.html support
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

    // If directory, check trailing slash
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

async function run() {
  console.log('--- Step 1: Starting native Node.js HTTP server on port ' + httpPort + ' ---');
  const server = await createStaticServer(websiteDir, httpPort);
  console.log('Static server listening on http://localhost:' + httpPort);

  console.log('\n--- Step 2: Testing route resolution ---');
  const routes = [
    '/',
    '/tourist-guide/',
    '/tourist-guide/privacy/',
    '/tourist-guide/delete-account/',
    '/nexus/',
    '/nexus/privacy/',
    '/orvix/',
    '/orvix/privacy/',
    '/privacy/',
    '/contact/',
    '/privacy.html',
    '/404.html',
    // Non-trailing slash (should redirect to trailing slash)
    '/tourist-guide',
    '/tourist-guide/privacy',
    '/tourist-guide/delete-account',
    '/nexus',
    '/nexus/privacy',
    '/orvix',
    '/orvix/privacy',
    '/privacy',
    '/contact'
  ];

  let routeFailures = 0;
  for (const r of routes) {
    const res = await checkUrl(`http://localhost:${httpPort}${r}`);
    const ok = res.statusCode >= 200 && res.statusCode < 400;
    if (!ok) {
      console.error(`FAIL: ${r} -> ${res.statusCode} ${res.error || ''}`);
      routeFailures++;
    } else {
      console.log(`OK: ${r} -> ${res.statusCode}${res.location ? ' (Redirect to: ' + res.location + ')' : ''}`);
    }
  }

  console.log('\n--- Step 3: Launching Headless Chrome via CDP ---');
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tempUserData}`,
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    `http://localhost:${httpPort}/`
  ]);

  await wait(2000);
  const tabs = await getJson(`http://127.0.0.1:${cdpPort}/json`);
  const targetTab = tabs.find(t => t.url.includes('localhost')) || tabs[0];
  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = idCounter++;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  const externalRequests = [];
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) p.reject(msg.error);
      else p.resolve(msg.result);
    }
    if (msg.method === 'Network.requestWillBeSent') {
      const reqUrl = msg.params.request.url;
      if (!reqUrl.startsWith(`http://localhost:${httpPort}`) && !reqUrl.startsWith('data:') && !reqUrl.startsWith('about:')) {
        externalRequests.push(reqUrl);
      }
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        const text = msg.params.args.map(a => a.value || a.description).join(' ');
        consoleErrors.push(text);
      }
    }
  };

  await new Promise((resolve, reject) => {
    if (ws.readyState === 1) return resolve();
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  await send('Page.enable');
  await send('Network.enable');
  await send('Runtime.enable');

  console.log('\n--- Step 4: Testing every page in Chrome at 360, 768, 1280 & capturing screenshots ---');
  const pagesToTest = [
    { name: 'home', url: `http://localhost:${httpPort}/` },
    { name: 'tourist-guide', url: `http://localhost:${httpPort}/tourist-guide/` },
    { name: 'tourist-guide-privacy', url: `http://localhost:${httpPort}/tourist-guide/privacy/` },
    { name: 'tourist-guide-delete', url: `http://localhost:${httpPort}/tourist-guide/delete-account/` },
    { name: 'nexus', url: `http://localhost:${httpPort}/nexus/` },
    { name: 'nexus-privacy', url: `http://localhost:${httpPort}/nexus/privacy/` },
    { name: 'orvix', url: `http://localhost:${httpPort}/orvix/` },
    { name: 'orvix-privacy', url: `http://localhost:${httpPort}/orvix/privacy/` },
    { name: 'studio-privacy', url: `http://localhost:${httpPort}/privacy/` },
    { name: 'contact', url: `http://localhost:${httpPort}/contact/` }
  ];

  const viewports = [
    { width: 360, height: 740, label: '360' },
    { width: 768, height: 1024, label: '768' },
    { width: 1280, height: 800, label: '1280' }
  ];

  for (const p of pagesToTest) {
    console.log(`Checking ${p.name}...`);
    await send('Page.navigate', { url: p.url });
    await wait(500);

    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768
      });
      await wait(250);

      // Check horizontal overflow (scrollWidth > innerWidth)
      const overflowEval = await send('Runtime.evaluate', {
        expression: 'document.documentElement.scrollWidth > window.innerWidth'
      });
      if (overflowEval.result && overflowEval.result.value) {
        console.warn(`  WARNING: Horizontal overflow detected on ${p.name} at width ${vp.width}!`);
      }

      // Save screenshot for home, tourist-guide, and tourist-guide-privacy
      if (['home', 'tourist-guide', 'tourist-guide-privacy'].includes(p.name)) {
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(screenshotsDir, `redesign-${p.name}-${vp.label}.png`);
        fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
        console.log(`  Saved screenshot: redesign-${p.name}-${vp.label}.png`);
      }
    }
  }

  console.log('\n--- Step 5: External Network Requests Audit ---');
  if (externalRequests.length === 0) {
    console.log('PASS: Zero external third-party network requests made! (100% self-contained)');
  } else {
    console.error('FAIL: Detected external requests:');
    externalRequests.forEach(u => console.error('  - ' + u));
  }

  console.log('\n--- Step 6: Console Error Audit ---');
  if (consoleErrors.length === 0) {
    console.log('PASS: Zero console errors on any page!');
  } else {
    console.error('FAIL: Detected console errors:');
    consoleErrors.forEach(e => console.error('  - ' + e));
  }

  // Cleanup
  ws.close();
  chromeProc.kill();
  server.close();
  try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}

  console.log('\nVerification complete!');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
