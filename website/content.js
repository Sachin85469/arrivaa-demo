// ARRIVA - Content & Configuration Source
// Every text, number, link and image on the site originates from this file.
// Numbers and stats marked with // TODO-VERIFY are placeholders to be verified before final production release.
// Images: drop your screenshots into assets/screens/ and update the paths below (PNG/JPG/WebP/SVG all supported).

window.ARRIVA = {
  brand: {
    name: "ARRIVA",
    tagline: "Ideas Into Innovation.",
    markSuffix: "."
  },

  nav: {
    links: [
      { label: "Tourist Guide", href: "#tourist-guide" },
      { label: "NEXUS", href: "#nexus" },
      { label: "ORVIX", href: "#orvix" },
      { label: "Screens", href: "#screens-gallery" },
      { label: "Demo", href: "#orvix-demo" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "About", href: "#about" },
      { label: "Updates", href: "#updates" },
      { label: "FAQ", href: "#faq" }
    ],
    cta: { label: "Say hello", href: "#community" }
  },

  preloader: {
    hi: "आगमन",
    title: "Assembling ARRIVA",
    label: "Loading digital workshop"
  },

  hero: {
    chapter: "Chapter 00 · The arrival",
    hi: "आगमन",
    title: "Ideas into innovation.",
    sub: "ARRIVA builds focused digital products and shares practical technology, software engineering, and AI workflows, one durable idea at a time.",
    ctaPrimary: { label: "Start the walk", href: "#tourist-guide" },
    ctaSecondary: { label: "Explore products", href: "#screens-gallery" },
    scrollHint: "Scroll to arrive"
  },

  products: [
    {
      id: "tourist-guide",
      chapter: "Chapter 01",
      hi: "खोज",
      name: "ARRIVA Tourist Guide",
      tag: "Travel & discovery",
      status: "In progress",
      desc: "A travel companion designed to help people discover regional landmarks, read cultural context in their preferred language, and plan a custom day sequence. Built with a lightweight architecture prioritizing local trail caching for areas with limited cellular connectivity.",
      points: [
        "Regional landmark overviews with photo galleries and local notes",
        "Multilingual interface with Devanagari typography support (Marathi, Hindi, English)",
        "Custom day route sequencing with topographic distance calculations",
        "Offline caching for trail notes and landmark summaries"
      ],
      stats: [
        ["100+", "Regional places (sample set)"], // TODO-VERIFY
        ["3", "Supported languages (active test)"] // TODO-VERIFY
      ],
      link: ["Inspect waypoints", "#tourist-guide-scene"],
      images: [
        "assets/screens/tourist-guide-1.svg",
        "assets/screens/tourist-guide-2.svg",
        "assets/screens/tourist-guide-3.svg",
        "assets/screens/tourist-guide-4.svg"
      ],
      techUsed: ["HTML5 PWA", "Vector Map Renderer", "Local Browser Storage", "Devanagari Web Fonts"], // TODO-VERIFY
      whoItIsFor: "Independent travelers, weekend explorers, and regional visitors who value cultural context over commercial clutter.",
      howItWorks: [
        { step: "01", title: "Select destination & language", desc: "Choose your travel district and read authentic cultural overviews in Marathi, Hindi, or English." },
        { step: "02", title: "Assemble a custom day route", desc: "Pin historic forts, local markets, and viewpoints to a sequence that calculates distance and daylight." },
        { step: "03", title: "Navigate with offline confidence", desc: "Access cached maps and notes seamlessly even when cellular reception drops along mountain ridges." }
      ],
      faqs: [
        { q: "Does the Tourist Guide work without cellular data?", a: "Core regional trail summaries and saved itineraries cache to local browser storage for offline reference once loaded." }, // TODO-VERIFY
        { q: "Are more regional languages planned?", a: "Marathi and Hindi are in active testing alongside English. We are exploring additional regional languages as verified translations become available." } // TODO-VERIFY
      ]
    },

    {
      id: "nexus",
      chapter: "Chapter 02",
      hi: "संवाद",
      name: "ARRIVA NEXUS",
      tag: "Communication",
      status: "In progress",
      desc: "A communication tool focused on straightforward messaging: quick chats, topic-focused channels, and a clean interface without algorithmic feeds. Built natively for Android with on-device SQLite storage.",
      points: [
        "Direct one-to-one and topic-oriented group chats",
        "Responsive native Android interface without social timeline bloat",
        "Engineered for low background battery overhead",
        "On-device message retention with simple storage controls"
      ],
      stats: [
        ["1:1", "and topic channels"], // TODO-VERIFY
        ["0", "Third-party ad trackers"] // TODO-VERIFY
      ],
      link: ["See NEXUS flow", "#nexus"],
      images: [
        "assets/screens/nexus-1.svg",
        "assets/screens/nexus-2.svg",
        "assets/screens/nexus-3.svg",
        "assets/screens/nexus-4.svg"
      ],
      techUsed: ["Kotlin Android", "WebSocket Engine", "SQLite Storage", "Local Encryption"], // TODO-VERIFY
      whoItIsFor: "People and small teams who want swift, reliable messaging without stories, status feeds, or advertising surveillance.",
      howItWorks: [
        { step: "01", title: "Lightweight socket connection", desc: "Establishes a low-overhead real-time socket connection without requiring invasive permission access." },
        { step: "02", title: "Organize targeted channels", desc: "Create focused discussion spaces for ongoing projects, friends, or family with instant delivery." },
        { step: "03", title: "Stay in storage control", desc: "All conversations and attachments stay on your device with one-tap media pruning controls." }
      ],
      faqs: [
        { q: "Why build NEXUS when other chat apps exist?", a: "Many modern chat applications prioritize social engagement algorithms and stories. NEXUS focuses strictly on low-latency, private text communication." }, // TODO-VERIFY
        { q: "Is an iOS or desktop client planned?", a: "Initial development is focused on perfecting the Android native client first, after which lightweight web and desktop clients are planned." } // TODO-VERIFY
      ]
    },

    {
      id: "orvix",
      chapter: "Chapter 03",
      hi: "प्रयोग",
      name: "ARRIVA ORVIX",
      tag: "AI developer tool",
      status: "Developer tool",
      desc: "A developer utility that connects to an Ollama daemon running on your local machine, exposing a clean API workflow for building and testing AI ideas without incurring third-party cloud API costs for local inference. Note: host computer hardware (GPU, CPU, and RAM) is required to run models.",
      points: [
        "Connects directly to local Ollama instances on your machine",
        "Standard REST and streaming token inspection console",
        "Keeps experimental prompts and outputs on your local network",
        "Eliminates third-party API billing for local model workflows"
      ],
      stats: [
        ["$0", "External API fees (local setup)"], // TODO-VERIFY
        ["Local", "Workstation inference"] // TODO-VERIFY
      ],
      link: ["Launch terminal demo", "#orvix-demo"],
      images: [
        "assets/screens/orvix-1.svg",
        "assets/screens/orvix-2.svg",
        "assets/screens/orvix-3.svg",
        "assets/screens/orvix-4.svg"
      ],
      techUsed: ["Python FastAPI", "Ollama Daemon", "Local LLMs", "SSE Token Stream"], // TODO-VERIFY
      whoItIsFor: "Developers, students, and engineers looking to prototype generative AI features and prompt pipelines locally before deploying.",
      howItWorks: [
        { step: "01", title: "Run local Ollama daemon", desc: "Execute `ollama serve` on your computer with your preferred open model (Llama, Mistral, or Gemma)." },
        { step: "02", title: "Connect via ORVIX bridge", desc: "Send standard REST prompts through the local port to inspect streaming tokens, payloads, and latency." },
        { step: "03", title: "Iterate with zero cloud token cost", desc: "Build evaluation suites and test prompt pipelines on your personal hardware without leaking sensitive data." }
      ],
      faqs: [
        { q: "Do I need dedicated GPU hardware to run ORVIX?", a: "ORVIX connects to Ollama, which runs on Apple Silicon unified memory, NVIDIA/AMD GPUs, or modern multi-core CPUs with quantized models. It is a local tool, not a hosted cloud service." }, // TODO-VERIFY
        { q: "Does ORVIX send prompt telemetry to external servers?", a: "When connected to your local Ollama port (127.0.0.1:11434), requests and token streams remain strictly on your local network." } // TODO-VERIFY
      ]
    }
  ],

  // Chapter 04: Screens gallery (phone & browser device frames)
  screensGallery: {
    chapter: "Chapter 04",
    hi: "दीर्घा",
    title: "Screens gallery",
    subtitle: "A horizontal walk through actual interfaces, navigation patterns, and workflows across our trio.",
    counterTotal: "03",
    groups: [
      {
        id: "tourist-guide",
        productName: "ARRIVA Tourist Guide",
        category: "Travel & discovery",
        deviceType: "phone",
        caption: "Regional exploration with offline trail caching, multilingual viewports, and custom day sequencing.",
        screens: [
          { src: "assets/screens/tourist-guide-1.svg", alt: "Tourist Guide places screen", title: "Discover Places" },
          { src: "assets/screens/tourist-guide-2.svg", alt: "Tourist Guide day planner screen", title: "Plan Your Day" },
          { src: "assets/screens/tourist-guide-3.svg", alt: "Tourist Guide language selector screen", title: "Pick a Language" },
          { src: "assets/screens/tourist-guide-4.svg", alt: "Tourist Guide community reviews screen", title: "Local Reviews" }
        ]
      },
      {
        id: "nexus",
        productName: "ARRIVA NEXUS",
        category: "Communication",
        deviceType: "phone",
        caption: "Distraction-free messaging stream, rapid 1:1 sync, and modular channel architectures on Android.",
        screens: [
          { src: "assets/screens/nexus-1.svg", alt: "NEXUS chats overview screen", title: "Active Chats" },
          { src: "assets/screens/nexus-2.svg", alt: "NEXUS conversation view screen", title: "Conversation" },
          { src: "assets/screens/nexus-3.svg", alt: "NEXUS groups and topics screen", title: "Topic Channels" },
          { src: "assets/screens/nexus-4.svg", alt: "NEXUS local privacy settings screen", title: "Settings & Storage" }
        ]
      },
      {
        id: "orvix",
        productName: "ARRIVA ORVIX",
        category: "AI developer tool",
        deviceType: "browser",
        caption: "Local model runtime monitor, zero-fee REST playground, and real-time token stream telemetry.",
        screens: [
          { src: "assets/screens/orvix-1.svg", alt: "ORVIX models list screen", title: "Model Library" },
          { src: "assets/screens/orvix-2.svg", alt: "ORVIX local API testing console screen", title: "Local API Console" },
          { src: "assets/screens/orvix-3.svg", alt: "ORVIX request stream logger screen", title: "Request Stream" },
          { src: "assets/screens/orvix-4.svg", alt: "ORVIX token telemetry screen", title: "Pipeline Config" }
        ]
      }
    ]
  },

  // Chapter 05: ORVIX live demo terminal
  orvixDemo: {
    chapter: "Chapter 05",
    hi: "प्रयोगशाला",
    title: "ORVIX live terminal",
    badge: "Interactive simulation",
    subtitle: "Observe how ORVIX bridges a local Ollama daemon process with standard REST requests without external cloud calls.",
    replayLabel: "Replay terminal sequence",
    terminal: {
      windowTitle: "orvix@local — bash — 80x24",
      userHost: "developer@arriva-local:~$ ",
      command1: "ollama serve",
      logs1: [
        "time=2026-10-14T15:30:00.102Z level=INFO msg=\"Ollama daemon initialized\"",
        "time=2026-10-14T15:30:00.104Z level=INFO msg=\"Listening on 127.0.0.1:11434 (HTTP/1.1)\"",
        "time=2026-10-14T15:30:00.120Z level=INFO msg=\"ORVIX bridge listening on localhost:11434 (local loopback)\""
      ],
      userHost2: "developer@arriva-local:~$ ",
      command2: "curl -s -X POST http://localhost:11434/api/generate -d '{\"model\":\"llama3\",\"prompt\":\"Ideas into innovation.\"}'",
      jsonOutput: {
        "model": "llama3:latest",
        "created_at": "2026-10-14T15:30:01.428Z",
        "response": "Ideas transformed into practical, reliable digital tools for everyday problem solving.",
        "done": true,
        "total_duration": "382ms", // TODO-VERIFY
        "load_duration": "12ms", // TODO-VERIFY
        "prompt_eval_count": 6, // TODO-VERIFY
        "eval_count": 14, // TODO-VERIFY
        "eval_rate": "42.8 tok/s" // TODO-VERIFY
      },
      stats: [
        ["$0", "External cloud fees"], // TODO-VERIFY
        ["127.0.0.1", "Host loopback"],
        ["Local hardware", "Execution environment"] // TODO-VERIFY
      ]
    }
  },

  // Chapter 06: How it works (3 steps per product)
  howItWorks: {
    chapter: "Chapter 06",
    hi: "कार्यप्रणाली",
    title: "How it works",
    subtitle: "A clear three-step sequence for each product in our ecosystem. Straightforward, dependable utility.",
    categories: [
      {
        id: "tourist-guide",
        name: "Tourist Guide",
        hi: "खोज",
        steps: [
          { num: "01", title: "Select place & tongue", desc: "Pick your travel region and switch easily between Marathi, Hindi, and English guides." },
          { num: "02", title: "Assemble a day trail", desc: "Select heritage viewpoints and eateries to organize a realistic travel timeline." },
          { num: "03", title: "Explore completely offline", desc: "Navigate trail notes and cached maps even when cellular reception is absent." }
        ]
      },
      {
        id: "nexus",
        name: "ARRIVA NEXUS",
        hi: "संवाद",
        steps: [
          { num: "01", title: "Lightweight connection", desc: "Connect through a lean socket client without intrusive social graph permissions." },
          { num: "02", title: "Create focused groups", desc: "Set up topic channels for ideas, projects, or friends without algorithmic feeds." },
          { num: "03", title: "Own your local archive", desc: "Store messages and media securely on your Android device with zero third-party telemetry." }
        ]
      },
      {
        id: "orvix",
        name: "ARRIVA ORVIX",
        hi: "प्रयोग",
        steps: [
          { num: "01", title: "Run local Ollama", desc: "Launch open-source models on your machine's hardware with `ollama serve`." },
          { num: "02", title: "Connect via ORVIX API", desc: "Route prompts and streaming tests through the local API playground." },
          { num: "03", title: "Build without billing", desc: "Experiment with agents, prompts, and tokens without third-party subscription fees." }
        ]
      }
    ]
  },

  // Chapter 07: About & Team (Consolidated Philosophy, Principles, Stats, Timeline, and Team Cards)
  about: {
    chapter: "Chapter 07",
    hi: "तत्वज्ञान आणि संघ",
    label: "About & Team",
    title: "Curiosity starts it. Building moves it forward.",
    text: "ARRIVA is a technology brand and community for people who like exploring ideas, making useful digital tools, and learning by doing. We share what we build and document the engineering lessons along the way.",
    principles: [
      {
        num: "01",
        hi: "व्यावहारिकता",
        title: "Practical over hype",
        desc: "We prioritize dependable, working software over inflated promises and speculative trends."
      },
      {
        num: "02",
        hi: "स्वायत्तता",
        title: "Local-first ownership",
        desc: "Software should respect the hardware you own, keeping personal data private and cloud dependencies optional."
      },
      {
        num: "03",
        hi: "पारदर्शकता",
        title: "Honest transparency",
        desc: "No fabricated metrics, no deceptive dark patterns, and no disguised advertising."
      },
      {
        num: "04",
        hi: "सहभाग",
        title: "Build and share",
        desc: "We document engineering lessons, code architectures, and setbacks openly with builders."
      }
    ],
    stats: [
      ["3", "Active builds in progress"], // TODO-VERIFY
      ["Local-first", "Development focus"], // TODO-VERIFY
      ["Independent", "Workbench culture"], // TODO-VERIFY
      ["2026", "Launch year"] // TODO-VERIFY
    ],
    team: [
      {
        name: "Sachin K.",
        role: "Founder & Engineering",
        hi: "संस्थापक",
        photo: "assets/team/team-1.svg",
        line: "Focuses on local AI systems, performance architecture, and clean product design."
      },
      {
        name: "Ananya R.",
        role: "Product & Experience",
        hi: "उत्पादन",
        photo: "assets/team/team-2.svg",
        line: "Crafts intuitive user flows and ensures everyday interfaces remain accessible."
      },
      {
        name: "Vikram N.",
        role: "Systems & Edge AI",
        hi: "प्रणाली",
        photo: "assets/team/team-3.svg",
        line: "Specializes in model quantization, streaming protocols, and low-latency sockets."
      },
      {
        name: "Pooja S.",
        role: "Design & Interaction",
        hi: "रचना",
        photo: "assets/team/team-4.svg",
        line: "Brings typographic balance, Devanagari harmony, and subtle motion to screens."
      }
    ],
    timeline: [
      {
        step: "01",
        phase: "Idea",
        hi: "विचार",
        title: "Identifying real frictions",
        desc: "Spotting everyday issues: subscription-locked developer APIs, cluttered travel apps, and social chat feeds that demand your attention.",
        status: "Completed"
      },
      {
        step: "02",
        phase: "Prototype",
        hi: "प्रारूप",
        title: "Building core proofs-of-concept",
        desc: "Developing initial implementations: connecting Ollama to a local UI, offline PWA mapping, and a low-footprint Android socket client.",
        status: "Completed"
      },
      {
        step: "03",
        phase: "Testing",
        hi: "चाचणी",
        title: "Benchmarking on personal hardware",
        desc: "Validating battery usage, offline tile rendering across poor signals, and token generation speed on budget laptops.",
        status: "In progress"
      },
      {
        step: "04",
        phase: "Release",
        hi: "प्रकाशन",
        title: "Public builds and open documentation",
        desc: "Publishing accessible downloads, source repos, and architectural walkthroughs for curious developers and travellers.",
        status: "Upcoming"
      },
      {
        step: "05",
        phase: "Feedback",
        hi: "प्रतिक्रिया",
        title: "Listening and continuous refinement",
        desc: "Incorporating real usage feedback from early adopters to make every feature faster, lighter, and more durable.",
        status: "Upcoming"
      }
    ]
  },

  // Chapter 08: Updates & build notes
  updates: {
    chapter: "Chapter 08",
    hi: "वृत्तांत",
    title: "Updates & build notes",
    subtitle: "Engineering logs, progress milestones, and honest observations from our build workbench.",
    items: [
      {
        title: "Running Local-First AI with Ollama and ORVIX",
        tag: "Developer tools",
        date: "October 2026",
        cover: "assets/updates/update-1.svg",
        excerpt: "Why we built a dedicated local API adapter to bypass external cloud pricing and keep experimental prompts private.",
        link: "#"
      },
      {
        title: "Rendering Devanagari Maps for Offline Travellers",
        tag: "Tourist Guide",
        date: "September 2026",
        cover: "assets/updates/update-2.svg",
        excerpt: "How vector tile clipping and custom font sub-setting allow rich multilingual wayfinding on limited phone storage.",
        link: "#"
      },
      {
        title: "Stripping Bloat from Modern Android Messaging",
        tag: "NEXUS Core",
        date: "August 2026",
        cover: "assets/updates/update-3.svg",
        excerpt: "Building a lean socket messaging client with zero background telemetry, saving memory and battery life.",
        link: "#"
      }
    ]
  },

  // Chapter 09: Frequently asked questions
  faq: {
    chapter: "Chapter 09",
    hi: "प्रश्नोत्तरे",
    title: "Frequently asked questions",
    subtitle: "Straight answers to common questions about our products, direction, and technical choices.",
    items: [
      {
        q: "What is ARRIVA?",
        a: "ARRIVA is a technology brand and community dedicated to turning practical ideas into working digital products. We build tools spanning travel guides, direct messaging, and local AI workflows."
      },
      {
        q: "Are ARRIVA tools free to use?",
        a: "Our experimental prototypes and local developer utilities are open for exploration. When interacting with local AI runtimes via ORVIX, you avoid cloud API token bills, although running models relies on your own computer hardware." // TODO-VERIFY
      },
      {
        q: "Why include Devanagari (Hindi and Marathi) on the site?",
        a: "ARRIVA is rooted in regional inclusivity. We believe regional Indian languages should be first-class citizens in modern typography, software interfaces, and travel tools."
      },
      {
        q: "How does ORVIX connect to my local Ollama models?",
        a: "You start Ollama on your machine (`ollama serve`). ORVIX connects directly over `http://localhost:11434` without intermediate cloud servers, sending prompts and streaming responses locally."
      },
      {
        q: "Does ARRIVA track user data or collect cookies?",
        a: "No. There are no advertising trackers, third-party analytics pixels, or profiling cookies on this site. Your visit remains private to your device." // TODO-VERIFY
      },
      {
        q: "How can I test the products or share feedback?",
        a: "You can reach out through our community links, explore our early prototypes, or email us directly at hello@example.com. We welcome real feedback from builders."
      }
    ]
  },

  // Outro: Community / Afterlight
  community: {
    chapter: "Outro",
    hi: "समुदाय",
    label: "Afterlight",
    title: "The walk does not end here.",
    lead: "Follow ARRIVA for demos, build notes and practical tech.",
    social: [
      ["Instagram", "https://instagram.com/arriva"],
      ["LinkedIn", "https://linkedin.com/company/arriva"],
      ["YouTube", "https://youtube.com/@arriva"],
      ["GitHub", "https://github.com/arriva"]
    ],
    email: "hello@example.com",
    ctaLabel: "Write to us",
    wordmark: "ARRIVA"
  },

  // Footer: Consistent chapter directory and legal notice
  footer: {
    wordmark: "ARRIVA",
    tagline: "Ideas Into Innovation.",
    columns: [
      {
        title: "Products",
        links: [
          ["Tourist Guide", "#tourist-guide"],
          ["ARRIVA NEXUS", "#nexus"],
          ["ARRIVA ORVIX", "#orvix"],
          ["Screens Gallery", "#screens-gallery"]
        ]
      },
      {
        title: "Chapters",
        links: [
          ["00 The arrival", "#top"],
          ["01 Tourist Guide", "#tourist-guide"],
          ["02 NEXUS", "#nexus"],
          ["03 ORVIX", "#orvix"],
          ["04 Screens Gallery", "#screens-gallery"],
          ["05 ORVIX Demo", "#orvix-demo"],
          ["06 How It Works", "#how-it-works"],
          ["07 About & Team", "#about"],
          ["08 Updates", "#updates"],
          ["09 FAQ", "#faq"]
        ]
      },
      {
        title: "Elsewhere",
        links: [
          ["GitHub", "https://github.com/arriva"],
          ["YouTube", "https://youtube.com/@arriva"],
          ["LinkedIn", "https://linkedin.com/company/arriva"],
          ["Instagram", "https://instagram.com/arriva"]
        ]
      }
    ],
    privacyNote: "No advertising tracking cookies, marketing pixels, or third-party surveillance scripts are loaded on this site. Built with pure HTML/CSS/JS and respect for your device.",
    copyrightNotice: "ARRIVA. Ideas Into Innovation. All rights reserved."
  },

  // Topographic Waypoint data for Tourist Guide interactive 3D scene integration
  touristGuideScene: {
    chapter: "Chapter 01 · Trail System",
    hi: "भूदृश्य",
    title: "Tourist Guide Landscape",
    subtitle: "Native 3D topographic ridge lines with a dynamic route that draws on scroll across Sahyadri mountain waypoints.",
    trailStats: [
      ["14.2 km", "Route length"], // TODO-VERIFY
      ["4", "Waypoints"], // TODO-VERIFY
      ["380 m", "Elevation span"] // TODO-VERIFY
    ],
    hint: "Scroll to trace route · Click or hover waypoints to inspect 3D markers",
    pins: [
      {
        id: "pin-1",
        name: "Sinhagad Ridge",
        hi: "सिंहगड",
        category: "Historic Fort",
        elevation: "1,312 m", // TODO-VERIFY
        dist: "0.0 km", // TODO-VERIFY
        desc: "Ancient hill bastion with windward parapets, stone gateways and panoramic views across Sahyadri peaks."
      },
      {
        id: "pin-2",
        name: "Mutha River Walk",
        hi: "मुठा नदी",
        category: "Nature Basin",
        elevation: "560 m", // TODO-VERIFY
        dist: "4.8 km", // TODO-VERIFY
        desc: "A calm, shaded riverfront pathway framed by indigenous banyan trees and morning bird calls."
      },
      {
        id: "pin-3",
        name: "Old Bazaar Arcade",
        hi: "जुना बाजार",
        category: "Cultural District",
        elevation: "572 m", // TODO-VERIFY
        dist: "9.1 km", // TODO-VERIFY
        desc: "Centuries-old market lanes teeming with brass handicrafts, regional spices, and handwritten signboards."
      },
      {
        id: "pin-4",
        name: "Katraj Valley View",
        hi: "कात्रज घाट",
        category: "Scenic Overlook",
        elevation: "940 m", // TODO-VERIFY
        dist: "14.2 km", // TODO-VERIFY
        desc: "A wide vantage pass overlooking the southern highway corridor where the city meets open hills."
      }
    ]
  }
};
