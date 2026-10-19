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
  await wait(1200);

  chromeProc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tempUserData}`,
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    'http://localhost:8000/index.html'
  ]);

  await wait(2200);
  let tabs = await getJson(`http://127.0.0.1:${cdpPort}/json`);
  const targetTab = tabs.find(t => t.url.includes('index.html')) || tabs[0];

  const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();
  const consoleErrors = [];
  const consoleWarnings = [];
  const externalRequests = [];

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
    if (msg.method === 'Network.requestWillBeSent') {
      const reqUrl = msg.params.request.url;
      if (!reqUrl.startsWith('http://localhost:') &&
          !reqUrl.startsWith('http://127.0.0.1:') &&
          !reqUrl.startsWith('data:') &&
          !reqUrl.startsWith('blob:')) {
        externalRequests.push(reqUrl);
      }
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
  await send('Network.enable');

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  console.log('=== TEST SUITE: ARRIVAA COMPREHENSIVE PHASE 2 VERIFICATION ===\n');

  console.log('--- Phase A: Desktop Viewport (1366 x 800) ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 800, deviceScaleFactor: 1, mobile: false });
  await wait(2500);

  const pageTitle = await evaluate('document.title');
  console.log('1. Page Title:', pageTitle);
  if (!pageTitle.includes('ARRIVA')) throw new Error('Incorrect page title: ' + pageTitle);

  const heroHeading = await evaluate('document.getElementById("h1")?.textContent');
  console.log('2. Hero Heading:', heroHeading);
  if (!heroHeading.includes('Ideas into innovation')) throw new Error('Missing hero heading text');

  const hasCanvas = await evaluate('!!document.getElementById("world")');
  console.log('3. World 3D Canvas:', hasCanvas);
  if (!hasCanvas) throw new Error('Missing #world canvas');

  const sceneValues = await evaluate(`
    Array.from(document.querySelectorAll('[data-scene]')).map(el => ({
      id: el.id,
      scene: parseFloat(el.getAttribute('data-scene'))
    }))
  `);
  console.log('4. Monotonic data-scene progression count:', sceneValues.length);
  for (let i = 1; i < sceneValues.length; i++) {
    if (sceneValues[i].scene < sceneValues[i - 1].scene) {
      throw new Error(`Non-monotonic scene progression: ${sceneValues[i-1].id} (${sceneValues[i-1].scene}) -> ${sceneValues[i].id} (${sceneValues[i].scene})`);
    }
  }

  console.log('5. Testing Tourist Guide interactive waypoints...');
  await evaluate('document.querySelector("#tourist-guide").scrollIntoView({ behavior: "instant" })');
  await wait(800);

  const pinCount = await evaluate('document.querySelectorAll(".topo-pin-card").length');
  console.log('   Waypoint cards count:', pinCount);
  if (pinCount < 4) throw new Error('Expected 4 waypoint cards, found: ' + pinCount);

  await evaluate('document.querySelectorAll(".topo-pin-card")[1]?.click()');
  await wait(400);
  const isSecondPinActive = await evaluate('document.querySelectorAll(".topo-pin-card")[1]?.classList.contains("active")');
  console.log('   Click card 2 activates:', isSecondPinActive);
  if (!isSecondPinActive) throw new Error('Click failed to activate waypoint card 2');

  const keyboardEnterSuccess = await evaluate(`
    (() => {
      const card3 = document.querySelectorAll(".topo-pin-card")[2];
      card3.focus();
      card3.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
      return card3.classList.contains('active');
    })()
  `);
  console.log('   Enter key activates card 3:', keyboardEnterSuccess);
  if (!keyboardEnterSuccess) throw new Error('Enter key failed to activate waypoint card 3');

  const keyboardSpaceSuccess = await evaluate(`
    (() => {
      const card4 = document.querySelectorAll(".topo-pin-card")[3];
      card4.focus();
      card4.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
      return card4.classList.contains('active');
    })()
  `);
  console.log('   Space key activates card 4:', keyboardSpaceSuccess);
  if (!keyboardSpaceSuccess) throw new Error('Space key failed to activate waypoint card 4');

  const scrubberVal = await evaluate('document.getElementById("elevation-scrubber")?.value');
  console.log('   Scrubber synchronized to pin 4 (index 3):', scrubberVal === '3');
  if (scrubberVal !== '3') throw new Error('Elevation scrubber did not sync to card 4');

  console.log('6. Testing ORVIX terminal demo & replay race fix...');
  await evaluate('document.querySelector("#orvix-demo").scrollIntoView({ behavior: "instant" })');
  await wait(1200);

  const replayRaceResult = await evaluate(`
    (() => {
      const replay = document.getElementById("replay-term-btn");
      if (!replay) return { error: "No replay button" };
      replay.click();
      replay.click();
      const skip = document.getElementById("skip-term-btn");
      if (skip) skip.click();
      const cmd1 = document.getElementById("term-cmd-1")?.textContent || "";
      const cmd2 = document.getElementById("term-cmd-2")?.textContent || "";
      const isReplayEnabled = !replay.disabled;
      return { cmd1, cmd2, isReplayEnabled };
    })()
  `);
  console.log('   Terminal replay test:');
  console.log('     cmd1:', replayRaceResult.cmd1);
  console.log('     cmd2:', replayRaceResult.cmd2);
  console.log('     Replay re-enabled:', replayRaceResult.isReplayEnabled);

  if (replayRaceResult.cmd1.includes('ncnu') || !replayRaceResult.cmd1.includes('ollama serve')) {
    throw new Error('Terminal replay race corrupted command 1: ' + replayRaceResult.cmd1);
  }
  if (!replayRaceResult.cmd2.includes('curl') || !replayRaceResult.cmd2.includes('11434')) {
    throw new Error('Terminal command 2 corrupted or missing: ' + replayRaceResult.cmd2);
  }

  console.log('   Testing interactive terminal prompt & chips...');
  const interChipSuccess = await evaluate(`
    (() => {
      const chips = document.querySelectorAll('.term-chip');
      const listChip = Array.from(chips).find(c => c.dataset.chip === 'ollama list');
      if (listChip) listChip.click();
      const historyText = document.getElementById('term-interactive-history')?.textContent || '';
      return historyText.includes('llama3:latest');
    })()
  `);
  console.log('   Interactive terminal chip executes & returns output:', interChipSuccess);
  if (!interChipSuccess) throw new Error('Interactive terminal chip test failed');

  console.log('7. Testing FAQ accordion, search filter, and accessibility...');
  await evaluate('document.querySelector("#faq").scrollIntoView({ behavior: "instant" })');
  await wait(600);

  const closedFaqAudit = await evaluate(`
    (() => {
      const closedAnswers = Array.from(document.querySelectorAll('.faq-item:not(.open) .faq-a'));
      const allHaveHidden = closedAnswers.every(a => a.hasAttribute('hidden'));
      const allDisplayNone = closedAnswers.every(a => getComputedStyle(a).display === 'none');
      const focusableInsideClosed = Array.from(document.querySelectorAll('.faq-item:not(.open) .faq-a a, .faq-item:not(.open) .faq-a button')).filter(el => el.offsetParent !== null);
      return { count: closedAnswers.length, allHaveHidden, allDisplayNone, focusableCount: focusableInsideClosed.length };
    })()
  `);
  console.log(`   Closed FAQ answers: ${closedFaqAudit.count}, all have hidden attr: ${closedFaqAudit.allHaveHidden}, all display none: ${closedFaqAudit.allDisplayNone}, focusable elements: ${closedFaqAudit.focusableCount}`);
  if (!closedFaqAudit.allHaveHidden || !closedFaqAudit.allDisplayNone || closedFaqAudit.focusableCount > 0) {
    throw new Error('Closed FAQ items violate accessibility containment');
  }

  const expandAllSuccess = await evaluate(`
    (() => {
      document.getElementById('faq-expand-all')?.click();
      const openCount = document.querySelectorAll('.faq-item.open').length;
      const totalCount = document.querySelectorAll('.faq-item').length;
      return openCount === totalCount;
    })()
  `);
  console.log('   FAQ Expand All button opens all items:', expandAllSuccess);
  if (!expandAllSuccess) throw new Error('FAQ Expand All failed');

  const collapseAllSuccess = await evaluate(`
    (() => {
      document.getElementById('faq-collapse-all')?.click();
      const openCount = document.querySelectorAll('.faq-item.open').length;
      return openCount === 0;
    })()
  `);
  console.log('   FAQ Collapse All button closes all items:', collapseAllSuccess);
  if (!collapseAllSuccess) throw new Error('FAQ Collapse All failed');

  console.log('8. Testing Screens Gallery sizing & eager loading at 1366x800...');
  const galleryFit = await evaluate(`
    (() => {
      const cards = Array.from(document.querySelectorAll('.gallery-card'));
      const firstImg = document.querySelector('.gallery-card img');
      const isEager = firstImg ? firstImg.getAttribute('loading') !== 'lazy' : false;
      const counterWrap = document.getElementById('gallery-counter');
      const counterStyle = counterWrap ? getComputedStyle(counterWrap).whiteSpace : '';
      return { cardCount: cards.length, isEager, counterWhiteSpace: counterStyle };
    })()
  `);
  console.log('   Screens gallery eager loading:', galleryFit.isEager, 'Counter white-space:', galleryFit.counterWhiteSpace);
  if (!galleryFit.isEager) throw new Error('First gallery screen must not have loading=lazy');
  if (galleryFit.counterWhiteSpace !== 'nowrap') throw new Error('Gallery counter white-space is not nowrap');

  const desktopOverflow = await evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth');
  console.log('9. Desktop 1366x800 horizontal overflow free:', desktopOverflow);
  if (!desktopOverflow) throw new Error('Desktop horizontal overflow detected');

  console.log('\n--- Phase B: Tablet / Breakpoint Viewport (900 x 800) ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 800, deviceScaleFactor: 1, mobile: false });
  await wait(800);

  const tabletNavState = await evaluate(`
    (() => {
      const menuBtn = document.getElementById('menu-btn');
      const menuBtnVisible = menuBtn ? getComputedStyle(menuBtn).display !== 'none' : false;
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      return { menuBtnVisible, scrollW, docW, noOverflow: scrollW <= docW };
    })()
  `);
  console.log('   900px breakpoint uses clean condensed/hamburger nav:', tabletNavState.menuBtnVisible);
  console.log('   900px horizontal overflow free:', tabletNavState.noOverflow);
  if (!tabletNavState.menuBtnVisible) throw new Error('Hamburger menu button should be active at 900px');
  if (!tabletNavState.noOverflow) throw new Error('Horizontal overflow detected at 900px');

  console.log('\n--- Phase C: Mobile Viewport (390 x 780) ---');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 780, deviceScaleFactor: 2, mobile: true });
  await evaluate('window.scrollTo(0, 0); window.dispatchEvent(new Event("resize")); window.dispatchEvent(new Event("scroll"));');
  await wait(800);

  const mobileOverflow = await evaluate(`
    (() => {
      const docW = document.documentElement.clientWidth;
      const scrollW = document.documentElement.scrollWidth;
      let worstEl = null;
      let maxWidth = 0;
      document.querySelectorAll('*').forEach(el => {
        if (el.closest('#gallery-viewport') || el.closest('.gallery-track-viewport')) return;
        const r = el.getBoundingClientRect();
        if (r.right > docW + 1.5 && r.width > maxWidth) {
          maxWidth = r.width;
          worstEl = el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.split(' ').join('.') : '');
        }
      });
      return { docW, scrollW, overflows: scrollW > docW, worstEl };
    })()
  `);
  console.log(`   390px Viewport: clientWidth=${mobileOverflow.docW}, scrollWidth=${mobileOverflow.scrollW}, no overflow: ${!mobileOverflow.overflows}`);
  if (mobileOverflow.overflows) {
    throw new Error(`Mobile horizontal overflow at 390px (scrollWidth: ${mobileOverflow.scrollW} > clientWidth: ${mobileOverflow.docW}). Culprit: ${mobileOverflow.worstEl}`);
  }

  console.log('   Testing Mobile Menu: open, backdrop close, escape key, focus management...');
  await evaluate('window.scrollTo(0, 0)');
  await wait(300);

  await evaluate('document.getElementById("menu-btn")?.click()');
  await wait(400);
  const menuOpened = await evaluate(`
    (() => {
      const nav = document.getElementById('nav');
      const btn = document.getElementById('menu-btn');
      const bodyHasClass = document.body.classList.contains('menu-open');
      return nav?.classList.contains('open') && btn?.getAttribute('aria-expanded') === 'true' && bodyHasClass;
    })()
  `);
  console.log('   Menu opens cleanly with aria-expanded and body lock:', menuOpened);
  if (!menuOpened) throw new Error('Mobile menu failed to open properly');

  const escapeClosesMenu = await evaluate(`
    (() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
      const nav = document.getElementById('nav');
      const btn = document.getElementById('menu-btn');
      return !nav?.classList.contains('open') && btn?.getAttribute('aria-expanded') === 'false';
    })()
  `);
  console.log('   Escape key closes mobile menu & resets aria-expanded:', escapeClosesMenu);
  if (!escapeClosesMenu) throw new Error('Escape key failed to close mobile menu');

  await evaluate('document.getElementById("menu-btn")?.click()');
  await wait(400);
  const backdropClosesMenu = await evaluate(`
    (() => {
      document.getElementById('nav-backdrop')?.click();
      const nav = document.getElementById('nav');
      const btn = document.getElementById('menu-btn');
      return !nav?.classList.contains('open') && btn?.getAttribute('aria-expanded') === 'false';
    })()
  `);
  console.log('   Backdrop click closes mobile menu:', backdropClosesMenu);
  if (!backdropClosesMenu) throw new Error('Backdrop click failed to close mobile menu');

  console.log('   Testing Terminal header & stats wrapping at 390px...');
  await evaluate('document.querySelector("#orvix-demo").scrollIntoView({ behavior: "instant" })');
  await wait(600);
  const termHeaderWrap = await evaluate(`
    (() => {
      const stats = document.querySelector('.terminal-stats');
      const head = document.querySelector('.terminal-header');
      return {
        statsWidth: stats ? stats.getBoundingClientRect().width : 0,
        headWidth: head ? head.getBoundingClientRect().width : 0,
        docW: document.documentElement.clientWidth
      };
    })()
  `);
  console.log(`   Terminal elements fit 390px width: head=${Math.round(termHeaderWrap.headWidth)}px, stats=${Math.round(termHeaderWrap.statsWidth)}px, clientWidth=${termHeaderWrap.docW}px`);
  if (termHeaderWrap.headWidth > termHeaderWrap.docW + 2 || termHeaderWrap.statsWidth > termHeaderWrap.docW + 2) {
    throw new Error('Terminal header or stats overflow 390px viewport');
  }

  console.log('\n--- Phase D: Integrity, Console Errors & Network Host Audits ---');
  console.log('   Recorded console warnings:', consoleWarnings.length);
  console.log('   Recorded console errors:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    throw new Error(`Encountered browser console errors: ${consoleErrors.join('; ')}`);
  }

  console.log('   Recorded external 3rd-party requests count:', externalRequests.length);
  if (externalRequests.length > 0) {
    throw new Error(`Found unexpected external network requests: ${externalRequests.join(', ')}`);
  }

  ws.close();
}

run()
  .then(() => {
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    console.log('\n>>> ALL AUTOMATED VERIFICATION CHECKS PASSED WITH 0 DEFECTS! <<<\n');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n>>> VERIFICATION FAILED:', err.message);
    if (chromeProc) chromeProc.kill();
    if (serverProc) serverProc.kill();
    try { fs.rmSync(tempUserData, { recursive: true, force: true }); } catch (e) {}
    process.exit(1);
  });
