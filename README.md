# ARRIVA Launch Kit v2

**New in v2:** animated Three.js scroll journey, preloader, parallax, content-driven site (edit `website/content.js`). See `PROMPT_FOR_AI_IDE.md` to build the full version and `website/README-EDIT.md` to edit.

This kit contains a responsive, static website starter and a first-month social media launch guide.

## Included
- `website/index.html` — single-page ARRIVA website
- `website/styles.css` — responsive styling using ARRIVA's selected palette
- `website/script.js` — mobile navigation and placeholder social-link behavior
- `website/assets/favicon.svg` — simple favicon
- `brand/brand-guide.md` — identity and usage rules
- `social/30-day-launch-plan.md` — launch schedule, content pillars, captions, and video scripts

## Brand decisions used
- Brand: ARRIVA, a technology brand and community
- Tagline: Ideas Into Innovation.
- Personality: modern, premium, creative, approachable
- Voice: balanced professional and casual
- Wordmark direction: bold geometric uppercase wordmark
- Typeface: Poppins
- Colors: Purple `#7C3AED`, Lavender `#F8F7FF`, Navy `#0F172A`, Green `#10B981`
- Products: Tourist Guide, NEXUS, ORVIX

## Before publishing
1. Confirm final product names and descriptions.
2. Replace social profile placeholder links in `index.html`.
3. Add working product/app URLs when available.
4. Verify the current ORVIX workflow and any requirements or limitations before making detailed claims.
5. Test the site on mobile and desktop.
6. Add a privacy policy/contact details if you collect user data or add forms/analytics.

## Run locally
Open `website/index.html` in a browser. For a more production-like local server, run from the `website` folder:
`python -m http.server 8000`
Then open `http://localhost:8000`.

## Deploy
This is a static site and can be deployed on Vercel, Netlify, or GitHub Pages. On Vercel, import the folder/repository and use the `website` directory as the project root if the repository includes the full kit. No build command is required for the static HTML version.

This kit does not create social accounts, purchase a domain, configure hosting, or publish content. Those steps require your account access and official profile/product URLs.
