# Prompt: build the full ARRIVA website (Kage-style scroll journey)

Paste everything below into your AI IDE. Open the `website/` folder first so it can extend the existing v2 code.

---

You are a senior creative front-end developer. Extend the existing static site in `website/` (plain HTML/CSS/JS, Three.js in `vendor/three.min.js`, no build step, must work by opening `index.html`).

## Reference experience (what to copy: the technique, not the content)
A one-page scroll journey, like the Kage temple landing page:
- A preloader with a live percentage, then a curtain wipe that reveals the hero (the one orchestrated moment: headline words slide up from masks).
- A fixed full-screen Three.js canvas behind everything. The scroll position moves through "scenes": the 3D object changes and cross-fades per chapter (orb, globe, network, cube, ring), shifts left/right to stay beside the text, and follows the mouse slightly.
- Numbered chapters ("Chapter 00 - The arrival"), each with a Hindi/Marathi (Devanagari) label next to the English one, the way Kage pairs Japanese with English.
- Layered parallax: foreground cutouts (phones, bubbles, ridges) move at different speeds as you scroll.
- A pinned horizontal gallery driven by vertical scroll, a drawn route line, counting stats, a scroll progress bar, a soft cursor glow, magnetic buttons, and a giant outlined wordmark in the footer.
Do not copy any code, images or text from ThreeUI/Kage. Everything must be original.

## Brand (keep exactly)
ARRIVA, "Ideas Into Innovation." Purple #7C3AED (soft #A78BFA), navy #0F172A, lavender #F8F7FF, green #10B981 (mint #A7F3D0, use sparingly). Font: Poppins (weights 300-700, includes Devanagari). Voice: simple, practical, no hype, no invented metrics or testimonials.

## Rules
1. All content lives in `content.js`. Never hard-code text, numbers, links or image paths in HTML/JS. Add new sections as new keys there.
2. Classic scripts only (no ES modules), so `file://` works.
3. Performance: DPR cap 1.75, pause the render loop when the tab is hidden, lazy-load images, one rAF scroll handler.
4. Accessibility: skip link, visible focus, semantic landmarks, alt text on every image, `prefers-reduced-motion` turns off parallax, pinned scroll, preloader delay and 3D rotation (pinned gallery becomes a normal horizontally scrollable row).
5. WebGL failure falls back to a CSS gradient. Test at 1366x800 and 390x780.

## Sections to add (in this order, after the existing hero + 3 product chapters)
1. **Screens gallery** (pinned, horizontal): 3 groups (Tourist Guide, NEXUS, ORVIX), 4 phone screens each, a caption and "02 / 03" counter that updates.
2. **ORVIX live demo**: terminal that types `ollama serve`, then a request to the local API and a JSON reply. Label it "illustrative example".
3. **Tourist Guide scene**: layered SVG ridges (generated in JS), a dashed route that draws on scroll, 4 map pins that pop in with place names.
4. **NEXUS scene**: floating chat bubbles with parallax and a typing indicator.
5. **How it works** (3 steps per product, this one IS a sequence so numbering is fine).
6. **About** (light lavender band) with 4 principles and the stats row.
7. **Journey timeline**: idea, prototype, testing, release, feedback; line draws on scroll, current step highlighted.
8. **Team**: 4 cards (photo, name, role, short line), subtle tilt on hover.
9. **Updates**: 3 cards with cover image, tag, date, title.
10. **FAQ**: 6 accordion items, animated height, keyboard accessible.
11. **Community / Afterlight**: social links, email button, giant outlined "ARRIVA".
12. **Footer**: link columns (Products, Chapters, Elsewhere), privacy note if any data is collected.

## Placeholder content to fill in `content.js` (I will replace all of it)
- Per product: name, tag, status, 2-sentence description, 4 feature points, 2 stats, 4 screenshot paths, a link, tech used, "who it is for", 3 "how it works" steps, 2 short FAQs.
- Tourist Guide: places, photos, languages, trip planner, reviews. NEXUS: chats, groups, Android. ORVIX: local Ollama, API workflow, models, setup steps.
- Team (4), updates (3), timeline (5), FAQ (6), socials, email, legal line.
- Mark every placeholder number with `// PLACEHOLDER` and keep sample text clearly generic.

## Images
Use `assets/screens/` for app screens (SVG placeholders already exist; real screenshots can be PNG/JPG/WebP), `assets/updates/` for update covers, `assets/team/` for photos. Generate matching SVG placeholders for anything missing so the site never shows a broken image.

## Done when
No console errors, every section renders from `content.js`, scroll is smooth on a mid-range phone, and replacing a screenshot path changes the image with no other edit.
