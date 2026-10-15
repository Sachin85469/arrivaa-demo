// ARRIVA High-Contrast Scroll-Driven Three.js World
// Light technical paper theme (#F8F7FF) with depth fog, layered ribbons,
// procedural terrain, pulsing message packets, and continuous camera path.

(function () {
  'use strict';

  const cv = document.getElementById('world');
  if (!cv || !window.THREE) return;

  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (e) {
    document.documentElement.classList.add('no-gl');
    window.WORLD = { set() {}, highlightPin() {} };
    return;
  }

  // --- Brand Colors ---
  const C_PAPER = 0xF8F7FF;
  const C_PURPLE = 0x7C3AED;
  const C_PURPLE_LIGHT = 0xA78BFA;
  const C_NAVY = 0x0F172A;
  const C_NAVY_MUTED = 0x334155;
  const C_GREEN = 0x10B981;
  const C_LINE = 0xCBD5E1;
  const C_LINE_DARK = 0x94A3B8;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(C_PAPER, 0.024);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 10.5);

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x7C3AED, 1.8);
  dirLight1.position.set(12, 16, 14);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x10B981, 0.8);
  dirLight2.position.set(-14, -12, 10);
  scene.add(dirLight2);

  const dirLightTop = new THREE.DirectionalLight(0xffffff, 1.0);
  dirLightTop.position.set(0, 20, 10);
  scene.add(dirLightTop);

  // Background subtle technical dust particles
  const dustCount = 350;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 50;
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({
    color: C_NAVY_MUTED,
    size: 0.055,
    transparent: true,
    opacity: 0.22
  });
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  scene.add(dustPoints);

  // -------------------------------------------------------------
  // STATION 0: HERO (The Arrival Sculpture)
  // Bold kinetic centerpiece on the right half of desktop hero
  // -------------------------------------------------------------
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  // 1. Faceted Icosahedron Gem Core (Crisp royal purple with dark edges)
  const gemGeo = new THREE.IcosahedronGeometry(2.35, 1);
  const gemMat = new THREE.MeshStandardMaterial({
    color: 0x7C3AED,
    roughness: 0.2,
    metalness: 0.15,
    transparent: true,
    opacity: 0.88,
    flatShading: true
  });
  const gemMesh = new THREE.Mesh(gemGeo, gemMat);
  heroGroup.add(gemMesh);

  // High contrast wireframe lines on gem
  const gemWireGeo = new THREE.WireframeGeometry(gemGeo);
  const gemWireMat = new THREE.LineBasicMaterial({
    color: C_NAVY,
    transparent: true,
    opacity: 0.75
  });
  const gemWire = new THREE.LineSegments(gemWireGeo, gemWireMat);
  heroGroup.add(gemWire);

  // Inner pulsing emerald core
  const innerCoreGeo = new THREE.IcosahedronGeometry(1.0, 1);
  const innerCoreMat = new THREE.MeshBasicMaterial({ color: C_GREEN, wireframe: true, transparent: true, opacity: 0.85 });
  const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
  heroGroup.add(innerCore);

  // 2. Gyroscopic gimbal rings (Bold Navy and Purple)
  const ring1Geo = new THREE.TorusGeometry(3.5, 0.055, 16, 120);
  const ringMat1 = new THREE.MeshStandardMaterial({
    color: C_NAVY,
    roughness: 0.35,
    metalness: 0.25,
    transparent: true,
    opacity: 0.9
  });
  const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
  ring1.rotation.x = Math.PI * 0.35;
  heroGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(3.9, 0.045, 16, 120);
  const ringMat2 = new THREE.MeshStandardMaterial({
    color: C_PURPLE,
    roughness: 0.3,
    metalness: 0.2,
    transparent: true,
    opacity: 0.9
  });
  const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
  ring2.rotation.y = Math.PI * 0.45;
  heroGroup.add(ring2);

  // 3. Technical ticks along outer equator
  const tickCount = 48;
  const tickPts = [];
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * Math.PI * 2;
    const r1 = 4.15;
    const r2 = i % 4 === 0 ? 4.45 : 4.28;
    tickPts.push(
      new THREE.Vector3(Math.cos(angle) * r1, 0, Math.sin(angle) * r1),
      new THREE.Vector3(Math.cos(angle) * r2, 0, Math.sin(angle) * r2)
    );
  }
  const tickGeo = new THREE.BufferGeometry().setFromPoints(tickPts);
  const tickMat = new THREE.LineBasicMaterial({ color: C_NAVY, transparent: true, opacity: 0.6 });
  const tickRing = new THREE.LineSegments(tickGeo, tickMat);
  heroGroup.add(tickRing);

  // 4. Orbiting emerald node and ribbon trail
  const heroOrbitGroup = new THREE.Group();
  heroGroup.add(heroOrbitGroup);

  const orbNodeGeo = new THREE.SphereGeometry(0.2, 16, 16);
  const orbNodeMat = new THREE.MeshBasicMaterial({ color: C_GREEN, transparent: true, opacity: 0.95 });
  const orbNode = new THREE.Mesh(orbNodeGeo, orbNodeMat);
  orbNode.position.set(3.8, 0, 0);
  heroOrbitGroup.add(orbNode);

  // Orbiting particle ribbon
  const ribbonPts = [];
  const ribbonCount = 160;
  for (let i = 0; i < ribbonCount; i++) {
    const u = i / ribbonCount;
    const a = u * Math.PI * 4;
    const r = 2.9 + Math.sin(u * Math.PI * 6) * 0.7;
    const y = (u - 0.5) * 4.6;
    ribbonPts.push(Math.cos(a) * r, y, Math.sin(a) * r);
  }
  const ribbonGeo = new THREE.BufferGeometry();
  ribbonGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribbonPts, 3));
  const ribbonMat = new THREE.PointsMaterial({
    color: C_PURPLE,
    size: 0.1,
    transparent: true,
    opacity: 0.75
  });
  const ribbon = new THREE.Points(ribbonGeo, ribbonMat);
  heroGroup.add(ribbon);

  // -------------------------------------------------------------
  // STATION 1: TOURIST GUIDE (Native Procedural Ridge Terrain)
  // Layered contour mountain ridges with animated route & glowing pins
  // -------------------------------------------------------------
  const touristGroup = new THREE.Group();
  scene.add(touristGroup);

  const terCols = 44;
  const terRows = 36;
  const terWidth = 24;
  const terDepth = 20;
  const terGeo = new THREE.PlaneGeometry(terWidth, terDepth, terCols - 1, terRows - 1);
  terGeo.rotateX(-Math.PI / 2.3);

  const posAttr = terGeo.attributes.position;

  function getTerrainHeight(x, z) {
    const d = Math.hypot(x, z);
    const m1 = Math.sin(x * 0.38 + 1.2) * Math.cos(z * 0.42 - 0.3) * 2.3;
    const m2 = Math.sin(x * 0.75 - z * 0.55) * 1.2;
    const m3 = Math.cos(x * 1.3 + z * 1.0) * 0.5;
    const falloff = Math.exp(-d * 0.09);
    return (m1 + m2 + m3) * falloff;
  }

  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vz = posAttr.getZ(i);
    posAttr.setY(i, getTerrainHeight(vx, vz));
  }
  terGeo.computeVertexNormals();

  // Subtle shaded terrain underlay
  const terMeshMat = new THREE.MeshStandardMaterial({
    color: 0xEDE9FE,
    roughness: 0.7,
    metalness: 0.1,
    flatShading: true,
    transparent: true,
    opacity: 0.65
  });
  const terMesh = new THREE.Mesh(terGeo, terMeshMat);
  touristGroup.add(terMesh);

  // High contrast contour ridge lines
  const terWireMat = new THREE.LineBasicMaterial({
    color: C_PURPLE,
    transparent: true,
    opacity: 0.55
  });
  const terWire = new THREE.LineSegments(new THREE.WireframeGeometry(terGeo), terWireMat);
  touristGroup.add(terWire);

  // 3D Dashed Winding Route across Sahyadri peaks
  const routeWaypoints = [
    new THREE.Vector3(-7.5, getTerrainHeight(-7.5, 4.5) + 0.35, 4.5),
    new THREE.Vector3(-3.5, getTerrainHeight(-3.5, 2.2) + 0.45, 2.2),
    new THREE.Vector3(0.5, getTerrainHeight(0.5, -0.6) + 0.55, -0.6),
    new THREE.Vector3(4.8, getTerrainHeight(4.8, -2.8) + 0.45, -2.8),
    new THREE.Vector3(7.8, getTerrainHeight(7.8, -5.2) + 0.35, -5.2)
  ];

  const routeCurve = new THREE.CatmullRomCurve3(routeWaypoints);
  const routeCurvePoints = routeCurve.getPoints(120);

  // Base dotted trail
  const routeTrailGeo = new THREE.BufferGeometry().setFromPoints(routeCurvePoints);
  const routeBaseMat = new THREE.LineDashedMaterial({
    color: C_NAVY_MUTED,
    dashSize: 0.3,
    gapSize: 0.2,
    transparent: true,
    opacity: 0.4
  });
  const routeBaseLine = new THREE.Line(routeTrailGeo, routeBaseMat);
  routeBaseLine.computeLineDistances();
  touristGroup.add(routeBaseLine);

  // Dynamic green trail drawn on scroll
  const routeProgGeo = new THREE.BufferGeometry();
  const routeProgMat = new THREE.LineBasicMaterial({
    color: C_GREEN,
    linewidth: 3,
    transparent: true,
    opacity: 0.95
  });
  const routeProgLine = new THREE.Line(routeProgGeo, routeProgMat);
  touristGroup.add(routeProgLine);

  // 4 Glowing 3D Waypoint Pins with vertical beacons
  const pinData = [
    { pos: routeWaypoints[0], name: "Sinhagad Ridge", hi: "सिंहगड" },
    { pos: routeWaypoints[1], name: "Mutha River Walk", hi: "मुठा नदी" },
    { pos: routeWaypoints[3], name: "Old Bazaar Arcade", hi: "जुना बाजार" },
    { pos: routeWaypoints[4], name: "Katraj Valley View", hi: "कात्रज घाट" }
  ];

  const pinGroups = [];
  pinData.forEach((pin, idx) => {
    const pg = new THREE.Group();
    pg.position.copy(pin.pos);

    // Vertical beacon stem
    const stemGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1.9, 0)
    ]);
    const stemMat = new THREE.LineBasicMaterial({ color: C_PURPLE, transparent: true, opacity: 0.85 });
    pg.add(new THREE.Line(stemGeo, stemMat));

    // Glowing head
    const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({ color: idx === 0 ? C_GREEN : C_PURPLE, transparent: true, opacity: 0.95 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.9;
    pg.add(head);

    // Ground ripple ring
    const rippleGeo = new THREE.RingGeometry(0.25, 0.45, 32);
    rippleGeo.rotateX(-Math.PI / 2);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? C_GREEN : C_PURPLE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    ripple.position.y = 0.05;
    pg.add(ripple);

    pg.userData = { head, ripple, headMat, rippleMat, baseIdx: idx };
    pinGroups.push(pg);
    touristGroup.add(pg);
  });

  // -------------------------------------------------------------
  // STATION 2: NEXUS (Communication Constellation & Message Packets)
  // -------------------------------------------------------------
  const nexusGroup = new THREE.Group();
  scene.add(nexusGroup);

  const nexusNodeCount = 28;
  const nexusNodes = [];
  const nexusNodePos = [];

  for (let i = 0; i < nexusNodeCount; i++) {
    const radius = 2.4 + Math.random() * 3.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.7;
    const v = new THREE.Vector3(
      radius * Math.cos(phi) * Math.sin(theta),
      radius * Math.sin(phi),
      radius * Math.cos(phi) * Math.cos(theta)
    );
    nexusNodes.push(v);
    nexusNodePos.push(v.x, v.y, v.z);
  }

  // Network connections
  const nexusLines = [];
  const nexusPairs = [];
  for (let i = 0; i < nexusNodeCount; i++) {
    for (let j = i + 1; j < nexusNodeCount; j++) {
      const dist = nexusNodes[i].distanceTo(nexusNodes[j]);
      if (dist < 2.9) {
        nexusLines.push(nexusNodes[i], nexusNodes[j]);
        nexusPairs.push({ a: nexusNodes[i], b: nexusNodes[j], dist });
      }
    }
  }

  const nexLineGeo = new THREE.BufferGeometry().setFromPoints(nexusLines);
  const nexLineMat = new THREE.LineBasicMaterial({
    color: C_LINE_DARK,
    transparent: true,
    opacity: 0.6
  });
  nexusGroup.add(new THREE.LineSegments(nexLineGeo, nexLineMat));

  // Node Points
  const nexNodeGeo = new THREE.BufferGeometry();
  nexNodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nexusNodePos, 3));
  const nexNodeMat = new THREE.PointsMaterial({
    color: C_PURPLE,
    size: 0.22,
    transparent: true,
    opacity: 0.9
  });
  nexusGroup.add(new THREE.Points(nexNodeGeo, nexNodeMat));

  // Central hub sphere
  const hubGeo = new THREE.SphereGeometry(0.6, 24, 24);
  const hubMat = new THREE.MeshStandardMaterial({
    color: C_NAVY,
    roughness: 0.2,
    metalness: 0.3,
    transparent: true,
    opacity: 0.9
  });
  const hubMesh = new THREE.Mesh(hubGeo, hubMat);
  nexusGroup.add(hubMesh);

  // Concentric radar waves from hub
  const radarRings = [];
  for (let k = 0; k < 3; k++) {
    const ringG = new THREE.RingGeometry(1.2 + k * 1.3, 1.25 + k * 1.3, 48);
    ringG.rotateX(Math.PI / 2.5);
    const ringM = new THREE.MeshBasicMaterial({
      color: C_PURPLE_LIGHT,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3 - k * 0.08
    });
    const ringMesh = new THREE.Mesh(ringG, ringM);
    radarRings.push(ringMesh);
    nexusGroup.add(ringMesh);
  }

  // Active pulsing message packets traveling along network lines
  const packetCount = 12;
  const packets = [];
  const packetGeo = new THREE.SphereGeometry(0.1, 12, 12);
  const packetMat = new THREE.MeshBasicMaterial({ color: C_GREEN, transparent: true, opacity: 0.95 });

  for (let i = 0; i < packetCount; i++) {
    const pair = nexusPairs[i % nexusPairs.length] || { a: nexusNodes[0], b: nexusNodes[1] };
    const pMesh = new THREE.Mesh(packetGeo, packetMat);
    nexusGroup.add(pMesh);
    packets.push({
      mesh: pMesh,
      from: pair.a,
      to: pair.b,
      progress: Math.random(),
      speed: 0.28 + Math.random() * 0.32
    });
  }

  // -------------------------------------------------------------
  // STATION 3: ORVIX (Local Compute Matrix & Streaming Data Packets)
  // -------------------------------------------------------------
  const orvixGroup = new THREE.Group();
  scene.add(orvixGroup);

  const gridSize = 4;
  const latticeSpacing = 1.35;
  const latticePts = [];
  const boxInstGroup = new THREE.Group();
  orvixGroup.add(boxInstGroup);

  const cubeGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
  const cubeWireGeo = new THREE.WireframeGeometry(cubeGeo);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0xEDE9FE,
    roughness: 0.3,
    metalness: 0.2,
    transparent: true,
    opacity: 0.7
  });
  const wireMatOrv = new THREE.LineBasicMaterial({ color: C_NAVY, transparent: true, opacity: 0.75 });

  const cubeCenters = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < gridSize; z++) {
        const px = (x - (gridSize - 1) / 2) * latticeSpacing;
        const py = (y - 1) * (latticeSpacing * 1.3);
        const pz = (z - (gridSize - 1) / 2) * latticeSpacing;

        const cb = new THREE.Mesh(cubeGeo, cubeMat);
        cb.position.set(px, py, pz);
        const cbWire = new THREE.LineSegments(cubeWireGeo, wireMatOrv);
        cb.add(cbWire);
        boxInstGroup.add(cb);
        cubeCenters.push(new THREE.Vector3(px, py, pz));

        if (x < gridSize - 1) latticePts.push(new THREE.Vector3(px, py, pz), new THREE.Vector3(px + latticeSpacing, py, pz));
        if (y < 2) latticePts.push(new THREE.Vector3(px, py, pz), new THREE.Vector3(px, py + latticeSpacing * 1.3, pz));
        if (z < gridSize - 1) latticePts.push(new THREE.Vector3(px, py, pz), new THREE.Vector3(px, py, pz + latticeSpacing));
      }
    }
  }

  const busGeo = new THREE.BufferGeometry().setFromPoints(latticePts);
  const busMat = new THREE.LineBasicMaterial({ color: C_LINE_DARK, transparent: true, opacity: 0.55 });
  orvixGroup.add(new THREE.LineSegments(busGeo, busMat));

  // Big outer framing chassis
  const rackBoxGeo = new THREE.BoxGeometry(
    gridSize * latticeSpacing * 1.1,
    3.8 * latticeSpacing,
    gridSize * latticeSpacing * 1.1
  );
  const rackEdges = new THREE.EdgesGeometry(rackBoxGeo);
  const rackMat = new THREE.LineBasicMaterial({ color: C_PURPLE, transparent: true, opacity: 0.65 });
  orvixGroup.add(new THREE.LineSegments(rackEdges, rackMat));

  // Streaming Token Data Packets
  const dataPacketCount = 14;
  const dataPackets = [];
  const dataPackGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const dataPackMat = new THREE.MeshBasicMaterial({ color: C_GREEN, transparent: true, opacity: 0.95 });

  for (let i = 0; i < dataPacketCount; i++) {
    const startIdx = Math.floor(Math.random() * cubeCenters.length);
    const m = new THREE.Mesh(dataPackGeo, dataPackMat);
    orvixGroup.add(m);
    dataPackets.push({
      mesh: m,
      start: cubeCenters[startIdx],
      dir: ['x', 'y', 'z'][Math.floor(Math.random() * 3)],
      offset: Math.random() * latticeSpacing,
      speed: 0.85 + Math.random() * 0.95
    });
  }

  // -------------------------------------------------------------
  // STATION 4: OUTRO (Afterlight Astrolabe Ring & Community)
  // -------------------------------------------------------------
  const outroGroup = new THREE.Group();
  scene.add(outroGroup);

  const outerRingGeo = new THREE.TorusGeometry(3.6, 0.045, 16, 120);
  const outerRingMat = new THREE.MeshStandardMaterial({
    color: C_PURPLE,
    metalness: 0.35,
    roughness: 0.25,
    transparent: true,
    opacity: 0.9
  });
  const outroRing1 = new THREE.Mesh(outerRingGeo, outerRingMat);
  outroGroup.add(outroRing1);

  const innerRingGeo = new THREE.TorusGeometry(2.4, 0.03, 16, 100);
  const innerRingMat = new THREE.MeshStandardMaterial({
    color: C_NAVY,
    metalness: 0.25,
    roughness: 0.35,
    transparent: true,
    opacity: 0.9
  });
  const outroRing2 = new THREE.Mesh(innerRingGeo, innerRingMat);
  outroRing2.rotation.x = Math.PI / 3;
  outroGroup.add(outroRing2);

  const coreIcoGeo = new THREE.IcosahedronGeometry(1.25, 1);
  const coreIcoMat = new THREE.MeshStandardMaterial({
    color: C_GREEN,
    roughness: 0.25,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85
  });
  const coreIco = new THREE.Mesh(coreIcoGeo, coreIcoMat);
  coreIco.add(new THREE.LineSegments(new THREE.WireframeGeometry(coreIcoGeo), new THREE.LineBasicMaterial({ color: C_NAVY })));
  outroGroup.add(coreIco);

  const haloCount = 180;
  const haloPts = [];
  for (let i = 0; i < haloCount; i++) {
    const a = (i / haloCount) * Math.PI * 2;
    const r = 4.0 + Math.random() * 3.5;
    haloPts.push(Math.cos(a) * r, (Math.random() - 0.5) * 2.2, Math.sin(a) * r);
  }
  const haloGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(haloPts, 3));
  const haloMat = new THREE.PointsMaterial({ color: C_PURPLE_LIGHT, size: 0.07, transparent: true, opacity: 0.55 });
  outroGroup.add(new THREE.Points(haloGeo, haloMat));

  // Array of all 5 station groups
  const stations = [heroGroup, touristGroup, nexusGroup, orvixGroup, outroGroup];

  // Base X coordinates for each station [Hero (right), Tourist (right), NEXUS (left), ORVIX (right), Outro (center)]
  const stationDesktopX = [3.4, 3.4, -3.2, 3.2, 0.0];
  const stationDesktopY = [0.1, -0.1, 0.0, 0.0, 0.0];

  let currentScroll = 0;
  let targetScroll = 0;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let lastTime = performance.now();
  let isHeld = false;

  function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const isNarrow = w < 800;
    stations.forEach((g, i) => {
      if (isNarrow) {
        g.position.set(0, i === 0 ? -1.3 : -1.6, 0);
        g.scale.setScalar(0.62);
      } else {
        g.position.set(stationDesktopX[i], stationDesktopY[i], 0);
        g.scale.setScalar(1.0);
      }
    });
  }

  window.addEventListener('resize', handleResize, { passive: true });
  handleResize();

  window.addEventListener('pointermove', e => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) lastTime = performance.now();
  });

  // -------------------------------------------------------------
  // ANIMATION RENDER LOOP
  // -------------------------------------------------------------
  function renderLoop(time) {
    requestAnimationFrame(renderLoop);
    if (document.hidden || isHeld) return;

    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    const scrollDamping = rm ? 1 : Math.min(1, dt * 6.0);
    currentScroll += (targetScroll - currentScroll) * scrollDamping;

    mouseX += (targetMouseX - mouseX) * Math.min(1, dt * 4.0);
    mouseY += (targetMouseY - mouseY) * Math.min(1, dt * 4.0);

    const clampedScroll = Math.max(0, Math.min(4, currentScroll));
    const isNarrow = window.innerWidth < 800;

    // Orchestrate cross-fade & visibility between stations
    stations.forEach((g, i) => {
      const dist = Math.abs(clampedScroll - i);
      const weight = Math.max(0, 1 - dist * 1.6);

      g.visible = weight > 0.01;
      if (g.visible) {
        const baseScale = isNarrow ? 0.62 : 1.0;
        const dynamicScale = baseScale * (0.88 + 0.12 * weight);
        g.scale.setScalar(dynamicScale);

        // Position with subtle scroll drift
        const baseX = isNarrow ? 0 : stationDesktopX[i];
        const baseY = isNarrow ? (i === 0 ? -1.3 : -1.6) : stationDesktopY[i];
        const driftY = (clampedScroll - i) * (isNarrow ? -0.8 : -1.4);
        g.position.set(baseX, baseY + driftY, 0);

        // Fade materials based on weight
        g.traverse(child => {
          if (child.material) {
            if (child.material.opacity !== undefined) {
              const maxOp = child.userData && child.userData.baseOpacity !== undefined
                ? child.userData.baseOpacity
                : (child.isPoints ? 0.8 : (child.isLine ? 0.65 : 0.85));
              const mobileMod = isNarrow ? 0.55 : 1.0;
              child.material.opacity = weight * maxOp * mobileMod;
            }
          }
        });
      }
    });

    // Mouse parallax on camera
    if (!rm) {
      camera.position.x = mouseX * 0.45;
      camera.position.y = -mouseY * 0.35;
      camera.lookAt(0, 0, 0);
    }

    // 1. Hero Kinetic Animations
    if (!rm && heroGroup.visible) {
      gemMesh.rotation.y += dt * 0.28;
      gemMesh.rotation.x = Math.sin(time * 0.0009) * 0.18;
      gemWire.rotation.copy(gemMesh.rotation);
      innerCore.rotation.y -= dt * 0.4;

      ring1.rotation.z += dt * 0.16;
      ring2.rotation.x += dt * 0.14;
      tickRing.rotation.y += dt * 0.05;

      heroOrbitGroup.rotation.y += dt * 0.85;
      ribbon.rotation.y += dt * 0.35;
    }

    // 2. Tourist Guide Trail Progress
    if (touristGroup.visible) {
      const touristProgress = Math.max(0, Math.min(1, (clampedScroll - 0.5) / 1.0));
      const pointCountToDraw = Math.max(2, Math.floor(touristProgress * routeCurvePoints.length));
      const drawnPts = routeCurvePoints.slice(0, pointCountToDraw);
      routeProgGeo.setFromPoints(drawnPts);

      pinGroups.forEach((pg, i) => {
        const pTime = time * 0.003 + i * 1.5;
        const s = 1.0 + Math.sin(pTime) * 0.22;
        pg.userData.ripple.scale.set(s, s, 1);
        pg.userData.head.position.y = 1.9 + Math.sin(pTime) * 0.12;
      });

      if (!rm) {
        touristGroup.rotation.y = Math.sin(time * 0.0005) * 0.08;
      }
    }

    // 3. NEXUS Network Message Packets Animation
    if (!rm && nexusGroup.visible) {
      hubMesh.rotation.y += dt * 0.3;
      radarRings.forEach((ring, idx) => {
        ring.rotation.z += dt * (0.16 - idx * 0.04);
      });

      packets.forEach(pkt => {
        pkt.progress += dt * pkt.speed;
        if (pkt.progress > 1) {
          pkt.progress = 0;
        }
        pkt.mesh.position.lerpVectors(pkt.from, pkt.to, pkt.progress);
      });
    }

    // 4. ORVIX Compute Matrix Data Packets Animation
    if (!rm && orvixGroup.visible) {
      boxInstGroup.rotation.y += dt * 0.1;

      dataPackets.forEach(dp => {
        dp.offset += dt * dp.speed;
        if (dp.offset > latticeSpacing) {
          dp.offset = 0;
        }
        dp.mesh.position.copy(dp.start);
        if (dp.dir === 'x') dp.mesh.position.x += dp.offset;
        else if (dp.dir === 'y') dp.mesh.position.y += dp.offset;
        else dp.mesh.position.z += dp.offset;
      });
    }

    // 5. Outro Astrolabe Rotation
    if (!rm && outroGroup.visible) {
      outroRing1.rotation.y += dt * 0.22;
      outroRing2.rotation.z += dt * 0.18;
      coreIco.rotation.y += dt * 0.35;
    }

    renderer.render(scene, camera);
  }

  requestAnimationFrame(renderLoop);

  // -------------------------------------------------------------
  // PUBLIC API: window.WORLD
  // -------------------------------------------------------------
  window.WORLD = {
    set(val) {
      targetScroll = Math.max(0, Math.min(4, val));
      if (rm) currentScroll = targetScroll;
    },
    hold(h) {
      isHeld = Boolean(h);
      if (!isHeld) lastTime = performance.now();
    },
    highlightPin(pinIdx) {
      pinGroups.forEach((pg, i) => {
        const isTarget = i === pinIdx;
        pg.userData.headMat.color.setHex(isTarget ? C_GREEN : C_PURPLE);
        pg.userData.rippleMat.color.setHex(isTarget ? C_GREEN : C_PURPLE);
        pg.userData.rippleMat.opacity = isTarget ? 0.95 : 0.5;
      });
    }
  };

})();
