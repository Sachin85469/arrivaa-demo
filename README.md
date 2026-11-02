# ARRIVA — Official Brand & Web Portal

**ARRIVA** — *Intelligent Exploration for Maharashtra & Pune.*  
Official brand portal and Google Play Store compliance suite for the **Arriva Android Travel Companion** (`com.arriva.touristguide`).

Live Portal: [https://arrivaa.tech](https://arrivaa.tech)  
Repository: [https://github.com/Sachin85469/arrivaa-demo](https://github.com/Sachin85469/arrivaa-demo)  
Android App Source: [https://github.com/Sachin85469/Tourist_Guide_App](https://github.com/Sachin85469/Tourist_Guide_App)

---

## Core Focus: ARRIVA Travel Companion

Arriva is an autonomous Android travel companion built natively for Android 10+ (API 29–35) in Kotlin and Java. It provides:
1. **Autonomous Simulated Annealing Trip Planner**: On-device TSP solver optimizing multi-stop Pune and Sahyadri itineraries, penalizing backtracking and traffic bottlenecks.
2. **Offline Topographic Vector Contours**: 20-meter elevation contour maps powered by osmdroid and SQLite tile caching, operating in complete cellular dead zones.
3. **On-Device Marathi Neural Translation**: Google ML Kit on-device model translating directional, culinary, and emergency phrases without network latency.
4. **Zero-Permission Intent Emergency SOS**: Complete Google Play compliance using Android `ACTION_SENDTO` and `ACTION_DIAL` Intents to prefill coordinates without requesting invasive background SMS/Call permissions.

---

## Web Architecture & Directory Layout

The web portal lives under `website/` and is deployed as a high-performance static experience:

```text
ARRIVAA/
├── website/
│   ├── assets/
│   │   ├── fonts/               # Self-hosted typography
│   │   ├── screens/             # App screenshots and vector device mockups
│   │   ├── favicon.svg          # Official Arriva mark
│   │   └── og-image.png         # Social graph preview card
│   ├── 404.html                 # Custom dark fallback page
│   ├── index.html               # Official Arriva product landing showcase
│   ├── privacy.html             # Google Play compliant standalone privacy policy
│   ├── robots.txt               # Search engine crawler directives
│   └── sitemap.xml              # XML Sitemap
├── brand/                       # Vector wordmarks and design guidelines
├── dev/                         # Local development and verification scripts
└── README.md                    # Project documentation
```

---

## Google Play Developer Policy Compliance

The portal hosts the official, standalone **Privacy Policy** required by Google Play Console:
- Public URL: `https://arrivaa.tech/privacy.html`
- Prominent runtime permission disclosures: `ACCESS_FINE_LOCATION`, `CAMERA`
- Explicit declaration of zero sensitive SMS / Call permissions
- Step-by-step account and telemetry deletion instructions
- Grievance Redressal Officer contact: Sachin Bableshwar (`sachinbableshwar1828@gmail.com`)

---

## Local Development

Serve the static site locally with any static HTTP server:
```bash
python -m http.server 8000 --directory website
```
Open `http://localhost:8000` in your browser.

---

## License

Open source under the [MIT License](https://opensource.org/licenses/MIT).
