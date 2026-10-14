import json
import os

def main():
    bundle_path = os.path.join(os.path.dirname(__file__), 'sylva-bundle.json')
    with open(bundle_path, 'r', encoding='utf-8') as f:
        bundle = json.load(f)

    files_by_path = {f['path']: f['code'] for f in bundle['files']}

    inner_green_source = files_by_path['src/shaders/sylva-living-world/sources/inner-green-3d.html']
    three_runtime = files_by_path['src/shaders/sylva-living-world/sources/inner-green-assets/three.min.js']

    variant = "living-green"
    variant_label = "Interactive procedural moss root world"

    scene_only_markup = f'''<main class="hero" id="hero">
  <canvas id="scene" role="img" aria-label="{variant_label}"></canvas>
  <div class="stage" id="stage" aria-hidden="true"></div>
</main>'''

    scene_only_style = '''<style data-threeui-sylva-scene>
html,
body {
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

body {
  position: relative !important;
  background: #4a4d44 !important;
}

.hero {
  height: 100% !important;
  min-height: 0 !important;
}

#scene {
  pointer-events: auto !important;
}
</style>'''

    presentation_start = inner_green_source.find('<main class="hero" id="hero">')
    runtime_start = inner_green_source.find('<script src="inner-green-assets/three.min.js"></script>')

    if presentation_start < 0 or runtime_start < 0 or runtime_start <= presentation_start:
        raise ValueError("Sylva scene adapter could not isolate the authored Three.js scene.")

    base_doc = f"{inner_green_source[:presentation_start]}{scene_only_markup}\n\n{inner_green_source[runtime_start:]}"
    base_doc = base_doc.replace("<title>Sylva — Into the living world</title>", f"<title>{variant_label}</title>")
    base_doc = base_doc.replace("</head>", f"{scene_only_style}</head>")
    base_doc = base_doc.replace(
        '<script src="inner-green-assets/three.min.js"></script>',
        f'<script data-threeui-three-runtime>{three_runtime}</script>'
    )

    reduced_doc = base_doc.replace(
        "(function loop() { requestAnimationFrame(loop); tick(); })();",
        "(function loop() { if (!REDUCED) requestAnimationFrame(loop); tick(); })();"
    )

    out_dir = os.path.join(os.path.dirname(__file__), '..', 'website', 'vendor', 'sylva')
    os.makedirs(out_dir, exist_ok=True)

    out_normal = os.path.join(out_dir, 'living-green.html')
    out_reduced = os.path.join(out_dir, 'living-green-reduced.html')

    with open(out_normal, 'w', encoding='utf-8') as f:
        f.write(base_doc)

    with open(out_reduced, 'w', encoding='utf-8') as f:
        f.write(reduced_doc)

    print(f"Generated {out_normal} ({len(base_doc)} bytes)")
    print(f"Generated {out_reduced} ({len(reduced_doc)} bytes)")

if __name__ == '__main__':
    main()
