// ─── The wood wide web: canvas engine for the home hero's underground ────────
// Hyphae grow from each speaker's fruiting body to the disciplines and countries
// they actually touch (from src/content). Ants walk only those real links,
// carrying spores; nutrient pulses run along them. Faint dashed hyphae between
// neighbouring nodes are "potential" links nobody has made yet.

import { hyphaPath, measure, pointAt, rng, walker, type Pt } from "@/lib/mycelium";

export type WebNode = { id: string; code: string; label: string; type: "disc" | "ctry"; vacant: boolean };
export type WebSpeaker = { id: string; links: string[] };
export type Focus = { type: "spk"; id: string } | { type: "pair"; a: string; b: string } | null;

type Edge = { a: string; b: string; owner?: string; kind: "spk" | "web" | "leap"; pts: Pt[]; cum: number[]; delay: number; dur: number; born?: number; w?: number; al?: number };
type Stroke = { pts: Pt[]; delay: number; dur: number; a?: number; w?: number };
type Placed = WebNode & { x: number; y: number; p: number };
type Ant = { e: Edge; s: number; dir: 1 | -1; v: number; carry: boolean };
type Pulse = { e: Edge; s: number; v: number; col: string };

export type WebOptions = {
  W: number;
  H: number;
  mobile: boolean;
  reduced: boolean;
  bases: { id: string; x: number }[];
  treeX: number;
  nodes: WebNode[];
  speakers: WebSpeaker[];
  exclude: [number, number, number, number][];
  /** canvas font stack for node labels (Chinese: Noto Serif TC; English: EB Garamond) */
  labelFont?: string;
  /** room kept free right of the rightmost node for its label, on mobile (longer for English names) */
  labelRoomMobile?: number;
};

const HY = "233,223,198";
const SPORE = "#D8B25A";
const GLOW = "#8FD3C1";

function sprite(col: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, col);
  gr.addColorStop(0.25, col + "8c");
  gr.addColorStop(1, col + "00");
  g.fillStyle = gr;
  g.fillRect(0, 0, 32, 32);
  return c;
}

export function createWeb(canvas: HTMLCanvasElement, o: WebOptions) {
  const ctx = canvas.getContext("2d")!;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const { W, H, mobile, reduced } = o;
  const labelFont = o.labelFont ?? '"Noto Serif TC", serif';
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const R = rng(42);
  const glowS = sprite(GLOW);
  const sporeS = sprite(SPORE);

  // ── place nodes: seeded rejection sampling, avoiding the text blocks ──
  const x0 = mobile ? 24 : Math.max(96, (W - 1320) / 2 + 96);
  const x1 = W - (mobile ? (o.labelRoomMobile ?? 84) : Math.max(190, (W - 1320) / 2 + 190)); // clear of the depth gauge
  const y0 = 64;
  const y1 = H - 40;
  let minD = mobile ? 66 : 118;
  const nodes = new Map<string, Placed>();
  const placed: Pt[] = [];
  const blocked = (x: number, y: number) => o.exclude.some(([l, t, r, b]) => x + 80 > l && x - 12 < r && y + 16 > t && y - 16 < b);
  for (const n of o.nodes) {
    let x = 0;
    let y = 0;
    for (let tries = 0; tries < 900; tries++) {
      if (tries && tries % 300 === 0) minD *= 0.85;
      x = x0 + R() * (x1 - x0);
      y = y0 + R() * (y1 - y0);
      if (!blocked(x, y) && placed.every((p) => Math.hypot(p[0] - x, (p[1] - y) * 1.3) > minD)) break;
    }
    placed.push([x, y]);
    nodes.set(n.id, { ...n, x, y, p: 0 });
  }
  for (const b of o.bases) nodes.set("s:" + b.id, { id: "s:" + b.id, code: "", label: "", type: "disc", vacant: false, x: b.x, y: 2, p: 1 });

  // ── real edges: speaker → discipline / country ──
  const edges: Edge[] = [];
  o.speakers.forEach((s, si) => {
    const a = nodes.get("s:" + s.id);
    if (!a) return;
    s.links.forEach((id, j) => {
      const b = nodes.get(id);
      if (!b) return;
      const pts = hyphaPath(a.x, a.y, b.x, b.y, R);
      const main = j === 0;
      edges.push({
        a: a.id,
        b: id,
        owner: s.id,
        kind: "spk",
        pts,
        cum: measure(pts),
        delay: 0.5 + si * 0.18 + j * 0.12,
        dur: 2.2 + R(),
        w: main ? 1.4 + R() * 0.9 : 0.45 + R() * 0.95,
        al: main ? 0.55 + R() * 0.2 : 0.2 + R() * 0.42,
      });
    });
  });
  // ── label prominence: more speakers → clearer; a seeded jitter adds depth of field ──
  for (const n of nodes.values()) {
    if (!n.code) continue;
    const deg = edges.filter((e) => e.b === n.id).length;
    n.p = deg ? Math.min(1, 0.5 + 0.18 * deg + (R() - 0.5) * 0.3) : 0.08 + R() * 0.34;
  }
  // ── potential links between neighbouring nodes (drawn dashed, never walked) ──
  const potential: Edge[] = [];
  const ids = o.nodes.map((n) => n.id);
  const seen = new Set<string>();
  for (const id of ids) {
    const n = nodes.get(id)!;
    ids
      .filter((m) => m !== id)
      .map((m) => [m, Math.hypot(nodes.get(m)!.x - n.x, nodes.get(m)!.y - n.y)] as const)
      .sort((p, q) => p[1] - q[1])
      .slice(0, 2)
      .forEach(([m]) => {
        const key = [id, m].sort().join("|");
        if (seen.has(key)) return;
        seen.add(key);
        const t = nodes.get(m)!;
        const pts = hyphaPath(n.x, n.y, t.x, t.y, R, 7);
        potential.push({ a: id, b: m, kind: "web", pts, cum: measure(pts), delay: 1.8 + R() * 1.2, dur: 1.8 + R(), w: 0.4 + R() * 0.6, al: 0.05 + R() * 0.15 });
      });
  }
  // ── texture: short hyphae branching off real edges, and loose ones in the soil ──
  const decor: Stroke[] = [];
  for (const e of edges) {
    for (let i = 0; i < Math.floor(e.pts.length / 8); i++) {
      const p = e.pts[Math.floor(R() * e.pts.length)];
      decor.push({ pts: walker(p[0], p[1], R() * Math.PI * 2, 10 + R() * 60, R, 3 + R() * 3), delay: e.delay + 0.8 + R() * 1.4, dur: 1.2, a: 0.05 + R() * 0.16, w: 0.3 + R() * 0.5 });
    }
  }
  for (const b of o.bases) {
    for (let i = 0; i < 3; i++) decor.push({ pts: walker(b.x, 2, Math.PI / 2 + (R() - 0.5) * 1.4, 40 + R() * 120, R, 5), delay: 0.4 + R(), dur: 1.6, a: 0.14 + R() * 0.2, w: 0.8 + R() * 0.9 });
  }
  for (let i = 0; i < (mobile ? 14 : 30); i++) decor.push({ pts: walker(R() * W, 10 + R() * (H - 20), R() * Math.PI * 2, 120 + R() * 260, R, 7), delay: 1.5 + R() * 3, dur: 2.4, a: 0.025 + R() * 0.05, w: 0.35 + R() * 0.8 });
  for (let i = 0; i < (mobile ? 40 : 90); i++) decor.push({ pts: walker(R() * W, 10 + R() * (H - 20), R() * Math.PI * 2, 30 + R() * 110, R, 6), delay: 1 + R() * 3, dur: 2, a: 0.04 + R() * 0.06 });
  // ── the volume tree's root system, mirroring its crown ──
  const roots: Stroke[] = [];
  const RR = rng(11);
  const rootMax = mobile ? 5 : 6;
  const root = (x: number, y: number, len: number, ang: number, d: number) => {
    const ex = x + Math.cos(ang) * len;
    const ey = y + Math.sin(ang) * len;
    const k = (RR() - 0.5) * 0.5;
    const mx = (x + ex) / 2 + Math.cos(ang + Math.PI / 2) * len * k;
    const my = (y + ey) / 2 + Math.sin(ang + Math.PI / 2) * len * k;
    const pts: Pt[] = [];
    for (let t = 0; t <= 1.001; t += 0.125) pts.push([(1 - t) * (1 - t) * x + 2 * (1 - t) * t * mx + t * t * ex, (1 - t) * (1 - t) * y + 2 * (1 - t) * t * my + t * t * ey]);
    roots.push({ pts, delay: 0.15 + d * 0.28, dur: 0.5, w: Math.max(0.4, (6 - d) * 0.55) });
    if (d >= rootMax) return;
    const n = RR() < 0.3 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const sp = 0.45 + RR() * 0.5;
      root(ex, ey, len * (0.66 + RR() * 0.14), ang + (n === 2 ? (i ? 1 : -1) * sp : (i - 1) * sp) + (RR() - 0.5) * 0.2, d + 1);
    }
  };
  if (o.treeX > 0) root(o.treeX, 0, Math.min(H * 0.13, 90), Math.PI / 2, 0);

  const growEnd = Math.max(1, ...edges.map((e) => e.delay + e.dur), ...potential.map((e) => e.delay + e.dur), ...decor.map((d) => d.delay + d.dur), ...roots.map((r) => r.delay + r.dur)) + 0.2;

  const ants: Ant[] = [];
  if (edges.length) {
    for (let i = 0; i < (mobile ? 4 : 8); i++) {
      const e = edges[Math.floor(R() * edges.length)];
      ants.push({ e, s: R() * e.cum[e.cum.length - 1], dir: R() < 0.5 ? 1 : -1, v: 13 + R() * 9, carry: R() < 0.5 });
    }
  }
  let pulses: Pulse[] = [];
  const leaps: Edge[] = [];

  let focus: Focus = null;
  const t0 = performance.now() - (reduced ? (growEnd + 1) * 1000 : 0);
  let baked: HTMLCanvasElement | null = null;
  let raf = 0;
  let last = performance.now();
  let visible = true;
  let destroyed = false;

  const prog = (s: { delay: number; dur: number }, t: number) => Math.max(0, Math.min(1, (t - s.delay) / s.dur));
  const ease = (p: number) => 1 - Math.pow(1 - p, 3);
  const partial = (pts: Pt[], p: number) => {
    const n = pts.length;
    if (p <= 0 || n < 2) return;
    const lim = p * (n - 1);
    const k = Math.floor(lim);
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= k && i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (k < n - 1) {
      const tt = lim - k;
      ctx.lineTo(pts[k][0] + (pts[k + 1][0] - pts[k][0]) * tt, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * tt);
    }
  };
  const drawStatic = (c: CanvasRenderingContext2D, t: number) => {
    c.lineCap = "round";
    for (const d of decor) {
      const p = prog(d, t);
      if (!p) continue;
      c.beginPath();
      const n = d.pts.length;
      const k = Math.max(1, Math.floor(ease(p) * (n - 1)));
      c.moveTo(d.pts[0][0], d.pts[0][1]);
      for (let i = 1; i <= k; i++) c.lineTo(d.pts[i][0], d.pts[i][1]);
      c.strokeStyle = `rgba(${HY},${d.a})`;
      c.lineWidth = d.w ?? 0.7;
      c.stroke();
    }
    for (const r of roots) {
      const p = prog(r, t);
      if (!p) continue;
      c.beginPath();
      const n = r.pts.length;
      const k = Math.max(1, Math.floor(ease(p) * (n - 1)));
      c.moveTo(r.pts[0][0], r.pts[0][1]);
      for (let i = 1; i <= k; i++) c.lineTo(r.pts[i][0], r.pts[i][1]);
      c.strokeStyle = "rgba(196,120,78,.6)";
      c.lineWidth = r.w ?? 1;
      c.stroke();
    }
  };

  const related = (e: Edge) => {
    if (!focus) return false;
    if (focus.type === "spk") return e.owner === focus.id;
    return e.kind === "leap" && e.a === focus.a && e.b === focus.b;
  };
  const nodeOn = (id: string) => {
    if (!focus) return false;
    if (focus.type === "spk") {
      const sid = focus.id;
      return o.speakers.find((s) => s.id === sid)?.links.includes(id) ?? false;
    }
    return id === focus.a || id === focus.b;
  };

  const drawAnt = (x: number, y: number, a: number, ph: number, carry: boolean) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.scale(1.15, 1.15);
    ctx.strokeStyle = `rgba(${HY},.85)`;
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    for (let k = -1; k <= 1; k++) {
      const sw = Math.sin(ph + k * 2.1) * 0.45 * (k === 0 ? -1 : 1);
      for (const sd of [-1, 1]) {
        const ang = sd * (Math.PI / 2 + k * 0.55 + sw * sd);
        const kx = k * 0.9;
        const bend = ang + sd * 0.7 * (k > 0 ? -1 : 1);
        ctx.moveTo(kx, 0);
        ctx.lineTo(kx + Math.cos(ang) * 2.2, Math.sin(ang) * 2.2);
        ctx.lineTo(kx + Math.cos(ang) * 2.2 + Math.cos(bend) * 1.6, Math.sin(ang) * 2.2 + Math.sin(bend) * 1.6);
      }
    }
    ctx.moveTo(3.6, -0.6);
    ctx.quadraticCurveTo(5, -2.2, 6.2, -2.4);
    ctx.moveTo(3.6, 0.6);
    ctx.quadraticCurveTo(5, 2.2, 6.2, 2.4);
    ctx.stroke();
    ctx.fillStyle = `rgb(${HY})`;
    for (const [ex, rx, ry] of [[-3.6, 2.3, 1.65], [-1.1, 0.55, 0.45], [0.6, 1.4, 0.8], [2.9, 1.15, 1.05]]) {
      ctx.beginPath();
      ctx.ellipse(ex, 0, rx, ry, 0, 0, 7);
      ctx.fill();
    }
    if (carry) {
      ctx.drawImage(sporeS, 3.5, -4.5, 9, 9);
      ctx.fillStyle = SPORE;
      ctx.beginPath();
      ctx.arc(8, 0, 1.1, 0, 7);
      ctx.fill();
    }
    ctx.restore();
  };

  const frame = (now: number) => {
    raf = 0;
    if (destroyed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (t > growEnd) {
      if (!baked) {
        baked = document.createElement("canvas");
        baked.width = canvas.width;
        baked.height = canvas.height;
        const b = baked.getContext("2d")!;
        b.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawStatic(b, 1e9);
      }
      ctx.drawImage(baked, 0, 0, W, H);
    } else drawStatic(ctx, t);

    ctx.lineCap = "round";
    ctx.setLineDash([2, 5]);
    for (const e of potential) {
      const p = prog(e, t);
      if (!p) continue;
      ctx.beginPath();
      partial(e.pts, ease(p));
      ctx.strokeStyle = `rgba(${HY},${focus ? (e.al ?? 0.16) * 0.4 : e.al ?? 0.16})`;
      ctx.lineWidth = e.w ?? 0.7;
      ctx.stroke();
    }
    ctx.setLineDash([]);
    for (const e of [...edges, ...leaps]) {
      const p = e.kind === "leap" ? Math.max(0, Math.min(1, (t - (e.born ?? 0)) / 1.8)) : prog(e, t);
      if (!p) continue;
      const on = related(e);
      let col = HY;
      let a = e.al ?? 0.46;
      let w = e.w ?? 0.9;
      if (e.kind === "leap") {
        col = "216,178,90";
        a = on ? 0.95 : 0.5;
        w = 1.2;
      } else if (on) {
        col = "216,178,90";
        a = 0.95;
        w = Math.max(1.3, w);
      } else if (focus) a *= 0.3;
      ctx.beginPath();
      partial(e.pts, ease(p));
      ctx.strokeStyle = `rgba(${col},${a})`;
      ctx.lineWidth = w;
      ctx.stroke();
    }

    const appear = Math.max(0, Math.min(1, (t - 1.2) / 1));
    if (appear) {
      for (const n of nodes.values()) {
        if (!n.code) continue;
        const on = nodeOn(n.id);
        // depth of field: clear nodes ≥13px and bright, faint ones small and ghostly (all are in the sr-only list)
        const pr = on ? 1 : n.p;
        const base = appear * (focus && !on ? 0.5 : 1) * (0.3 + 0.7 * pr);
        ctx.globalAlpha = base;
        if (on) ctx.drawImage(sporeS, n.x - 22, n.y - 22, 44, 44);
        ctx.fillStyle = "#15120E";
        ctx.lineWidth = 0.9;
        if (n.type === "ctry") {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y - 5.5);
          ctx.lineTo(n.x + 5.5, n.y);
          ctx.lineTo(n.x, n.y + 5.5);
          ctx.lineTo(n.x - 5.5, n.y);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = on ? SPORE : GLOW;
          ctx.stroke();
        } else {
          if (n.vacant) ctx.setLineDash([2, 2]);
          ctx.beginPath();
          ctx.arc(n.x, n.y, 8, 0, 7);
          ctx.strokeStyle = on ? SPORE : `rgba(${HY},${n.vacant ? 0.3 : 0.45})`;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(n.x, n.y, 3.2, 0, 7);
          ctx.fill();
          ctx.strokeStyle = on ? SPORE : `rgba(${HY},.8)`;
          ctx.stroke();
        }
        const zs = (mobile ? 9.5 : 10) + 6 * pr;
        ctx.font = `500 ${(8.5 + 2.5 * pr).toFixed(1)}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = on ? SPORE : n.type === "ctry" ? GLOW : "#B3AA94";
        ctx.fillText(n.code, n.x + 13, n.y - 3);
        ctx.font = `${pr > 0.75 ? 600 : pr < 0.3 ? 300 : 400} ${zs.toFixed(1)}px ${labelFont}`;
        ctx.fillStyle = on ? "#F3E6C0" : `rgb(${HY})`;
        ctx.fillText(n.label, n.x + 13, n.y + 3 + zs * 0.75);
        ctx.globalAlpha = 1;
      }
    }

    if (!reduced && t > 2 && edges.length) {
      if (Math.random() < dt * 2.2) {
        const pool = focus ? [...edges, ...leaps].filter(related) : edges;
        const src = pool.length ? pool : edges;
        const e = src[Math.floor(Math.random() * src.length)];
        pulses.push({ e, s: 0, v: 60 + Math.random() * 40, col: Math.random() < 0.5 ? SPORE : GLOW });
      }
      pulses = pulses.filter((p) => p.s < p.e.cum[p.e.cum.length - 1]);
      for (const p of pulses) {
        p.s += p.v * dt;
        const [x, y] = pointAt(p.e.pts, p.e.cum, p.s);
        ctx.drawImage(p.col === SPORE ? sporeS : glowS, x - 8, y - 8, 16, 16);
      }
    }

    if (t > growEnd * 0.55) {
      for (const a of ants) {
        if (!reduced) {
          a.s += a.v * a.dir * dt;
          const L = a.e.cum[a.e.cum.length - 1];
          if (a.s > L || a.s < 0) {
            const end = a.s > L ? a.e.b : a.e.a;
            const opts = edges.filter((e) => e.a === end || e.b === end);
            const ne = opts[Math.floor(Math.random() * opts.length)] ?? a.e;
            a.e = ne;
            if (ne.a === end) {
              a.dir = 1;
              a.s = 0;
            } else {
              a.dir = -1;
              a.s = ne.cum[ne.cum.length - 1];
            }
            if (Math.random() < 0.4) a.carry = !a.carry;
          }
        }
        const [x, y, ang] = pointAt(a.e.pts, a.e.cum, a.s);
        drawAnt(x, y, ang + (a.dir < 0 ? Math.PI : 0), a.s * 0.9, a.carry);
      }
    }
    if (!reduced && visible) raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (destroyed) return;
    if (reduced) {
      frame(performance.now());
      return;
    }
    if (!raf && visible) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting && !document.hidden;
    if (visible) kick();
  });
  io.observe(canvas);
  const onVis = () => {
    visible = !document.hidden;
    if (visible) kick();
  };
  document.addEventListener("visibilitychange", onVis);
  kick();

  return {
    setFocus(f: Focus) {
      focus = f;
      kick();
    },
    leap(a: string, b: string, seed: number) {
      const A = nodes.get(a);
      const B = nodes.get(b);
      if (!A || !B) return;
      const pts = hyphaPath(A.x, A.y, B.x, B.y, rng(seed), 6);
      leaps.push({ a, b, kind: "leap", pts, cum: measure(pts), delay: 0, dur: 1.8, born: reduced ? -10 : (performance.now() - t0) / 1000 });
      if (leaps.length > 3) leaps.shift();
      kick();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}

export type Web = ReturnType<typeof createWeb>;
