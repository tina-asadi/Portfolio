/* Hero "blueprint lens"
   Clones the hero into a wireframe layer and reveals it through a circle that follows the pointer.
   No changes to your hero HTML are needed. */
(() => {
  const hero = document.querySelector('.hero');
  if (!hero || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.classList.add('has-lens');

  // Original elements, in document order (collected before the lens layers are added)
  const origs = [...hero.querySelectorAll('*')];

  // Build the wireframe layer from a clone of the hero's children
  const wire = document.createElement('div');
  wire.className = 'hero-wire';
  wire.setAttribute('aria-hidden', 'true');
  wire.inert = true;
  [...hero.children].forEach((child) => wire.appendChild(child.cloneNode(true)));
  const clones = [...wire.querySelectorAll('*')];

  const clip = document.createElement('div');
  clip.className = 'lens-clip';
  const ring = document.createElement('div');
  ring.className = 'lens-ring';
  clip.appendChild(ring);

  const ui = document.createElement('div');
  ui.className = 'lens-ui';
  ui.innerHTML =
    '<span class="lens-hint">Move over the page to see how it is built</span>' +
    '<button type="button" class="lens-toggle" aria-pressed="false">Blueprint view</button>';
  const toggle = ui.querySelector('button');

  hero.append(wire, clip, ui);

  // Make the clone use the same layout as the real hero
  const layoutProps = [
    'display', 'flexDirection', 'flexWrap', 'alignItems', 'justifyContent',
    'rowGap', 'columnGap', 'gridTemplateColumns', 'gridTemplateRows',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  ];
  const labelTags = ['h1', 'h2', 'p', 'a'];

  function sync() {
    const cs = getComputedStyle(hero);
    layoutProps.forEach((p) => { wire.style[p] = cs[p]; });
    wire.style.width = hero.clientWidth + 'px';
    wire.style.height = hero.clientHeight + 'px';

    origs.forEach((el, i) => {
      const tag = el.tagName.toLowerCase();
      const clone = clones[i];
      if (tag === 'img') {
        const r = el.getBoundingClientRect();
        clone.parentElement.dataset.label = `img ${Math.round(r.width)}×${Math.round(r.height)}`;
      } else if (labelTags.includes(tag)) {
        const size = Math.round(parseFloat(getComputedStyle(el).fontSize));
        const cls = el.classList[0] ? '.' + el.classList[0] : '';
        clone.dataset.label = `${tag}${cls} ${size}px`;
      }
    });
  }
  sync();
  new ResizeObserver(sync).observe(hero);

  // Lens motion: ease toward the pointer
  const RADIUS = 150;
  let tx = 0, ty = 0, x = 0, y = 0, r = 0, tr = 0;
  let full = false, raf = 0;

  const fullRadius = () => Math.hypot(hero.clientWidth, hero.clientHeight) * 1.1;

  function tick() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    r += (tr - r) * 0.18;
    hero.style.setProperty('--x', x.toFixed(1) + 'px');
    hero.style.setProperty('--y', y.toFixed(1) + 'px');
    hero.style.setProperty('--r', Math.max(r, 0).toFixed(1) + 'px');
    hero.style.setProperty('--ring', r > 4 && !full ? '1' : '0');
    wire.style.setProperty('--x', x.toFixed(1) + 'px');
    wire.style.setProperty('--y', y.toFixed(1) + 'px');
    wire.style.setProperty('--r', Math.max(r, 0).toFixed(1) + 'px');

    const settled = Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs(tr - r) < 0.3;
    raf = settled ? 0 : requestAnimationFrame(tick);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  hero.addEventListener('pointermove', (e) => {
    const b = hero.getBoundingClientRect();
    tx = e.clientX - b.left;
    ty = e.clientY - b.top;
    if (r < 1) { x = tx; y = ty; } // open where the pointer is, not from a corner
    if (!full) tr = RADIUS;
    ui.classList.add('is-used');
    kick();
  });

  hero.addEventListener('pointerleave', () => {
    if (!full) { tr = 0; kick(); }
  });

  toggle.addEventListener('click', () => {
    full = !full;
    toggle.setAttribute('aria-pressed', String(full));
    tr = full ? fullRadius() : 0;
    ui.classList.add('is-used');
    kick();
  });

  window.addEventListener('resize', () => { if (full) { tr = fullRadius(); kick(); } });
})();