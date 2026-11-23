/**
 * Golnar: the carpet generator.
 * Builds a city carpet as a grid of knots, paints it to a <canvas>,
 * and adds a loupe that magnifies the knots under the pointer.
 */

/** Which part of the carpet a knot belongs to (used by the carpet guide). */
const REGION = {
  GUARD: 1,
  INNER_GUARD: 2,
  BORDER: 3,
  FIELD: 4,
  MEDALLION: 5,
  CORNER: 6,
  FRINGE: 7,
};

/** Deterministic integer hash, so the same carpet id always draws the same carpet. */
function hash(a, b, seed) {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(seed | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

/**
 * Lay out every knot of a W × H carpet.
 * @returns {{ color: Uint8Array, region: Uint8Array }} palette index and region per knot
 */
function generatePattern(W, H, seed, geometric) {
  const color = new Uint8Array(W * H);
  const region = new Uint8Array(W * H);

  const borderWidth = Math.max(5, Math.round(W * 0.11));
  const cx = (W - 1) / 2;
  const cy = (H - 1) / 2;
  const inset = 10 + borderWidth;
  const halfW = cx - inset;
  const halfH = cy - inset;
  const rosettePitch = Math.max(6, Math.round(borderWidth * 1.7));
  const latticePitch = Math.max(6, Math.round(W / 11));
  const borderMid = (borderWidth - 1) / 2;
  const TAU = Math.PI * 2;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const edge = Math.min(x, y, W - 1 - x, H - 1 - y); // distance to the nearest edge
      let c = 0;
      let r = REGION.FIELD;

      if (edge === 0 || edge === 4) {
        // outline around the outer guard stripe
        c = 3;
        r = REGION.GUARD;
      } else if (edge === 5 + borderWidth || edge === 9 + borderWidth) {
        // outline around the inner guard stripe
        c = 3;
        r = REGION.INNER_GUARD;
      } else if (edge <= 3) {
        // outer guard: a small barber-pole stripe
        c = (x + y) % 4 < 2 ? 6 : 7;
        r = REGION.GUARD;
      } else if (edge < 5 + borderWidth) {
        // main border: rosettes joined by a vine
        r = REGION.BORDER;
        const depth = edge - 5;
        const horizontal = Math.min(y, H - 1 - y) <= Math.min(x, W - 1 - x);
        const along = Math.abs(horizontal ? x - cx : y - cy);
        const phase = ((along + rosettePitch / 2) % rosettePitch) - rosettePitch / 2;
        const rosette = Math.hypot(phase, depth - borderMid);
        c = 5;
        if (rosette < borderWidth * 0.44) {
          c =
            rosette < borderWidth * 0.14
              ? 4
              : rosette < borderWidth * 0.27
                ? 7
                : rosette < borderWidth * 0.38
                  ? 6
                  : 3;
        } else {
          const vine = borderMid + borderWidth * 0.32 * Math.cos((TAU * phase) / rosettePitch);
          if (Math.abs(depth - vine) < 0.7) c = 4;
          else if (
            Math.abs(Math.abs(phase) - rosettePitch * 0.36) < 0.9 &&
            (depth < 1.2 || depth > borderWidth - 2.2)
          )
            c = 8;
        }
      } else if (edge <= 8 + borderWidth) {
        // inner guard: checkerboard
        r = REGION.INNER_GUARD;
        const sx = Math.floor(Math.abs(x - cx));
        const sy = Math.floor(Math.abs(y - cy));
        c = (sx + sy) % 4 < 2 ? 4 : 7;
      } else {
        // field, medallion, pendants and corners
        const fx = x - cx;
        const fy = y - cy;
        const u = Math.abs(fx) / halfW;
        const v = Math.abs(fy) / halfH;
        const mx = fx / (halfW * 0.56);
        const my = fy / (halfH * 0.4);
        const angle = Math.atan2(my, mx);

        let medallion;
        if (geometric) {
          const ax = Math.abs(mx);
          const ay = Math.abs(my);
          medallion =
            ((ax + ay) * 0.8 + Math.max(ax, ay) * 0.25) / (1 + 0.07 * (Math.floor((ax + ay) * 6) % 2));
        } else {
          medallion = Math.hypot(mx, my) / (1 + 0.09 * Math.cos(8 * angle) + 0.035 * Math.cos(16 * angle));
        }
        const pendant = Math.hypot(mx / 0.42, (Math.abs(my) - 1.2) / 0.2);

        if (medallion < 1) {
          r = REGION.MEDALLION;
          if (medallion > 0.93) c = 3;
          else if (medallion > 0.56) {
            c = 1;
            const petal = Math.cos(12 * angle);
            if (medallion > 0.64 && medallion < 0.86 && petal > 0.55) c = 7;
            else if (medallion > 0.7 && medallion < 0.8 && petal < -0.85) c = 4;
          } else if (medallion > 0.5) c = 3;
          else {
            c = 2;
            if (medallion < 0.12) c = 4;
            else if (medallion < 0.2) c = 1;
            else if (medallion < 0.42 && Math.cos(6 * angle) > 1 - (0.42 - medallion) * 7) c = 1;
            else if (medallion > 0.44 && medallion < 0.47) c = 4;
          }
        } else if (pendant < 1) {
          r = REGION.MEDALLION;
          c = pendant > 0.8 ? 3 : pendant < 0.4 ? 4 : 1;
        } else {
          const cu = 1 - u;
          const cv = 1 - v;
          const cornerAngle = Math.atan2(cv, cu);
          const corner = Math.hypot(cu / 0.42, cv / 0.3) / (1 + 0.08 * Math.cos(8 * cornerAngle));
          if (corner < 1) {
            r = REGION.CORNER;
            c = corner > 0.9 ? 3 : corner > 0.5 ? 2 : corner > 0.42 ? 4 : 1;
          } else {
            // open field with a scattered lattice of small motifs
            r = REGION.FIELD;
            c = 0;
            if (medallion > 1.13 && corner > 1.1) {
              const ax = Math.abs(fx);
              const ay = Math.abs(fy);
              const lx = ax % latticePitch;
              const ly = ay % latticePitch;
              const dist = Math.abs(lx - latticePitch / 2) + Math.abs(ly - latticePitch / 2);
              const h = hash(Math.floor(ax / latticePitch), Math.floor(ay / latticePitch), seed);
              if (dist < 1.1) c = [4, 7, 8][h % 3];
              else if (dist < 2.1 && (h >> 3) % 2) c = 9;
              else if (Math.abs(dist - latticePitch / 2) < 0.5) c = 9;
            }
          }
        }
      }

      color[i] = c;
      region[i] = r;
    }
  }
  return { color, region };
}

/** A tiny tile that shades each knot like a tuft of wool; cached per size. */
const knotTextures = new Map();
function knotTexture(size) {
  if (knotTextures.has(size)) return knotTextures.get(size);
  const tile = document.createElement('canvas');
  tile.width = tile.height = size;
  const ctx = tile.getContext('2d');
  const shade = ctx.createLinearGradient(0, 0, 0, size);
  shade.addColorStop(0, 'rgba(255,255,255,0.11)');
  shade.addColorStop(0.5, 'rgba(255,255,255,0)');
  shade.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(0,0,0,0.10)';
  ctx.fillRect(size - 1, 0, 1, size);
  knotTextures.set(size, tile);
  return tile;
}

/** Make a pattern without drawing it (the raj calculator samples its colours). */
function createPattern(rug, knotsWide) {
  const W = knotsWide;
  const H = Math.round((W * rug.length) / rug.width);
  const palette = PALETTES[rug.palette];
  const { color, region } = generatePattern(W, H, parseInt(rug.id, 10) || 7, Boolean(palette.geometric));
  return { W, H, palette, color, region };
}

/**
 * Draw a carpet into `mount`.
 * @param {object} rug       an entry from RUGS (or STUDY_RUG)
 * @param {number} knotsWide knots across the width; more knots, finer drawing
 * @param {number} knotSize  pixels per knot on the canvas
 * @returns carpet object with `paint(highlightRegion)` for the carpet guide
 */
function createCarpet(rug, knotsWide, knotSize, mount) {
  const pattern = createPattern(rug, knotsWide);
  const { W, H } = pattern;

  const buffer = document.createElement('canvas'); // one pixel per knot
  buffer.width = W;
  buffer.height = H;

  const canvas = document.createElement('canvas');
  canvas.width = W * knotSize;
  canvas.height = H * knotSize;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `${rug.name}, a ${rug.city} carpet`);
  mount.appendChild(canvas);

  const carpet = { ...pattern, rug, canvas, buffer, knotSize, seed: parseInt(rug.id, 10) || 7 };
  carpet.paint = (highlight = null) => paint(carpet, highlight);
  carpet.paint();
  return carpet;
}

/** Paint the knots, optionally greying out everything except one region. */
function paint(carpet, highlight) {
  const { W, H, knotSize, seed, palette, buffer, canvas, color, region } = carpet;
  const bctx = buffer.getContext('2d');
  const image = bctx.createImageData(W, H);
  const px = image.data;

  for (let i = 0; i < W * H; i++) {
    const y = (i / W) | 0;
    const x = i - y * W;
    let [r, g, b] = palette.rgb[color[i]];

    // slight per-knot variation plus horizontal abrash bands, like hand-dyed wool
    let shade = 0.92 + ((hash(x, y, seed + 7) % 1000) / 1000) * 0.12;
    shade *= 1 + 0.045 * Math.sin(y * 0.16 + (seed % 11));

    if (highlight !== null) {
      const inFocus =
        region[i] === highlight || (highlight === REGION.GUARD && region[i] === REGION.INNER_GUARD);
      if (!inFocus) {
        const lum = r * 0.3 + g * 0.59 + b * 0.11;
        r = r * 0.12 + lum * 0.2 + 112;
        g = g * 0.12 + lum * 0.2 + 110;
        b = b * 0.12 + lum * 0.2 + 120;
        shade = 1;
      }
    }

    const j = i * 4;
    px[j] = Math.min(255, r * shade);
    px[j + 1] = Math.min(255, g * shade);
    px[j + 2] = Math.min(255, b * shade);
    px[j + 3] = 255;
  }
  bctx.putImageData(image, 0, 0);

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(buffer, 0, 0, W * knotSize, H * knotSize);
  ctx.fillStyle = ctx.createPattern(knotTexture(knotSize), 'repeat');
  ctx.fillRect(0, 0, W * knotSize, H * knotSize);
}

/** Show a round magnifier of individual knots while the pointer moves over the carpet. */
function attachKnotLoupe(container, carpet) {
  const SIZE = 176;
  const KNOTS_VISIBLE = 13;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const px = SIZE * dpr;

  const lens = document.createElement('canvas');
  lens.className = 'lens';
  lens.width = lens.height = px;
  lens.hidden = true;

  const label = document.createElement('span');
  label.className = 'lens-tag';
  label.hidden = true;
  container.append(lens, label);

  const ctx = lens.getContext('2d');
  const { rug } = carpet;
  const density = rug.raj ? knotStats(rug.width, rug.length, rug.raj, 1).perSquareInch : null;

  const hide = () => {
    lens.hidden = true;
    label.hidden = true;
  };

  container.addEventListener('pointermove', (event) => {
    const rect = carpet.canvas.getBoundingClientRect();
    const ox = event.clientX - rect.left;
    const oy = event.clientY - rect.top;
    if (ox < 0 || oy < 0 || ox > rect.width || oy > rect.height) return hide();

    const kx = (ox / rect.width) * carpet.W;
    const ky = (oy / rect.height) * carpet.H;
    const cell = px / KNOTS_VISIBLE;
    const startX = Math.floor(kx - KNOTS_VISIBLE / 2);
    const startY = Math.floor(ky - KNOTS_VISIBLE / 2);
    const offsetX = (startX - (kx - KNOTS_VISIBLE / 2)) * cell;
    const offsetY = (startY - (ky - KNOTS_VISIBLE / 2)) * cell;

    ctx.save();
    ctx.clearRect(0, 0, px, px);
    ctx.beginPath();
    ctx.arc(px / 2, px / 2, px / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#E8DECA'; // undyed warp showing between knots
    ctx.fillRect(0, 0, px, px);

    for (let j = 0; j <= KNOTS_VISIBLE; j++) {
      for (let i = 0; i <= KNOTS_VISIBLE; i++) {
        const knotX = startX + i;
        const knotY = startY + j;
        if (knotX < 0 || knotY < 0 || knotX >= carpet.W || knotY >= carpet.H) continue;

        const x0 = offsetX + i * cell;
        const y0 = offsetY + j * cell;
        ctx.fillStyle = carpet.palette.colors[carpet.color[knotY * carpet.W + knotX]];
        ctx.fillRect(x0, y0, cell, cell);

        const tuft = ctx.createLinearGradient(0, y0, 0, y0 + cell);
        tuft.addColorStop(0, 'rgba(255,255,255,.18)');
        tuft.addColorStop(1, 'rgba(0,0,0,.28)');
        ctx.fillStyle = tuft;
        ctx.fillRect(x0, y0, cell, cell);

        // the loop of the knot around its warp threads
        ctx.strokeStyle = 'rgba(0,0,0,.28)';
        ctx.lineWidth = Math.max(1, cell * 0.06);
        ctx.beginPath();
        ctx.moveTo(x0 + cell * 0.12, y0 + cell * 0.18);
        ctx.quadraticCurveTo(x0 + cell * 0.5, y0 + cell * 1.05, x0 + cell * 0.88, y0 + cell * 0.18);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(0,0,0,.18)';
        ctx.strokeRect(x0, y0, cell, cell);
      }
    }
    ctx.restore();

    const box = container.getBoundingClientRect();
    lens.style.left = label.style.left = `${event.clientX - box.left}px`;
    lens.style.top = label.style.top = `${event.clientY - box.top}px`;
    label.textContent = `Row ${Math.floor(ky) + 1} · Knot ${Math.floor(kx) + 1}${density ? ` · ${density} per in²` : ''}`;
    lens.hidden = false;
    label.hidden = false;
  });

  container.addEventListener('pointerleave', hide);
}
