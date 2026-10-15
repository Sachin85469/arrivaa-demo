// ARRIVA - Interactive Frontend Engine & Motion Orchestration
// Integrates Lenis smooth inertia, GSAP, high-contrast Three.js World,
// phone/browser device frames, and copy-honest dynamic rendering from content.js.

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
  // 1. REUSABLE DEVICE FRAME BUILDER
  // ==========================================
  function createDeviceFrame(src, alt, deviceType = 'phone') {
    const isSvgPlaceholder = typeof src === 'string' && (src.endsWith('.svg') || src.includes('placeholder'));
    const placeholderBadge = isSvgPlaceholder
      ? '<span class="placeholder-tag" aria-label="Mockup placeholder">PLACEHOLDER</span>'
      : '';

    if (deviceType === 'browser') {
      return `
        <div class="device-frame device-browser">
          <div class="browser-header">
            <div class="browser-controls">
              <span class="b-dot red"></span>
              <span class="b-dot yellow"></span>
              <span class="b-dot green"></span>
            </div>
            <div class="browser-address">localhost:11434 / orvix</div>
            ${placeholderBadge}
          </div>
          <div class="browser-screen">
            <img src="${src}" alt="${alt}" loading="lazy">
          </div>
        </div>
      `;
    }

    return `
      <div class="device-frame device-phone">
        <div class="phone-bezel">
          <div class="phone-notch">
            <span class="phone-speaker"></span>
            <span class="phone-lens"></span>
          </div>
          ${placeholderBadge}
          <div class="phone-screen">
            <img src="${src}" alt="${alt}" loading="lazy">
          </div>
          <div class="phone-home-indicator"></div>
        </div>
      </div>
    `;
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

  // ==========================================
  // 2. DYNAMIC DOM GENERATION FROM content.js
  // ==========================================

  // --- Preloader Texts
  const preHi = $('#pre-hi'), preTitle = $('#pre-title');
  if (preHi && D.preloader) preHi.textContent = D.preloader.hi;
  if (preTitle && D.preloader) preTitle.textContent = D.preloader.title;

  // --- Header & Brand Logo
  const logo = $('#brand-logo');
  if (logo && D.brand) {
    logo.innerHTML = `${D.brand.name}<span>${D.brand.markSuffix}</span>`;
  }

  // --- Primary Navigation
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

  // --- Chapter 00: Hero
  const heroLabel = $('#hero-label'), h1 = $('#h1'), lead = $('#lead'), heroCta = $('#hero-cta'), heroScroll = $('#hero-scroll');
  if (heroLabel && D.hero) {
    heroLabel.innerHTML = formatHeader(D.hero.chapter, "THE ARRIVAL", D.hero.hi);
  }
  if (h1 && D.hero) {
    h1.setAttribute('aria-label', D.hero.title);
    h1.innerHTML = D.hero.title.split(' ').map((w, i) =>
      `<span class="w" aria-hidden="true"><span class="reveal-word" style="--d:${(i * 0.08).toFixed(2)}s">${w}</span></span>`
    ).join(' ');
  }
  if (lead && D.hero) lead.textContent = D.hero.sub;
  if (heroCta && D.hero) {
    heroCta.innerHTML = `
      <a class="btn solid" href="${D.hero.ctaPrimary.href}" data-magnet>${D.hero.ctaPrimary.label}</a>
      <a class="btn" href="${D.hero.ctaSecondary.href}" data-magnet>${D.hero.ctaSecondary.label}</a>
    `;
  }
  if (heroScroll && D.hero) heroScroll.textContent = D.hero.scrollHint;

  // --- Chapters 01, 02, 03: Product Chapters
  const chaptersEl = $('#chapters');
  if (chaptersEl && D.products) {
    chaptersEl.innerHTML = D.products.map((p, i) => {
      const isTourist = p.id === 'tourist-guide';
      const isNexus = p.id === 'nexus';
      const isOrvix = p.id === 'orvix';

      // Specific rich showcase layout per product
      let visualSide = '';
      if (isTourist && D.touristGuideScene) {
        const TS = D.touristGuideScene;
        visualSide = `
          <div class="product-visual tourist-visual-box" id="tourist-interactive-scene">
            <div class="topo-stats-banner">
              ${TS.trailStats.map(st => `
                <div class="topo-pill"><b>${st[0]}</b><span>${st[1]}</span></div>
              `).join('')}
            </div>
            <div class="topo-interactive-box" id="topo-wrap">
              <div class="topo-pins-list" id="topo-pins">
                ${TS.pins.map((pin, idx) => `
                  <div class="topo-pin-card" data-pin-idx="${idx}" tabindex="0" role="button" aria-label="Inspect 3D waypoint ${idx + 1}: ${pin.name}">
                    <div class="topo-pin-header">
                      <span class="pin-idx">0${idx + 1}</span>
                      <div class="pin-titles">
                        <h4>${pin.name}</h4>
                        <span class="pin-cat"><span class="hi">${pin.hi}</span>${pin.category}</span>
                      </div>
                      <span class="pin-elev">${pin.elevation}</span>
                    </div>
                    <p class="pin-desc">${pin.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            <p class="topo-hint">${TS.hint}</p>
          </div>
        `;
      } else if (isNexus) {
        visualSide = `
          <div class="product-visual nexus-visual-box" id="nexus-visual">
            <div class="nexus-device-wrap">
              ${createDeviceFrame(p.images[0], `${p.name} primary screen`, 'phone')}
            </div>
            <div class="nexus-floating-preview">
              <div class="bubble incoming" style="--py:-12px;">
                <span class="bubble-sender">Sachin K.</span>
                <p>Ollama socket verified on ORVIX. Local inference is ready.</p>
                <span class="bubble-time">10:24 AM · Verified</span>
              </div>
              <div class="bubble outgoing" style="--py:14px;">
                <span class="bubble-sender">You</span>
                <p>Tourist Guide offline route caching confirmed. Clean build packaged.</p>
                <span class="bubble-time">10:25 AM · Delivered</span>
              </div>
            </div>
          </div>
        `;
      } else {
        // ORVIX
        visualSide = `
          <div class="product-visual orvix-visual-box">
            <div class="orvix-browser-wrap">
              ${createDeviceFrame(p.images[1] || p.images[0], `${p.name} console screen`, 'browser')}
            </div>
          </div>
        `;
      }

      return `
        <section class="chapter ${i % 2 ? 'flip' : ''}" id="${p.id}" data-scene="${(i + 1).toFixed(1)}">
          ${isTourist ? '<div id="tourist-guide-scene" style="position:absolute; top:0; left:0; width:1px; height:1px;"></div>' : ''}
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
            <div class="showcase-col">
              ${visualSide}
            </div>
          </div>
        </section>
      `;
    }).join('');
  }

  // --- Chapter 04: Screens Gallery (Pinned Horizontal Walk)
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
                      ${createDeviceFrame(s.src, s.alt, grp.deviceType || 'phone')}
                      <span class="screen-title">${s.title}</span>
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

  // --- Chapter 05: ORVIX Live Demo (Interactive Terminal Simulation)
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

  // --- Chapter 06: How It Works (Sequence)
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
                <span class="tag-pill"><span class="hi">${cat.hi}</span>Sequence</span>
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

  // --- Chapter 07: About & Team (Consolidated Philosophy, Principles, Stats, Timeline, and Team)
  const aboutEl = $('#about');
  if (aboutEl && D.about) {
    const AB = D.about;
    aboutEl.innerHTML = `
      <div class="wrap">
        <div class="about-hero-block">
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

        <!-- Integrated Team Section -->
        ${AB.team ? `
          <div class="team-sub-block" id="team">
            <div class="section-subhead">
              <span class="tag-pill">Builders</span>
              <h3>The workbench team</h3>
              <p class="lead">Hands-on engineers and designers building clean digital tools.</p>
            </div>
            <div class="team-grid">
              ${AB.team.map(m => `
                <div class="team-card" data-tilt>
                  <div class="team-photo-wrap">
                    <img src="${m.photo}" alt="${m.name} - ${m.role}" loading="lazy">
                  </div>
                  <div class="team-info">
                    <h4>${m.name}</h4>
                    <span class="team-role"><span class="hi">${m.hi}</span>${m.role}</span>
                    <p class="team-line">${m.line}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Integrated Journey Timeline -->
        ${AB.timeline ? `
          <div class="timeline-sub-block" id="timeline">
            <div class="section-subhead">
              <span class="tag-pill">Milestones</span>
              <h3>Journey timeline</h3>
              <p class="lead">From initial scratchpad problem statements to community-tested software.</p>
            </div>
            <div class="timeline-wrap" id="timeline-box">
              <div class="timeline-spine">
                <div class="timeline-fill" id="timeline-fill"></div>
              </div>
              <div class="timeline-items" id="timeline-items">
                ${AB.timeline.map(st => `
                  <div class="timeline-item" data-step="${st.step}">
                    <div class="timeline-node">${st.step}</div>
                    <div class="timeline-card">
                      <div class="timeline-card-header">
                        <span class="tag-pill"><span class="hi">${st.hi}</span>Phase ${st.step} · ${st.phase}</span>
                        <span class="status">${st.status}</span>
                      </div>
                      <h4>${st.title}</h4>
                      <p>${st.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // --- Chapter 08: Updates & Build Notes
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

  // --- Chapter 09: FAQ (Accessible Accordions)
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

    // FAQ Accordion Toggle
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
          ans.style.maxHeight = (ans.scrollHeight + 30) + 'px';
        }
      });
    });

    window.addEventListener('resize', () => {
      $$('.faq-item.open .faq-a', faqEl).forEach(ans => {
        ans.style.maxHeight = (ans.scrollHeight + 30) + 'px';
      });
    }, { passive: true });
  }

  // --- Outro: Community / Afterlight
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

  // --- Footer: Consistent Chapters Directory & Legal
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
  // 3. PRELOADER ORCHESTRATION
  // ==========================================
  let pctVal = 0, isReady = false;
  const pctEl = $('#pct'), barEl = $('#bar');
  const t0 = performance.now();
  const minLoadTime = rm ? 0 : 1200;

  Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise(resolve => window.addEventListener('load', resolve, { once: true }))
  ]).then(() => { isReady = true; });

  function tickPreloader() {
    const elapsed = performance.now() - t0;
    pctVal = Math.min(isReady ? 100 : 92, Math.max(pctVal, Math.min(100, (elapsed / minLoadTime) * 100)));
    pctVal = Math.round(pctVal);

    const pre = $('#pre');
    if (pctEl) pctEl.textContent = pctVal + '%';
    if (barEl) barEl.style.width = pctVal + '%';
    if (pre) pre.setAttribute('aria-valuenow', String(pctVal));

    if (pctVal < 100 || elapsed < minLoadTime) {
      requestAnimationFrame(tickPreloader);
    } else {
      if (pre) {
        pre.classList.add('done');
        document.body.classList.remove('loading');
        setTimeout(() => pre.remove(), 1200);
      }
    }
  }
  requestAnimationFrame(tickPreloader);

  // ==========================================
  // 4. LENIS SMOOTH INERTIAL SCROLL SETUP
  // ==========================================
  let lenis = null;
  if (typeof window.Lenis !== 'undefined' && !rm) {
    try {
      lenis = new window.Lenis({
        duration: 1.1,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 1.5
      });

      function lenisLoop(time) {
        lenis.raf(time);
        requestAnimationFrame(lenisLoop);
      }
      requestAnimationFrame(lenisLoop);

      // Handle anchor link smooth scrolling via Lenis
      $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
          const targetId = anchor.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetEl = $(targetId);
            if (targetEl && lenis) {
              e.preventDefault();
              lenis.scrollTo(targetEl, { offset: -60 });
            }
          }
        });
      });
    } catch (e) {
      console.warn('Lenis initialization bypassed:', e);
    }
  }

  // ==========================================
  // 5. UNIFIED SCROLL DISPATCHER & 3D INTERACTION
  // ==========================================
  const secs = $$('[data-scene]');
  const progEl = $('#prog');
  const headerEl = $('#header');
  const galTrack = $('#gallery-track');
  const galCounter = $('#gallery-counter');
  const galCaption = $('#gallery-caption');
  const galTabs = $$('.gallery-tab');
  const timeFill = $('#timeline-fill');
  const timeItems = $$('.timeline-item');
  const topoPins = $$('.topo-pin-card');

  // Waypoint hover/click triggers 3D pin highlight
  if (topoPins.length) {
    topoPins.forEach((card, idx) => {
      card.addEventListener('pointerenter', () => {
        topoPins.forEach(p => p.classList.remove('active'));
        card.classList.add('active');
        if (window.WORLD && typeof window.WORLD.highlightPin === 'function') {
          window.WORLD.highlightPin(idx);
        }
      });
      card.addEventListener('click', () => {
        topoPins.forEach(p => p.classList.remove('active'));
        card.classList.add('active');
        if (window.WORLD && typeof window.WORLD.highlightPin === 'function') {
          window.WORLD.highlightPin(idx);
        }
      });
    });
  }

  let isScrollTicking = false;

  function onScroll() {
    isScrollTicking = false;
    const y = window.scrollY;
    const H = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const maxScroll = docH - H;

    // Progress bar & header solid
    if (progEl) progEl.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;
    if (headerEl) headerEl.classList.toggle('solid', y > 40);

    // Continuous 3D World Scene progress (0.0 -> 4.0) with chapter hold
    let sceneIndex = 0;
    secs.forEach((s, idx) => {
      if (s.offsetTop <= y + 60) sceneIndex = idx;
    });

    const currSec = secs[sceneIndex];
    const nextSec = secs[sceneIndex + 1];
    let sceneVal = currSec ? +currSec.dataset.scene : 0;

    if (nextSec && currSec) {
      const segH = nextSec.offsetTop - currSec.offsetTop;
      if (segH > 0) {
        const segProgress = Math.max(0, Math.min(1, (y - currSec.offsetTop) / segH));
        // Hold current scene for first 55% of section, then smoothly transition over remaining 45%
        if (segProgress > 0.55) {
          const t = (segProgress - 0.55) / 0.45;
          const easedT = t * t * (3 - 2 * t);
          sceneVal = +currSec.dataset.scene + (+nextSec.dataset.scene - +currSec.dataset.scene) * easedT;
        }
      }
    }

    if (window.WORLD && typeof window.WORLD.set === 'function') {
      window.WORLD.set(sceneVal);
    }

    // Hero wrap fade & motion
    if (!rm) {
      const topWrap = $('#top .wrap');
      if (topWrap) {
        topWrap.style.transform = `translateY(${(Math.min(y, H) * 0.16).toFixed(1)}px)`;
        topWrap.style.opacity = (1 - Math.min(y / (H * 0.8), 1)).toFixed(2);
      }
    }

    // Pinned Horizontal Gallery
    if (galEl && galTrack && innerWidth > 800 && !rm) {
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

    // Timeline fill line & active items
    if (timeFill && $('#about')) {
      const timeBox = $('#timeline');
      if (timeBox) {
        const tRect = timeBox.getBoundingClientRect();
        const tProg = Math.max(0, Math.min(1, (H - tRect.top - 100) / tRect.height));
        timeFill.style.height = `${tProg * 100}%`;

        timeItems.forEach(item => {
          const ir = item.getBoundingClientRect();
          item.classList.toggle('active', ir.top <= H * 0.75);
        });
      }
    }
  }

  function requestTick() {
    if (!isScrollTicking) {
      isScrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  requestTick();

  // Mobile gallery horizontal swipe sync
  const galViewport = $('#gallery-viewport');
  if (galViewport && D.screensGallery) {
    galViewport.addEventListener('scroll', () => {
      if (innerWidth <= 800) {
        const scrollLeft = galViewport.scrollLeft;
        const cardWidth = galViewport.clientWidth || 1;
        const groupCount = D.screensGallery.groups.length;
        const activeIdx = Math.min(groupCount - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
        if (galCounter) galCounter.textContent = `0${activeIdx + 1} / ${D.screensGallery.counterTotal}`;
        if (galCaption && D.screensGallery.groups[activeIdx]) {
          galCaption.textContent = D.screensGallery.groups[activeIdx].caption;
        }
        galTabs.forEach((tab, i) => {
          tab.classList.toggle('active', i === activeIdx);
        });
      }
    }, { passive: true });
  }

  // Gallery tabs click handler
  if (galTabs.length && galEl) {
    galTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        galTabs.forEach((t, i) => t.classList.toggle('active', i === idx));
        if (galCaption && D.screensGallery && D.screensGallery.groups[idx]) {
          galCaption.textContent = D.screensGallery.groups[idx].caption;
        }
        if (galCounter && D.screensGallery) {
          galCounter.textContent = `0${idx + 1} / ${D.screensGallery.counterTotal}`;
        }
        if (innerWidth > 800 && !rm) {
          const gTop = galEl.offsetTop;
          const gScrollable = galEl.offsetHeight - innerHeight;
          const targetY = gTop + (idx / (galTabs.length - 1)) * gScrollable;
          if (lenis) {
            lenis.scrollTo(targetY);
          } else {
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
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
  // 6. INTERSECTION OBSERVER & COUNTERS
  // ==========================================
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');

        // Numeric count animation
        if (entry.target.dataset.count !== undefined && !entry.target.done) {
          entry.target.done = true;
          const text = entry.target.textContent.trim();
          const match = text.match(/^(\$?\d+)(.*)$/);
          if (match && !rm) {
            const hasDollar = match[1].startsWith('$');
            const num = +match[1].replace('$', '');
            const suffix = match[2];
            const startT = performance.now();
            const duration = 1200;

            function countStep(now) {
              const p = Math.min(1, (now - startT) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              entry.target.textContent = (hasDollar ? '$' : '') + Math.round(num * eased) + suffix;
              if (p < 1) requestAnimationFrame(countStep);
            }
            requestAnimationFrame(countStep);
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  $$('.copy, .how-col, .principle-card, .team-card, .update-card, [data-count]').forEach(el => io.observe(el));

  // ==========================================
  // 7. ORVIX TERMINAL LIVE TYPING DEMO
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
        setTimeout(typeCmd1, rm ? 0 : 45);
      } else {
        setTimeout(() => {
          if (logs1El) logs1El.style.display = 'block';
          if (line2El) line2El.style.display = 'block';
          i = 0;
          setTimeout(typeCmd2, rm ? 0 : 300);
        }, rm ? 0 : 350);
      }
    }

    function typeCmd2() {
      if (cmd2El && i < cmd2Text.length) {
        cmd2El.textContent += cmd2Text.charAt(i);
        i++;
        setTimeout(typeCmd2, rm ? 0 : 18);
      } else {
        setTimeout(showJsonReply, rm ? 0 : 350);
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
      replayBtn.addEventListener('click', runTerminalSequence);
    }
  }

  // ==========================================
  // 8. MAGNETIC BUTTONS & 3D TILT
  // ==========================================
  if (fine && !rm) {
    // Magnetic buttons
    $$('[data-magnet]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left - r.width / 2) * 0.28;
        const my = (e.clientY - r.top - r.height / 2) * 0.35;
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
        const rx = -(y / (r.height / 2)) * 7;
        const ry = (x / (r.width / 2)) * 7;
        card.style.transform = `perspective(700px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

})();
