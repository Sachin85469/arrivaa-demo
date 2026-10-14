// Three.js world: one object per chapter, cross-faded by scroll. window.WORLD.set(sceneFloat)
(function () {
  const cv = document.getElementById('world');
  if (!cv || !window.THREE) return;
  let R;
  try {
    R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  } catch (e) {
    document.documentElement.classList.add('no-gl');
    window.WORLD = { set() {} };
    return;
  }

  const S = new THREE.Scene();
  const C = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  C.position.z = 9;

  const P = 0xa78bfa, G = 0x6ee7b7, mats = [];
  const mat = (c, pts) => {
    const m = pts
      ? new THREE.PointsMaterial({ color: c, size: 0.05, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
      : new THREE.LineBasicMaterial({ color: c, transparent: true, blending: THREE.AdditiveBlending });
    mats.push(m);
    return m;
  };

  const groups = [0, 1, 2, 3, 4].map(() => {
    const g = new THREE.Group();
    S.add(g);
    return g;
  });

  // Background ambient stars
  const sp = [];
  for (let i = 0; i < 900; i++) {
    sp.push((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, -Math.random() * 30 - 4);
  }
  const sg = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.035, transparent: true, opacity: 0.6 }));
  S.add(stars);

  // 0: Hero orb (wireframe icosahedron with mint points)
  const ico = new THREE.IcosahedronGeometry(2.3, 2);
  groups[0].add(new THREE.LineSegments(new THREE.WireframeGeometry(ico), mat(P)), new THREE.Points(ico, mat(G, 1)));

  // 1: Globe of dots + route arcs (Tourist Guide)
  const gp = [];
  for (let i = 0; i < 700; i++) {
    const y = 1 - 2 * (i + 0.5) / 700, r = Math.sqrt(1 - y * y), a = i * 2.39996;
    gp.push(Math.cos(a) * r * 2.4, y * 2.4, Math.sin(a) * r * 2.4);
  }
  groups[1].add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(gp, 3)), mat(P, 1)));
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let t = 0; t <= 1; t += 0.04) {
      const a = k * 2 + t * 1.6, h = 2.4 + Math.sin(t * Math.PI) * 0.9;
      pts.push(new THREE.Vector3(Math.cos(a) * h * 0.9, (t - 0.5 + k * 0.3 - 0.3) * 3, Math.sin(a) * h * 0.9));
    }
    groups[1].add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat(G)));
  }

  // 2: Network constellation (NEXUS)
  const nodes = [];
  for (let i = 0; i < 32; i++) {
    nodes.push(new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3));
  }
  const lp = [];
  nodes.forEach((a, i) => {
    nodes.forEach((b, j) => {
      if (j > i && a.distanceTo(b) < 1.9) lp.push(a, b);
    });
  });
  groups[2].add(
    new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp), mat(G)),
    new THREE.Points(new THREE.BufferGeometry().setFromPoints(nodes), (() => {
      const m = mat(P, 1);
      m.size = 0.14;
      return m;
    })())
  );

  // 3: Lattice cube (ORVIX local stack)
  const cp = [];
  for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 5; y++) {
      for (let z = 0; z < 5; z++) {
        cp.push((x - 2) * 0.9, (y - 2) * 0.9, (z - 2) * 0.9);
      }
    }
  }
  groups[3].add(
    new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(cp, 3)), (() => {
      const m = mat(P, 1);
      m.size = 0.09;
      return m;
    })()),
    new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(3.8, 3.8, 3.8)), mat(G))
  );

  // 4: Celestial ring (Afterlight moon)
  groups[4].add(
    new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.02, 8, 160), new THREE.MeshBasicMaterial({ color: G, transparent: true })),
    new THREE.Points(new THREE.IcosahedronGeometry(1.2, 3), mat(P, 1))
  );
  mats.push(groups[4].children[0].material);

  groups.forEach(g => {
    g.children.forEach(c => {
      c.material.userData = { base: c.material.opacity };
    });
  });

  const X = [2.8, 2.9, -2.9, 2.9, 0];
  let s = 0, ts = 0, mx = 0, my = 0, vel = 0, last = performance.now();
  const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

  const size = () => {
    const w = window.innerWidth, h = window.innerHeight;
    R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    R.setSize(w, h, false);
    C.aspect = w / h;
    C.updateProjectionMatrix();
  };
  window.addEventListener('resize', size, { passive: true });
  size();

  window.addEventListener('pointermove', e => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) last = performance.now();
  });

  const sm = t => t * t * (3 - 2 * t);

  function frame(t) {
    requestAnimationFrame(frame);
    if (document.hidden) return;

    const dt = Math.min((t - last) / 1000, 0.05);
    last = t;
    s += (ts - s) * Math.min(1, dt * 4);

    const clampedS = Math.max(0, Math.min(4, s));
    const narrow = window.innerWidth < 800;
    const i0 = Math.min(3, Math.floor(clampedS));
    const f = sm(Math.min(1, Math.max(0, clampedS - i0)));
    const x = narrow ? 0 : X[i0] + (X[i0 + 1] - X[i0]) * f;

    groups.forEach((g, i) => {
      const w = Math.max(0, 1 - Math.abs(clampedS - i) * 1.5);
      g.visible = w > 0.01;
      g.children.forEach(c => {
        c.material.opacity = w * (c.isPoints ? 0.9 : 0.55) * (narrow ? 0.45 : 1);
      });
      g.position.set(x, narrow ? 1.6 : 0, 0);
      g.scale.setScalar((narrow ? 0.62 : 1) * (0.85 + 0.15 * w));
      if (!rm) {
        g.rotation.y += dt * (0.12 + i * 0.03) + vel * 0.02;
        g.rotation.x = Math.sin(t / 5000 + i) * 0.2;
      }
    });

    vel *= 0.92;
    stars.rotation.y += rm ? 0 : dt * 0.01;

    C.position.x += (mx * 1.2 - C.position.x) * 0.05;
    C.position.y += (-my * 0.8 - C.position.y) * 0.05;
    C.lookAt(0, 0, 0);
    R.render(S, C);
  }

  requestAnimationFrame(frame);

  window.WORLD = {
    set(v) {
      const target = Math.max(0, Math.min(4, v));
      vel = Math.min(2, Math.abs(target - ts) * 8);
      ts = target;
      if (rm) s = target;
    }
  };
})();
