// EDIT THIS FILE ONLY: every text, number, link and image on the site comes from here.
// Numbers and descriptions below are PLACEHOLDERS - replace with real, verifiable info.
// Images: drop your screenshots into assets/screens/ and change the paths below (PNG/JPG/WebP/SVG all work).

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
      { label: "Gallery", href: "#screens-gallery" },
      { label: "Demo", href: "#orvix-demo" },
      { label: "About", href: "#about" }
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
    sub: "ARRIVA builds digital products and shares practical technology, software and AI, one useful idea at a time.",
    ctaPrimary: { label: "Start the walk", href: "#tourist-guide" },
    ctaSecondary: { label: "About ARRIVA", href: "#about" },
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
      desc: "A travel companion that helps people find places, read about them in their own language and plan a day around what they like. It stays lightweight, works without intrusive tracking, and keeps offline utility front and center.",
      points: [
        "Place pages with photo galleries and local tips",
        "Multilingual guide in Hindi, Marathi and English",
        "Trip planner and interactive trail map",
        "Curated reviews and notes from travellers"
      ],
      stats: [
        ["100+", "Places"], // PLACEHOLDER
        ["3", "Languages"] // PLACEHOLDER
      ],
      link: ["Open the guide", "#tourist-guide-scene"],
      images: [
        "assets/screens/tourist-guide-1.svg",
        "assets/screens/tourist-guide-2.svg",
        "assets/screens/tourist-guide-3.svg",
        "assets/screens/tourist-guide-4.svg"
      ],
      techUsed: ["HTML5 PWA", "MapLibre Vector", "Offline Storage", "Devanagari Type"],
      whoItIsFor: "Independent travellers, weekend explorers, and regional visitors who want clear cultural context without commercial clutter.",
      howItWorks: [
        { step: "01", title: "Select destination & language", desc: "Choose your travel district and read authentic cultural overviews in Marathi, Hindi, or English." },
        { step: "02", title: "Assemble a custom day route", desc: "Pin historic forts, local markets, and viewpoints to a sequence that calculates distance and daylight." },
        { step: "03", title: "Navigate with offline confidence", desc: "Access cached maps and notes seamlessly even when cellular reception drops along mountain ridges." }
      ],
      faqs: [
        { q: "Does the Tourist Guide work without cellular data?", a: "Yes. Core regional trail summaries, landmark info, and saved itineraries cache to local storage for offline reference." },
        { q: "Are more regional Indian languages coming?", a: "Yes. Marathi and Hindi are in active testing, with Gujarati and Kannada support planned in upcoming releases." }
      ]
    },

    {
      id: "nexus",
      chapter: "Chapter 02",
      hi: "संवाद",
      name: "ARRIVA NEXUS",
      tag: "Communication",
      status: "In progress",
      desc: "A chatting app that keeps conversations simple: quick messages, clean groups and nothing you did not ask for. Built natively for Android to deliver responsive messaging without algorithmic feeds or background surveillance.",
      points: [
        "One-to-one and topic-focused group chats",
        "Fast, light interface without social media bloat",
        "Native Android app optimized for battery efficiency",
        "Built feature by feature with strict privacy"
      ],
      stats: [
        ["1:1", "and group chats"], // PLACEHOLDER
        ["0", "tracking pixels"] // PLACEHOLDER
      ],
      link: ["See NEXUS", "#nexus-scene"],
      images: [
        "assets/screens/nexus-1.svg",
        "assets/screens/nexus-2.svg",
        "assets/screens/nexus-3.svg",
        "assets/screens/nexus-4.svg"
      ],
      techUsed: ["Kotlin Native", "WebSocket Engine", "SQLite Room DB", "Local Crypto"],
      whoItIsFor: "People and small teams who want swift, reliable messaging without stories, status feeds, or background telemetry.",
      howItWorks: [
        { step: "01", title: "Lightweight connection", desc: "Establishes a low-overhead real-time socket connection without requiring invasive permission access." },
        { step: "02", title: "Organize targeted channels", desc: "Create focused discussion spaces for ongoing projects, friends, or family with instant delivery." },
        { step: "03", title: "Stay in storage control", desc: "All conversations and attachments stay on your device with one-tap media pruning controls." }
      ],
      faqs: [
        { q: "Why build NEXUS when other chat apps exist?", a: "Most modern chat apps have morphed into bloated social feeds. NEXUS focuses strictly on low-latency, private text communication." },
        { q: "Is an iOS or desktop version planned?", a: "We are focusing on perfecting the Android native client first, after which lightweight web and desktop clients will follow." }
      ]
    },

    {
      id: "orvix",
      chapter: "Chapter 03",
      hi: "प्रयोग",
      name: "ARRIVA ORVIX",
      tag: "AI developer tool",
      status: "Developer tool",
      desc: "Connects to Ollama running on your own machine and gives you an API workflow for building and testing, without a paid external API for that local setup. Prototype AI ideas securely with zero token billing.",
      points: [
        "Works with local Ollama models on your hardware",
        "Simple REST and streaming API workflow",
        "Runs on local workstation hardware without cloud sync",
        "Built for testing ideas fast with zero API bills"
      ],
      stats: [
        ["0$", "external API cost"], // PLACEHOLDER
        ["100%", "on-device execution"] // PLACEHOLDER
      ],
      link: ["Try ORVIX", "#orvix-demo"],
      images: [
        "assets/screens/orvix-1.svg",
        "assets/screens/orvix-2.svg",
        "assets/screens/orvix-3.svg",
        "assets/screens/orvix-4.svg"
      ],
      techUsed: ["Python FastAPI", "Ollama Engine", "Local LLMs", "SSE Telemetry"],
      whoItIsFor: "Developers, indie hackers, and students wanting to experiment with generative AI and agentic pipelines without subscription fees.",
      howItWorks: [
        { step: "01", title: "Run local Ollama daemon", desc: "Execute `ollama serve` on your computer with your preferred open model (Llama, Mistral, or Gemma)." },
        { step: "02", title: "Connect via ORVIX bridge", desc: "Send standard REST prompts through the local port to inspect streaming tokens, payloads, and latency." },
        { step: "03", title: "Iterate with zero cloud cost", desc: "Build evaluation suites and test prompt pipelines on your personal GPU without leaking sensitive data." }
      ],
      faqs: [
        { q: "Do I need an expensive GPU to run ORVIX?", a: "No. ORVIX connects to Ollama, which runs smoothly on Apple Silicon unified memory, discrete GPUs, or standard CPUs with quantized models." },
        { q: "Does ORVIX send any telemetry to external servers?", a: "None whatsoever. All inference calls, prompts, and tokens remain strictly within your local machine network." }
      ]
    }
  ],

  // 1. Screens gallery (pinned, horizontal)
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

  // 2. ORVIX live demo
  orvixDemo: {
    chapter: "Chapter 05",
    hi: "प्रयोगशाला",
    title: "ORVIX live terminal",
    badge: "Illustrative example",
    subtitle: "Observe how ORVIX bridges local Ollama daemon processes with immediate API requests without external cloud calls.",
    replayLabel: "Replay terminal sequence",
    terminal: {
      windowTitle: "orvix@local — bash — 80x24",
      userHost: "developer@arriva-local:~$ ",
      command1: "ollama serve",
      logs1: [
        "time=2026-10-14T15:30:00.102Z level=INFO msg=\"Ollama daemon initialized\"",
        "time=2026-10-14T15:30:00.104Z level=INFO msg=\"Listening on 127.0.0.1:11434 (HTTP/1.1)\"",
        "time=2026-10-14T15:30:00.120Z level=INFO msg=\"ORVIX bridge bound to port 11434 with zero external telemetry\""
      ],
      userHost2: "developer@arriva-local:~$ ",
      command2: "curl -s -X POST http://localhost:11434/api/generate -d '{\"model\":\"llama3\",\"prompt\":\"Ideas into innovation.\"}'",
      jsonOutput: {
        "model": "llama3:latest",
        "created_at": "2026-10-14T15:30:01.428Z",
        "response": "Ideas transformed into practical, reliable digital tools for everyday problem solving.",
        "done": true,
        "total_duration": "382ms", // PLACEHOLDER
        "load_duration": "12ms", // PLACEHOLDER
        "prompt_eval_count": 6, // PLACEHOLDER
        "eval_count": 14, // PLACEHOLDER
        "eval_rate": "42.8 tok/s" // PLACEHOLDER
      },
      stats: [
        ["0$", "cloud fees"], // PLACEHOLDER
        ["127.0.0.1", "host loopback"],
        ["42.8", "tok/sec on local GPU"] // PLACEHOLDER
      ]
    }
  },

  // 3. Tourist Guide scene
  touristGuideScene: {
    chapter: "Chapter 06",
    hi: "भूदृश्य",
    title: "Tourist Guide landscape",
    subtitle: "Layered terrain ridges with a dashed exploration trail that draws as you scroll across regional waypoints.",
    trailStats: [
      ["14.2 km", "Route length"], // PLACEHOLDER
      ["4", "Waypoints"], // PLACEHOLDER
      ["380 m", "Elevation span"] // PLACEHOLDER
    ],
    hint: "Scroll to trace route · Hover or tap waypoints to inspect",
    pins: [
      {
        id: "pin-1",
        name: "Sinhagad Ridge",
        hi: "सिंहगड",
        category: "Historic Fort",
        elevation: "1,312 m", // PLACEHOLDER
        dist: "0.0 km", // PLACEHOLDER
        desc: "Ancient hill bastion with windward parapets, stone gateways and panoramic views across Sahyadri peaks."
      },
      {
        id: "pin-2",
        name: "Mutha River Walk",
        hi: "मुठा नदी",
        category: "Nature Basin",
        elevation: "560 m", // PLACEHOLDER
        dist: "4.8 km", // PLACEHOLDER
        desc: "A calm, shaded riverfront pathway framed by indigenous banyan trees and morning bird calls."
      },
      {
        id: "pin-3",
        name: "Old Bazaar Arcade",
        hi: "जुना बाजार",
        category: "Cultural District",
        elevation: "572 m", // PLACEHOLDER
        dist: "9.1 km", // PLACEHOLDER
        desc: "Centuries-old market lanes teeming with brass handicrafts, regional spices, and handwritten signboards."
      },
      {
        id: "pin-4",
        name: "Katraj Valley View",
        hi: "कात्रज घाट",
        category: "Scenic Overlook",
        elevation: "940 m", // PLACEHOLDER
        dist: "14.2 km", // PLACEHOLDER
        desc: "A wide vantage pass overlooking the southern highway corridor where the city meets open hills."
      }
    ]
  },

  // 4. NEXUS scene
  nexusScene: {
    chapter: "Chapter 07",
    hi: "संवाद प्रवाह",
    title: "NEXUS conversation flow",
    subtitle: "Floating message bubbles moving with layered parallax, capturing the cadence of distraction-free dialogue.",
    typingLabel: "Sachin is typing",
    bubbles: [
      {
        id: "b1",
        sender: "Sachin",
        initials: "SK",
        text: "Just verified the local Ollama socket on ORVIX. Latency is under 15ms with zero cloud roundtrips.",
        time: "10:24 AM",
        isMe: false,
        speed: 0.14
      },
      {
        id: "b2",
        sender: "You",
        initials: "ME",
        text: "Tested the Tourist Guide trail caching in offline mode too. Loads instantly with zero network.",
        time: "10:25 AM",
        isMe: true,
        speed: -0.09
      },
      {
        id: "b3",
        sender: "Sachin",
        initials: "SK",
        text: "That is the ARRIVA standard: tools that respect hardware, time, and user attention.",
        time: "10:26 AM",
        isMe: false,
        speed: 0.18
      },
      {
        id: "b4",
        sender: "You",
        initials: "ME",
        text: "Packing the clean APK build. No tracking libraries, no ad banners.",
        time: "10:27 AM",
        isMe: true,
        speed: -0.12
      }
    ]
  },

  // 5. How it works (3 steps per product)
  howItWorks: {
    chapter: "Chapter 08",
    hi: "कार्यप्रणाली",
    title: "How it works",
    subtitle: "A clear three-step sequence for each product in our ecosystem. No hidden layers, just straightforward utility.",
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
          { num: "03", title: "Own your local archive", desc: "Store messages and media securely on your Android device with zero telemetry." }
        ]
      },
      {
        id: "orvix",
        name: "ARRIVA ORVIX",
        hi: "प्रयोग",
        steps: [
          { num: "01", title: "Run local Ollama", desc: "Launch open-source models on your machine's hardware with `ollama serve`." },
          { num: "02", title: "Connect via ORVIX API", desc: "Route prompts and streaming tests through the local API playground." },
          { num: "03", title: "Build without billing", desc: "Experiment with agents, prompts, and tokens without recurring subscription fees." }
        ]
      }
    ]
  },

  // 6. About (light lavender band)
  about: {
    chapter: "Chapter 09",
    hi: "तत्वज्ञान",
    label: "About ARRIVA",
    title: "Curiosity starts it. Building moves it forward.",
    text: "ARRIVA is a technology brand and community for people who like exploring ideas, making useful things and learning by doing. We share what we build and what we learn along the way.",
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
        desc: "Software should run on the hardware you own, keeping data private and cloud dependencies optional."
      },
      {
        num: "03",
        hi: "पारदर्शकता",
        title: "Clear transparency",
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
      ["3", "Active builds"], // PLACEHOLDER
      ["100%", "Local-first utility"], // PLACEHOLDER
      ["0", "Venture hype"], // PLACEHOLDER
      ["2026", "Launch year"] // PLACEHOLDER
    ]
  },

  // 7. Journey timeline
  timeline: {
    chapter: "Chapter 10",
    hi: "प्रवास",
    title: "Journey timeline",
    subtitle: "From an initial scratchpad problem statement to community-tested software.",
    steps: [
      {
        step: "01",
        phase: "Idea",
        hi: "विचार",
        title: "Identifying the real friction",
        desc: "Spotting everyday issues: subscription-locked developer APIs, cluttered travel apps, and social chat apps that demand your whole day.",
        status: "Completed"
      },
      {
        step: "02",
        phase: "Prototype",
        hi: "प्रारूप",
        title: "Building core proof-of-concepts",
        desc: "Developing barebones implementations: connecting Ollama to a local UI, offline PWA mapping, and a low-footprint Android socket client.",
        status: "Completed"
      },
      {
        step: "03",
        phase: "Testing",
        hi: "चाचणी",
        title: "Benchmarking on modest hardware",
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

  // 8. Team
  team: {
    chapter: "Chapter 11",
    hi: "संघ",
    title: "The team",
    subtitle: "Small, hands-on, and focused on building clean digital tools that work.",
    members: [
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
    ]
  },

  // 9. Updates
  updates: {
    chapter: "Chapter 12",
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

  // 10. FAQ
  faq: {
    chapter: "Chapter 13",
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
        a: "Yes. Our prototypes and core tools are designed to be accessible. Where tools involve AI, we prioritize local runtimes like Ollama so you never face unexpected cloud API charges."
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
        a: "No. There are no tracking scripts, third-party analytics pixels, or profiling cookies on this site. Your visit remains private to your device."
      },
      {
        q: "How can I test the products or share feedback?",
        a: "You can reach out through our community links, explore our early prototypes, or email us directly at hello@example.com. We welcome real feedback from builders."
      }
    ]
  },

  // 11. Community / Afterlight
  community: {
    chapter: "Chapter 14",
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

  // 12. Footer
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
          ["04 Screens gallery", "#screens-gallery"],
          ["05 ORVIX demo", "#orvix-demo"],
          ["06 Tourist landscape", "#tourist-guide-scene"],
          ["07 NEXUS flow", "#nexus-scene"],
          ["08 How it works", "#how-it-works"]
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
    privacyNote: "No tracking cookies, marketing pixels, or third-party telemetry are collected on this site. Built with pure HTML/CSS/JS and respect for your device.",
    copyrightNotice: "ARRIVA. Ideas Into Innovation. All rights reserved."
  }
};
