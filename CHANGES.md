# ARRIVA Website Redesign Changelog (CHANGES.md)

**Project:** ARRIVA Studio Brand & Product Website  
**Branch:** `redesign`  
**Date:** November 3, 2026  
**Auditor/Engineer:** Automated Redesign & Verification Suite  

---

## 1. Overview of Changes

This update audits, cleans up, and redesigns the official web portal for ARRIVA, an independent software engineering studio in Pune, India, run by developer Sachin Bableshwar. The redesign replaces an outdated, heavy dark-mode template and unverified claims with a calm, editorial, light-themed website. The updated site has zero external runtime dependencies, accurate privacy documentation for Google Play Console submission, and strict security and caching headers.

---

## 2. Detailed File Modifications

### 2.1 File Additions
- **`ISSUES.md`**: Project audit log cataloging all critical, important, and minor issues found in the baseline repository, along with line references and remediations.
- **`CHANGES.md`**: Complete changelog documenting every modification across the codebase.
- **`website/tourist-guide/index.html`**: Dedicated product page for Tourist Guide featuring its development status ("In testing"), interface preview frames, architectural details, and privacy link.
- **`website/tourist-guide/privacy/index.html`**: Google Play Console compliant Privacy Policy with unverified parameters bracketed for confirmation from release builds.
- **`website/tourist-guide/delete-account/index.html`**: Dedicated account and data deletion instructions fulfilling Google Play's 2026 user data safety mandate.
- **`website/nexus/index.html` & `website/nexus/privacy/index.html`**: Product showcase and preliminary architectural privacy notice for NEXUS with "In development" status.
- **`website/orvix/index.html` & `website/orvix/privacy/index.html`**: Product showcase and architectural privacy notice for ORVIX with "In development" status.
- **`website/privacy/index.html`**: Studio website privacy policy governing `arrivaa.tech` exclusively (zero cookies, zero analytics).
- **`website/contact/index.html`**: Studio contact page with verified developer email, GitHub links, and location details.
- **`website/assets/fonts/fraunces-latin.woff2` & `inter-latin-*.woff2`**: Self-hosted variable serif (`Fraunces`) and clean sans-serif (`Inter`) typography.

### 2.2 File Deletions (Obsolete Legacy Assets)
- **`dev/tools/SylvaLivingWorldScene.tsx`**: Legacy 3D scene component from an abandoned earlier design.
- **`dev/tools/threeui.css`**: Legacy CSS for 3D Three.js UI overlays.
- **`dev/tools/sylva-bundle.json`**: 947 KB binary mesh bundle.
- **`dev/tools/build_sylva.py`**: Legacy script for bundling 3D scene data.
- **`dev/tools/lighthouse-report.json`**: Outdated pre-redesign Lighthouse report.
- **`dev/tools/site.spec.js`, `capture_before_screenshots.js`, `capture_after_screenshots.js`, `verify_file_protocol.js`, `verify_phase2.js`**: Legacy automation scripts referencing removed page structures.
- **`screenshots/*-before.png` & `screenshots/*-after.png`**: 13 obsolete screenshots from previous iterations.
- **`website/assets/fonts/poppins-*.woff2` & `jetbrains-mono-*.woff2`**: 16 unused font files totaling over 300 KB.
- **`website/assets/team/` & `website/assets/updates/`**: Fictitious team avatar SVGs and placeholder update graphics.

### 2.3 Core Modifications
- **`website/index.html`**:
  - Rebuilt with a light, warm editorial palette (background `#FAF8F4`, text `#1E1B16`, sand panels `#EEE8DA`).
  - Added a dedicated "What we make" section with status dots ("In testing" for Tourist Guide, "In development" for NEXUS and ORVIX).
  - Added a flagship **Tourist Guide spotlight** sand panel highlighting key features with a phone interface preview.
  - Removed fake interactive terminal emulators, scripted chat demos, and artificial solver simulations.
  - Added absolute OpenGraph and Twitter card meta tags referencing `https://arrivaa.tech/assets/og-image.png`.
  - Added absolute `<link rel="canonical" href="https://arrivaa.tech/">`.
  - Removed "404 Diagnostics" from footer navigation.
  - Stripped all HTML comments.
- **`website/styles.css`**:
  - Replaced Tailwind CDN compilation with clean, native CSS Grid and Flexbox layouts.
  - Defined design tokens for the editorial palette: `--color-bg: #FAF8F4`, `--color-panel: #EEE8DA`, `--color-border: #E2DBCB`, `--color-text: #1E1B16`, `--color-accent: #6D28D9`.
  - Replaced colored pill badges with minimal status dots (`.status-testing::before`, `.status-development::before`).
  - Enforced 44px minimum touch target dimensions for interactive controls.
  - Added horizontal scroll wrappers (`.table-wrapper`) for table responsiveness on 360px mobile viewports.
  - Configured `@media (prefers-reduced-motion: reduce)` and print stylesheets.
  - Removed all comments from the stylesheet.
- **`website/main.js`**:
  - Minified mobile navigation toggle script with no comments and zero external dependencies.
- **`website/privacy.html`**:
  - Converted legacy top-level `/privacy.html` into a lightweight redirect pointing to `/tourist-guide/privacy/` via `<meta http-equiv="refresh">` and `window.location.replace()`.
- **`website/404.html`**:
  - Redesigned 404 page matching the studio aesthetic with home navigation button and full metadata.
- **`website/sitemap.xml`**:
  - Cleaned up duplicate URLs (`/` vs `/index.html`), indexing all 10 canonical directory URLs with trailing slashes.
- **`firebase.json`**:
  - Enabled `trailingSlash: true`.
  - Added Content Security Policy (`default-src 'self' ...`).
  - Added `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
  - Added optimal Cache-Control directives: 1 year immutable for fonts/images, 1 week for CSS/JS, 1 hour for HTML.
- **`README.md`**:
  - Replaced outdated and unverified claims with factual, honest project descriptions.
  - Updated directory tree and Google Play compliance documentation.

---

## 3. Rationale for Architectural Decisions

1. **Self-Contained Offline Architecture**: Eliminating third-party CDNs prevents FOUC, network timeouts, and external privacy tracking. Self-hosting WOFF2 fonts and using inline SVGs guarantees fast first-contentful paint (FCP).
2. **Directory-Based Routing**: Adopting directory folders with `index.html` files ensures clean URLs ending in a slash (e.g., `/tourist-guide/`), fully aligning with Firebase Hosting's `trailingSlash: true` configuration and preventing 301 redirect loops.
3. **Data Safety Compliance for Google Play**: Splitting the privacy documentation into product-specific policies and bracketing unverified items prevents misleading representations in Google Play Data Safety forms.

### 2.4 Contributors Section
- Added responsive editorial **Contributors** section to website/tourist-guide/index.html featuring:
  1. **Sachin Bableshwar**: Android Architecture & Room Database
  2. **Srushti Bagad**: UI/UX Design, Route Algorithm & Translation Models
  3. **Atharva Surange**: Offline Topographic Maps & osmdroid
  4. **Atharva Jaju**: Destination Research & Marathi Curation
  5. **Atharva Bodke**: QA Testing & Closed Beta Coordination
- Added **App Contributors** sub-section to the Studio About section in website/index.html.
- Added self-contained editorial grid styles (.contributors-grid, .contributor-card, etc.) to website/styles.css adhering to WCAG AA contrast rules and mobile responsiveness.
- Updated README.md documenting team contributions and profile links.


---

## 4. Spacing Scale, Motion Tokens & Interaction Engine (Branch motion)

### 4.1 Strict 10-Point Spacing Scale
Implemented a single, cohesive 10-point CSS custom property scale across website/styles.css:
- --space-1: 4px
- --space-2: 8px
- --space-3: 12px
- --space-4: 16px
- --space-5: 24px
- --space-6: 32px
- --space-7: 48px
- --space-8: 64px
- --space-9: 96px
- --space-10: 128px
- Fluid vertical section padding: clamp(72px, 10vw, 128px)
- Fluid typography clamps for headings (clamp(2rem, 4.5vw, 3.25rem) on H1; clamp(1.5rem, 3vw, 2.25rem) on H2)
- Body line height 1.6 to 1.7, large heading line height 1.05 to 1.15
- Reading width restricted to maximum 66 characters (--max-reading-width: 66ch)
- Container max-width 1120px with 40px desktop gutters and 20px mobile gutters
- Every touch target strictly >= 44px with zero screen edge collision on 360px viewports

### 4.2 Motion Tokens & Accessibility
- --ease: cubic-bezier(0.22, 0.7, 0.2, 1)
- --dur-hover: 160ms
- --dur-ui: 320ms
- --dur-reveal: 600ms
- Comprehensive @media (prefers-reduced-motion: reduce) system setting all durations and delays to 0.001ms !important and transforms to none !important.

### 4.3 Interactive Features (Vanilla JS, 0 external dependencies, 0 code comments)
1. **Header Scroll Border:** Dynamically adds a subtle bottom border (#E2DBCB) when scroll depth exceeds 8px.
2. **Accessible Mobile Navigation:** Slides out smoothly, traps keyboard focus, closes on Escape key, closes on navigation link click, and returns focus to #menu-toggle.
3. **Hero Entrance & Pointer Tilt:** Staggered opacity and 12px rise on page load (60ms stagger). Desktop-only pointer parallax tilt (maximum 4 degrees) with smooth transition back on pointer leave.
4. **Hero Itinerary FLIP Animation:** 'Tidy up the route' button reorders destination stops with smooth FLIP transitions, toggles label to 'Route tidied', and restores initial order on second click.
5. **Interactive Product Rows:** Sand background wash slides in from left on hover and keyboard focus, title nudges 4px, and arrow shifts. Entire row is clickable while child links (e.g. Privacy) remain independently operable.
6. **Tourist Guide Spotlight Tablist:** Real ARIA tablist ('Plan', 'Map', 'Phrasebook') with Left/Right arrow key navigation and 8px slide crossfades.
   - Map: Self-drawing SVG route line (1.2s ease) with sequential pin pop-ins.
   - Phrasebook: Multi-bar animated audio waveform and Web Speech synthesis Marathi voice check.
7. **JS-Off Friendly Scroll Reveals:** Elements reveal gracefully with IntersectionObserver (12-16px rise, 320-600ms, 60ms stagger). Initial hidden state is scoped exclusively to html.js, guaranteeing 100% visibility when JavaScript is disabled.
8. **Privacy Sticky TOC & Progress:** Sticky sidebar TOC highlighting the active section via IntersectionObserver with smooth scroll offset. Fixed top reading progress bar tracking document scroll depth.
9. **Tourist Guide Features & Accordion:** Mobile horizontal scroll-snap preview, desktop 6px hover lift, and accessible animated <details>/<summary> accordion for 'Under the hood'.
10. **Micro-Interactions & Contact Copy:** Animated link underlines, active button scale (0.98), back-to-top button, and 'Copy email' button with immediate 'Copied!' feedback and fallback support.
11. **View Transitions API:** Declarative @view-transition { navigation: auto; } for cross-document transitions.
12. **404 Self-Drawing Route:** Interactive canvas/SVG drawing route line guiding users back to safety.
13. **Captions:** Subtle 'Illustrative preview' captions placed on all conceptual phone UI frames.

### 4.4 Verification & Quality Assurance
- **Multi-Viewport Testing:** 11 pages tested at 360px, 768px, and 1280px widths (0 horizontal overflows, 0 console errors).
- **Lighthouse Scores:** Home and /tourist-guide/ achieved 100 on Accessibility, 100 on Best Practices, 100 on SEO, and 0.00 Cumulative Layout Shift (CLS).
- **Code Comments:** Verified 0 code comments across all HTML, CSS, and JS files.
- **Artifacts:** home-scroll.webm generated demonstrating the full range of interactions and responsiveness.
