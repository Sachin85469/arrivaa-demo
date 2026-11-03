# ARRIVA — Software Studio & Product Suite

**ARRIVA** — *Ideas Into Innovation.*  
Independent software engineering studio based in Pune, Maharashtra, India, run by developer Sachin Bableshwar. We build native Android applications and developer utilities focused on offline utility, privacy, and simplicity.

- **Live Website:** [https://arrivaa.tech](https://arrivaa.tech)
- **Studio GitHub:** [https://github.com/Sachin85469](https://github.com/Sachin85469)
- **Tourist Guide Repository:** [https://github.com/Sachin85469/Tourist_Guide_App](https://github.com/Sachin85469/Tourist_Guide_App)

---

## Products

### 1. Tourist Guide (Flagship Android App)
- **Status:** In Testing (Preparing for Google Play closed testing)
- **Description:** A dedicated travel companion for Maharashtra. Features curated destination discovery (heritage forts, temples, nature sanctuaries), multi-stop route planning, on-device translation between Marathi, Hindi, and English via Google ML Kit, and offline 20m topographic contour maps for Sahyadri trekking routes.
- **Privacy Policy:** [https://arrivaa.tech/tourist-guide/privacy/](https://arrivaa.tech/tourist-guide/privacy/)
- **Account Deletion:** [https://arrivaa.tech/tourist-guide/delete-account/](https://arrivaa.tech/tourist-guide/delete-account/)

### 2. NEXUS (Private Messaging)
- **Status:** In Development
- **Description:** An early-stage project exploring lightweight, private messaging with local SQLite message storage, direct chats, topic channels, and zero algorithmic tracking feeds.

### 3. ORVIX (Local AI Bridge)
- **Status:** In Development
- **Description:** A native developer interface for interacting with and inspecting local Ollama instances on your own hardware without routing prompts through external cloud telemetry.

---

## Directory Structure

```text
ARRIVAA/
├── website/                         # Deployed root (Firebase Hosting public directory)
│   ├── assets/
│   │   ├── favicon.svg             # Vector brand icon mark
│   │   ├── fonts/                  # Self-hosted typography (Fraunces serif & Inter sans)
│   │   │   ├── fonts.css
│   │   │   ├── fraunces-latin.woff2
│   │   │   └── inter-latin-*.woff2
│   │   ├── og-image.png            # OpenGraph and Twitter card image card
│   │   └── screens/                # Vector phone interface previews
│   ├── tourist-guide/
│   │   ├── index.html              # Tourist Guide product showcase
│   │   ├── privacy/
│   │   │   └── index.html          # Google Play Console Privacy Policy
│   │   └── delete-account/
│   │       └── index.html          # Account and data deletion instructions
│   ├── nexus/
│   │   ├── index.html              # NEXUS product page
│   │   └── privacy/
│   │       └── index.html          # NEXUS privacy notice
│   ├── orvix/
│   │   ├── index.html              # ORVIX product page
│   │   └── privacy/
│   │       └── index.html          # ORVIX privacy notice
│   ├── privacy/
│   │   └── index.html              # Studio website privacy policy (arrivaa.tech only)
│   ├── contact/
│   │   └── index.html              # Studio contact information
│   ├── index.html                  # Studio home page
│   ├── privacy.html                # Legacy redirect to /tourist-guide/privacy/
│   ├── 404.html                    # Error page
│   ├── styles.css                  # Shared editorial stylesheet (zero CDN dependencies)
│   ├── main.js                     # Minimal mobile menu navigation script
│   ├── robots.txt                  # Search engine crawler directives
│   └── sitemap.xml                 # XML Sitemap indexing all canonical URLs
├── brand/                          # Brand wordmarks and design guidelines
├── social/                         # Marketing and launch planning documents
├── dev/                            # Verification tools and scripts
├── screenshots/                    # Multi-viewport verification captures
├── firebase.json                   # Firebase Hosting configuration (security headers, caching)
├── .firebaserc                     # Firebase project binding
├── ISSUES.md                       # Comprehensive project audit findings
├── CHANGES.md                      # Changelog detailing all modifications
└── README.md                       # Project documentation
```

---

## Technical Specifications

- **Architecture:** Static HTML5, modern CSS, and lightweight vanilla JavaScript (zero libraries, zero CDNs, zero build tools).
- **Dependencies:** Completely self-contained. All typography (Fraunces variable serif, Inter sans) is self-hosted in WOFF2 format.
- **Design System:** Calm editorial aesthetic with warm off-white surfaces (#FAF8F4), sand panels (#EEE8DA), hairline borders (#E2DBCB), deep charcoal body text (#1E1B16), and single accent purple (#6D28D9).
- **Spacing Scale:** Strict 10-point custom property scale (4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px), fluid typography and section vertical padding via clamp(), and 66ch reading width limits.
- **Motion & Interaction Tokens:** Tasteful animations governed by --ease: cubic-bezier(0.22, 0.7, 0.2, 1) and durations 160ms, 320ms, 600ms. Includes FLIP route sorting, interactive tablist with self-drawing SVG routes, pointer parallax tilt, scroll reveals, and sticky reading progress.
- **Responsiveness & Accessibility:** Tested across 360px, 768px, and 1280px with 0 horizontal overflow. Perfect WCAG AA contrast, >= 44px touch targets, full keyboard accessibility (focus traps, Escape handlers, arrow navigation), and complete graceful degradation when JavaScript is disabled.
- **Motion Reduction:** Full @media (prefers-reduced-motion: reduce) support with immediate state display.
- **Security:** Strict Content Security Policy, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy: strict-origin-when-cross-origin, and Permissions-Policy configured in irebase.json.

---

## Contributors

Tourist Guide is built collaboratively with independent makers, designers, and researchers in Pune:

1. **Sachin Bableshwar** (Lead Developer)
   - **Contribution:** Android Architecture, Room Database, API integration & core system engineering.
   - **Profiles:** [GitHub](https://github.com/Sachin85469) &middot; [LinkedIn](https://www.linkedin.com/in/sachin-bableshwar-657853392/)
2. **Srushti Bagad** (Co-Founder & UI/UX Contributor)
   - **Contribution:** UI/UX Design, Route Algorithm flows, on-device Google ML Kit translation & phrasebook.
   - **Profiles:** [GitHub](https://github.com/bagadsrushti) &middot; [LinkedIn](https://www.linkedin.com/in/srushti-bagad/)
3. **Atharva Surange** (Contributor)
   - **Contribution:** Offline Topographic Maps, osmdroid integration & Sahyadri mountain trail caching.
   - **Profile:** [GitHub](https://github.com/atharvasur-hub)
4. **Atharva Jaju** (Contributor)
   - **Contribution:** Destination Research, Maharashtra fort & heritage metadata & Marathi curation.
   - **Profile:** [LinkedIn](https://www.linkedin.com/search/results/all/?keywords=Atharva%20Jaju)
5. **Atharva Bodke** (Contributor)
   - **Contribution:** QA Testing, cross-device Android compatibility verification & closed beta coordination.
   - **Location:** Pune, Maharashtra, India

---

## Contact & Grievance Redressal

**Sachin Bableshwar**  
Lead Developer & Privacy Contact, ARRIVA  
Pune, Maharashtra, India  
Email: [sachinbableshwar1828@gmail.com](mailto:sachinbableshwar1828@gmail.com)  
GitHub: [https://github.com/Sachin85469](https://github.com/Sachin85469)

---

## License

Open-source under the [MIT License](https://opensource.org/licenses/MIT).
