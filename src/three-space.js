import * as THREE from 'three';

export function initSpaceScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02040a, 0.0007);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 420);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient & Point Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xffaa00, 5, 800);
  goldLight.position.set(150, 100, 100);
  scene.add(goldLight);

  const violetLight = new THREE.PointLight(0x9d4edd, 6, 900);
  violetLight.position.set(-200, -150, -100);
  scene.add(violetLight);

  const cyanLight = new THREE.PointLight(0x00f5d4, 4, 600);
  cyanLight.position.set(0, -200, 150);
  scene.add(cyanLight);

  // 1. GRAVITATIONAL WARP STARFIELD PARTICLES
  const starsCount = 4500;
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starsCount * 3);
  const starColors = new Float32Array(starsCount * 3);

  const starPalette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xffaa00),
    new THREE.Color(0x9d4edd),
    new THREE.Color(0x00f5d4),
    new THREE.Color(0x4361ee)
  ];

  for (let i = 0; i < starsCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 1800;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 1800;

    const col = starPalette[Math.floor(Math.random() * starPalette.length)];
    starColors[i * 3] = col.r;
    starColors[i * 3 + 1] = col.g;
    starColors[i * 3 + 2] = col.b;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85
  });

  const starField = new THREE.Points(starGeometry, starMaterial);
  scene.add(starField);

  // 2. INTERACTIVE 3D BLACK HOLE (SINGULARITY & ACCRETION DISK)
  const blackHoleGroup = new THREE.Group();
  blackHoleGroup.position.set(180, 50, -80);

  // Event Horizon Pitch Black Core
  const coreGeo = new THREE.SphereGeometry(45, 64, 64);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const blackHoleCore = new THREE.Mesh(coreGeo, coreMat);
  blackHoleGroup.add(blackHoleCore);

  // Event Horizon Photonic Ring Aura 1 (Amber Glow)
  const aura1Geo = new THREE.RingGeometry(46, 54, 64);
  const aura1Mat = new THREE.MeshBasicMaterial({
    color: 0xffaa00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95
  });
  const aura1 = new THREE.Mesh(aura1Geo, aura1Mat);
  aura1.rotation.x = Math.PI * 0.4;
  blackHoleGroup.add(aura1);

  // Event Horizon Photonic Ring Aura 2 (Violet Lensing)
  const aura2Geo = new THREE.RingGeometry(52, 65, 64);
  const aura2Mat = new THREE.MeshBasicMaterial({
    color: 0x9d4edd,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75
  });
  const aura2 = new THREE.Mesh(aura2Geo, aura2Mat);
  aura2.rotation.x = Math.PI * 0.35;
  blackHoleGroup.add(aura2);

  // Swirling Accretion Disk Particles
  const accretionCount = 4000;
  const accretionGeo = new THREE.BufferGeometry();
  const accretionPos = new Float32Array(accretionCount * 3);
  const accretionColors = new Float32Array(accretionCount * 3);
  const accretionAngles = new Float32Array(accretionCount);
  const accretionRadii = new Float32Array(accretionCount);
  const accretionSpeeds = new Float32Array(accretionCount);

  for (let i = 0; i < accretionCount; i++) {
    const radius = 60 + Math.random() * 150;
    const angle = Math.random() * Math.PI * 2;
    accretionRadii[i] = radius;
    accretionAngles[i] = angle;
    accretionSpeeds[i] = (200 / radius) * 0.015; // Keplerian velocity physics!

    accretionPos[i * 3] = Math.cos(angle) * radius;
    accretionPos[i * 3 + 1] = (Math.random() - 0.5) * (12 - (radius * 0.05)); // Flatter near core
    accretionPos[i * 3 + 2] = Math.sin(angle) * radius;

    // Color gradient: Fiery orange core -> Plasma Cyan -> Deep Violet outer rim
    let col;
    if (radius < 90) {
      col = new THREE.Color(0xffaa00);
    } else if (radius < 140) {
      col = new THREE.Color(0xf72585);
    } else if (radius < 180) {
      col = new THREE.Color(0x9d4edd);
    } else {
      col = new THREE.Color(0x00f5d4);
    }

    accretionColors[i * 3] = col.r;
    accretionColors[i * 3 + 1] = col.g;
    accretionColors[i * 3 + 2] = col.b;
  }

  accretionGeo.setAttribute('position', new THREE.BufferAttribute(accretionPos, 3));
  accretionGeo.setAttribute('color', new THREE.BufferAttribute(accretionColors, 3));

  const accretionMat = new THREE.PointsMaterial({
    size: 2.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const accretionDisk = new THREE.Points(accretionGeo, accretionMat);
  accretionDisk.rotation.x = Math.PI * 0.38; // Gravitational tilt angle
  blackHoleGroup.add(accretionDisk);

  // Relativistic Polar Beams (Energy Jets)
  const jetGeo = new THREE.CylinderGeometry(1, 25, 250, 32, 1, true);
  const jetMat = new THREE.MeshBasicMaterial({
    color: 0x00f5d4,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });
  const jetNorth = new THREE.Mesh(jetGeo, jetMat);
  jetNorth.position.y = 125;
  blackHoleGroup.add(jetNorth);

  const jetSouth = new THREE.Mesh(jetGeo, jetMat);
  jetSouth.position.y = -125;
  jetSouth.rotation.z = Math.PI;
  blackHoleGroup.add(jetSouth);

  scene.add(blackHoleGroup);

  // 3. SECONDARY NEBULA & COSMIC ORB
  const cosmicOrbGroup = new THREE.Group();
  cosmicOrbGroup.position.set(-260, -140, -120);

  const orbGeo = new THREE.IcosahedronGeometry(40, 2);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0x9d4edd,
    wireframe: true,
    emissive: 0x4361ee,
    roughness: 0.2
  });
  const cosmicOrb = new THREE.Mesh(orbGeo, orbMat);
  cosmicOrbGroup.add(cosmicOrb);

  scene.add(cosmicOrbGroup);

  // 4. SHOOTING METEORS / COSMIC PARTICLES
  const meteorCount = 15;
  const meteors = [];

  for (let i = 0; i < meteorCount; i++) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array([0, 0, 0, -40, 40, -40]);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.LineBasicMaterial({
      color: (i % 2 === 0) ? 0xffaa00 : 0x00f5d4,
      transparent: true,
      opacity: 0.85
    });
    const line = new THREE.Line(geo, mat);
    line.position.set(
      (Math.random() - 0.5) * 1200,
      Math.random() * 600 + 100,
      (Math.random() - 0.5) * 600
    );
    scene.add(line);
    meteors.push({
      mesh: line,
      speed: Math.random() * 5 + 5
    });
  }

  // Mouse Interactivity & Scroll Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.1;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.1;
  });

  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop (60 FPS Black Hole Physics)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Lerp Camera Movement
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX;
    camera.position.y = -targetY - scrollY * 0.15;
    camera.lookAt(scene.position);

    // Rotate Starfield
    starField.rotation.y = elapsedTime * 0.015;

    // Black Hole Orbit & Accretion Physics
    blackHoleGroup.rotation.y = elapsedTime * 0.25;
    aura1.rotation.z = elapsedTime * 0.5;
    aura2.rotation.z = -elapsedTime * 0.3;

    // Swirl Accretion Disk Particles
    const posAttr = accretionGeo.attributes.position;
    const positions = posAttr.array;

    for (let i = 0; i < accretionCount; i++) {
      accretionAngles[i] += accretionSpeeds[i];
      const angle = accretionAngles[i];
      const r = accretionRadii[i];

      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 2] = Math.sin(angle) * r;
    }
    posAttr.needsUpdate = true;

    // Gravitational Tilt on Mouse Hover
    blackHoleGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15 + (mouseY * 0.002);
    blackHoleGroup.rotation.z = Math.cos(elapsedTime * 0.4) * 0.1 + (mouseX * 0.002);

    // Rotate Secondary Cosmic Orb
    cosmicOrb.rotation.x = elapsedTime * 0.4;
    cosmicOrb.rotation.y = elapsedTime * 0.6;

    // Animate Meteors
    meteors.forEach((m) => {
      m.mesh.position.x -= m.speed;
      m.mesh.position.y -= m.speed;
      if (m.mesh.position.x < -900 || m.mesh.position.y < -600) {
        m.mesh.position.x = Math.random() * 900 + 300;
        m.mesh.position.y = Math.random() * 600 + 200;
      }
    });

    renderer.render(scene, camera);
  }

  animate();
}
