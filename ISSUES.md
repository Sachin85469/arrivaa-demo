# Project Audit & Issues Register (ISSUES.md)

**Project:** ARRIVA Studio Brand & Product Website  
**Domain:** https://arrivaa.tech  
**Audit Date:** November 3, 2026  
**Auditor:** Automated Engineering Audit  

---

## Summary of Findings

The project was audited across code structure, external dependencies, compliance, accessibility, security configurations, and content fidelity. Issues are catalogued below into **Critical**, **Important**, and **Minor** categories. Each issue specifies the file, line number (referenced from the original baseline on the `main` branch), description of the defect, and the remediation applied.

---

## 1. Critical Issues

### 1.1 Production Use of Tailwind CDN, Lucide CDN, and Google Fonts
- **File:** `website/index.html` (lines 20-35) & `website/privacy.html` (lines 18-28)
- **Problem:** `website/index.html` and `privacy.html` loaded Tailwind CSS from `https://cdn.tailwindcss.com`, icon glyphs from `https://unpkg.com/lucide@latest`, and typography from Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`). The Tailwind script build is explicitly documented by Tailwind Labs as unsuitable for production because it compiles utility classes in the client runtime on the fly, risking Flash of Unstyled Content (FOUC), latency, and breakage if third-party CDNs become unavailable. Furthermore, this directly contradicted the repository's documentation claiming zero external dependencies.
- **Fix:** Completely eliminated all external script tags and stylesheet links. Implemented a single, shared, self-contained stylesheet (`website/styles.css`) using native CSS variables and modern layout primitives (CSS Grid and Flexbox). Self-hosted font files (`Fraunces` variable serif and `Inter` sans-serif) in `website/assets/fonts/` loaded via `website/assets/fonts/fonts.css`. Replaced CDN icon references with inline vector SVGs.

### 1.2 Unverified & Misleading Claims in Tourist Guide Privacy Policy for Google Play
- **File:** `website/privacy.html` (lines 78–195)
- **Problem:** As the intended public "Privacy policy URL" for Google Play Console submission of the Tourist Guide Android app, the baseline policy contained numerous factual claims that cannot be verified without access to the separate Android source repository (`Tourist_Guide_App`). Specific unverified assertions included:
  - "0 dangerous permissions declared" while simultaneously enumerating runtime location and camera permissions.
  - "ZERO SEND_SMS, CALL_PHONE and accessibility service".
  - "no background location".
  - "TLS 1.3 / AES-256".
  - "no shadow backups".
  - Self-assigned "Google Play Developer Policy Compliant" badge.
  - Rigid "7-day deletion window".
  - Precise in-app path: `Settings > Profile > Delete Account`.
  - Unconfirmed Android package name: `com.arriva.touristguide`.
  Submitting unverified or inaccurate data safety disclosures in Google Play Console can result in policy strikes or app rejection.
- **Fix:** Restructured the privacy documentation. Moved the app policy to its dedicated product path at `website/tourist-guide/privacy/index.html` (with a lightweight HTTP-refresh and JS redirect preserved at `/privacy.html`). Rewrote the policy to include only architectural commitments that are true by design. Every unconfirmed parameter has been clearly demarcated in square brackets (e.g., `[confirm from release build: package name com.arriva.touristguide]`, `[confirm from release build: foreground service permissions]`, `[confirm in-app navigation: Settings > Profile > Delete Account]`, `[confirm deletion SLA turnaround]`). Created a dedicated account deletion informational page at `/tourist-guide/delete-account/index.html` satisfying Google Play's 2026 data deletion policy requirements.

### 1.3 Fabrication of Interactive Demos & Synthetic Statistics
- **File:** `website/index.html` (lines 280–490)
- **Problem:** The original index page featured deceptive interactive widgets:
  - A fake terminal simulation featuring an artificial command line prompt (`sachin@arriva:~$`) giving visitors the misleading impression of an interactive remote shell for ORVIX.
  - A simulated chat interface for NEXUS depicting dummy instant messaging interactions.
  - An algorithmic "itinerary solver" presentation with simulated calculation steps.
  - Invented quantitative performance claims (e.g., "<2% battery per day", "0ms telemetry latency", "10,000+ routes solved").
  These synthetic demos misrepresented the maturity of products that are still in early development.
- **Fix:** Removed all fake terminal emulators, scripted chat demos, solver simulations, and unverified quantitative metrics. Replaced them with honest, plain-language editorial descriptions and neutral labelled phone screen previews ("Screenshot coming soon") clearly identifying Tourist Guide as in testing, and NEXUS and ORVIX as in active development.

### 1.4 Missing Security & Caching Directives in Firebase Configuration
- **File:** `firebase.json` (lines 1–12)
- **Problem:** `firebase.json` only specified `public: "website"`, `trailingSlash: true`, and ignore patterns. It omitted fundamental HTTP security headers (Content-Security-Policy, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy). Furthermore, it omitted Cache-Control headers, causing static binary assets (fonts, images, SVGs) to be served with default revalidation headers instead of optimal immutable long-term caching.
- **Fix:** Added comprehensive header definitions in `firebase.json`:
  - `Content-Security-Policy`: Restricts scripts, styles, fonts, and images strictly to `'self'`, preventing Cross-Site Scripting (XSS) and data exfiltration.
  - `X-Content-Type-Options: nosniff` preventing MIME-type sniffing.
  - `X-Frame-Options: DENY` preventing clickjacking.
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`.
  - `Cache-Control` configured to 1 year immutable (`public, max-age=31536000, immutable`) for fonts and images, 1 week for CSS/JS (`public, max-age=604800, stale-while-revalidate=86400`), and 1 hour with revalidation for HTML documents.

### 1.5 Duplicate URLs in XML Sitemap Causing SEO Canonical Contention
- **File:** `website/sitemap.xml` (lines 3–14)
- **Problem:** The sitemap indexed both `https://arrivaa.tech/` and `https://arrivaa.tech/index.html` as two independent entries with conflicting priorities. This causes search crawler canonical conflicts and duplicate content penalties.
- **Fix:** Rebuilt `website/sitemap.xml` to list only clean canonical URLs ending with trailing slashes matching Firebase Hosting's `trailingSlash: true` configuration, eliminating duplicate `/index.html` references and indexing all 10 site endpoints.

---

## 2. Important Issues

### 2.1 Relative OpenGraph and Twitter Meta Tags & Missing Canonical Tags
- **File:** `website/index.html` (lines 12–19), `website/404.html`, and all product subpages
- **Problem:** `og:image` and `twitter:image` tags used relative paths (e.g., `assets/og-image.png` or `/assets/og-image.png`). The OpenGraph and Twitter card specifications mandate absolute URLs starting with `https://`. In addition, canonical `<link rel="canonical">` tags were absent on several pages (including `404.html`), and Twitter Card metadata (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) was missing across subpages.
- **Fix:** Updated every HTML file with unique descriptive titles, meta descriptions, absolute canonical URLs (`https://arrivaa.tech/.../`), and fully qualified OpenGraph and Twitter Card meta tags referencing `https://arrivaa.tech/assets/og-image.png`.

### 2.2 Outdated Project Documentation & Unsubstantiated Claims in README
- **File:** `README.md` (lines 14–60)
- **Problem:** The repository README contained unverified claims such as "Status: Live / Version 1.0.4", "100% Intent-based emergency actions", "<2% battery per day", and listed obsolete technologies like Poppins and JetBrains Mono fonts. It also cited contradictory permission statements (mentioning `CAMERA` in disclosures while the policy stated no camera was declared).
- **Fix:** Completely overhauled `README.md` to accurately describe ARRIVA as a Pune-based independent studio, highlighting Tourist Guide entering closed testing, NEXUS and ORVIX in development, detailing the actual file structure, self-hosted typography, and correct privacy policy routes.

### 2.3 Obsolete 3D Scene Tools, Build Artifacts, and Screenshots
- **File:** `dev/tools/` & `screenshots/`
- **Problem:** Over 4.5 MB of leftover files from an abandoned earlier "Sylva Living World" 3D scene and dark theme design remained in the repository:
  - `dev/tools/SylvaLivingWorldScene.tsx` (79 KB)
  - `dev/tools/threeui.css` (40 KB)
  - `dev/tools/sylva-bundle.json` (947 KB)
  - `dev/tools/build_sylva.py` (2.8 KB)
  - `dev/tools/lighthouse-report.json` (243 KB old report)
  - `screenshots/*-before.png` and `screenshots/*-after.png` (13 legacy image files totaling ~2.5 MB)
  - `website/assets/fonts/` held 14 unused Poppins WOFF2 files and 2 JetBrains Mono WOFF2 files (~300 KB).
  - `website/assets/team/` (team-1 to team-4 SVGs) and `website/assets/updates/` (update-1 to update-3 SVGs) representing fictitious team members and updates.
- **Fix:** Removed all obsolete 3D scene files, deprecated build scripts, legacy before/after screenshots, unused Poppins/JetBrains font files, and synthetic team/update SVGs. Preserved only active test and font assets.

### 2.4 Diagnostic Link in Public Navigation Footer
- **File:** `website/index.html` (line 520) & `website/404.html`
- **Problem:** The footer included an internal diagnostic link titled "404 Diagnostics" pointing to `404.html`. Exposing error page diagnostics in public consumer navigation is poor user experience and dilutes SEO link equity.
- **Fix:** Removed the "404 Diagnostics" link from the footer across all templates. Navigation links in the footer are now organized strictly under product and studio categories.

### 2.5 Code Comments in Production Delivery Files
- **File:** Multiple files in `website/` (`index.html`, `styles.css`, `main.js`, subpage HTML files)
- **Problem:** Code files contained inline and block comments (`<!-- ... -->`, `/* ... */`, `// ...`). Project guidelines require clean code files free of internal developer comments.
- **Fix:** Stripped all comments from HTML, CSS, and JS files across the `website/` directory.

---

## 3. Minor Issues

### 3.1 Public Email Address Exposure in Mailto Links
- **File:** `website/index.html` (line 121), `website/tourist-guide/privacy/index.html` (line 192), `website/contact/index.html` (line 53)
- **Problem:** The personal developer email address `sachinbableshwar1828@gmail.com` is exposed in plain text in mailto links, posing spam harvesting risks.
- **Resolution:** As instructed by the project brief ("flag it, do not change it"), the email address was preserved intact across all mailto links and contact sections to ensure user and regulatory communications remain functional.

### 3.2 Placeholder Tokens in Social Launch Documentation
- **File:** `social/30-day-launch-plan.md` & `social/first-9-posts.md`
- **Problem:** Social media planning documentation contained template placeholders such as `[Official website URL]`, `[WORKING PRODUCT LINK]`, `[PRODUCT NAME]`, and `[VERIFIED USER NEED]`.
- **Resolution:** Audited and verified. These files are internal marketing planning guides meant to be populated prior to public campaign execution. Added notes to verify URLs and product status before scheduling posts.

### 3.3 Touch Target Sizing and Mobile Viewport Contrast at 360px
- **File:** `website/styles.css`
- **Problem:** Small mobile viewports (360px) exhibited cramped tap targets for inline navigation links and footer elements, risking WCAG 2.1 AA non-compliance for touch target size (minimum 44x44px).
- **Fix:** Added minimum padding and tap height rules to all interactive buttons, header navigation links, and mobile menu toggles to guarantee at least 44x44px target areas. Maintained text contrast exceeding 7:1 for headers and body text against the `#FAF8F4` background.

### 3.4 Reduced Motion Preference Media Query
- **File:** `website/styles.css`
- **Problem:** CSS transitions on buttons and navigation did not respect user system preferences for reduced motion.
- **Fix:** Implemented `@media (prefers-reduced-motion: reduce)` disabling smooth scrolling and resetting transition/animation durations to 0.01ms.
