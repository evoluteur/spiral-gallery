// Spiral Gallery -- the logarithmic, Archimedean, Fermat and Fibonacci
// spirals side by side, with the nautilus, the ram's horn and the galaxy.
//
// Every curve here is a polar curve r(theta), sampled from the middle out and
// then scaled so its outer end lands on the same radius. That last step is
// what makes the pictures comparable: what is left to see is only the way
// each one fills the space on the way out.
//
// Two numbers tell them apart:
//
//   psi  the angle between the curve and the radius line drawn to it
//   G    how much the radius grows over one whole turn
//
// Only the logarithmic spiral holds psi at the same value everywhere (hence
// "equiangular"), and that is exactly why it is the one living things use for
// anything that grows without changing shape: a shell, a horn, the arms of a
// galaxy. The Archimedean and Fermat spirals have a psi that creeps toward
// 90 degrees, so their outer turns flatten into near-circles.
//
// The Fibonacci spiral is not a spiral at all but a chain of quarter circles,
// one per square of Fibonacci side, and the gallery is the quickest way to
// see where it parts company with the golden spiral it stands in for.

const TAU = 2 * Math.PI;
const DEG = 180 / Math.PI;
const PHI = (1 + Math.sqrt(5)) / 2;

const R = 100; // the outer radius every spiral is scaled to
const RAM_G = 2.6; // the growth per turn the horn is drawn at
const GAL_P = 15 / DEG; // a galaxy's pitch angle, in radians

const bOf = (G) => Math.log(G) / TAU; // r = a e^(b theta) grows G per turn
const logR = (G) => (t) => Math.exp(bOf(G) * t);
const logPsi = (G) => () => Math.atan(TAU / Math.log(G)) * DEG;

// ---------------------------------------------------------------- looks

const LOOKS = {
  night: {
    name: "Night",
    bg: "#141b26",
    ink: "#e8e2d0",
    colors: ["#6fb7e0", "#e8c46a", "#8fd18a", "#c49be8", "#f0a35e", "#e07a6f", "#d8b98a", "#7fe0c8"],
  },
  parchment: {
    name: "Parchment",
    bg: "#f1e4c8",
    ink: "#3b2f22",
    colors: ["#2c4f7c", "#9c4a2f", "#2f6b4f", "#6b4a7c", "#b07d2a", "#8c3a3a", "#6a553a", "#2f6b6b"],
  },
  ink: {
    name: "Ink",
    bg: "#fbf7ee",
    ink: "#1b1b1b",
    colors: ["#1f2a37", "#8c2f28", "#2f6b4f", "#6b4a7c", "#8a6a2a", "#7c3a52", "#4a4a4a", "#2f6b6b"],
  },
  cosmos: {
    name: "Cosmos",
    bg: "#06070e",
    ink: "#cfd6e6",
    colors: ["#7fd4ff", "#ffd27a", "#9bf0a8", "#d6a8ff", "#ffb347", "#ff8f7a", "#c9b08a", "#7fffe0"],
  },
};

// ---------------------------------------------------------------- the spirals

const SPIRALS = {
  logarithmic: {
    name: "Logarithmic",
    kind: "math",
    eq: "r = a e<sup>b&theta;</sup>",
    spacing: "Each turn a fixed multiple of the last",
    found: "Anything that grows without changing shape",
    blurb:
      "The <em>spira mirabilis</em>. Descartes arrived at it in 1638 by asking for a curve that cuts every radius at the same angle. Jacob Bernoulli was taken with the fact that it comes back unchanged after growing, and asked for it on his tombstone with <em>eadem mutata resurgo</em> — though changed, I rise again the same. The mason cut an Archimedean spiral instead.",
    growth: (o) => o.growth,
    r: (t, o) => Math.exp(bOf(o.growth) * t),
    psi: (t, o) => Math.atan(TAU / Math.log(o.growth)) * DEG,
  },
  archimedean: {
    name: "Archimedean",
    kind: "math",
    eq: "r = a&theta;",
    spacing: "The same gap, turn after turn",
    found: "A coiled rope, the groove of a record, a rolled carpet",
    blurb:
      "Archimedes' own spiral, from <em>On Spirals</em> around 225 BC: the radius grows at a steady rate, so the gap from one turn to the next never changes. Wind anything of even thickness onto a spool and this is the curve the edge traces. Its angle to the radius starts at nothing and climbs toward 90&deg;, which is why the outer turns look like circles.",
    r: (t) => t,
    psi: (t) => Math.atan(t) * DEG,
  },
  fermat: {
    name: "Fermat",
    kind: "math",
    eq: "r = a&radic;&theta;",
    spacing: "Gaps that shrink, equal area each turn",
    found: "Sunflower and daisy seed heads, in Vogel's model",
    blurb:
      "Fermat's spiral, 1636. The radius grows like the square root of the angle, so every turn sweeps the same area as the one before and the turns crowd together on the way out. Drop a seed at each of the points r = c&radic;n, &theta; = n &times; 137.5&deg; and the two arms of this curve fill a sunflower head with no gap and no crowding.",
    arms: 2,
    r: (t) => Math.sqrt(t),
    psi: (t) => Math.atan(2 * t) * DEG,
  },
  fibonacci: {
    name: "Fibonacci",
    kind: "math",
    eq: "quarter arcs of radius 1, 1, 2, 3, 5, 8, &hellip;",
    spacing: "About &phi;&#8308; per turn, in four jumps",
    found: "Design books, beside the golden spiral it stands in for",
    blurb:
      "Not one curve but a chain of quarter circles, each fitted into a square whose side is the next Fibonacci number. It shadows the golden spiral — consecutive Fibonacci numbers run to &phi; — and yet it is not smooth: the curvature jumps at every square, and the angle to the radius swings a few degrees either side of 72.97&deg; instead of holding still. Turn the squares on to see the scaffolding.",
    data: (turns) => fibData(turns),
    rAt: (u) => (u <= 0 ? 1 : lastRadius(fibData(u))),
  },
  golden: {
    name: "Golden",
    kind: "math",
    eq: "r = a &phi;<sup>2&theta;/&pi;</sup>",
    spacing: "&phi; wider every quarter turn",
    found: "Design books, and the occasional overconfident diagram",
    blurb:
      "A logarithmic spiral tuned so that a quarter turn multiplies the radius by the golden ratio &phi; = 1.618. That makes 6.854 times per turn, which is fast: three turns and the inside is a thousandth of the outside. It is the limit the Fibonacci arcs are reaching for, and it is a good deal looser than anything the three living things in this gallery do.",
    growth: () => PHI ** 4,
    r: logR(PHI ** 4),
    psi: logPsi(PHI ** 4),
  },
  nautilus: {
    name: "Nautilus",
    kind: "nature",
    eq: "r = a e<sup>b&theta;</sup>, about 3.2 per turn",
    spacing: "Whorls that just touch",
    found: "<em>Nautilus pompilius</em>, and ammonites for 300 million years",
    blurb:
      "Each chamber of a nautilus is a scaled copy of the one before it, and a shape that grows that way has no choice but to lay itself out along a logarithmic spiral. Measured shells widen about 3.2 times per turn, which is just enough for each whorl to sit against the last. That is nowhere near the golden spiral's 6.854: the nautilus is logarithmic, not golden. Here it is drawn with its septa and the thread of the siphuncle.",
    maxTurns: 4,
    growth: () => 3.2,
    r: logR(3.2),
    psi: logPsi(3.2),
    art: nautilusArt,
  },
  ram: {
    name: "Ram's horn",
    kind: "nature",
    eq: "r = a e<sup>b&theta;</sup>, drawn at 2.6 per turn",
    spacing: "Two turns and done",
    found: "Rams, ibex and bighorn sheep",
    blurb:
      "A horn is a cone dragged along a logarithmic spiral, which is why the cross-section of a ram's horn is the same curve as a shell's. Two differences: the coil drifts sideways as it goes, so the real thing is a corkscrew rather than a flat spiral, and it stops after about two turns, when the tip comes round by the animal's eye. Drawn here with its growth ridges.",
    maxTurns: 2.4,
    growth: () => RAM_G,
    r: logR(RAM_G),
    psi: logPsi(RAM_G),
    art: ramArt,
  },
  galaxy: {
    name: "Galaxy",
    kind: "nature",
    eq: "r = a e<sup>&theta;&middot;tan p</sup>, p &asymp; 15&deg;",
    spacing: "Half a turn is all you ever see",
    found: "M51, M101, NGC 1232 — and the one we are inside of",
    blurb:
      "A spiral arm is not an object but a pattern, a density wave that stars drift through, and it traces a logarithmic spiral. Astronomers quote it as the pitch angle p, measured against the circle rather than the radius: about 5&deg; for a tightly wound Sa galaxy, some 12&deg; for the Milky Way, up to 25&deg; or 30&deg; for a loose Sc. No galaxy shows much more than half a turn of arm, so the curve has to be read from a short piece of it.",
    maxTurns: 1.3,
    arms: 2,
    growth: () => Math.exp(TAU * Math.tan(GAL_P)),
    r: (t) => Math.exp(Math.tan(GAL_P) * t),
    psi: () => 90 - GAL_P * DEG,
    art: galaxyArt,
  },
};
const KEYS = Object.keys(SPIRALS);

// ---------------------------------------------------------------- options

const opts = {
  view: "gallery",
  turns: 3.5,
  growth: 2.4, // growth per turn of the plain logarithmic spiral
  width: 3,
  look: "night",
  marks: true, // dots and a ruler where each turn crosses the start ray
  angle: false, // the angle between the curve and the radius
  squares: true, // the Fibonacci squares
  nature: true, // draw the shell, the horn and the galaxy, not just their curve
  anim: false,
  show: KEYS.reduce((a, k) => ((a[k] = true), a), {}),
};

const $e = (id) => document.getElementById(id);
const f1 = (v) => Math.round(v * 10) / 10;
const f2 = (v) => Math.round(v * 100) / 100;
const shown = () => KEYS.filter((k) => opts.show[k]);
const colorOf = (key) => LOOKS[opts.look].colors[KEYS.indexOf(key) % 8];
const turnsOf = (key) => Math.min(opts.turns, SPIRALS[key].maxTurns || Infinity);

let uid = 0;
const nextId = () => "sg" + ++uid; // gradients need ids unique in the page

function rng(s) {
  s = s % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------------------------------------------------------------- Fibonacci squares

// Squares of Fibonacci side wound around a growing rectangle -- left, below,
// right, above, and again -- each carrying the quarter circle that joins the
// corner the last arc ended on to the one across the square from it. The
// center of that arc is always a corner of the rectangle the square was
// attached to, so the chain closes up on itself without any fitting.
function fibData(turns) {
  const n = Math.max(2, Math.round(turns * 4));
  const F = [1, 1];
  while (F.length <= n) F.push(F[F.length - 1] + F[F.length - 2]);
  const DIRS = ["left", "below", "right", "above"];
  const rc = { x0: 0, y0: 0, x1: 1, y1: 1 };
  const squares = [{ x: 0, y: 0, s: 1 }];
  const arcs = [];
  let p = [1, 0];
  for (let i = 0; i < n; i++) {
    let c = [0, 0];
    if (i > 0) {
      const s = F[i];
      switch (DIRS[(i - 1) % 4]) {
        case "left":
          c = [rc.x0, rc.y0];
          squares.push({ x: rc.x0 - s, y: rc.y0, s });
          rc.x0 -= s;
          break;
        case "below":
          c = [rc.x1, rc.y0];
          squares.push({ x: rc.x0, y: rc.y0 - s, s });
          rc.y0 -= s;
          break;
        case "right":
          c = [rc.x1, rc.y1];
          squares.push({ x: rc.x1, y: rc.y0, s });
          rc.x1 += s;
          break;
        default:
          c = [rc.x0, rc.y1];
          squares.push({ x: rc.x0, y: rc.y1, s });
          rc.y1 += s;
      }
    }
    arcs.push({ c, s: p, r: F[i] });
    p = [c[0] - (p[1] - c[1]), c[1] + (p[0] - c[0])]; // a quarter turn counter-clockwise
  }
  // sampled, so the arcs go through the same machinery as the smooth curves
  const pts = [];
  for (const a of arcs) {
    const a0 = Math.atan2(a.s[1] - a.c[1], a.s[0] - a.c[0]);
    const m = 24;
    for (let j = pts.length ? 1 : 0; j <= m; j++) {
      const t = a0 + (Math.PI / 2) * (j / m);
      pts.push([a.c[0] + a.r * Math.cos(t), a.c[1] + a.r * Math.sin(t)]);
    }
  }
  return { pts, squares };
}
const lastRadius = (d) => Math.hypot(...d.pts[d.pts.length - 1]);

// ---------------------------------------------------------------- geometry

function geometry(key) {
  const sp = SPIRALS[key];
  const turns = turnsOf(key);
  let pts, squares;
  if (sp.data) {
    ({ pts, squares } = sp.data(turns));
  } else {
    const n = Math.max(160, Math.round(turns * 240));
    pts = [];
    for (let i = 0; i <= n; i++) {
      const t = (turns * TAU * i) / n;
      const r = sp.r(t, opts);
      pts.push([r * Math.cos(t), r * Math.sin(t)]);
    }
  }
  let rmax = 0;
  for (const p of pts) rmax = Math.max(rmax, Math.hypot(...p));
  return { key, sp, turns, pts, squares, rmax, k: R / rmax };
}

// the radius after u turns, in the spiral's own units
const rAt = (key, u) => {
  const sp = SPIRALS[key];
  return sp.rAt ? sp.rAt(u, opts) : sp.r(u * TAU, opts);
};
// where the curve crosses the start ray, as a fraction of the outer radius
function crossings(geo) {
  const out = [];
  for (let i = 0; i <= geo.turns + 1e-9; i++) out.push(rAt(geo.key, i) / geo.rmax);
  return out;
}
// growth over the last whole turn -- constant for the logarithmic family
function growthPerTurn(key) {
  const sp = SPIRALS[key];
  if (sp.growth) return sp.growth(opts);
  const turns = turnsOf(key);
  if (turns <= 1) return null;
  const a = rAt(key, turns - 1);
  return a > 0 ? rAt(key, turns) / a : null;
}
// the angle between the tangent and the radius, read off the samples
function psiAt(pts, i) {
  const [x, y] = pts[i];
  const a = pts[Math.max(0, i - 1)];
  const b = pts[Math.min(pts.length - 1, i + 1)];
  const tx = b[0] - a[0], ty = b[1] - a[1];
  return Math.atan2(Math.abs(x * ty - y * tx), Math.abs(x * tx + y * ty)) * DEG;
}
const indexAtRadius = (geo, r) => {
  for (let i = 0; i < geo.pts.length; i++) if (Math.hypot(...geo.pts[i]) >= r) return i;
  return geo.pts.length - 1;
};
// the figure for the table: one angle for the equiangular ones, a range for
// the Fibonacci arcs, the outer value for the two that keep changing
function psiText(geo) {
  const { sp, pts } = geo;
  if (sp.psi) return `${f1(sp.psi(geo.turns * TAU, opts))}&deg;`;
  let lo = 90, hi = 0;
  for (let i = Math.floor(pts.length * 0.75); i < pts.length - 1; i++) {
    const v = psiAt(pts, i);
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  return `${Math.round(lo)}&deg;&ndash;${Math.round(hi)}&deg;`;
}
const psiOuter = (geo) => (geo.sp.psi ? geo.sp.psi(geo.turns * TAU, opts) : psiAt(geo.pts, geo.pts.length - 2));

// ---------------------------------------------------------------- the frame

// Everything is drawn into a square viewBox with the spiral's center in the
// middle; k turns the spiral's own units into frame units.
function frame(k, pad, fs) {
  const c = R + pad;
  const X = (x) => f1(c + x * k);
  const Y = (y) => f1(c - y * k);
  return {
    k,
    c,
    vb: 2 * c,
    fs,
    sw: 0.6 + opts.width * 0.5,
    X,
    Y,
    P: (x, y) => `${X(x)} ${Y(y)}`,
    Pol: (r, t) => `${X(r * Math.cos(t))} ${Y(r * Math.sin(t))}`,
    Ppx: (x, y) => `${f1(c + x)} ${f1(c - y)}`,
    line: (pts) => "M" + pts.map(([x, y]) => `${X(x)} ${Y(y)}`).join("L"),
  };
}
const rot = (pts, a) => {
  const ca = Math.cos(a), sa = Math.sin(a);
  return pts.map(([x, y]) => [x * ca - y * sa, x * sa + y * ca]);
};
const text = (x, y, s, fill, fs, anchor) =>
  `<text x="${x}" y="${y}" fill="${fill}" font-size="${f1(fs)}" font-family="Overpass,system-ui,sans-serif"` +
  `${anchor ? ` text-anchor="${anchor}"` : ""} dominant-baseline="middle">${s}</text>`;

// ---------------------------------------------------------------- nature

function nautilusArt(geo, F, col) {
  const G = 3.2, b = bOf(G), { k, turns } = geo;
  const n = Math.max(240, Math.round(turns * 260));
  const out = [], inn = [], siph = [];
  for (let i = 0; i <= n; i++) {
    const t = (turns * TAU * i) / n;
    const r = Math.exp(b * t);
    const u = [Math.cos(t), Math.sin(t)];
    out.push([r * u[0], r * u[1]]);
    inn.push([(r / G) * u[0], (r / G) * u[1]]);
    siph.push([0.62 * r * u[0], 0.62 * r * u[1]]);
  }
  // the whorl is the band between the shell wall and the wall of the turn
  // before it, which for touching whorls is the same curve divided by G
  let s =
    `<path d="${F.line(out)}L${[...inn].reverse().map((p) => F.P(...p)).join("L")}Z"` +
    ` fill="${col}" fill-opacity="0.16" stroke="${col}" stroke-width="${f1(F.sw * 0.8)}" stroke-linejoin="round"/>`;
  let sep = "";
  for (let t = turns * TAU; t > 0.01; t -= TAU / 10) {
    const r = Math.exp(b * t), ri = r / G;
    if ((r - ri) * k < 2.4) break;
    sep += `M${F.Pol(ri, t)}Q${F.Pol((r + ri) * 0.53, t - 0.17)} ${F.Pol(r, t)}`;
  }
  s += `<path d="${sep}" fill="none" stroke="${col}" stroke-width="${f1(F.sw * 0.45)}" opacity="0.65"/>`;
  s += `<path d="${F.line(siph)}" fill="none" stroke="${col}" stroke-width="${f1(F.sw * 0.4)}" stroke-dasharray="2 3" opacity="0.6"/>`;
  const e = turns * TAU;
  s += `<path d="M${F.Pol(Math.exp(b * e) / G, e)}L${F.Pol(Math.exp(b * e), e)}" stroke="${col}" stroke-width="${f1(F.sw * 0.9)}" opacity="0.9"/>`;
  return s;
}

function ramArt(geo, F, col) {
  const b = bOf(RAM_G), w = 0.27, { k, turns } = geo;
  const n = Math.max(200, Math.round(turns * 260));
  const out = [], inn = [];
  for (let i = 0; i <= n; i++) {
    const t = (turns * TAU * i) / n;
    const r = Math.exp(b * t), u = [Math.cos(t), Math.sin(t)];
    out.push([r * (1 + w) * u[0], r * (1 + w) * u[1]]);
    inn.push([r * (1 - w) * u[0], r * (1 - w) * u[1]]);
  }
  // a cone pulled along the spiral: the tube's width keeps step with r, so
  // the horn tapers to nothing at the tip all by itself
  let s =
    `<path d="${F.line(out)}L${[...inn].reverse().map((p) => F.P(...p)).join("L")}Z"` +
    ` fill="${col}" fill-opacity="0.16" stroke="${col}" stroke-width="${f1(F.sw * 0.8)}" stroke-linejoin="round"/>`;
  let ridges = "";
  for (let t = turns * TAU; t > 0.01; t -= TAU / 18) {
    const r = Math.exp(b * t);
    if (2 * w * r * k < 3) break;
    ridges += `M${F.Pol(r * (1 - w), t)}Q${F.Pol(r, t - 0.07)} ${F.Pol(r * (1 + w), t)}`;
  }
  s += `<path d="${ridges}" fill="none" stroke="${col}" stroke-width="${f1(F.sw * 0.4)}" opacity="0.5"/>`;
  return s;
}

function galaxyArt(geo, F, col) {
  const b = Math.tan(GAL_P), w = 0.14, { turns } = geo;
  const n = 200;
  const bulge = nextId(), disc = nextId();
  let s = `<defs><radialGradient id="${bulge}">`;
  s += `<stop offset="0" stop-color="${col}" stop-opacity="0.95"/>`;
  s += `<stop offset="0.4" stop-color="${col}" stop-opacity="0.3"/>`;
  s += `<stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient>`;
  s += `<radialGradient id="${disc}">`;
  s += `<stop offset="0" stop-color="${col}" stop-opacity="0.14"/>`;
  s += `<stop offset="0.7" stop-color="${col}" stop-opacity="0.07"/>`;
  s += `<stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs>`;
  s += `<circle cx="${F.c}" cy="${F.c}" r="${f1(R * 1.1)}" fill="url(#${disc})"/>`;
  for (let j = 0; j < 2; j++) {
    const out = [], inn = [];
    for (let i = 0; i <= n; i++) {
      const t = (turns * TAU * i) / n, a = t + j * Math.PI;
      // the band thins away to nothing at the tip, the way an arm frays out
      const wi = w * (1 - (i / n) ** 5);
      const r = Math.exp(b * t), u = [Math.cos(a), Math.sin(a)];
      out.push([r * (1 + wi) * u[0], r * (1 + wi) * u[1]]);
      inn.push([r * (1 - wi) * u[0], r * (1 - wi) * u[1]]);
    }
    s += `<path d="${F.line(out)}L${[...inn].reverse().map((p) => F.P(...p)).join("L")}Z" fill="${col}" fill-opacity="0.2"/>`;
  }
  // stars, scattered along the arms with a little spread either side
  const rand = rng(20260407);
  let dots = "";
  for (let i = 0; i < 130; i++) {
    const t = turns * TAU * (0.1 + 0.9 * rand());
    const a = t + (i % 2) * Math.PI + (rand() - rand()) * 0.22;
    const r = Math.exp(b * t) * (1 + (rand() - rand()) * 0.12);
    dots += `<circle cx="${F.X(r * Math.cos(a))}" cy="${F.Y(r * Math.sin(a))}" r="${f1(0.5 + rand() * 1.3)}"/>`;
  }
  s += `<g fill="${col}" opacity="0.8">${dots}</g>`;
  s += `<circle cx="${F.c}" cy="${F.c}" r="${f1(R * 0.34)}" fill="url(#${bulge})"/>`;
  return s;
}

// ---------------------------------------------------------------- drawing one spiral

function fibSquares(geo, F, L) {
  return (
    `<g fill="none" stroke="${L.ink}" stroke-width="${f1(F.sw * 0.4)}" opacity="0.3">` +
    geo.squares
      .map((q) => `<rect x="${F.X(q.x)}" y="${F.Y(q.y + q.s)}" width="${f1(q.s * geo.k)}" height="${f1(q.s * geo.k)}"/>`)
      .join("") +
    "</g>"
  );
}

// dots where the curve crosses the ray it started on
function marksArt(geo, F, L, col) {
  let s = `<path d="M${F.Ppx(0, 0)}L${F.Ppx(R, 0)}" stroke="${L.ink}" stroke-width="${f1(F.sw * 0.35)}" stroke-dasharray="3 4" opacity="0.4"/>`;
  s += crossings(geo)
    .map((f) => `<circle cx="${f1(F.c + f * R)}" cy="${F.c}" r="${f1(F.sw * 0.9)}" fill="${col}"/>`)
    .join("");
  return s;
}

// the radius line, the tangent, and the angle between them, at three radii
function angleArt(geo, F, L) {
  const ARC = 15, LEN = 0.17 * R;
  let s = "";
  for (const f of [0.32, 0.62, 0.92]) {
    const i = indexAtRadius(geo, f * geo.rmax);
    const [x, y] = geo.pts[i];
    const a = geo.pts[Math.max(0, i - 1)], b = geo.pts[Math.min(geo.pts.length - 1, i + 1)];
    const tl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const t = [(b[0] - a[0]) / tl, (b[1] - a[1]) / tl];
    const rl = Math.hypot(x, y) || 1;
    const u = [x / rl, y / rl]; // outward along the radius
    const px = [x * geo.k, y * geo.k];
    s += `<path d="M${F.Ppx(0, 0)}L${F.Ppx(px[0], px[1])}" stroke="${L.ink}" stroke-width="${f1(F.sw * 0.35)}" stroke-dasharray="2 3" opacity="0.55"/>`;
    s += `<path d="M${F.Ppx(px[0] - t[0] * LEN, px[1] - t[1] * LEN)}L${F.Ppx(px[0] + t[0] * LEN, px[1] + t[1] * LEN)}" stroke="${L.ink}" stroke-width="${f1(F.sw * 0.45)}" opacity="0.8"/>`;
    // the wedge, swept from the radius round to the tangent
    const a0 = Math.atan2(u[1], u[0]);
    let d = Math.atan2(t[1], t[0]) - a0;
    while (d > Math.PI) d -= TAU;
    while (d < -Math.PI) d += TAU;
    const w = [];
    for (let j = 0; j <= 12; j++) {
      const an = a0 + (d * j) / 12;
      w.push(F.Ppx(px[0] + ARC * Math.cos(an), px[1] + ARC * Math.sin(an)));
    }
    s += `<path d="M${w.join("L")}" fill="none" stroke="${L.ink}" stroke-width="${f1(F.sw * 0.35)}" opacity="0.8"/>`;
    // the label sits outside the wedge, slid back in if that runs off the frame
    const am = a0 + d / 2;
    const anchor = Math.cos(am) < 0 ? "end" : "start";
    const lw = 2.2 * F.fs, m = 4; // enough room for "88°"
    let lx = F.c + px[0] + 22 * Math.cos(am);
    lx = anchor === "end" ? Math.max(lx, m + lw) : Math.min(lx, F.vb - m - lw);
    const ly = Math.min(F.vb - m - F.fs, Math.max(m + F.fs, F.c - px[1] - 22 * Math.sin(am)));
    s += text(f1(lx), f1(ly), `${Math.round(psiAt(geo.pts, i))}&deg;`, L.ink, F.fs, anchor);
  }
  return s;
}

function spiralArt(geo, F) {
  const sp = geo.sp, L = LOOKS[opts.look], col = colorOf(geo.key);
  const drawn = opts.nature && sp.art;
  let s = "";
  if (geo.squares && opts.squares) s += fibSquares(geo, F, L);
  if (drawn) s += `<g class="art">${sp.art(geo, F, col, L)}</g>`;
  const sw = F.sw * (drawn ? 0.5 : 1);
  for (let j = 0; j < (sp.arms || 1); j++)
    s +=
      `<path class="curve" pathLength="1" d="${F.line(rot(geo.pts, (j * TAU) / (sp.arms || 1)))}"` +
      ` fill="none" stroke="${col}" stroke-width="${f1(sw)}" stroke-linecap="round" stroke-linejoin="round"${drawn ? ' opacity="0.6"' : ""}/>`;
  if (opts.marks) s += marksArt(geo, F, L, col);
  if (opts.angle) s += angleArt(geo, F, L);
  return s;
}

// on the page the drawing scales to its box; an export needs a real size
const svgTag = (vb, inner, onPage) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vb} ${vb}"` +
  (onPage ? ' class="plain"' : ` width="${vb}" height="${vb}"`) +
  `>${inner}</svg>`;

// ---------------------------------------------------------------- the gallery

// a strip under the drawing, on the same horizontal scale, ticked where each
// turn crosses the ray: even ticks, bunching ticks or spreading ticks is the
// whole difference between these curves in one line
function rulerStrip(geo, F, col, L) {
  const h = 18, y = 11;
  let s = `<line x1="${F.c}" y1="${y}" x2="${f1(F.c + R)}" y2="${y}" stroke="${L.ink}" stroke-width="1" opacity="0.35"/>`;
  s += crossings(geo)
    .map((f) => {
      const x = f1(F.c + f * R);
      return `<line x1="${x}" y1="${y - 5}" x2="${x}" y2="${y + 5}" stroke="${col}" stroke-width="${f1(F.sw * 0.7)}" stroke-linecap="round"/>`;
    })
    .join("");
  return `<svg class="ruler" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${F.vb} ${h}">${s}</svg>`;
}

function card(key) {
  const sp = SPIRALS[key], L = LOOKS[opts.look];
  const geo = geometry(key);
  const F = frame(geo.k, 26, 11);
  const g = growthPerTurn(key);
  const num = (k, v) => `<div><span class="k">${k}</span><span class="v">${v}</span></div>`;
  return (
    `<div class="card${sp.kind === "nature" ? " nature" : ""}">` +
    `<div class="card-head"><h3>${sp.name}</h3><div class="eq">${sp.eq}</div></div>` +
    `<div class="canvas-box" style="background-color:${L.bg}">${svgTag(F.vb, spiralArt(geo, F), true)}</div>` +
    (opts.marks ? `${rulerStrip(geo, F, colorOf(key), L)}<p class="rulecap">each turn, crossing the ray</p>` : "") +
    `<div class="nums">` +
    num("Growth / turn", g ? `&times;${f2(g)}` : "&ndash;") +
    num("Angle to radius", psiText(geo)) +
    num("Pitch", `${f1(90 - psiOuter(geo))}&deg;`) +
    num("Turns drawn", f1(geo.turns)) +
    `</div>` +
    `<p class="note">${sp.blurb}</p>` +
    `<p class="found"><span>Seen in</span> ${sp.found}</p>` +
    `</div>`
  );
}

// ---------------------------------------------------------------- the overlay

function overlaySvg(onPage) {
  const L = LOOKS[opts.look], PAD = 56;
  const F = frame(1, PAD, 9);
  let s = `<rect width="${F.vb}" height="${F.vb}" fill="${L.bg}"/>`;
  s += `<circle cx="${F.c}" cy="${F.c}" r="${R}" fill="none" stroke="${L.ink}" stroke-width="0.6" stroke-dasharray="2 4" opacity="0.4"/>`;
  s += `<path d="M${F.Ppx(0, 0)}L${F.Ppx(R + 12, 0)}" stroke="${L.ink}" stroke-width="0.6" stroke-dasharray="3 4" opacity="0.4"/>`;
  let legend = "";
  shown().forEach((key, i) => {
    const sp = SPIRALS[key], col = colorOf(key);
    const geo = geometry(key);
    const Fk = frame(geo.k, PAD, 9);
    const dash = sp.kind === "nature" ? ' stroke-dasharray="5 3"' : "";
    for (let j = 0; j < (sp.arms || 1); j++)
      s +=
        `<path class="curve" pathLength="1" d="${Fk.line(rot(geo.pts, (j * TAU) / (sp.arms || 1)))}"` +
        ` fill="none" stroke="${col}" stroke-width="${sp.kind === "nature" ? 1.4 : 1.8}" stroke-linecap="round"${dash}/>`;
    // the curves nearly all end on the same ray, so they are named in a
    // corner instead of where they come out
    const y = 14 + i * 12;
    legend += `<path d="M6 ${y}L20 ${y}" stroke="${col}" stroke-width="1.8" stroke-linecap="round"${dash}/>`;
    legend += text(24, y, sp.name, col, 9, "start");
  });
  return svgTag(F.vb, s + legend, onPage);
}

// one ruler per curve, stacked: the spacing laws read straight off
function rulerRows() {
  const L = LOOKS[opts.look];
  const W = 240, x0 = 4, x1 = W - 4;
  return shown()
    .map((key) => {
      const col = colorOf(key);
      const geo = geometry(key);
      const ticks = crossings(geo)
        .map((f) => {
          const x = f1(x0 + f * (x1 - x0));
          return `<line x1="${x}" y1="2" x2="${x}" y2="14" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;
        })
        .join("");
      return (
        `<div class="rrow"><span class="rname" style="color:${col}">${SPIRALS[key].name}</span>` +
        `<svg class="rbar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 16">` +
        `<line x1="${x0}" y1="8" x2="${x1}" y2="8" stroke="${L.ink}" stroke-width="1" opacity="0.3"/>${ticks}</svg></div>`
      );
    })
    .join("");
}

// ---------------------------------------------------------------- the table

function tableHtml() {
  const row = (key) => {
    const sp = SPIRALS[key], geo = geometry(key), g = growthPerTurn(key);
    return (
      `<tr><th style="color:${colorOf(key)}">${sp.name}</th>` +
      `<td class="eqc">${sp.eq}</td>` +
      `<td>${sp.spacing}</td>` +
      `<td class="n">${g ? `&times;${f2(g)}` : "&ndash;"}</td>` +
      `<td class="n">${psiText(geo)}</td>` +
      `<td class="n">${f1(90 - psiOuter(geo))}&deg;</td>` +
      `<td>${sp.found}</td></tr>`
    );
  };
  return (
    `<table class="omg-table"><thead><tr><th>Spiral</th><th>Polar equation</th><th>Spacing of the turns</th>` +
    `<th class="n">Growth / turn</th><th class="n">Angle to radius</th><th class="n">Pitch</th><th>Seen in</th></tr></thead>` +
    `<tbody>${shown().map(row).join("")}</tbody></table>`
  );
}

// ---------------------------------------------------------------- export

// the gallery as one sheet: the drawings in a grid, each with its name
function sheetSvg() {
  const L = LOOKS[opts.look];
  if (opts.view === "overlay") return overlaySvg(false);
  const keys = shown();
  const F0 = frame(1, 26, 11);
  const cols = Math.min(4, Math.max(1, keys.length));
  const rows = Math.ceil(keys.length / cols);
  const gap = 14, lab = 26, top = 54;
  const tw = F0.vb + gap, th = F0.vb + lab + gap;
  const W = cols * tw + gap, H = top + rows * th + gap;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
  s += `<rect width="${W}" height="${H}" fill="${L.bg}"/>`;
  s += text(gap + 4, 30, "Spiral Gallery", L.ink, 24, "start");
  keys.forEach((key, i) => {
    const x = gap + (i % cols) * tw, y = top + Math.floor(i / cols) * th;
    const geo = geometry(key);
    const Fk = frame(geo.k, 26, 11);
    s += `<g transform="translate(${x} ${y})">${spiralArt(geo, Fk)}`;
    s += text(Fk.c, Fk.vb + 12, SPIRALS[key].name, colorOf(key), 13, "middle");
    s += "</g>";
  });
  return s + "</svg>";
}

function download(name, href) {
  const a = document.createElement("a");
  a.download = name;
  a.href = href;
  a.click();
}
function saveSvg() {
  download("spiral-gallery.svg", URL.createObjectURL(new Blob([sheetSvg()], { type: "image/svg+xml" })));
}
function savePng() {
  const svg = sheetSvg();
  const img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas");
    const scale = 2000 / Math.max(img.width, img.height);
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    download("spiral-gallery.png", c.toDataURL("image/png"));
  };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// ---------------------------------------------------------------- render

function render() {
  const gallery = opts.view === "gallery";
  $e("gallery").hidden = !gallery;
  $e("overlay").hidden = gallery;
  if (gallery) {
    $e("gallery").innerHTML = shown().map(card).join("");
  } else {
    $e("overlay-art").innerHTML = overlaySvg(true);
    $e("overlay-art").style.backgroundColor = LOOKS[opts.look].bg;
    $e("rulers").innerHTML = rulerRows();
  }
  $e("table").innerHTML = tableHtml();
  $e("picks").innerHTML = KEYS.map(
    (k) =>
      `<button type="button" data-k="${k}" aria-pressed="${!!opts.show[k]}">` +
      `<span class="dot" style="background:${colorOf(k)}"></span>${SPIRALS[k].name}</button>`,
  ).join("");
  $e("app").classList.toggle("anim", opts.anim);
  $e("squares-opt").hidden = !opts.show.fibonacci;
  $e("nature-opt").hidden = !shown().some((k) => SPIRALS[k].art);
}

// ---------------------------------------------------------------- the state in the address

function writeUrl() {
  const q = [
    `view=${opts.view}`,
    `turns=${opts.turns}`,
    `growth=${opts.growth}`,
    `look=${opts.look}`,
    `show=${KEYS.map((k) => (opts.show[k] ? 1 : 0)).join("")}`,
  ];
  history.replaceState(null, "", "#" + q.join("&"));
}
function readUrl() {
  const q = new URLSearchParams(location.hash.slice(1));
  if (!q.get("show")) return;
  if (q.get("view") === "overlay") opts.view = "overlay";
  const t = parseFloat(q.get("turns")), g = parseFloat(q.get("growth"));
  if (t >= 1 && t <= 8) opts.turns = t;
  if (g >= 1.1 && g <= 8) opts.growth = g;
  if (LOOKS[q.get("look")]) opts.look = q.get("look");
  const sh = q.get("show");
  if (sh.length === KEYS.length) KEYS.forEach((k, i) => (opts.show[k] = sh[i] === "1"));
  if (!shown().length) opts.show[KEYS[0]] = true;
}

const LS = "spiral-gallery";
function saveSettings() {
  try {
    const { view, turns, growth, width, look, marks, angle, squares, nature, anim, show } = opts;
    localStorage.setItem(LS, JSON.stringify({ view, turns, growth, width, look, marks, angle, squares, nature, anim, show }));
  } catch (e) {}
}
function loadSettings() {
  const def = { ...opts.show }; // so a spiral added later still starts shown
  try {
    const saved = JSON.parse(localStorage.getItem(LS));
    if (saved) Object.assign(opts, saved, { show: { ...def, ...saved.show } });
  } catch (e) {}
  if (!LOOKS[opts.look]) opts.look = "night";
  if (opts.view !== "overlay") opts.view = "gallery";
  if (!shown().length) opts.show[KEYS[0]] = true;
}
function update() {
  render();
  writeUrl();
  saveSettings();
}

// ---------------------------------------------------------------- controls

function chips(id, items, key, onPick) {
  const el = $e(id);
  el.innerHTML = Object.entries(items)
    .map(([k, v]) => `<button type="button" data-k="${k}"${key ? ` aria-pressed="${opts[key] === k}"` : ""}>${v.name}</button>`)
    .join("");
  el.onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (key) {
      opts[key] = b.dataset.k;
      el.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    }
    onPick(b.dataset.k);
  };
}
function rangeCtl(id, key, fmt) {
  const el = $e(id);
  el.value = opts[key];
  const show = () => ($e(id + "-val").innerHTML = fmt(opts[key]));
  show();
  el.addEventListener("input", () => {
    opts[key] = +el.value;
    show();
    update();
  });
}
function checkCtl(id, key) {
  $e(id).checked = opts[key];
  $e(id).addEventListener("change", (e) => {
    opts[key] = e.target.checked;
    update();
  });
}

function initSpirals() {
  loadSettings();
  readUrl();
  chips("view-chips", { gallery: { name: "Gallery" }, overlay: { name: "Overlay" } }, "view", update);
  chips("look-chips", LOOKS, "look", update);
  $e("picks").onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    opts.show[b.dataset.k] = !opts.show[b.dataset.k];
    if (!shown().length) opts.show[b.dataset.k] = true;
    update();
  };
  rangeCtl("turns", "turns", (v) => `${v} turns`);
  rangeCtl("growth", "growth", (v) => `&times;${f1(v)} per turn`);
  rangeCtl("width", "width", (v) => `${v}`);
  checkCtl("o-marks", "marks");
  checkCtl("o-angle", "angle");
  checkCtl("o-squares", "squares");
  checkCtl("o-nature", "nature");
  checkCtl("o-anim", "anim");
  $e("all").addEventListener("click", () => {
    KEYS.forEach((k) => (opts.show[k] = true));
    update();
  });
  $e("math-only").addEventListener("click", () => {
    KEYS.forEach((k) => (opts.show[k] = SPIRALS[k].kind === "math"));
    update();
  });
  $e("nature-only").addEventListener("click", () => {
    KEYS.forEach((k) => (opts.show[k] = SPIRALS[k].kind === "nature"));
    update();
  });
  $e("export-png").addEventListener("click", savePng);
  $e("export-svg").addEventListener("click", saveSvg);
  update();
}
