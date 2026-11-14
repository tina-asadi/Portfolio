/* case-study.js: every project page in /projects uses this
   1 Scroll reveal · 2 Chapter rail · 3 Progress bar · 4 Compare slider · 5 Metrics · 6 Prototype
   It only enhances the HTML. The pages stay readable without it. */
(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Run `fn` once when `el` is mostly on screen */
  const onceVisible = (el, fn, threshold = 0.6) => {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      fn();
    }, { threshold });
    io.observe(el);
  };

  /* ---------- 1. Scroll reveal ---------- */
  $$('.reveal').forEach((el) => onceVisible(el, () => el.classList.add('in'), 0.12));

  /* ---------- 2. Chapter rail: highlight the chapter being read ---------- */
  const railLinks = $$('.rail a');
  if (railLinks.length) {
    const spy = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      railLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + entry.target.id)));
    }), { rootMargin: '-40% 0px -55% 0px' });
    $$('.ch').forEach((chapter) => spy.observe(chapter));
  }

  /* ---------- 3. Reading progress bar ---------- */
  const bar = $('#progress');
  if (bar) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- 4. Compare slider (wireframe to final design) ---------- */
  $$('.compare').forEach((box) => {
    const input = $('input', box);
    // The thumb is 40px wide, so the reveal line is offset to stay under it at both ends
    const setPos = (v) => box.style.setProperty('--pos', `calc(${v}% + ${((0.5 - v / 100) * 40).toFixed(1)}px)`);
    input.addEventListener('input', () => setPos(+input.value));
    setPos(+input.value);

    if (reduceMotion) return;
    onceVisible(box, () => {                           // a short sweep shows it is interactive
      let t = 0;
      const tick = () => {
        t += 0.03;
        input.value = 50 + Math.sin(t) * 22 * Math.max(0, 1 - t / 6);
        setPos(+input.value);
        if (t < 6) requestAnimationFrame(tick);
        else { input.value = 50; setPos(50); }
      };
      tick();
    }, 0.7);
  });

  /* ---------- 5. Metrics: count up when visible ---------- */
  $$('.metric').forEach((metric) => {
    const number = $('strong', metric);
    const value = parseFloat(metric.dataset.value);
    const suffix = metric.dataset.suffix || '';
    if (Number.isNaN(value) || reduceMotion) return;   // the HTML already shows the final number
    const show = (v) => { number.textContent = (Number.isInteger(value) ? Math.round(v) : +v.toFixed(1)).toLocaleString() + suffix; };
    show(0);
    onceVisible(number, () => {
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / 1200, 1);
        show(value * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  });

  /* ---------- 6. Prototype: load the embed only when asked ---------- */
  $$('.prototype [data-launch]').forEach((button) => {
    button.addEventListener('click', () => {
      const box = button.closest('.prototype');
      const frame = document.createElement('iframe');
      frame.src = box.dataset.embed;
      frame.title = box.dataset.title || 'Interactive prototype';
      frame.allowFullscreen = true;
      box.replaceChildren(frame);
    });
  });
})();
