# ARRIVA — Software Studio & Product Suite

**ARRIVA** — *Ideas Into Innovation.*  
Independent software engineering studio based in Pune, India. We design and build focused digital products prioritizing on-device privacy, offline utility, and high-performance native architecture.

- **Live Web Portal**: [https://arrivaa.tech](https://arrivaa.tech)
- **Web Portal Repository**: [https://github.com/Sachin85469/arrivaa-demo](https://github.com/Sachin85469/arrivaa-demo)
- **Flagship Android App**: [https://github.com/Sachin85469/Tourist_Guide_App](https://github.com/Sachin85469/Tourist_Guide_App)

---

## The ARRIVA Fleet

### 01 · ARRIVA Tourist Guide (Flagship Android App)
- **Status**: Live / Version 1.0.4 (Target SDK 34 / Android 10+)
- **Package**: `com.arriva.touristguide`
- **Core Technology**: Kotlin & Java, Room SQLite DB, osmdroid 20m contour topography, Google ML Kit on-device Marathi translation, Simulated Annealing route optimizer.
- **Safety**: 100% Intent-based emergency distress (`Intent.ACTION_SENDTO` and `Intent.ACTION_DIAL`) with zero dangerous background SMS or phone call permissions.

### 02 · ARRIVA NEXUS (Private Messaging)
- **Status**: In Active Development (Android Native)
- **Core Philosophy**: Zero algorithmic feeds, zero timeline ads, on-device SQLite message storage, topic channels, and low background battery overhead (<2% per day).

### 03 · ARRIVA ORVIX (Local AI Bridge)
- **Status**: Developer System / Local Compute
- **Core Technology**: Connects directly to local Ollama on `127.0.0.1:11434`. Streaming token inspection, raw REST API console, zero external cloud telemetry leaks.

---

## Directory Layout

```text
ARRIVAA/
├── website/
│   ├── assets/
│   │   ├── fonts/               # Self-hosted typography (Poppins, JetBrains Mono)
│   │   ├── screens/             # SVG & image mockups (Tourist Guide, NEXUS, ORVIX)
│   │   ├── favicon.svg          # Official ARRIVA studio mark
│   │   └── og-image.png         # OpenGraph preview card
│   ├── 404.html                 # Diagnostics & error page
│   ├── index.html               # Official studio showcase & interactive fleet portal
│   ├── privacy.html             # Standalone Google Play 2026 compliant privacy policy
│   ├── robots.txt               # Crawler directives
│   └── sitemap.xml              # XML Sitemap
├── brand/                       # Vector wordmarks and design guidelines
├── dev/                         # Local development test suites
└── README.md                    # Project documentation
```

---

## Google Play Developer Policy Compliance

The web portal hosts the standalone **Privacy Policy & Data Safety Disclosures** required by Google Play Console:
- Direct URL: `https://arrivaa.tech/privacy.html`
- Prominent runtime permission disclosures: `ACCESS_FINE_LOCATION`, `CAMERA`, `INTERNET`
- Explicit zero-permission declaration: No `SEND_SMS` or `CALL_PHONE`
- Self-serve account and telemetry deletion instructions
- Grievance Redressal Officer: Sachin Bableshwar (`sachinbableshwar1828@gmail.com`)

---

## License

Open source under the [MIT License](https://opensource.org/licenses/MIT).
