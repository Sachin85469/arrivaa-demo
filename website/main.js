(function () {
  'use strict';

  const D = window.ARRIVA;
  if (!D) return;

  const $ = (q, r = document) => r.querySelector(q);
  const $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function showToast(msg) {
    const toast = $('#toast-msg');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  function createDeviceFrame(src, alt, deviceType = 'phone') {
    const isSvgPlaceholder = typeof src === 'string' && (src.endsWith('.svg') || src.includes('placeholder'));
    const placeholderBadge = isSvgPlaceholder
      ? '<span class="placeholder-tag" aria-label="Mockup placeholder">PLACEHOLDER</span>'
      : '';
    const browserAddr = (D.brand && D.brand.browserAddress) ? D.brand.browserAddress : 'localhost:11434 / orvix';

    if (deviceType === 'browser') {
      return `
        <div class="device-frame device-browser">
          <div class="browser-header">
            <div class="browser-controls">
              <span class="b-dot red"></span>
              <span class="b-dot yellow"></span>
              <span class="b-dot green"></span>
            </div>
            <div class="browser-address">${browserAddr}</div>
            ${placeholderBadge}
          </div>
          <div class="browser-screen">
            <img src="${src}" alt="${alt}" loading="eager">
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
            <img src="${src}" alt="${alt}" loading="eager">
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

  const preHi = $('#pre-hi'), preTitle = $('#pre-title');
  if (preHi && D.preloader) preHi.textContent = D.preloader.hi;
  if (preTitle && D.preloader) preTitle.textContent = D.preloader.title;

  const logo = $('#brand-logo');
  if (logo && D.brand) {
    logo.innerHTML = `${D.brand.name}<span>${D.brand.markSuffix}</span>`;
  }

  const nav = $('#nav');
  if (nav && D.nav) {
    nav.innerHTML = D.nav.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('') +
      `<a class="pill" href="${D.nav.cta.href}" data-magnet>${D.nav.cta.label}</a>`;
  }

  const menuBtn = $('#menu-btn');
  const navBackdrop = $('#nav-backdrop');
  let isMenuOpen = false;

  function openMobileMenu() {
    isMenuOpen = true;
    nav.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    if (lenis) lenis.stop();
    const firstLink = nav.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMobileMenu() {
    if (!isMenuOpen) return;
    isMenuOpen = false;
    nav.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
    if (menuBtn) menuBtn.focus();
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      if (isMenuOpen) closeMobileMenu();
      else openMobileMenu();
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
    }

    $$('#nav a').forEach(a => {
      a.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
      }
    });

    nav.addEventListener('keydown', e => {
      if (e.key === 'Tab' && isMenuOpen) {
        const focusables = [menuBtn, ...nav.querySelectorAll('a')];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  const heroLabel = $('#hero-label'), h1 = $('#h1'), lead = $('#lead'), heroCta = $('#hero-cta'), heroScroll = $('#hero-scroll');
  if (heroLabel && D.hero) {
    heroLabel.innerHTML = formatHeader(D.hero.chapter, 'THE ARRIVAL', D.hero.hi);
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

  const chaptersEl = $('#chapters');
  if (chaptersEl && D.products) {
    chaptersEl.innerHTML = D.products.map((p, i) => {
      const isTourist = p.id === 'tourist-guide';
      const isNexus = p.id === 'nexus';
      const isOrvix = p.id === 'orvix';

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
                  <div class="topo-pin-card ${idx === 0 ? 'active' : ''}" data-pin-idx="${idx}" tabindex="0" role="button" aria-label="0${idx + 1} ${pin.name} — ${pin.category}">
                    <div class="topo-pin-header">
                      <span class="pin-idx">0${idx + 1}</span>
                      <div class="pin-titles">
                        <h3>${pin.name}</h3>
                        <span class="pin-cat"><span class="hi">${pin.hi}</span>${pin.category}</span>
                      </div>
                      <span class="pin-elev">${pin.elevation}</span>
                    </div>
                    <p class="pin-desc">${pin.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="waypoint-nav-row">
              <button class="waypoint-nav-btn" id="waypoint-prev" aria-label="Previous waypoint">&larr; ${D.ui ? D.ui.prevWaypoint : 'Previous'}</button>
              <span id="waypoint-readout" style="font-family:var(--font-mono); font-size:0.75rem; color:var(--navy);">01 / 04 · Sinhagad (1,312 m)</span>
              <button class="waypoint-nav-btn" id="waypoint-next" aria-label="Next waypoint">${D.ui ? D.ui.nextWaypoint : 'Next'} &rarr;</button>
            </div>
            <div class="elevation-profile-wrap">
              <div class="elevation-profile-head">
                <span>${TS.elevationTitle || 'Elevation Profile'}</span>
                <b id="elevation-indicator">1,312 m</b>
              </div>
              <svg class="elevation-svg" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
                <path d="M 0,15 L 120,50 L 240,48 L 400,32 L 400,60 L 0,60 Z" fill="rgba(124, 58, 237, 0.12)"></path>
                <path d="M 0,15 L 120,50 L 240,48 L 400,32" fill="none" stroke="#7C3AED" stroke-width="2.5"></path>
                <circle cx="0" cy="15" r="4.5" fill="#10B981" id="elev-dot"></circle>
              </svg>
              <input type="range" min="0" max="3" step="1" value="0" class="elevation-scrubber" id="elevation-scrubber" aria-label="Elevation route scrubber">
            </div>
            <div class="day-planner-wrap">
              <div class="day-planner-head">
                <h5>${TS.plannerTitle || 'Custom Day Trail Planner'}</h5>
                <button class="waypoint-nav-btn" id="planner-toggle-all">Toggle All</button>
              </div>
              <div class="day-planner-toggles" id="planner-items">
                ${TS.pins.map((pin, idx) => `
                  <label class="day-planner-item">
                    <input type="checkbox" data-planner-idx="${idx}" checked>
                    <span>${pin.name} (${pin.dist})</span>
                  </label>
                `).join('')}
              </div>
              <div class="day-planner-summary">
                <span>${TS.plannerDistanceLabel || 'Selected Route:'} <b id="planner-dist">14.2 km</b></span>
                <span>${TS.plannerTimeLabel || 'Est. Walking Time:'} <b id="planner-time">3h 33m</b></span>
              </div>
            </div>
            <p class="topo-hint">${TS.hint}</p>
          </div>
        `;
      } else if (isNexus) {
        const previewMsgs = p.previewMessages || [
          { incoming: true, sender: 'Sachin K.', text: 'Ollama socket verified on ORVIX. Local inference is ready.', time: '10:24 AM · Verified', py: '-12px' },
          { incoming: false, sender: 'You', text: 'Tourist Guide offline route caching confirmed. Clean build packaged.', time: '10:25 AM · Delivered', py: '14px' }
        ];
        const chatConfig = p.chatDemo || {};
        const channels = chatConfig.channels || ['#general', '#dev-build', '#sahyadri-hike'];

        visualSide = `
          <div class="product-visual nexus-visual-box" id="nexus-visual">
            <div class="nexus-device-wrap">
              ${createDeviceFrame(p.images[0], `${p.name} primary screen`, 'phone')}
            </div>
            <div class="nexus-floating-preview">
              ${previewMsgs.map(m => `
                <div class="bubble ${m.incoming ? 'incoming' : 'outgoing'}\" style="--py:${m.py};">
                  <span class="bubble-sender">${m.sender}</span>
                  <p>${m.text}</p>
                  <span class="bubble-time">${m.time}</span>
                </div>
              `).join('')}
            </div>
            <div class="nexus-chat-widget" id="nexus-chat-widget">
              <div class="nexus-chat-header">
                <div class="nexus-channels-tabs" id="nexus-channels">
                  ${channels.map((ch, idx) => `
                    <button class="nexus-channel-tab ${idx === 0 ? 'active' : ''}" data-ch="${ch}">${ch}</button>
                  `).join('')}
                </div>
                <span class="nexus-chat-badge">${chatConfig.badge || 'Simulated socket'}</span>
              </div>
              <div class="nexus-chat-messages" id="nexus-messages"></div>
              <div class="nexus-chat-input-row">
                <input type="text" class="nexus-chat-input" id="nexus-chat-input" placeholder="${chatConfig.inputPlaceholder || 'Type a test message...'}" aria-label="Test message input">
                <button class="btn sm" id="nexus-send-btn">${chatConfig.sendButton || 'Send'}</button>
              </div>
            </div>
          </div>
        `;
      } else {
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
              <div class="stats">${p.stats.map(s => `<div><b data-count="${s[0]}">${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
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
        <div class="gallery-track-viewport" id="gallery-viewport" tabindex="0" aria-label="Screens gallery track">
          <div class="gallery-track" id="gallery-track">
            ${G.groups.map(grp => `
              <div class="gallery-group" data-group="${grp.id}">
                <div class="gallery-group-title">
                  <span class="tag-pill">${grp.category}</span>
                  <h3>${grp.productName}</h3>
                </div>
                <div class="gallery-screens-grid">
                  ${grp.screens.map((s, sIdx) => `
                    <div class="gallery-card" data-screen-src="${s.src}" data-screen-title="${s.title}" data-screen-alt="${s.alt}" data-device="${grp.deviceType || 'phone'}" tabindex="0" role="button" aria-label="Enlarge ${s.title}">
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

  const demoEl = $('#orvix-demo');
  if (demoEl && D.orvixDemo) {
    const dm = D.orvixDemo;
    const badgeText = dm.statusBadge || dm.badge || 'LOCAL 127.0.0.1:11434';
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
            <span class="terminal-badge">${badgeText}</span>
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
            <div id="term-interactive-slot"></div>
          </div>
          <div class="terminal-footer">
            <div class="terminal-stats">
              ${dm.terminal.stats.map(st => `<span><b>${st[0]}</b>${st[1]}</span>`).join('')}
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="btn sm" id="copy-term-btn" data-magnet>${D.ui ? D.ui.copyCode : 'Copy'}</button>
              <button class="btn sm" id="skip-term-btn" data-magnet>${dm.skipLabel || 'Skip'}</button>
              <button class="btn sm" id="replay-term-btn" data-magnet>${dm.replayLabel}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

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

  const aboutEl = $('#about');
  if (aboutEl && D.about) {
    const AB = D.about;
    const teamSub = AB.teamSubhead || { tag: 'Builders', title: 'The workbench team', lead: 'Hands-on engineers and designers building clean digital tools.' };
    const timeSub = AB.timelineSubhead || { tag: 'Milestones', title: 'Journey timeline', lead: 'From initial scratchpad problem statements to community-tested software.' };

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
                <b data-count="${st[0]}">${st[0]}</b>
                <span>${st[1]}</span>
              </div>
            `).join('')}
          </div>
        </div>

        ${AB.team ? `
          <div class="team-sub-block" id="team">
            <div class="section-subhead">
              <span class="tag-pill">${teamSub.tag}</span>
              <h3>${teamSub.title}</h3>
              <p class="lead">${teamSub.lead}</p>
            </div>
            <div class="team-grid">
              ${AB.team.map(m => `
                <div class="team-card" data-tilt tabindex="0">
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

        ${AB.timeline ? `
          <div class="timeline-sub-block" id="timeline">
            <div class="section-subhead">
              <span class="tag-pill">${timeSub.tag}</span>
              <h3>${timeSub.title}</h3>
              <p class="lead">${timeSub.lead}</p>
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
                <span class="update-status-badge">${UP.dispatchBadge || u.status || 'Coming soon'}</span>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;
  }

  const faqEl = $('#faq');
  if (faqEl && D.faq) {
    const FQ = D.faq;
    faqEl.innerHTML = `
      <div class="wrap">
        <p class="label">${formatHeader(FQ.chapter, FQ.title, FQ.hi)}</p>
        <h2>${FQ.title}</h2>
        <p class="lead">${FQ.subtitle}</p>
        <div class="faq-controls-row">
          <input type="search" class="faq-search-input" id="faq-search" placeholder="${FQ.searchPlaceholder || 'Search FAQ...'}" aria-label="Search FAQ">
          <div class="faq-btn-group">
            <button class="faq-toggle-btn" id="faq-expand-all">${FQ.expandAllLabel || 'Expand all'}</button>
            <button class="faq-toggle-btn" id="faq-collapse-all">${FQ.collapseAllLabel || 'Collapse all'}</button>
          </div>
        </div>
        <div class="faq-list" id="faq-list" aria-label="Frequently asked questions">
          ${FQ.items.map((item, idx) => `
            <div class="faq-item" id="faq-item-${idx}" data-q="${item.q.toLowerCase()}" data-a="${item.a.toLowerCase()}">
              <button class="faq-q" aria-expanded="false" aria-controls="faq-ans-${idx}" id="faq-btn-${idx}">
                <span class="faq-q-text">${item.q}</span>
                <span class="faq-icon" aria-hidden="true">+</span>
              </button>
              <div class="faq-a" id="faq-ans-${idx}" aria-labelledby="faq-btn-${idx}" hidden>
                <div class="faq-a-inner">
                  <p class="faq-a-text">${item.a}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <p id="faq-empty-msg" style="display:none; text-align:center; margin-top:24px; color:var(--mut); font-family:var(--font-mono); font-size:0.85rem;">${FQ.noResultsText || 'No questions match your query.'}</p>
      </div>
    `;

    function openFaqItem(item) {
      if (!item) return;
      const btn = item.querySelector('.faq-q');
      const ans = item.querySelector('.faq-a');
      const icon = item.querySelector('.faq-icon');
      item.classList.add('open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (icon) icon.textContent = '−';
      if (ans) {
        ans.removeAttribute('hidden');
        ans.style.maxHeight = (ans.scrollHeight + 30) + 'px';
      }
    }

    function closeFaqItem(item) {
      if (!item) return;
      const btn = item.querySelector('.faq-q');
      const ans = item.querySelector('.faq-a');
      const icon = item.querySelector('.faq-icon');
      item.classList.remove('open');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (icon) icon.textContent = '+';
      if (ans) {
        ans.style.maxHeight = '0px';
        ans.setAttribute('hidden', '');
      }
    }

    $$('.faq-q', faqEl).forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        if (item.classList.contains('open')) closeFaqItem(item);
        else openFaqItem(item);
      });
    });

    const expandAllBtn = $('#faq-expand-all');
    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', () => {
        $$('.faq-item', faqEl).forEach(openFaqItem);
      });
    }

    const collapseAllBtn = $('#faq-collapse-all');
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', () => {
        $$('.faq-item', faqEl).forEach(closeFaqItem);
      });
    }

    const faqSearch = $('#faq-search');
    const faqEmpty = $('#faq-empty-msg');
    if (faqSearch) {
      faqSearch.addEventListener('input', () => {
        const query = faqSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        $$('.faq-item', faqEl).forEach((item, idx) => {
          const rawQ = FQ.items[idx].q;
          const rawA = FQ.items[idx].a;
          const qMatch = rawQ.toLowerCase().includes(query);
          const aMatch = rawA.toLowerCase().includes(query);

          if (!query || qMatch || aMatch) {
            item.style.display = '';
            visibleCount++;
            const qEl = item.querySelector('.faq-q-text');
            const aEl = item.querySelector('.faq-a-text');
            if (query) {
              const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
              if (qEl) qEl.innerHTML = rawQ.replace(regex, '<mark class="faq-highlight">$1</mark>');
              if (aEl) aEl.innerHTML = rawA.replace(regex, '<mark class="faq-highlight">$1</mark>');
              openFaqItem(item);
            } else {
              if (qEl) qEl.textContent = rawQ;
              if (aEl) aEl.textContent = rawA;
            }
          } else {
            item.style.display = 'none';
          }
        });

        if (faqEmpty) faqEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
      });
    }

    function checkFaqHash() {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#faq-')) {
        const targetItem = $(hash, faqEl);
        if (targetItem) {
          openFaqItem(targetItem);
          targetItem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    window.addEventListener('hashchange', checkFaqHash);
    setTimeout(checkFaqHash, 400);

    window.addEventListener('resize', () => {
      $$('.faq-item.open .faq-a', faqEl).forEach(ans => {
        ans.style.maxHeight = (ans.scrollHeight + 30) + 'px';
      });
    }, { passive: true });
  }

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
              <h3>${col.title}</h3>
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

  let lenis = null;
  if (typeof window.Lenis !== 'undefined' && !rm) {
    try {
      lenis = new window.Lenis({
        lerp: 0.1,
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0
      });

      function lenisLoop(time) {
        lenis.raf(time);
        requestAnimationFrame(lenisLoop);
      }
      requestAnimationFrame(lenisLoop);

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
      console.warn('Lenis bypassed:', e);
    }
  }

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
  const chapterRail = $('#chapter-rail');

  const railSections = [
    { id: 'top', label: '00 The arrival' },
    { id: 'tourist-guide', label: '01 Tourist Guide' },
    { id: 'nexus', label: '02 NEXUS' },
    { id: 'orvix', label: '03 ORVIX' },
    { id: 'screens-gallery', label: '04 Screens' },
    { id: 'orvix-demo', label: '05 Demo' },
    { id: 'how-it-works', label: '06 How It Works' },
    { id: 'about', label: '07 About & Team' },
    { id: 'updates', label: '08 Updates' },
    { id: 'faq', label: '09 FAQ' },
    { id: 'community', label: 'Outro Community' }
  ];

  if (chapterRail) {
    chapterRail.innerHTML = railSections.map(sec => `
      <button class="rail-dot" data-target="${sec.id}" aria-label="Jump to ${sec.label}" tabindex="0">
        <span class="rail-tooltip">${sec.label}</span>
      </button>
    `).join('');

    $$('.rail-dot', chapterRail).forEach(dot => {
      dot.addEventListener('click', () => {
        const tid = dot.dataset.target;
        const el = document.getElementById(tid);
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: -60 });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  let activeWaypointIdx = 0;
  const TS_DATA = D.touristGuideScene || { pins: [] };

  function selectWaypoint(idx) {
    if (!topoPins.length) return;
    activeWaypointIdx = Math.max(0, Math.min(topoPins.length - 1, idx));
    topoPins.forEach((p, i) => {
      const isActive = i === activeWaypointIdx;
      p.classList.toggle('active', isActive);
      if (isActive) p.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    if (window.WORLD && typeof window.WORLD.focusPin === 'function') {
      window.WORLD.focusPin(activeWaypointIdx);
    }

    const readout = $('#waypoint-readout');
    const elevInd = $('#elevation-indicator');
    const elevDot = $('#elev-dot');
    const scrubber = $('#elevation-scrubber');
    const pin = TS_DATA.pins[activeWaypointIdx];

    if (pin) {
      if (readout) readout.textContent = `0${activeWaypointIdx + 1} / 04 · ${pin.name} (${pin.elevation})`;
      if (elevInd) elevInd.textContent = pin.elevation;
      if (scrubber) scrubber.value = String(activeWaypointIdx);
      if (elevDot) {
        const dotCoords = [[0, 15], [120, 50], [240, 48], [400, 32]];
        const c = dotCoords[activeWaypointIdx] || [0, 15];
        elevDot.setAttribute('cx', String(c[0]));
        elevDot.setAttribute('cy', String(c[1]));
      }
    }
  }

  window.onPinSelectFrom3D = (idx) => {
    selectWaypoint(idx);
  };

  if (topoPins.length) {
    topoPins.forEach((card, idx) => {
      card.addEventListener('pointerenter', () => selectWaypoint(idx));
      card.addEventListener('click', () => selectWaypoint(idx));
      card.addEventListener('focus', () => selectWaypoint(idx));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          selectWaypoint(idx);
        }
      });
    });

    const prevPinBtn = $('#waypoint-prev');
    const nextPinBtn = $('#waypoint-next');
    if (prevPinBtn) {
      prevPinBtn.addEventListener('click', () => selectWaypoint(activeWaypointIdx - 1));
    }
    if (nextPinBtn) {
      nextPinBtn.addEventListener('click', () => selectWaypoint(activeWaypointIdx + 1));
    }

    const scrubber = $('#elevation-scrubber');
    if (scrubber) {
      scrubber.addEventListener('input', () => {
        selectWaypoint(parseInt(scrubber.value, 10));
      });
    }

    const plannerCheckboxes = $$('#planner-items input[type="checkbox"]');
    const plannerDist = $('#planner-dist');
    const plannerTime = $('#planner-time');
    const plannerToggleAll = $('#planner-toggle-all');

    function updatePlanner() {
      const pinDistances = [0.0, 4.8, 4.3, 5.1];
      let totalKm = 0;
      let prevSelected = null;

      plannerCheckboxes.forEach((cb, i) => {
        if (cb.checked) {
          if (prevSelected === null) {
            prevSelected = i;
          } else {
            for (let k = prevSelected + 1; k <= i; k++) {
              totalKm += pinDistances[k] || 0;
            }
            prevSelected = i;
          }
        }
      });

      const roundedKm = Math.round(totalKm * 10) / 10;
      const totalMinutes = Math.round((roundedKm / 4.0) * 60);
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      const timeStr = `${hrs}h ${mins < 10 ? '0' : ''}${mins}m`;

      if (plannerDist) plannerDist.textContent = `${roundedKm.toFixed(1)} km`;
      if (plannerTime) plannerTime.textContent = timeStr;
    }

    plannerCheckboxes.forEach(cb => {
      cb.addEventListener('change', updatePlanner);
    });

    if (plannerToggleAll) {
      plannerToggleAll.addEventListener('click', () => {
        const allChecked = plannerCheckboxes.every(cb => cb.checked);
        plannerCheckboxes.forEach(cb => { cb.checked = !allChecked; });
        updatePlanner();
      });
    }
  }

  const nexusChat = $('#nexus-chat-widget');
  if (nexusChat && D.products && D.products[1] && D.products[1].chatDemo) {
    const cd = D.products[1].chatDemo;
    let currentChannel = cd.activeChannel || '#general';
    const msgContainer = $('#nexus-messages');
    const chatInput = $('#nexus-chat-input');
    const sendBtn = $('#nexus-send-btn');
    const channelTabs = $$('#nexus-channels button');

    function renderMessages() {
      if (!msgContainer) return;
      const msgs = (cd.messages && cd.messages[currentChannel]) || [];
      msgContainer.innerHTML = msgs.map(m => `
        <div class="nexus-chat-bubble ${m.incoming ? 'incoming' : 'outgoing'}">
          <div class="nexus-chat-meta">
            <span>${m.sender}</span>
            <span>${m.time}</span>
          </div>
          <div>${m.text}</div>
        </div>
      `).join('');
      msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    channelTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        channelTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChannel = btn.dataset.ch;
        renderMessages();
      });
    });

    function sendMessage() {
      if (!chatInput) return;
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';

      if (!cd.messages[currentChannel]) cd.messages[currentChannel] = [];
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

      cd.messages[currentChannel].push({
        sender: 'You',
        text: text,
        time: timeStr,
        incoming: false
      });
      renderMessages();

      setTimeout(() => {
        const replyPool = cd.cannedReplies || ['Socket acknowledged. Message stored on-device.'];
        const replyText = replyPool[Math.floor(Math.random() * replyPool.length)];
        cd.messages[currentChannel].push({
          sender: 'NEXUS Node',
          text: replyText,
          time: timeStr,
          incoming: true
        });
        renderMessages();
      }, 700);
    }

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) {
      chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') sendMessage();
      });
    }

    renderMessages();
  }

  const lightbox = $('#gallery-lightbox');
  let currentLightboxIdx = 0;
  let allGalleryCards = [];

  function openLightbox(idx) {
    if (!lightbox || !allGalleryCards.length) return;
    currentLightboxIdx = (idx + allGalleryCards.length) % allGalleryCards.length;
    const card = allGalleryCards[currentLightboxIdx];
    const src = card.dataset.screenSrc;
    const title = card.dataset.screenTitle;
    const alt = card.dataset.screenAlt;
    const device = card.dataset.device || 'phone';

    lightbox.innerHTML = `
      <div class="lightbox-card" role="document">
        <div class="lightbox-head">
          <span class="lightbox-title">${title}</span>
          <button class="lightbox-close-btn" id="lightbox-close" aria-label="Close dialog">&times;</button>
        </div>
        <div class="lightbox-body">
          ${createDeviceFrame(src, alt, device)}
        </div>
        <div class="lightbox-foot">
          <button class="lightbox-nav-btn" id="lightbox-prev">&larr; ${D.ui ? D.ui.lightboxPrev : 'Previous'}</button>
          <span style="font-family:var(--font-mono); font-size:0.8rem; color:var(--navy-muted);">${currentLightboxIdx + 1} / ${allGalleryCards.length}</span>
          <button class="lightbox-nav-btn" id="lightbox-next">${D.ui ? D.ui.lightboxNext : 'Next'} &rarr;</button>
        </div>
      </div>
    `;

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
    if (lenis) lenis.stop();

    const closeBtn = $('#lightbox-close', lightbox);
    if (closeBtn) {
      closeBtn.focus();
      closeBtn.addEventListener('click', closeLightbox);
    }
    const prevBtn = $('#lightbox-prev', lightbox);
    if (prevBtn) prevBtn.addEventListener('click', () => openLightbox(currentLightboxIdx - 1));
    const nextBtn = $('#lightbox-next', lightbox);
    if (nextBtn) nextBtn.addEventListener('click', () => openLightbox(currentLightboxIdx + 1));
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    if (lenis) lenis.start();
    if (allGalleryCards[currentLightboxIdx]) allGalleryCards[currentLightboxIdx].focus();
  }

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') openLightbox(currentLightboxIdx - 1);
      else if (e.key === 'ArrowRight') openLightbox(currentLightboxIdx + 1);
    });

    let touchStartX = 0;
    lightbox.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX;
      if (diff > 50) openLightbox(currentLightboxIdx - 1);
      else if (diff < -50) openLightbox(currentLightboxIdx + 1);
    }, { passive: true });
  }

  allGalleryCards = $$('.gallery-card');
  allGalleryCards.forEach((card, idx) => {
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  const bttBtn = $('#back-to-top-btn');
  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  let isScrollTicking = false;

  function onScroll() {
    isScrollTicking = false;
    const y = window.scrollY;
    const H = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const maxScroll = docH - H;

    if (progEl) progEl.style.transform = `scaleX(${maxScroll > 0 ? y / maxScroll : 0})`;
    if (headerEl) headerEl.classList.toggle('solid', y > 40);
    if (bttBtn) bttBtn.classList.toggle('visible', y > 400);

    let sceneIndex = 0;
    secs.forEach((s, idx) => {
      if (s.offsetTop <= y + 60) sceneIndex = idx;
    });

    const currSec = secs[sceneIndex];
    const nextSec = secs[sceneIndex + 1];
    let sceneVal = currSec ? +currSec.dataset.scene : 0;

    if (currSec && currSec.id) {
      const activeNavId = currSec.id;
      $$('#nav a').forEach(a => {
        const href = a.getAttribute('href');
        a.classList.toggle('active', href === `#${activeNavId}`);
      });
      $$('.rail-dot', chapterRail).forEach(dot => {
        dot.classList.toggle('active', dot.dataset.target === activeNavId);
      });
      if (history.replaceState && activeNavId !== 'top') {
        history.replaceState(null, '', `#${activeNavId}`);
      }
    }

    if (nextSec && currSec) {
      const segH = nextSec.offsetTop - currSec.offsetTop;
      if (segH > 0) {
        const segProgress = Math.max(0, Math.min(1, (y - currSec.offsetTop) / segH));
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

    if (!rm) {
      const topWrap = $('#top .wrap');
      if (topWrap) {
        topWrap.style.transform = `translateY(${(Math.min(y, H) * 0.16).toFixed(1)}px)`;
        topWrap.style.opacity = (1 - Math.min(y / (H * 0.8), 1)).toFixed(2);
      }
    }

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
    } else if (galTrack && innerWidth <= 800) {
      galTrack.style.transform = '';
    }

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
  if (lenis) {
    lenis.on('scroll', onScroll);
  }
  requestTick();

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

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');

        if (entry.target.dataset.count !== undefined && !entry.target.done) {
          entry.target.done = true;
          const text = (entry.target.dataset.count || entry.target.textContent).trim();
          const match = text.match(/^(\$?)(\d+)(\+?)$/);
          if (match && !rm) {
            const hasDollar = match[1] === '$';
            const num = parseInt(match[2], 10);
            const suffix = match[3] || '';
            const startT = performance.now();
            const duration = 1200;

            entry.target.textContent = (hasDollar ? '$0' : '0') + suffix;

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

  let termRan = false;
  let termRunToken = 0;
  const termBox = $('#terminal-box');
  const replayBtn = $('#replay-term-btn');
  const skipBtn = $('#skip-term-btn');
  const copyBtn = $('#copy-term-btn');

  function renderTerminalFinalOutput() {
    const cmd1El = $('#term-cmd-1');
    const logs1El = $('#term-logs-1');
    const line2El = $('#term-line-2');
    const cmd2El = $('#term-cmd-2');
    const jsonEl = $('#term-json');
    const curEl = $('#term-cur');

    if (cmd1El && D.orvixDemo) cmd1El.textContent = D.orvixDemo.terminal.command1;
    if (logs1El) logs1El.style.display = 'block';
    if (line2El) line2El.style.display = 'block';
    if (cmd2El && D.orvixDemo) cmd2El.textContent = D.orvixDemo.terminal.command2;
    if (jsonEl && D.orvixDemo) {
      const json = D.orvixDemo.terminal.jsonOutput;
      const formatted = '{\n' +
        '  <span class="json-key">"model"</span>: <span class="json-str">"' + json.model + '"</span>,\n' +
        '  <span class="json-key">"created_at"</span>: <span class="json-str">"' + json.created_at + '"</span>,\n' +
        '  <span class="json-key">"response"</span>: <span class="json-str">"' + json.response + '"</span>,\n' +
        '  <span class="json-key">"done"</span>: <span class="json-bool">' + json.done + '</span>,\n' +
        '  <span class="json-key">"total_duration"</span>: <span class="json-str">"' + json.total_duration + '"</span>,\n' +
        '  <span class="json-key">"load_duration"</span>: <span class="json-str">"' + json.load_duration + '"</span>,\n' +
        '  <span class="json-key">"eval_count"</span>: <span class="json-num">' + json.eval_count + '</span>,\n' +
        '  <span class="json-key">"eval_duration"</span>: <span class="json-str">"' + json.eval_duration + '"</span>\n' +
        '}';
      jsonEl.innerHTML = formatted;
      jsonEl.style.display = 'block';
    }
    if (curEl) curEl.style.display = 'none';
    if (replayBtn) {
      replayBtn.disabled = false;
      replayBtn.textContent = D.orvixDemo.replayLabel;
    }
    mountInteractiveTerminal();
  }

  function runTerminalSequence() {
    const cmd1El = $('#term-cmd-1');
    const logs1El = $('#term-logs-1');
    const line2El = $('#term-line-2');
    const cmd2El = $('#term-cmd-2');
    const jsonEl = $('#term-json');
    const curEl = $('#term-cur');

    if (!cmd1El || !D.orvixDemo) return;

    const token = ++termRunToken;

    if (replayBtn) {
      replayBtn.disabled = true;
      replayBtn.textContent = 'Running...';
    }

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
      if (token !== termRunToken) return;
      if (i < cmd1Text.length) {
        cmd1El.textContent += cmd1Text.charAt(i);
        i++;
        setTimeout(typeCmd1, rm ? 0 : 45);
      } else {
        setTimeout(() => {
          if (token !== termRunToken) return;
          if (logs1El) logs1El.style.display = 'block';
          if (line2El) line2El.style.display = 'block';
          i = 0;
          setTimeout(typeCmd2, rm ? 0 : 300);
        }, rm ? 0 : 350);
      }
    }

    function typeCmd2() {
      if (token !== termRunToken) return;
      if (cmd2El && i < cmd2Text.length) {
        cmd2El.textContent += cmd2Text.charAt(i);
        i++;
        setTimeout(typeCmd2, rm ? 0 : 18);
      } else {
        setTimeout(() => {
          if (token !== termRunToken) return;
          renderTerminalFinalOutput();
        }, rm ? 0 : 350);
      }
    }

    typeCmd1();
  }

  function mountInteractiveTerminal() {
    const slot = $('#term-interactive-slot');
    if (!slot || slot.querySelector('#term-input') || !D.orvixDemo || !D.orvixDemo.interactive) return;

    const inter = D.orvixDemo.interactive;
    const chips = inter.chips || ['help', 'ollama list', 'ollama run llama3', 'curl test', 'clear'];

    slot.innerHTML = `
      <div class="term-interactive-wrap">
        <div id="term-interactive-history"></div>
        <div class="term-input-row">
          <span class="terminal-prompt">${inter.promptUser || 'developer@arriva-local:~$ '}</span>
          <input type="text" class="term-interactive-input" id="term-input" spellcheck="false" autocomplete="off" placeholder="${inter.placeholder || 'Type command...'}" aria-label="Interactive command line">
          <button class="btn sm" id="term-run-btn">Run</button>
        </div>
        <div class="term-chips-row">
          ${chips.map(c => `<button class="term-chip" data-chip="${c}">${c}</button>`).join('')}
        </div>
      </div>
    `;

    const input = $('#term-input', slot);
    const runBtn = $('#term-run-btn', slot);
    const histSlot = $('#term-interactive-history', slot);
    const cmdHistory = [];
    let histIdx = -1;

    function executeCommand(rawCmd) {
      const cmd = (rawCmd || '').trim();
      if (!cmd) return;
      cmdHistory.push(cmd);
      histIdx = cmdHistory.length;

      const userRow = document.createElement('div');
      userRow.className = 'terminal-line';
      userRow.innerHTML = `<span class="terminal-prompt">${inter.promptUser || 'developer@arriva-local:~$ '}</span><span class="terminal-cmd">${cmd}</span>`;
      histSlot.appendChild(userRow);

      const outRow = document.createElement('div');
      outRow.className = 'terminal-log';
      outRow.style.margin = '4px 0 12px';

      if (cmd === 'clear') {
        histSlot.innerHTML = '';
        input.value = '';
        return;
      } else if (cmd === 'help') {
        outRow.innerHTML = (inter.help || []).join('<br>');
      } else if (cmd === 'ollama list') {
        outRow.innerHTML = (inter.modelsList || []).join('<br>');
      } else if (cmd.startsWith('ollama run')) {
        const streamText = (inter.tokenStreamSamples && inter.tokenStreamSamples.default)
          || 'Practical local execution with zero third-party billing.';
        outRow.innerHTML = '<span class="stream-output"></span> <span style="color:#10B981; font-size:0.75rem;">[Streaming ~42.8 tok/s]</span>';
        histSlot.appendChild(outRow);
        const span = outRow.querySelector('.stream-output');
        const words = streamText.split(' ');
        let wIdx = 0;
        function streamNext() {
          if (wIdx < words.length) {
            span.textContent += (wIdx === 0 ? '' : ' ') + words[wIdx];
            wIdx++;
            setTimeout(streamNext, rm ? 0 : 50);
          }
        }
        streamNext();
        input.value = '';
        return;
      } else if (cmd.includes('curl')) {
        const out = inter.curlTestOutput || { model: 'llama3:latest', response: 'Simulated API output', done: true };
        outRow.innerHTML = '<pre style="margin:0; color:#CBD5E1;">' + JSON.stringify(out, null, 2) + '</pre>';
      } else {
        outRow.innerHTML = `<span style="color:#EF4444;">command not found: ${cmd}</span>. Type <b style="color:#6EE7B7;">help</b> for available options.`;
      }

      histSlot.appendChild(outRow);
      input.value = '';
      input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (runBtn) {
      runBtn.addEventListener('click', () => executeCommand(input.value));
    }

    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          executeCommand(input.value);
        } else if (e.key === 'ArrowUp') {
          if (histIdx > 0) {
            histIdx--;
            input.value = cmdHistory[histIdx];
          }
        } else if (e.key === 'ArrowDown') {
          if (histIdx < cmdHistory.length - 1) {
            histIdx++;
            input.value = cmdHistory[histIdx];
          } else {
            histIdx = cmdHistory.length;
            input.value = '';
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const curVal = input.value.trim();
          const match = chips.find(c => c.startsWith(curVal));
          if (match) input.value = match;
        }
      });
    }

    $$('.term-chip', slot).forEach(chip => {
      chip.addEventListener('click', () => {
        const c = chip.dataset.chip;
        if (input) input.value = c;
        executeCommand(c);
      });
    });
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

    if (replayBtn) {
      replayBtn.addEventListener('click', runTerminalSequence);
    }
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        termRunToken++;
        renderTerminalFinalOutput();
      });
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const cmd = D.orvixDemo.terminal.command2;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(cmd).then(() => {
            showToast(D.ui ? D.ui.copyToast : 'Copied to clipboard');
          });
        }
      });
    }
  }

  if (fine && !rm) {
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

    const glow = $('#cursor-glow');
    if (glow) {
      window.addEventListener('pointermove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
      }, { passive: true });
    }
  }

})();
