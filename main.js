/* =========================================================
   PROJEKTE — hier pflegst du dein Portfolio.
   Felder:
     title, client, year, category ("design" | "visuals" | "light"),
     size ("full" | "wide" | "half" | ""), role, tools, text,
     image  -> Pfad zu einem Bild, z. B. "img/projekt.jpg" (optional)
     video  -> Pfad zu einem kurzen stummen Loop, z. B. "img/loop.mp4" (optional)
     gallery -> Liste weiterer Bilder für die Detailansicht (optional)
     hue    -> Farbton (0–360) für den Platzhalter, solange kein Bild da ist
   ========================================================= */
const PROJECTS = [
  { title: "Festival Visual Identity", client: "Festival XY", year: 2026, category: "design", size: "wide", hue: 300,
    role: "Art Direction, Corporate Design", tools: "Figma, Illustrator, TouchDesigner",
    text: "Platzhalter: Visuelle Identität für ein elektronisches Musikfestival — vom Logo über Plakate bis zu den Live-Visuals auf der Mainstage." },
  { title: "Club Night — Live Set", client: "Club Leipzig", year: 2026, category: "visuals", size: "", hue: 190,
    role: "VJ, Content Creation", tools: "Resolume, TouchDesigner",
    text: "Platzhalter: Audioreaktives Live-Set über 6 Stunden mit generativen Feedback-Loops und Echtzeit-Mapping." },
  { title: "Lichtshow Open Air", client: "Open Air Z", year: 2025, category: "light", size: "half", hue: 40,
    role: "Lichtjockey, Programmierung", tools: "grandMA3, Capture",
    text: "Platzhalter: Lichtdesign und Live-Operating für eine Open-Air-Bühne mit 80+ Movingheads." },
  { title: "Generative Poster Series", client: "Eigenprojekt", year: 2025, category: "design", size: "half", hue: 340,
    role: "Konzept, Code, Gestaltung", tools: "p5.js, GLSL, InDesign",
    text: "Platzhalter: Serie generativer Plakate, bei der jede Version aus einem Audiotrack berechnet wird." },
  { title: "Stage Mapping", client: "Theater Y", year: 2025, category: "visuals", size: "", hue: 260,
    role: "Projection Mapping", tools: "TouchDesigner, Blender",
    text: "Platzhalter: Projection Mapping auf ein bewegliches Bühnenbild, live mit der Choreografie synchronisiert." },
  { title: "Tour Visuals", client: "Artist ABC", year: 2024, category: "visuals", size: "", hue: 160,
    role: "Content & Show Design", tools: "Notch, After Effects",
    text: "Platzhalter: Show-Content für eine Clubtour — 14 Tracks, je ein eigenes visuelles Kapitel." },
  { title: "Album Artwork", client: "Label 123", year: 2024, category: "design", size: "", hue: 20,
    role: "Artwork, Typografie", tools: "Photoshop, Blender",
    text: "Platzhalter: Cover und Kampagnen-Assets für ein Album-Release inkl. animierter Social-Media-Loops." },
  { title: "Light Installation", client: "Kunstraum", year: 2024, category: "light", size: "full", hue: 220,
    role: "Konzept, Lichtprogrammierung", tools: "DMX, TouchDesigner",
    text: "Platzhalter: Raumgreifende Lichtinstallation, die auf die Bewegung der Besucher reagiert." },
];

const CATEGORY_LABEL = { design: "Design", visuals: "Visuals", light: "Light" };

/* ---------- Hilfsfunktionen ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function placeholderBg(hue, seed = 0) {
  const x1 = 20 + ((hue * 7 + seed * 31) % 60), y1 = 20 + ((hue * 3 + seed * 17) % 60);
  return `radial-gradient(circle at ${x1}% ${y1}%, hsl(${hue} 95% 60%), transparent 55%),
          radial-gradient(circle at ${100 - x1}% ${100 - y1}%, hsl(${(hue + 70) % 360} 90% 55%), transparent 50%),
          linear-gradient(${hue}deg, hsl(${hue} 40% 8%), hsl(${(hue + 40) % 360} 50% 14%))`;
}
function mediaHtml(p, seed = 0, src) {
  src = src || (seed === 0 ? p.image : null);
  if (seed === 0 && p.video) return `<video src="${esc(p.video)}" autoplay muted loop playsinline></video>`;
  if (src) return `<img src="${esc(src)}" alt="${esc(p.title)}" loading="lazy">`;
  return `<div class="ph" style="--ph:${placeholderBg(p.hue ?? 200, seed)}"></div>`;
}

/* ---------- Grid ---------- */
const grid = $("#grid");
grid.innerHTML = PROJECTS.map((p, i) => `
  <button class="card ${p.size || ""} reveal" data-cat="${p.category}" data-i="${i}">
    <div class="thumb">
      ${mediaHtml(p)}
      <span class="tag mono">${CATEGORY_LABEL[p.category]}</span>
    </div>
    <div class="meta">
      <div>
        <h3>${esc(p.title)}</h3>
        <p class="mono muted">${esc(p.client)} — ${p.year}</p>
      </div>
      <span class="arrow" aria-hidden="true">↗</span>
    </div>
  </button>`).join("");

/* Filter */
$$(".filters button").forEach((btn) => btn.addEventListener("click", () => {
  $$(".filters button").forEach((b) => b.classList.toggle("active", b === btn));
  const f = btn.dataset.filter;
  $$(".card").forEach((c) => c.classList.toggle("hidden", f !== "all" && c.dataset.cat !== f));
}));

/* Detailansicht */
const modal = $("#modal");
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const p = PROJECTS[+card.dataset.i];
  const gallery = p.gallery && p.gallery.length ? p.gallery : null;
  const media = gallery
    ? gallery.map((src, k) => `<div>${mediaHtml(p, k + 1, src)}</div>`).join("")
    : [0, 1, 2].map((k) => `<div>${mediaHtml(p, k)}</div>`).join("");
  $("#modalBody").innerHTML = `
    <p class="mono muted">${CATEGORY_LABEL[p.category]} · ${p.year}</p>
    <h3>${esc(p.title)}</h3>
    <div class="info">
      <p>${esc(p.text)}</p>
      <dl class="mono">
        <dt>Kunde</dt><dd>${esc(p.client)}</dd>
        <dt>Rolle</dt><dd>${esc(p.role)}</dd>
        <dt>Tools</dt><dd>${esc(p.tools)}</dd>
      </dl>
    </div>
    <div class="media">${media}</div>`;
  modal.showModal();
});
$(".close", modal).addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

/* ---------- Scroll-Reveal ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: 0.12 });
$$(".section-head, .reel, .about-grid, .contact > *").forEach((el) => el.classList.add("reveal"));
$$(".reveal").forEach((el) => io.observe(el));

$("#year").textContent = new Date().getFullYear();

/* ---------- Cursor ---------- */
const cursor = $(".cursor");
let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
addEventListener("pointermove", (e) => {
  mouse = { x: e.clientX, y: e.clientY };
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
document.addEventListener("pointerover", (e) => {
  cursor.classList.toggle("big", !!e.target.closest("a, button, .card"));
});

/* =========================================================
   LOOKS (Club / Minimal / Experimental)
   ========================================================= */
const MOODS = {
  club:         { mode: 0, bg: [0.027, 0.027, 0.04], c1: [1.0, 0.17, 0.84], c2: [0.17, 0.96, 1.0], theme: "#07070a" },
  minimal:      { mode: 1, bg: [0.933, 0.925, 0.902], c1: [0.07, 0.07, 0.07], c2: [1.0, 0.23, 0.0], theme: "#eeece6" },
  experimental: { mode: 2, bg: [0.02, 0.02, 0.02], c1: [0.91, 1.0, 0.23], c2: [0.42, 0.23, 1.0], theme: "#050505" },
};
let mood = MOODS[document.documentElement.dataset.mood] ? document.documentElement.dataset.mood : "club";
let moodMix = { ...MOODS[mood] }; // weich überblendete Shader-Farben

function setMood(name) {
  if (!MOODS[name]) return;
  mood = name;
  document.documentElement.dataset.mood = name;
  $('meta[name="theme-color"]').setAttribute("content", MOODS[name].theme);
  $$("[data-set-mood]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.setMood === name)));
  try { localStorage.setItem("mood", name); } catch (e) {}
  if (reducedMotion) requestAnimationFrame(() => draw(performance.now()));
}
$$("[data-set-mood]").forEach((b) => b.addEventListener("click", () => setMood(b.dataset.setMood)));
setMood(mood);

/* =========================================================
   AUDIO-REAKTIV (Mikrofon, optional)
   ========================================================= */
let analyser = null, freq = null, level = 0;
const audioBtn = $("#audioBtn");
audioBtn.addEventListener("click", async () => {
  if (analyser) {
    analyser.ctx.close(); analyser.stream.getTracks().forEach((t) => t.stop());
    analyser = null; audioBtn.setAttribute("aria-pressed", "false"); return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const node = ctx.createAnalyser();
    node.fftSize = 256;
    ctx.createMediaStreamSource(stream).connect(node);
    analyser = Object.assign(node, { ctx, stream });
    freq = new Uint8Array(node.frequencyBinCount);
    audioBtn.setAttribute("aria-pressed", "true");
  } catch (err) {
    audioBtn.title = "Mikrofon nicht verfügbar";
  }
});
function readAudio() {
  if (!analyser) { level *= 0.95; return level; }
  analyser.getByteFrequencyData(freq);
  let sum = 0;
  for (let i = 1; i < 24; i++) sum += freq[i]; // Bässe / Low-Mids
  const v = sum / (23 * 255);
  level = v > level ? v : level * 0.9 + v * 0.1; // schneller Attack, langsamer Release
  return level;
}

/* =========================================================
   WEBGL-SHADER HINTERGRUND
   ========================================================= */
const canvas = $("#bg");
const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
const FRAG = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float a; uniform float sc;
uniform vec3 bg; uniform vec3 c1; uniform vec3 c2; uniform float mode;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, amp = 0.5; for (int i = 0; i < 5; i++){ v += amp * noise(p); p = p * 2.03 + vec2(1.7, 9.2); amp *= 0.5; } return v; }

void main(){
  vec2 uv = gl_FragCoord.xy / r;
  vec2 p = (gl_FragCoord.xy - 0.5 * r) / r.y;
  vec2 mm = (m - 0.5 * r) / r.y;
  float tt = t * 0.05;
  vec3 col;

  // Maus wirkt wie eine Linse, die das Feld verzieht
  float md = length(p - mm);
  p += (p - mm) * 0.18 * exp(-md * 3.0);

  if (mode < 0.5) {
    // CLUB: weiche Neon-Nebel per Domain-Warping
    vec2 q = vec2(fbm(p * 1.4 + tt), fbm(p * 1.4 - tt + 5.2));
    vec2 w = vec2(fbm(p * 1.4 + 2.2 * q + vec2(1.7, 9.2) + tt * 1.3), fbm(p * 1.4 + 2.2 * q + vec2(8.3, 2.8) - tt));
    float f = fbm(p * 1.4 + 2.6 * w);
    col = bg;
    col += c1 * smoothstep(0.3, 0.46, f) * (0.7 + a * 1.2);
    col += c2 * smoothstep(0.5, 0.72, w.y) * smoothstep(0.26, 0.4, f) * (0.5 + a);
    col += c1 * 0.08 * exp(-md * 2.5);
    col *= 1.0 - 0.55 * length(uv - 0.5);
  } else if (mode < 1.5) {
    // MINIMAL: topografische Höhenlinien
    float f = fbm(p * 1.1 + vec2(tt * 0.7, -tt * 0.5));
    float k = f * (16.0 + a * 10.0);
    float fw = fwidth(k) * 1.2;
    float lineMask = 1.0 - smoothstep(0.0, fw, abs(fract(k + 0.5) - 0.5));
    float accent = 1.0 - step(0.5, mod(floor(k + 0.5), 8.0));
    col = mix(bg, mix(c1, c2, accent), lineMask * mix(0.16, 0.55, accent));
  } else {
    // EXPERIMENTAL: Pixel-Raster, Posterize, Scanlines
    float cells = 70.0 - a * 40.0;
    vec2 g = floor(p * cells) / cells;
    float f = fbm(g * 2.2 + vec2(tt * 2.0, sin(tt) * 0.5) + fbm(g * 3.0 - tt) * 1.5);
    float steps = floor(f * 6.0) / 6.0;
    col = bg;
    col = mix(col, c2, step(0.42, steps) * 0.55);
    col = mix(col, c1, step(0.58, steps) * (0.85 + a * 0.3));
    col *= 0.85 + 0.15 * step(0.5, fract(gl_FragCoord.y / (3.0 * sc)));
    col *= 1.0 - 0.6 * length(uv - 0.5);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

let prog, uni = {};
function initGL() {
  if (!gl || !gl.getExtension("OES_standard_derivatives")) return false;
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return false;
  prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  ["r", "t", "m", "a", "sc", "bg", "c1", "c2", "mode"].forEach((n) => (uni[n] = gl.getUniformLocation(prog, n)));
  return true;
}

let scale = 1;
function resize() {
  // Halbe Auflösung: sieht durch den weichen Look gleich aus, spart viel GPU
  scale = Math.min(devicePixelRatio || 1, 1.5) * 0.5;
  canvas.width = Math.round(innerWidth * scale);
  canvas.height = Math.round(innerHeight * scale);
  if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
}

const lerp = (x, y, k) => x + (y - x) * k;
const lerp3 = (x, y, k) => x.map((v, i) => lerp(v, y[i], k));
let smoothMouse = { ...mouse };

function draw(now) {
  const target = MOODS[mood];
  const k = reducedMotion ? 1 : 0.06;
  moodMix.bg = lerp3(moodMix.bg, target.bg, k);
  moodMix.c1 = lerp3(moodMix.c1, target.c1, k);
  moodMix.c2 = lerp3(moodMix.c2, target.c2, k);
  smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.05);
  smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.05);

  gl.uniform2f(uni.r, canvas.width, canvas.height);
  gl.uniform1f(uni.t, reducedMotion ? 20 : now / 1000);
  gl.uniform2f(uni.m, smoothMouse.x * scale, canvas.height - smoothMouse.y * scale);
  gl.uniform1f(uni.a, readAudio());
  gl.uniform1f(uni.sc, scale);
  gl.uniform3fv(uni.bg, moodMix.bg);
  gl.uniform3fv(uni.c1, moodMix.c1);
  gl.uniform3fv(uni.c2, moodMix.c2);
  gl.uniform1f(uni.mode, target.mode);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function loop(now) {
  if (!document.hidden) draw(now);
  requestAnimationFrame(loop);
}

if (initGL()) {
  resize();
  addEventListener("resize", resize);
  if (reducedMotion) { draw(0); addEventListener("resize", () => draw(0)); }
  else requestAnimationFrame(loop);
} else {
  document.documentElement.classList.add("no-webgl");
}
