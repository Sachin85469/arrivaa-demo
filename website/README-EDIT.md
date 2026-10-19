# Editing the ARRIVA Website

The ARRIVA website is a pure vanilla HTML/CSS/JS static site with **zero build step**, **zero external CDN dependencies**, and self-hosted assets. All text, numbers, metrics, and links are driven by `content.js`.

---

## 1. Single Source of Truth (`content.js`)
Every user-facing string and data structure lives in `content.js`. When editing, do not hardcode text into `main.js` or `index.html`.

### Key Sections & New Keys:
- **`site.domain`**: Canonical site URL (`https://arrivaa.tech/`).
- **`brand`**: Brand name, mark suffix, tagline, and browser mockup address (`brand.browserAddress`).
- **`nav`**: Header links and "Say hello" CTA pill.
- **`hero`**: Hero chapter tag, Marathi transliteration, title, lead, CTAs, and scroll hint.
- **`products`**:
  - `touristGuide`: Trail stats, highlights, and waypoint data.
  - `nexus`: Features, preview messages (`previewMessages`), and live mock chat configuration (`chatDemo` containing channels, canned replies, and initial message threads).
  - `orvix`: Points, hardware note, and architecture highlights.
- **`touristGuideScene`**:
  - `trailStats`: Verified elevation span (Sinhagad 1,312m - Mutha River 560m = 752m).
  - `pins`: 4 Sahyadri waypoints (Sinhagad, Mutha River, Old Bazaar, Vetal Hill).
  - `elevationTitle`: Elevation profile widget title.
  - `plannerTitle`, `plannerDistanceLabel`, `plannerTimeLabel`: Mini day-planner widget copy.
- **`screensGallery`**: Pinned mockup groups, category pills, captions, and device frame definitions.
- **`orvixDemo`**:
  - `skipLabel`: Terminal "Skip to output" button label.
  - `daemonNote`: Background note explaining Ollama daemon vs client execution.
  - `terminal`: Simulated bash sequence (`command1`, `logs1`, `command2` with `"stream": false`, `jsonOutput`, `stats`).
  - `interactive`: Working interactive terminal simulation (`badge`, `promptUser`, `placeholder`, `chips`, `help`, `modelsList`, `llamaResponses`, `curlTestOutput`).
- **`faq`**:
  - `searchPlaceholder`: Live search input placeholder.
  - `expandAllLabel`, `collapseAllLabel`: Accordion bulk toggle button labels.
  - `noResultsText`: Message shown when no FAQ matches the search query.
  - `items`: 6 accessible Q&A items.
- **`about`**:
  - `principles`: 4 core engineering principles.
  - `stats`: Key project metrics.
  - `teamSubhead`: Subhead copy for the Team section.
  - `team`: 4 team member cards.
  - `timelineSubhead`: Subhead copy for the Timeline section.
  - `timeline`: Project roadmap and phase statuses.
- **`updates`**: 3 engineering logs with non-link "Coming soon" badges (`dispatchBadge`).
- **`community`**: Giant ARRIVA wordmark, social link tuples, and contact email.
- **`footer`**: Column links and privacy statement.
- **`ui`**: Shared UI strings (`skipToMain`, `openMenu`, `closeMenu`, `copyCode`, `copied`, `lightboxClose`, `lightboxPrev`, `lightboxNext`, `prevWaypoint`, `nextWaypoint`, `backToTop`, `copyToast`).

---

## 2. Replacing Placeholders
Search `content.js` for `// TODO-VERIFY` markers before public launch:
- Replace `hello@example.com` with your production contact address.
- Replace placeholder social URLs (GitHub, YouTube, LinkedIn, Instagram).
- Replace placeholder team names, roles, and portraits.
- Review Tourist Guide stack label (`"HTML5 PWA"` vs `"Android app"`).
- Replace SVG mockups in `assets/screens/` with real product screenshots.

---

## 3. Local Development & Testing
Run a local static server inside the `website/` directory:
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in Chrome, Firefox, or Safari.

### Automated Testing
From the repository root (`ARRIVAA/`):
```bash
node dev/tools/verify_phase2.js
```
Runs comprehensive headless Chrome CDP verification across desktop (1366x800), tablet (900x800), and mobile (390x780).

---

## 4. Deployment
Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```
The public directory is configured to `website/` in `firebase.json`.
