# ARRIVA Launch Kit v2

**ARRIVA** — *Ideas Into Innovation.*  
A high-contrast, scroll-driven web experience and launch kit showcasing ARRIVA's digital products: **Tourist Guide**, **NEXUS**, and **ORVIX**.

Built with pure vanilla web technologies: zero build step, zero external CDN scripts, self-hosted web fonts, hardware-accelerated 3D graphics, and strict brand honesty. Deployed directly to Firebase Hosting from `/website`.

---

## Architecture & Principles

1. **Content-Driven Single Source of Truth**:  
   Every headline, paragraph, metric, link, UI button label, and image path is driven by `website/content.js`. Changing copy or updating metrics requires editing only `content.js`.
2. **High-Contrast 3D World (`website/scene.js`)**:  
   A continuous Three.js journey in the style of ThreeUI / Kage. Features paper-theme depth fog (`#F8F7FF`), layered technical ribbons, procedural Sahyadri mountain contour ridges with a scroll-drawn route, raycasted interactive pins, pulsing network message packets, a local compute lattice with token streaming, and an astrolabe celestial outro.
3. **Zero CDN Dependencies & Strict Privacy**:  
   All fonts (Poppins and JetBrains Mono) are self-hosted as `.woff2` in `website/assets/fonts/`. External Google Fonts links and unused vendor libraries (`gsap.min.js`, `ScrollTrigger.min.js`) have been removed, eliminating third-party tracking calls and saving ~115 KB.
4. **Device Frame Mockup Components**:  
   Realistic phone and browser frames that accept real PNG, JPG, or WebP screenshots via `content.js` with zero layout breakage. SVG placeholders display a discreet `PLACEHOLDER` technical badge.
5. **Brand Honesty & Metric Integrity**:  
   Adheres to ARRIVA brand rules: no unsupported absolutes or exaggerated hype. Every placeholder metric is tagged with `// TODO-VERIFY`.
6. **Full Accessibility & Keyboard Navigation**:  
   WCAG 2.1 AA compliant. Supports `prefers-reduced-motion`, visible focus indicators (`:focus-visible`), aria landmarks, modal focus traps with focus restore, and Enter/Space/Escape/arrow-key navigation.

---

## Directory Structure

```text
ARRIVAA/
├── website/                     # Deployed to Firebase Hosting
│   ├── assets/
│   │   ├── fonts/               # Self-hosted Poppins & JetBrains Mono woff2 fonts
│   │   ├── screens/             # Drop app screenshots here (PNG, WebP, SVG)
│   │   ├── team/                # Team portraits
│   │   ├── updates/             # Field note cover images
│   │   ├── favicon.svg          # Vector favicon
│   │   └── og-image.png         # 1200x630 OpenGraph / Twitter preview card
│   ├── vendor/                  # Locally vendored libraries (no CDNs)
│   │   ├── lenis.min.js         # Smooth inertial scrolling
│   │   └── three.min.js         # WebGL 3D rendering core
│   ├── content.js               # Central content dictionary & configuration
│   ├── index.html               # Semantic HTML5 layout, landmarks & SEO meta
│   ├── main.js                  # Frontend orchestration, interactive widgets & Lenis
│   ├── scene.js                 # Scroll-driven Three.js continuous camera journey
│   ├── styles.css               # Drafting-grid theme, typography & responsive rules
│   ├── robots.txt               # SEO crawler directives
│   ├── sitemap.xml              # XML Sitemap
│   └── 404.html                 # Custom 404 fallback page
├── brand/
│   ├── arriva-wordmark-navy.svg
│   ├── arriva-wordmark-purple.svg
│   └── brand-guide.md           # Brand voice, colors, typography and guidelines
├── dev/                         # Developer tools (excluded from deployment)
│   ├── tools/
│   │   ├── verify_phase2.js     # Comprehensive headless Chrome CDP test suite
│   │   ├── site.spec.js         # Playwright multi-viewport test spec
│   │   └── lighthouse-report.json # Lighthouse audit report
│   ├── gen_assets.py            # SVG asset generator
│   └── gen_screens.py           # Screen mockup generator
├── playwright.config.js         # Playwright test configuration
├── .firebaserc                  # Firebase project identifier
├── firebase.json                # Hosting configuration (public: "website")
└── README.md                    # Project documentation
```

---

## Chapter Walkthrough & Interactive Features

- **Chapter 00 · The Arrival (`#top`)**:
  - Split-text reveal headline, dual magnetic CTAs, scroll indicator.
  - Interactive 3D gyroscopic gemstone with inertia drag, click ring pulse shockwave, and soft cursor glow on fine pointers.
- **Chapter 01 · Tourist Guide (`#tourist-guide`)**:
  - Sahyadri mountain contour ridges with 4 interactive waypoints.
  - 3D pin raycasting with camera easing on selection.
  - Keyboard activation (Enter/Space), previous/next buttons.
  - Interactive SVG elevation profile with a draggable route scrubber and live altitude/location readout.
  - Mini day-planner: interactive waypoint toggles with live distance and walking duration calculator.
- **Chapter 02 · NEXUS (`#nexus`)**:
  - Distraction-free native Android messaging stream, phone device frame.
  - Interactive live chat mock: channel switching (`#general`, `#dev-build`, `#sahyadri-hike`), message composition, and simulated replies.
  - 3D interactive hub sending particle bursts on click and illuminating bus lines on hover.
- **Chapter 03 · ORVIX (`#orvix`)**:
  - Local AI developer workflow bridging to Ollama on `127.0.0.1:11434`.
  - Browser mockup and transparent hardware requirements notice.
- **Chapter 04 · Screens Gallery (`#screens-gallery`)**:
  - Pinned horizontal device walk sized to fit 1366x800 viewports without clipping; eager loading prevents blank slides.
  - Interactive modal lightbox with keyboard arrows, touch swipe gestures, Escape to close, focus trapping, and focus restore.
- **Chapter 05 · ORVIX Live Demo (`#orvix-demo`)**:
  - Simulated bash terminal executing `ollama serve` and `curl`.
  - Fixed terminal replay race using run tokens with a "Skip to output" button and copy-to-clipboard toast.
  - Working interactive terminal prompt supporting `help`, `clear`, `ollama list`, `ollama run llama3 "<prompt>"`, `curl test`, token-by-token streaming, history (Up/Down), Tab completion, and quick chips.
- **Chapter 06 · How It Works (`#how-it-works`)**:
  - 3-step sequence per product in structured comparison columns.
- **Chapter 07 · About & Team (`#about`)**:
  - Brand philosophy, 4 engineering principles, numeric counters starting cleanly without flash, team cards with hover tilt, and scroll-linked timeline.
- **Chapter 08 · Updates (`#updates`)**:
  - Engineering dispatches styled as non-link "Coming soon" cards.
- **Chapter 09 · FAQ (`#faq`)**:
  - Live real-time search filtering with highlighted matches (`<mark class="faq-highlight">`).
  - "Expand all" and "Collapse all" controls.
  - Deep linking support via URL hash (`#faq-item-X`).
  - Proper accessibility containment with `hidden` and `display: none !important;`.
- **Outro · Community (`#community`)**:
  - Giant ARRIVA wordmark, social links, contact email, and footer directory.
- **Global Enhancements**:
  - Fixed vertical chapter dot rail (`#chapter-rail`) with hover tooltips and scroll spy.
  - Floating back-to-top button appearing after 400px scroll.
  - Mobile hamburger menu with backdrop click close, Escape close, body scroll lock, and Lenis pause/resume.

---

## Local Development & Testing

### 1. Serve Locally
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

### 2. Comprehensive Chrome CDP Test Suite
Runs automated tests across Desktop (1366x800), Tablet (900x800), and Mobile (390x780), verifying 0 console errors, 0 third-party requests, terminal replay race fix, keyboard navigation, FAQ accessibility, and 0px horizontal overflow:
```bash
node dev/tools/verify_phase2.js
```

### 3. Playwright Multi-Viewport Test
```bash
npx playwright test
```

### 4. Lighthouse Audit
```bash
npx lighthouse http://localhost:8000/index.html --only-categories=accessibility,seo --output=json --output-path=dev/tools/lighthouse-report.json --chrome-flags="--headless=new --no-sandbox"
```
Current scores:
- **Accessibility**: 95 / 100
- **SEO**: 100 / 100

---

## Deployment (Firebase Hosting)

Deploy directly to Firebase Hosting:
```bash
firebase deploy --only hosting
```
The deploy target is configured to `/website` in `firebase.json`.
