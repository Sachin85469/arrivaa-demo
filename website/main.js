(function () {
  'use strict';

  const D = window.ARRIVA;
  if (!D) {
    console.error('ARRIVA content.js not loaded.');
    return;
  }

  const $ = (q, r = document) => r.querySelector(q);
  const $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // ==========================================
  // 1. RENDER ALL CONTENT FROM content.js
  // ==========================================

  // --- Preloader
  const preHi = $('#pre-hi'), preTitle = $('#pre-title');
  if (preHi && D.preloader) preHi.textContent = D.preloader.hi;
  if (preTitle && D.preloader) preTitle.textContent = D.preloader.title;

  // --- Header & Nav
  const logo = $('#brand-logo');
  if (logo && D.brand) {
    logo.innerHTML = `${D.brand.name}<span>${D.brand.markSuffix}</span>`;
  }

  const nav = $('#nav');
  if (nav && D.nav) {
    nav.innerHTML = D.nav.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('') +
      `<a class="pill" href="${D.nav.cta.href}" data-magnet>${D.nav.cta.label}</a>`;
  }

  // Mobile menu toggle
  const menuBtn = $('#menu-btn');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
    $$('#nav a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function formatHeader(chapterStr, titleStr, hiStr) {
    const num = (chapterStr || '').replace(/[^0-9]/g, '');
    const cleanTitle = (titleStr || '')
      .toUpperCase()
      .replace(/^ARRIVA\s+/, '')
      .replace(/·\s*/g, '')
      .trim();
    const prefix = num ? `${num} / ${cleanTitle}` : cleanTitle;
    const hiMarkup = hiStr ? `<span class="hi">${hiStr}</span>` : '';
    return `<span class="chapter-mono">${prefix}</span>${hiMarkup}`;
  }

  // --- Hero (Chapter 00)
  const heroLabel = $('#hero-label'), h1 = $('#h1'), lead = $('#lead'), heroCta = $('#hero-cta'), heroScroll = $('#hero-scroll');
  if (heroLabel && D.hero) {
    heroLabel.innerHTML = formatHeader(D.hero.chapter, "THE ARRIVAL", D.hero.hi);
  }
  if (h1 && D.hero) {
    h1.innerHTML = D.hero.title.split(' ').map((w, i) => `<span class="w"><span style="--d:${(i * 0.08).toFixed(2)}s">${w}</span></span>`).join(' ');
  }
  if (lead && D.hero) lead.textContent = D.hero.sub;
  if (heroCta && D.hero) {
    heroCta.innerHTML = `
      <a class="btn solid" href="${D.hero.ctaPrimary.href}" data-magnet>${D.hero.ctaPrimary.label}</a>
      <a class="btn" href="${D.hero.ctaSecondary.href}" data-magnet>${D.hero.ctaSecondary.label}</a>
    `;
  }
  if (heroScroll && D.hero) heroScroll.textContent = D.hero.scrollHint;

  // --- 01, 02, 03 Product Chapters
  const chaptersEl = $('#chapters');
  if (chaptersEl && D.products) {
    chaptersEl.innerHTML = D.products.map((p, i) => `
      <section class="chapter ${i % 2 ? 'flip' : ''}" id="${p.id}" data-scene="${i + 1}">
        <div class="wrap grid">
          <div class="copy">
            <p class="label">${formatHeader(p.chapter, p.name, p.hi)}</p>
            <h2>${p.name}</h2>
            <p class="lead">${p.desc}</p>
            <ul class="points-list">${p.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
            <div class="tech-tags">${p.techUsed ? p.techUsed.map(t => `<span class="tech-pill">${t}</span>`).join('') : ''}</div>
            <div class="stats">${p.stats.map(s => `<div><b data-count>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
            <div class="row">
              <a class="btn solid" href="${p.link[1]}" data-magnet>${p.link[0]}</a>
              <span class="status">${p.status}</span>
            </div>
          </div>
          <div class="phones" aria-label="${p.name} mobile screens preview">
            ${p.images.slice(0, 3).map((src, k) => `
              <img class="phone" data-speed="${[0.08, -0.05, 0.13][k]}" src="${src}" alt="${p.name} screen ${k + 1}" loading="lazy">
            `).join('')}
          </div>
        </div>
      </section>
    `).join('');
  }

  // --- Section 1: Screens Gallery (Pinned Horizontal)
  const galEl = $('#screens-gallery');
  if (galEl && D.screensGallery) {
    const G = D.screensGallery;
    galEl.innerHTML = `
      <div class="gallery-sticky">
        <div class="wrap">
          <div class="gallery-head">
            <div>
              <p class="label">${formatHeader(G.chapter, G.title, G.hi)}</p>
              <h2>${G.title}</h2>
              <p class="lead" style="margin: 8px 0 0;">${G.subtitle}</p>
              <div class="gallery-tabs" id="gallery-tabs">
                ${G.groups.map((grp, idx) => `
                  <button class="gallery-tab ${idx === 0 ? 'active' : ''}" data-index="${idx}">${grp.productName}</button>
                `).join('')}
              </div>
            </div>
            <div class="gallery-meta">
              <span class="gallery-caption" id="gallery-caption">${G.groups[0].caption}</span>
              <span class="gallery-counter" id="gallery-counter">01 / ${G.counterTotal}</span>
            </div>
          </div>
        </div>
        <div class="gallery-track-viewport" id="gallery-viewport">
          <div class="gallery-track" id="gallery-track">
            ${G.groups.map(grp => `
              <div class="gallery-group" data-group="${grp.id}">
                <div class="gallery-group-title">
                  <span class="tag-pill">${grp.category}</span>
                  <h3>${grp.productName}</h3>
                </div>
                <div class="gallery-screens-grid">
                  ${grp.screens.map(s => `
                    <div class="gallery-card">
                      <img src="${s.src}" alt="${s.alt}" loading="lazy">
                      <span>${s.title}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- Section 2: ORVIX Live Demo (Terminal)
  const demoEl = $('#orvix-demo');
  if (demoEl && D.orvixDemo) {
    const dm = D.orvixDemo;
    demoEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(dm.chapter, dm.title, dm.hi)}</p>
        <h2>${dm.title}</h2>
        <p class="lead">${dm.subtitle}</p>
        <div class="terminal-wrap" id="terminal-box">
          <div class="terminal-header">
            <div class="terminal-controls">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title">${dm.terminal.windowTitle}</span>
            <span class="terminal-badge">LOCAL 127.0.0.1:11434</span>
          </div>
          <div class="terminal-body" id="terminal-body">
            <div class="terminal-line"><span class="terminal-prompt">${dm.terminal.userHost}</span><span class="terminal-cmd" id="term-cmd-1"></span><span class="terminal-cursor" id="term-cur"></span></div>
            <div id="term-logs-1" style="display:none; margin: 8px 0 14px;">
              ${dm.terminal.logs1.map(l => `<div class="terminal-log">${l}</div>`).join('')}
            </div>
            <div id="term-line-2" style="display:none;" class="terminal-line">
              <span class="terminal-prompt">${dm.terminal.userHost2}</span><span class="terminal-cmd" id="term-cmd-2"></span>
            </div>
            <div id="term-json" style="display:none;" class="terminal-json"></div>
          </div>
          <div class="terminal-footer">
            <div class="terminal-stats">
              ${dm.terminal.stats.map(st => `<span><b>${st[0]}</b>${st[1]}</span>`).join('')}
            </div>
            <button class="btn sm" id="replay-term-btn" data-magnet>${dm.replayLabel}</button>
          </div>
        </div>
      </div>
    `;
  }

  // --- Section 3: Tourist Guide Scene (Route Line & Sylva Living World)
  const tgSceneEl = $('#tourist-guide-scene');
  if (tgSceneEl && D.touristGuideScene) {
    const TS = D.touristGuideScene;
    tgSceneEl.innerHTML = `
      <div class="wrap">
        <div class="tourist-split-grid">
          <!-- Text column with chapter info, stats, and route line + 4 pins -->
          <div class="tourist-text-col">
            <p class="label">${formatHeader(TS.chapter, TS.title, TS.hi)}</p>
            <h2>${TS.title}</h2>
            <p class="lead">${TS.subtitle}</p>
            
            <div class="topo-stats">
              ${TS.trailStats.map(st => `
                <div class="topo-stat-pill"><b>${st[0]}</b> <span>${st[1]}</span></div>
              `).join('')}
            </div>

            <div class="tourist-trail-box" id="topo-wrap">
              <div class="trail-route-col">
                <svg class="trail-route-svg" viewBox="0 0 32 380" preserveAspectRatio="none" aria-hidden="true">
                  <path class="trail-base-line" d="M 16 16 L 16 364" />
                  <path id="route-line" class="trail-line" d="M 16 16 L 16 364" />
                </svg>
              </div>
              <div class="trail-waypoints-list" id="topo-pins">
                ${TS.pins.map((pin, idx) => `
                  <div class="trail-waypoint-item" data-pin-idx="${idx}" tabindex="0" role="button" aria-label="Waypoint ${idx + 1}: ${pin.name}">
                    <div class="waypoint-pin-node">
                      <span class="pin-pulse"></span>
                      <span class="pin-num">0${idx + 1}</span>
                    </div>
                    <div class="waypoint-details">
                      <div class="waypoint-header">
                        <h4>${pin.name}</h4>
                        <span class="pin-tag"><span class="hi">${pin.hi}</span>${pin.category}</span>
                      </div>
                      <p>${pin.desc}</p>
                      <div class="pin-meta">
                        <span>Elevation: ${pin.elevation}</span>
                        <span>Dist: ${pin.dist}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Scene frame column with dark window, ticks, label bar, iframe, caption -->
          <div class="tourist-scene-col">
            <div class="sylva-frame-window" id="sylva-window">
              <div class="sylva-frame-bar">
                <div class="sylva-frame-bar-left">
                  <span class="sylva-live-dot" aria-hidden="true"></span>
                  <span class="sylva-frame-title">${TS.frameHeader}</span>
                </div>
                <span class="sylva-frame-badge">PROCEDURAL 3D</span>
              </div>
              <div class="sylva-viewport-container">
                <div class="corner-tick tick-tl" aria-hidden="true"></div>
                <div class="corner-tick tick-tr" aria-hidden="true"></div>
                <div class="corner-tick tick-bl" aria-hidden="true"></div>
                <div class="corner-tick tick-br" aria-hidden="true"></div>
                
                <div
                  class="threeui-background sylva-living-world-scene"
                  id="sylva-host"
                  role="img"
                  aria-label="${TS.sceneLabel}"
                  data-variant="living-green"
                >
                  <div class="sylva-fallback" id="sylva-fallback" style="display:none;">
                    <p class="sylva-fallback-title">${TS.fallbackText}</p>
                    <span class="sylva-fallback-caption">${TS.sceneCaption}</span>
                  </div>
                  <iframe
                    id="sylva-iframe"
                    title="${TS.sceneLabel}"
                    sandbox="allow-scripts"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
              <figcaption class="sylva-frame-caption">${TS.sceneCaption}</figcaption>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- Section 4: NEXUS Scene (Floating Chat Parallax)
  const nexusSceneEl = $('#nexus-scene');
  if (nexusSceneEl && D.nexusScene) {
    const NS = D.nexusScene;
    nexusSceneEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(NS.chapter, NS.title, NS.hi)}</p>
        <h2>${NS.title}</h2>
        <p class="lead">${NS.subtitle}</p>
        <div class="chat-showcase">
          <div class="chat-frame">
            <div class="chat-header">
              <div class="chat-header-title">
                <div class="chat-avatar-group">NX</div>
                <div>
                  <h4 style="font-size:0.95rem; margin:0;">ARRIVA Dev Channel</h4>
                  <span style="font-size:0.75rem; color:var(--mint);">Active · Zero Telemetry</span>
                </div>
              </div>
              <span class="tag-pill">Kotlin Native</span>
            </div>
            <div class="chat-body" id="chat-body">
              ${NS.bubbles.map(b => `
                <div class="bubble ${b.isMe ? 'outgoing' : 'incoming'}" data-speed="${b.speed}">
                  <div class="bubble-sender">${b.sender}</div>
                  <div>${b.text}</div>
                  <div class="bubble-time">${b.time} · Delivered</div>
                </div>
              `).join('')}
              <div class="typing-box" id="typing-box">
                <div class="typing-dots"><span></span><span></span><span></span></div>
                <span>${NS.typingLabel}</span>
              </div>
            </div>
          </div>
          <div class="chat-info-panel copy">
            <h3>Zero Feeds. Pure Messaging.</h3>
            <p class="lead" style="font-size: 0.96rem;">
              NEXUS replaces algorithmic distraction with high-velocity conversation threads.
              All messages cache on your device, delivering offline access and instantaneous responses.
            </p>
            <ul class="points-list">
              <li>End-to-end local SQLite database storage</li>
              <li>Minimal battery overhead on Android devices</li>
              <li>No surveillance telemetry or advertising hooks</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // --- Section 5: How It Works (Sequence)
  const howEl = $('#how-it-works');
  if (howEl && D.howItWorks) {
    const HW = D.howItWorks;
    howEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(HW.chapter, HW.title, HW.hi)}</p>
        <h2>${HW.title}</h2>
        <p class="lead">${HW.subtitle}</p>
        <div class="how-grid">
          ${HW.categories.map(cat => `
            <div class="how-col">
              <div class="how-col-header">
                <span class="tag-pill"><span class="hi">${cat.hi}</span>System Sequence</span>
                <h3>${cat.name}</h3>
              </div>
              ${cat.steps.map(st => `
                <div class="how-step">
                  <div class="how-badge">${st.num}</div>
                  <div class="how-step-content">
                    <h4>${st.title}</h4>
                    <p>${st.desc}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Section 6: About (Light Lavender Band & Principles)
  const aboutEl = $('#about');
  if (aboutEl && D.about) {
    const AB = D.about;
    aboutEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(AB.chapter, AB.label || AB.title, AB.hi)}</p>
        <h2>${AB.title}</h2>
        <p class="lead">${AB.text}</p>
        <div class="principles-grid">
          ${AB.principles.map(pr => `
            <div class="principle-card">
              <div class="principle-num">${pr.num} <span class="tag-pill"><span class="hi">${pr.hi}</span>Principle</span></div>
              <h3>${pr.title}</h3>
              <p>${pr.desc}</p>
            </div>
          `).join('')}
        </div>
        <div class="about-stats">
          ${AB.stats.map(st => `
            <div class="about-stat">
              <b data-count>${st[0]}</b>
              <span>${st[1]}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Section 7: Journey Timeline
  const timeEl = $('#timeline');
  if (timeEl && D.timeline) {
    const TL = D.timeline;
    timeEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(TL.chapter, TL.title, TL.hi)}</p>
        <h2>${TL.title}</h2>
        <p class="lead">${TL.subtitle}</p>
        <div class="timeline-wrap" id="timeline-box">
          <div class="timeline-spine">
            <div class="timeline-fill" id="timeline-fill"></div>
          </div>
          <div class="timeline-items" id="timeline-items">
            ${TL.steps.map(st => `
              <div class="timeline-item" data-step="${st.step}">
                <div class="timeline-node">${st.step}</div>
                <div class="timeline-card">
                  <div class="timeline-card-header">
                    <span class="tag-pill"><span class="hi">${st.hi}</span>Phase ${st.step} · ${st.phase}</span>
                    <span class="status">${st.status}</span>
                  </div>
                  <h3>${st.title}</h3>
                  <p>${st.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // --- Section 8: Team (3D Tilt Cards)
  const teamEl = $('#team');
  if (teamEl && D.team) {
    const TM = D.team;
    teamEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(TM.chapter, TM.title, TM.hi)}</p>
        <h2>${TM.title}</h2>
        <p class="lead">${TM.subtitle}</p>
        <div class="team-grid">
          ${TM.members.map(m => `
            <div class="team-card" data-tilt>
              <div class="team-photo-wrap">
                <img src="${m.photo}" alt="${m.name} - ${m.role}" loading="lazy">
              </div>
              <div class="team-info">
                <h3>${m.name}</h3>
                <span class="team-role"><span class="hi">${m.hi}</span>${m.role}</span>
                <p class="team-line">${m.line}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Section 9: Updates (Field Notes)
  const updEl = $('#updates');
  if (updEl && D.updates) {
    const UP = D.updates;
    updEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(UP.chapter, UP.title, UP.hi)}</p>
        <h2>${UP.title}</h2>
        <p class="lead">${UP.subtitle}</p>
        <div class="updates-grid">
          ${UP.items.map(u => `
            <article class="update-card">
              <div class="update-cover-wrap">
                <img src="${u.cover}" alt="${u.title} cover" loading="lazy">
              </div>
              <div class="update-content">
                <div class="update-meta">
                  <span class="tag-pill">${u.tag}</span>
                  <time>${u.date}</time>
                </div>
                <h3>${u.title}</h3>
                <p>${u.excerpt}</p>
                <a class="update-link" href="${u.link}">Read dispatch &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --- Section 10: FAQ (Accessible Accordions)
  const faqEl = $('#faq');
  if (faqEl && D.faq) {
    const FQ = D.faq;
    faqEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(FQ.chapter, FQ.title, FQ.hi)}</p>
        <h2>${FQ.title}</h2>
        <p class="lead">${FQ.subtitle}</p>
        <div class="faq-list" role="region" aria-label="FAQ Accordion">
          ${FQ.items.map((item, idx) => `
            <div class="faq-item" id="faq-item-${idx}">
              <button class="faq-q" aria-expanded="false" aria-controls="faq-ans-${idx}" id="faq-btn-${idx}">
                <span>${item.q}</span>
                <span class="faq-icon" aria-hidden="true">+</span>
              </button>
              <div class="faq-a" id="faq-ans-${idx}" role="region" aria-labelledby="faq-btn-${idx}">
                <div class="faq-a-inner">
                  <p>${item.a}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // FAQ keyboard & click toggle
    $$('.faq-q', faqEl).forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        const ans = $('.faq-a', item);

        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          ans.style.maxHeight = '0px';
        } else {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    });
  }

  // --- Section 11: Community / Afterlight
  const commEl = $('#community');
  if (commEl && D.community) {
    const CM = D.community;
    commEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(CM.chapter, CM.label || CM.title, CM.hi)}</p>
        <h2>${CM.title}</h2>
        <p class="lead">${CM.lead}</p>
        <div class="row">
          ${CM.social.map(s => `<a class="btn" href="${s[1]}" target="_blank" rel="noopener noreferrer" data-magnet>${s[0]}</a>`).join('')}
          <a class="btn solid" href="mailto:${CM.email}" data-magnet>${CM.ctaLabel} (${CM.email})</a>
        </div>
      </div>
      <div class="giant" aria-hidden="true">${CM.wordmark}</div>
    `;
  }

  // --- Section 12: Footer
  const footEl = $('#foot');
  if (footEl && D.footer) {
    const FT = D.footer;
    footEl.innerHTML = `
      <div class="wrap">
        <div class="foot-grid">
          <div class="foot-brand">
            <a class="mark" href="#top" aria-label="ARRIVA home">${FT.wordmark}<span>.</span></a>
            <p>${FT.tagline}</p>
          </div>
          ${FT.columns.map(col => `
            <div class="foot-col">
              <h4>${col.title}</h4>
              <ul>
                ${col.links.map(l => `<li><a href="${l[1]}">${l[0]}</a></li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        <div class="foot-privacy-note">
          ${FT.privacyNote}
        </div>
        <div class="foot-bottom">
          <span>&copy; <span id="yr">${new Date().getFullYear()}</span> ${FT.copyrightNotice}</span>
          <a class="back-to-top" href="#top" data-magnet>&uarr; Return to top</a>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 2. PRELOADER ORCHESTRATION
  // ==========================================
  let pctVal = 0, isReady = false;
  const pctEl = $('#pct'), barEl = $('#bar');
  const t0 = performance.now();
  const minLoadTime = rm ? 0 : 1400;

  Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(resolve => window.addEventListener('load', resolve, { once: true }))
  ]).then(() => { isReady = true; });

  function tickPreloader() {
    const elapsed = performance.now() - t0;
    pctVal = Math.min(isReady ? 100 : 92, Math.max(pctVal, Math.min(100, (elapsed / minLoadTime) * 100)));
    pctVal = Math.round(pctVal);

    if (pctEl) pctEl.textContent = pctVal + '%';
    if (barEl) barEl.style.width = pctVal + '%';

    if (pctVal < 100 || elapsed < minLoadTime) {
      requestAnimationFrame(tickPreloader);
    } else {
      const pre = $('#pre');
      if (pre) {
        pre.classList.add('done');
        document.body.classList.remove('loading');
        setTimeout(() => pre.remove(), 1200);
      }
    }
  }
  requestAnimationFrame(tickPreloader);

  // ==========================================
  // 3. UNIFIED rAF SCROLL HANDLER
  // ==========================================
  const secs = $$('[data-scene]');
  const parallaxEls = $$('[data-speed]');
  const progEl = $('#prog');
  const headerEl = $('#header');
  const routeLine = $('#route-line');
  const topoWrap = $('#topo-wrap');
  const galTrack = $('#gallery-track');
  const galCounter = $('#gallery-counter');
  const galCaption = $('#gallery-caption');
  const galTabs = $$('.gallery-tab');
  const timeFill = $('#timeline-fill');
  const timeItems = $$('.timeline-item');

  let routeLineLen = 1000;
  if (routeLine) {
    try {
      routeLineLen = routeLine.getTotalLength();
      routeLine.style.strokeDasharray = `${routeLineLen} ${routeLineLen}`;
      routeLine.style.strokeDashoffset = `${routeLineLen}`;
    } catch (e) {}
  }

  let ticking = false;

  function onScrollTick() {
    ticking = false;
    const y = window.scrollY;
    const H = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const maxScroll = docH - H;

    // Progress bar & header solid
    if (progEl) progEl.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;
    if (headerEl) headerEl.classList.toggle('solid', y > 40);

    // 3D Scene float cross-fade
    const yc = y + H / 2;
    let sceneIndex = 0;
    secs.forEach((s, idx) => {
      if (s.offsetTop <= yc) sceneIndex = idx;
    });
    const currSec = secs[sceneIndex];
    const nextSec = secs[sceneIndex + 1];
    let sceneVal = currSec ? +currSec.dataset.scene : 0;
    if (nextSec) {
      const t = (yc - currSec.offsetTop) / (nextSec.offsetTop - currSec.offsetTop);
      sceneVal = +currSec.dataset.scene + (+nextSec.dataset.scene - +currSec.dataset.scene) * Math.max(0, Math.min(1, (t - 0.4) / 0.6));
    }
    if (window.WORLD && typeof window.WORLD.set === 'function') {
      window.WORLD.set(sceneVal);
    }

    // Parallax elements
    if (!rm) {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.speed) || 0;
        const offset = (r.top + r.height / 2 - H / 2) * speed * -1;
        el.style.setProperty('--py', offset.toFixed(1) + 'px');
      });

      // Hero wrap fade
      const topWrap = $('#top .wrap');
      if (topWrap) {
        topWrap.style.transform = `translateY(${(Math.min(y, H) * 0.18).toFixed(1)}px)`;
        topWrap.style.opacity = (1 - Math.min(y / (H * 0.8), 1)).toFixed(2);
      }
    }

    // Pinned Horizontal Gallery
    if (galEl && galTrack && innerWidth > 800 && !rm) {
      const gRect = galEl.getBoundingClientRect();
      const gTop = galEl.offsetTop;
      const gHeight = galEl.offsetHeight;
      const gScrollable = gHeight - H;

      if (gScrollable > 0) {
        const progress = Math.max(0, Math.min(1, (y - gTop) / gScrollable));
        const maxTranslate = galTrack.scrollWidth - (galTrack.parentElement.clientWidth || innerWidth);
        if (maxTranslate > 0) {
          galTrack.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
        }

        // Active Group & Caption
        if (D.screensGallery) {
          const groupCount = D.screensGallery.groups.length;
          const activeIdx = Math.min(groupCount - 1, Math.floor(progress * groupCount));
          if (galCounter) galCounter.textContent = `0${activeIdx + 1} / ${D.screensGallery.counterTotal}`;
          if (galCaption && D.screensGallery.groups[activeIdx]) {
            galCaption.textContent = D.screensGallery.groups[activeIdx].caption;
          }
          galTabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === activeIdx);
          });
        }
      }
    }

    // Route line drawing & waypoint highlight on scroll (Tourist Guide Scene)
    if (routeLine && topoWrap) {
      const rRect = topoWrap.getBoundingClientRect();
      const rProg = Math.max(0, Math.min(1, (H * 0.75 - rRect.top) / rRect.height));
      routeLine.style.strokeDashoffset = `${Math.max(0, 1 - rProg) * routeLineLen}`;

      const waypoints = topoWrap.querySelectorAll('.trail-waypoint-item');
      if (waypoints.length) {
        waypoints.forEach((wp, idx) => {
          const threshold = (idx + 0.2) / waypoints.length;
          wp.classList.toggle('active', rProg >= threshold);
        });
      }
    }

    // Sylva scene hold check: pause #world background render while frame is >= 50% visible
    const sylvaWin = document.getElementById('sylva-window');
    if (sylvaWin && window.WORLD && typeof window.WORLD.hold === 'function') {
      const swr = sylvaWin.getBoundingClientRect();
      const visibleH = Math.max(0, Math.min(swr.bottom, H) - Math.max(swr.top, 0));
      const isHalfVis = swr.height > 0 && (visibleH / swr.height >= 0.5);
      window.WORLD.hold(isHalfVis);
    }

    // Timeline fill line & active items
    if (timeFill && timeEl) {
      const tRect = timeEl.getBoundingClientRect();
      const tProg = Math.max(0, Math.min(1, (H - tRect.top - 100) / tRect.height));
      timeFill.style.height = `${tProg * 100}%`;

      timeItems.forEach(item => {
        const ir = item.getBoundingClientRect();
        if (ir.top <= H * 0.7) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  function requestScrollTick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScrollTick);
    }
  }

  window.addEventListener('scroll', requestScrollTick, { passive: true });
  window.addEventListener('resize', requestScrollTick, { passive: true });
  requestScrollTick();

  // Gallery tabs click handler
  if (galTabs.length && galEl) {
    galTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        if (innerWidth > 800 && !rm) {
          const gTop = galEl.offsetTop;
          const gScrollable = galEl.offsetHeight - innerHeight;
          const targetY = gTop + (idx / (galTabs.length - 1)) * gScrollable;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        } else {
          const groups = $$('.gallery-group', galTrack);
          if (groups[idx]) {
            groups[idx].scrollIntoView({ behavior: 'smooth', inline: 'start' });
          }
        }
      });
    });
  }

  // ==========================================
  // 4. INTERSECTION OBSERVER & COUNTERS
  // ==========================================
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');

        // Number count animation
        if (entry.target.dataset.count !== undefined && !entry.target.done) {
          entry.target.done = true;
          const text = entry.target.textContent.trim();
          const match = text.match(/^(\d+)(.*)$/);
          if (match && !rm) {
            const num = +match[1];
            const suffix = match[2];
            const startT = performance.now();
            const duration = 1200;

            function countStep(now) {
              const p = Math.min(1, (now - startT) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              entry.target.textContent = Math.round(num * eased) + suffix;
              if (p < 1) requestAnimationFrame(countStep);
            }
            requestAnimationFrame(countStep);
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  $$('.copy, .how-col, .principle-card, .team-card, .update-card, [data-count]').forEach(el => io.observe(el));

  // ==========================================
  // 5. ORVIX TERMINAL LIVE TYPING DEMO
  // ==========================================
  let termRan = false;
  const termBox = $('#terminal-box');

  function runTerminalSequence() {
    const cmd1El = $('#term-cmd-1');
    const logs1El = $('#term-logs-1');
    const line2El = $('#term-line-2');
    const cmd2El = $('#term-cmd-2');
    const jsonEl = $('#term-json');
    const curEl = $('#term-cur');

    if (!cmd1El || !D.orvixDemo) return;

    // Reset state
    cmd1El.textContent = '';
    if (logs1El) logs1El.style.display = 'none';
    if (line2El) line2El.style.display = 'none';
    if (cmd2El) cmd2El.textContent = '';
    if (jsonEl) {
      jsonEl.style.display = 'none';
      jsonEl.innerHTML = '';
    }
    if (curEl) curEl.style.display = 'inline-block';

    const cmd1Text = D.orvixDemo.terminal.command1;
    const cmd2Text = D.orvixDemo.terminal.command2;
    let i = 0;

    function typeCmd1() {
      if (i < cmd1Text.length) {
        cmd1El.textContent += cmd1Text.charAt(i);
        i++;
        setTimeout(typeCmd1, rm ? 0 : 50);
      } else {
        setTimeout(() => {
          if (logs1El) logs1El.style.display = 'block';
          if (line2El) line2El.style.display = 'block';
          i = 0;
          setTimeout(typeCmd2, rm ? 0 : 300);
        }, rm ? 0 : 400);
      }
    }

    function typeCmd2() {
      if (cmd2El && i < cmd2Text.length) {
        cmd2El.textContent += cmd2Text.charAt(i);
        i++;
        setTimeout(typeCmd2, rm ? 0 : 20);
      } else {
        setTimeout(showJsonReply, rm ? 0 : 400);
      }
    }

    function showJsonReply() {
      if (!jsonEl) return;
      const json = D.orvixDemo.terminal.jsonOutput;
      const formatted = '{\n' +
        '  <span class="json-key">"model"</span>: <span class="json-str">"' + json.model + '"</span>,\n' +
        '  <span class="json-key">"response"</span>: <span class="json-str">"' + json.response + '"</span>,\n' +
        '  <span class="json-key">"done"</span>: <span class="json-bool">' + json.done + '</span>,\n' +
        '  <span class="json-key">"total_duration"</span>: <span class="json-str">"' + json.total_duration + '"</span>,\n' +
        '  <span class="json-key">"eval_count"</span>: <span class="json-num">' + json.eval_count + '</span>,\n' +
        '  <span class="json-key">"eval_rate"</span>: <span class="json-str">"' + json.eval_rate + '"</span>\n' +
        '}';
      jsonEl.innerHTML = formatted;
      jsonEl.style.display = 'block';
      if (curEl) curEl.style.display = 'none';
    }

    typeCmd1();
  }

  if (termBox) {
    const termObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !termRan) {
        termRan = true;
        runTerminalSequence();
        termObserver.disconnect();
      }
    }, { threshold: 0.35 });
    termObserver.observe(termBox);

    const replayBtn = $('#replay-term-btn');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        runTerminalSequence();
      });
    }
  }

  // ==========================================
  // 5b. SYLVA LIVING WORLD SCENE ADAPTER (LAZY-LOAD, MOTION, FALLBACK)
  // ==========================================
  const sylvaHost = $('#sylva-host');
  const sylvaIframe = $('#sylva-iframe');
  const sylvaFallback = $('#sylva-fallback');

  function checkWebGL() {
    try {
      const testCanvas = document.createElement('canvas');
      return Boolean(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  if (sylvaHost && sylvaIframe) {
    if (!checkWebGL()) {
      if (sylvaFallback) sylvaFallback.style.display = 'flex';
      sylvaIframe.style.display = 'none';
    } else {
      let isNearViewport = false;

      function getSylvaSrc() {
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return isReduced ? 'vendor/sylva/living-green-reduced.html' : 'vendor/sylva/living-green.html';
      }

      function syncIframe() {
        const shouldMount = isNearViewport && !document.hidden;
        if (shouldMount) {
          const targetSrc = getSylvaSrc();
          const currentSrc = sylvaIframe.getAttribute('src');
          if (currentSrc !== targetSrc) {
            sylvaIframe.setAttribute('src', targetSrc);
          }
        } else {
          if (sylvaIframe.hasAttribute('src')) {
            sylvaIframe.removeAttribute('src');
          }
        }
      }

      const lazyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          isNearViewport = entry.isIntersecting;
          syncIframe();
        });
      }, { rootMargin: '100% 0px' });
      lazyObserver.observe(sylvaHost);

      document.addEventListener('visibilitychange', syncIframe);

      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', syncIframe);
      }
    }
  }

  // ==========================================
  // 6. CURSOR GLOW, MAGNETIC BUTTONS & 3D TILT
  // ==========================================
  if (fine && !rm) {
    // Cursor glow
    const glow = $('#glow');
    if (glow) {
      let gx = 0, gy = 0, tx = 0, ty = 0;
      window.addEventListener('pointermove', e => {
        tx = e.clientX;
        ty = e.clientY;
        glow.style.opacity = '1';
      }, { passive: true });

      function loopGlow() {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate(${gx}px, ${gy}px)`;
        requestAnimationFrame(loopGlow);
      }
      requestAnimationFrame(loopGlow);
    }

    // Magnetic buttons
    $$('[data-magnet]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.28;
        const my = (e.clientY - r.top - r.height / 2) * 0.38;
        el.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });

    // 3D Tilt on team cards
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const rx = -(y / (r.height / 2)) * 8;
        const ry = (x / (r.width / 2)) * 8;
        card.style.transform = `perspective(700px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

})();
