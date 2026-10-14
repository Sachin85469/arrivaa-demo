import os

base_dir = os.path.dirname(os.path.abspath(__file__))
screens_dir = os.path.join(base_dir, 'website', 'assets', 'screens')
team_dir = os.path.join(base_dir, 'website', 'assets', 'team')
updates_dir = os.path.join(base_dir, 'website', 'assets', 'updates')

os.makedirs(screens_dir, exist_ok=True)
os.makedirs(team_dir, exist_ok=True)
os.makedirs(updates_dir, exist_ok=True)

# 1. App screens (4 per product) - Light theme optimized with purple & green accents
products_screens = {
    'tourist-guide': ('#7C3AED', '#10B981', [
        ('Discover Places', 'Curated spots & heritage sites'),
        ('Plan Your Day', 'Smart offline itinerary builder'),
        ('Pick a Language', 'Devanagari, Hindi, Marathi, English'),
        ('Local Reviews', 'Authentic notes from fellow travellers')
    ]),
    'nexus': ('#10B981', '#7C3AED', [
        ('Active Chats', 'Fast 1:1 and lightweight group sync'),
        ('Conversation', 'Distraction-free messaging stream'),
        ('Topic Channels', 'Organized spaces for projects & ideas'),
        ('Settings & Privacy', 'Local cache control and zero tracking')
    ]),
    'orvix': ('#7C3AED', '#10B981', [
        ('Model Library', 'Local Ollama instances & weights'),
        ('Local API Console', 'Zero-latency inference testing'),
        ('Request Stream', 'Real-time tokens & telemetry stats'),
        ('Pipeline Config', 'Chaining prompts & embeddings locally')
    ])
}

for product, (col_a, col_b, screens) in products_screens.items():
    for i, (title, sub) in enumerate(screens):
        svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 740">
  <defs>
    <linearGradient id="g_{product}_{i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{col_a}"/>
      <stop offset="100%" stop-color="#4C1D95"/>
    </linearGradient>
  </defs>
  <rect width="360" height="740" fill="#F8F7FF"/>
  <!-- Status bar -->
  <rect width="360" height="28" fill="#0F172A" opacity="0.06"/>
  <circle cx="340" cy="14" r="4" fill="#0F172A" opacity="0.4"/>
  <circle cx="326" cy="14" r="4" fill="#0F172A" opacity="0.4"/>
  <rect x="18" y="10" width="34" height="8" rx="4" fill="#0F172A" opacity="0.4"/>

  <!-- App Header -->
  <rect y="28" width="360" height="162" fill="url(#g_{product}_{i})"/>
  <circle cx="308" cy="85" r="32" fill="{col_b}" opacity="0.85"/>
  <rect x="22" y="52" width="64" height="18" rx="9" fill="#FFFFFF" opacity="0.2"/>
  <text x="30" y="65" font-family="Poppins,Arial,sans-serif" font-size="10" font-weight="600" fill="#FFFFFF">ARRIVA</text>
  <text x="22" y="112" font-family="Poppins,Arial,sans-serif" font-size="24" font-weight="700" fill="#FFFFFF">{title}</text>
  <text x="22" y="136" font-family="Poppins,Arial,sans-serif" font-size="12" fill="#FFFFFF" opacity="0.85">{sub}</text>

  <!-- Content cards on light surface -->'''
        for r in range(4):
            y = 208 + r * 122
            w = 316 - ((r + i) % 3) * 45
            bar_col = col_a if r % 2 == 0 else col_b
            svg += f'''
  <rect x="22" y="{y}" width="316" height="106" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.2"/>
  <rect x="36" y="{y + 16}" width="74" height="74" rx="12" fill="{bar_col}" opacity="0.12"/>
  <circle cx="73" cy="{y + 53}" r="16" fill="{bar_col}" opacity="0.85"/>
  <rect x="124" y="{y + 24}" width="{w - 110}" height="13" rx="6" fill="#0F172A" opacity="0.85"/>
  <rect x="124" y="{y + 48}" width="{max(70, w - 140)}" height="10" rx="5" fill="#94A3B8"/>
  <rect x="124" y="{y + 70}" width="68" height="18" rx="9" fill="{bar_col}" opacity="0.12"/>
  <text x="134" y="{y + 83}" font-family="Poppins,Arial,sans-serif" font-size="9" font-weight="600" fill="{bar_col}">ACTIVE</text>'''

        svg += '''
  <!-- Home pill indicator -->
  <rect x="120" y="724" width="120" height="5" rx="3" fill="#0F172A" opacity="0.3"/>
</svg>'''
        with open(os.path.join(screens_dir, f'{product}-{i+1}.svg'), 'w', encoding='utf-8') as f:
            f.write(svg)

# 2. Team photos (4 members) - Light aesthetic with soft lavender backdrop and clean modern avatars
team_members = [
    ("Founder & Architecture", "#7C3AED", "#10B981", "SK"),
    ("Product & Experience", "#10B981", "#7C3AED", "AR"),
    ("Systems & AI Core", "#7C3AED", "#10B981", "VN"),
    ("Design & Interfaces", "#38BDF8", "#7C3AED", "PS")
]

for i, (role, col_a, col_b, initials) in enumerate(team_members):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="tg_{i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EDE9FE"/>
      <stop offset="50%" stop-color="#F8F7FF"/>
      <stop offset="100%" stop-color="#E0E7FF"/>
    </linearGradient>
    <linearGradient id="tg_ring_{i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{col_b}"/>
      <stop offset="100%" stop-color="{col_a}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="28" fill="url(#tg_{i})"/>
  <!-- Ambient circles -->
  <circle cx="200" cy="180" r="130" fill="none" stroke="url(#tg_ring_{i})" stroke-width="2" opacity="0.35" stroke-dasharray="8 6"/>
  <circle cx="200" cy="180" r="105" fill="none" stroke="{col_b}" stroke-width="1.5" opacity="0.5"/>
  <circle cx="200" cy="180" r="80" fill="{col_a}" opacity="0.12"/>
  
  <!-- Stylized avatar figure in navy & white -->
  <circle cx="200" cy="155" r="45" fill="#1E293B"/>
  <path d="M 120 280 C 120 220, 160 215, 200 215 C 240 215, 280 220, 280 280 Z" fill="#1E293B" opacity="0.9"/>
  
  <!-- Initials badge in royal purple -->
  <circle cx="250" cy="130" r="22" fill="{col_a}"/>
  <text x="250" y="136" text-anchor="middle" font-family="Poppins,Arial,sans-serif" font-size="13" font-weight="700" fill="#FFFFFF">{initials}</text>
  
  <!-- Subtle tech dot matrix -->
  <circle cx="70" cy="70" r="3.5" fill="{col_b}" opacity="0.5"/>
  <circle cx="90" cy="70" r="3.5" fill="{col_b}" opacity="0.3"/>
  <circle cx="70" cy="90" r="3.5" fill="{col_b}" opacity="0.3"/>
  <circle cx="330" cy="330" r="3.5" fill="{col_a}" opacity="0.5"/>
  <circle cx="310" cy="330" r="3.5" fill="{col_a}" opacity="0.3"/>
  <circle cx="330" cy="310" r="3.5" fill="{col_a}" opacity="0.3"/>
</svg>'''
    with open(os.path.join(team_dir, f'team-{i+1}.svg'), 'w', encoding='utf-8') as f:
        f.write(svg)

# 3. Update covers (3 cards) - Light theme editorial banners
updates = [
    ("Local First Architecture", "ORVIX Milestone 01", "#7C3AED", "#10B981"),
    ("Multilingual Route Mapping", "Tourist Guide Release", "#10B981", "#7C3AED"),
    ("Decentralized Sync Engine", "NEXUS Core Alpha", "#0284C7", "#7C3AED")
]

for i, (title, tag, col_a, col_b) in enumerate(updates):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
  <defs>
    <linearGradient id="ug_{i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F8F7FF"/>
      <stop offset="60%" stop-color="#EDE9FE"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="ug_line_{i}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="{col_a}"/>
      <stop offset="100%" stop-color="{col_b}"/>
    </linearGradient>
  </defs>
  <rect width="640" height="360" rx="16" fill="url(#ug_{i})"/>
  
  <!-- Subtle tech grid background -->
  <g opacity="0.35" stroke="#CBD5E1" stroke-width="1">
    <line x1="80" y1="0" x2="80" y2="360"/>
    <line x1="160" y1="0" x2="160" y2="360"/>
    <line x1="240" y1="0" x2="240" y2="360"/>
    <line x1="320" y1="0" x2="320" y2="360"/>
    <line x1="400" y1="0" x2="400" y2="360"/>
    <line x1="480" y1="0" x2="480" y2="360"/>
    <line x1="560" y1="0" x2="560" y2="360"/>
    <line x1="0" y1="90" x2="640" y2="90"/>
    <line x1="0" y1="180" x2="640" y2="180"/>
    <line x1="0" y1="270" x2="640" y2="270"/>
  </g>

  <!-- Glowing geometric nodes / curves in brand purple and green -->
  <path d="M 40 250 Q 200 110 360 210 T 600 90" fill="none" stroke="url(#ug_line_{i})" stroke-width="4.5" opacity="0.9"/>
  <circle cx="200" cy="110" r="8" fill="{col_a}"/>
  <circle cx="200" cy="110" r="18" fill="{col_a}" opacity="0.2"/>
  <circle cx="360" cy="210" r="10" fill="{col_b}"/>
  <circle cx="360" cy="210" r="22" fill="{col_b}" opacity="0.2"/>
  <circle cx="500" cy="140" r="6" fill="#1E293B"/>

  <!-- Foreground Badge & Details -->
  <rect x="44" y="44" width="168" height="28" rx="14" fill="#FFFFFF" stroke="{col_a}" stroke-width="1.2"/>
  <text x="60" y="63" font-family="Poppins,Arial,sans-serif" font-size="11" font-weight="600" fill="{col_a}">{tag}</text>
  
  <text x="44" y="300" font-family="Poppins,Arial,sans-serif" font-size="24" font-weight="700" fill="#0F172A">{title}</text>
  <text x="44" y="325" font-family="Poppins,Arial,sans-serif" font-size="13" font-weight="500" fill="#64748B">ARRIVA Research &amp; Build Log</text>
</svg>'''
    with open(os.path.join(updates_dir, f'update-{i+1}.svg'), 'w', encoding='utf-8') as f:
        f.write(svg)

print("Generated all light-theme screens, team portraits, and update covers!")
