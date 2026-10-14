# Editing the ARRIVA website
1. Open `content.js`: every text, number, link and image comes from this one file.
2. Replace placeholders (marked "placeholder"): stats, descriptions, links, email, social URLs.
3. Replace screens: put real screenshots in `assets/screens/` and change the paths in `content.js`.
4. Run: open `index.html`, or `python -m http.server 8000` in this folder.
5. Deploy: Vercel/Netlify/GitHub Pages, root folder = `website`, no build command.
Files: `index.html` (skeleton), `styles.css`, `main.js` (animations), `scene.js` (Three.js), `vendor/three.min.js`.
