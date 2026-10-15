# ARRIVA Launch Kit v2

**ARRIVA** — *Ideas Into Innovation.*  
A high-contrast, scroll-driven web experience and launch kit showcasing ARRIVA's digital products: **Tourist Guide**, **NEXUS**, and **ORVIX**.

Built with pure vanilla web technologies: zero build step, local vendor libraries, hardware-accelerated 3D graphics, and strict copy honesty. Deployed directly to Firebase Hosting from `/website`.

---

## Architecture & Principles

1. **Content-Driven Single Source of Truth**:  
   Every headline, paragraph, metric, link, and image path is driven by `website/content.js`. Changing copy or adding real screenshots requires editing only `content.js`.
2. **High-Contrast 3D World (`website/scene.js`)**:  
   A continuous Three.js journey in the style of ThreeUI / Kage. Features paper-theme depth fog (`#F8F7FF`), layered technical ribbons, procedural Sahyadri mountain contour ridges with a scroll-drawn route, pulsing network message packets, a local compute lattice with token streaming, and an astrolabe celestial outro.
3. **Local Vendoring (Zero CDN dependencies)**:  
   All runtime libraries reside locally in `website/vendor/`:
   - `three.min.js` (Three.js WebGL engine)
   - `gsap.min.js` & `ScrollTrigger.min.js` (GreenSock motion core)
   - `lenis.min.js` (Lenis smooth inertial scrolling)
4. **Device Frame Mockup Components**:  
   Realistic phone and browser frames that accept real PNG, JPG, or WebP screenshots via `content.js` with zero layout breakage. SVG placeholders display a discreet `PLACEHOLDER` technical badge.
5. **Brand Honesty**:  
   Adheres to ARRIVA brand rules: no unsupported absolutes or exaggerated hype. Every placeholder metric is tagged with `// TODO-VERIFY`.
6. **Isolated Deployment**:  
   `/website` is the sole deployed directory. All development scripts, generators, and testing tools live in `/dev`.

---

## Directory Structure

```text
ARRIVA_Launch_Kit_v2/
├── website/                     # Deployed to Firebase Hosting
│   ├── assets/
│   │   ├── screens/             # Drop app screenshots here (PNG, WebP, SVG)
│   │   ├── team/                # Team portraits
│   │   ├── updates/             # Field note cover images
│   │   └── favicon.svg          # Vector favicon
│   ├── vendor/                  # Locally vendored libraries (no CDNs)
│   │   ├── gsap.min.js
│   │   ├── lenis.min.js
│   │   ├── ScrollTrigger.min.js
│   │   └── three.min.js
│   ├── content.js               # Central content dictionary & configuration
│   ├── index.html               # Semantic HTML5 layout, landmarks & SEO meta
│   ├── main.js                  # Frontend orchestration, device frames & Lenis
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
│   │   ├── capture_after_screenshots.js   # Headless Chrome screenshot capture
│   │   ├── capture_before_screenshots.js
│   │   └── verify_phase2.js
│   ├── gen_assets.py            # SVG asset generator
│   └── gen_screens.py           # Screen mockup generator
├── screenshots/                 # Automated before/after verification captures
├── social/                      # 30-day social launch strategy & post templates
├── .firebaserc                  # Firebase project identifier
├── firebase.json                # Hosting configuration (public: "website")
└── README.md                    # Project documentation
```

---

## Chapter Walkthrough (Consolidated 9 Chapters)

- **Chapter 00 · The Arrival (`#top`)**: Split-text reveal headline, dual CTAs, scroll indicator, and kinetic 3D gyroscopic sculpture.
- **Chapter 01 · Tourist Guide (`#tourist-guide`)**: Multilingual travel companion with native 3D topographic mountain ridges, elevation profiles, and 4 interactive waypoints.
- **Chapter 02 · NEXUS (`#nexus`)**: Distraction-free native Android messaging stream, phone device frame, and floating conversation bubbles.
- **Chapter 03 · ORVIX (`#orvix`)**: Local AI developer workflow bridging to Ollama on `127.0.0.1:11434`, browser mockup, and hardware requirements.
- **Chapter 04 · Screens Gallery (`#screens-gallery`)**: Pinned horizontal walk across phone and browser device mockups with placeholder tags.
- **Chapter 05 · ORVIX Live Demo (`#orvix-demo`)**: Interactive simulated bash terminal executing `ollama serve` and `curl` with local token streaming telemetry.
- **Chapter 06 · How It Works (`#how-it-works`)**: 3-step sequence per product in structured comparison columns.
- **Chapter 07 · About & Team (`#about`)**: Consolidated brand philosophy, 4 engineering principles, metrics pills, 4 team cards with 3D hover tilt, and journey timeline.
- **Chapter 08 · Updates (`#updates`)**: 3 engineering logs and workbench dispatches.
- **Chapter 09 · FAQ (`#faq`)**: 6 fully accessible, keyboard-friendly accordion answers.
- **Outro · Community (`#community`)**: Giant outlined ARRIVA wordmark, social links, contact email, and footer directory.

---

## Local Development & Testing

Run a local HTTP server from the `website` directory:

```bash
# Using Python
cd website
python -m http.server 8000

# Or using npx serve
npx serve website
```

Open `http://localhost:8000` in your browser.

### Automated Testing & Verification

1. **Comprehensive Headless Test Suite** (validates WebGL 3D canvas, mobile menu toggle, interactive waypoints, terminal simulation, and console errors):
```bash
node dev/tools/verify_phase2.js
```

2. **File Protocol Direct Opening Verification**:
```bash
node dev/tools/verify_file_protocol.js
```

3. **Automated Screenshot Verification** (captures desktop 1366x800 and mobile 390x780 screenshots across Hero, Tourist Guide, and Footer):
```bash
node dev/tools/capture_after_screenshots.js
```

Screenshots are saved to the `screenshots/` directory.

---

## Deployment (Firebase Hosting)

Deploy to Firebase Hosting using the preconfigured `firebase.json`:

```bash
firebase deploy --only hosting
```

---

## Verification Checklist (`// TODO-VERIFY`)

Before official public launch, verify and update the following placeholders in `website/content.js`:

1. **Tourist Guide**:
   - `stats`: Sample place count (`"100+"`) and supported languages (`"3"`).
   - `faqs`: Regional language rollout timeline and offline tile storage limits.
   - `techUsed`: Confirmed stack libraries (HTML5 PWA, Vector Map Renderer, etc.).
2. **NEXUS**:
   - `stats`: Active channel types and ad-tracking claims.
   - `faqs`: Android native requirements and multi-platform roadmap.
   - `techUsed`: Database engine (SQLite/Room) and socket protocol.
3. **ORVIX**:
   - `stats`: External API fee comparison (`"$0"`) and token evaluation speeds (`"42.8 tok/s"`).
   - `terminal.jsonOutput`: Sample duration values (`total_duration`, `eval_count`).
   - Hardware requirements notice: clearly communicate RAM/VRAM needs for Ollama models.
4. **About & Team**:
   - `stats`: Launch year (`"2026"`), build counts (`"3"`), and team member biographies.
   - `timeline`: Actual phase statuses (Completed, In progress, Upcoming).
5. **Contact & Socials**:
   - Final official email address (`hello@example.com` -> production email).
   - Official social handles for GitHub, YouTube, LinkedIn, and Instagram.
