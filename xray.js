/* SEO X-ray
   A toggle that audits the live page: search preview, SEO/accessibility checks,
   heading outline and real speed metrics measured in the visitor's browser.
   Everything is read from the DOM, so it stays accurate. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Speed collectors (start early so values are accurate) ---------- */
  const perf = { lcp: null, cls: 0 };
  let onPerf = () => {};
  try {
    new PerformanceObserver((list) => {
      const e = list.getEntries();
      perf.lcp = e[e.length - 1].startTime;
      onPerf();
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (_) { /* not supported */ }
  try {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((e) => { if (!e.hadRecentInput) perf.cls += e.value; });
      onPerf();
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (_) { /* not supported */ }

  /* ---------- Helpers ---------- */
  const h = (tag, props = {}, ...kids) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
    });
    el.append(...kids.flat().filter((k) => k != null && k !== false));
    return el;
  };
  // Ignore our own UI, the hero lens clone, dialogs and hidden content
  const real = (el) => !el.closest('.xray-ui, .hero-wire, dialog, [aria-hidden="true"], noscript');
  const all = (sel) => [...document.querySelectorAll(sel)].filter(real);
  const metaContent = (sel) => {
    const m = document.head.querySelector(sel);
    return m ? (m.getAttribute('content') || '').trim() : '';
  };
  const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
  const ms = (v) => (v == null ? '—' : v >= 1000 ? (v / 1000).toFixed(2) + ' s' : Math.round(v) + ' ms');
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /* ---------- Audit ---------- */
  function audit() {
    const out = [];
    const add = (label, status, detail, els = []) => out.push({ label, status, detail, els });

    const title = document.title.trim();
    if (!title) add('Page title', 'fail', 'No <title> found.');
    else if (title.length < 30 || title.length > 60) add('Page title', 'warn', `${title.length} characters. Aim for 30–60 so it is not cut off in search results.`);
    else add('Page title', 'pass', `${title.length} characters.`);

    const desc = metaContent('meta[name="description"]');
    if (!desc) add('Meta description', 'fail', 'Missing. Search engines will pick random text from the page.');
    else if (desc.length < 70 || desc.length > 160) add('Meta description', 'warn', `${desc.length} characters. Aim for 70–160.`);
    else add('Meta description', 'pass', `${desc.length} characters.`);

    const heads = all('h1, h2, h3, h4, h5, h6');
    const h1s = heads.filter((x) => x.tagName === 'H1');
    if (h1s.length === 1) add('One H1', 'pass', clip(h1s[0].textContent.trim(), 70), h1s);
    else if (h1s.length === 0) add('One H1', 'fail', 'No H1 found. Add one that says what the page is about.');
    else add('One H1', 'warn', `${h1s.length} H1 elements. Use one per page.`, h1s);

    const skipped = [];
    heads.forEach((el, i) => {
      const lvl = +el.tagName[1];
      const prev = i ? +heads[i - 1].tagName[1] : 0;
      if (lvl - prev > 1) skipped.push(el);
    });
    skipped.length
      ? add('Heading order', 'warn', `${plural(skipped.length, 'heading skips', 'headings skip')} a level (for example H1 to H3).`, skipped)
      : add('Heading order', 'pass', 'No skipped levels.');

    const imgs = all('img');
    const noAlt = imgs.filter((i) => !i.hasAttribute('alt'));
    const emptyAlt = imgs.filter((i) => i.getAttribute('alt') === '');
    if (noAlt.length) add('Image alt text', 'fail', `${noAlt.length} of ${imgs.length} images have no alt attribute.`, noAlt);
    else if (emptyAlt.length) add('Image alt text', 'warn', `${plural(emptyAlt.length, 'image has', 'images have')} empty alt. That is only right for decorative images.`, emptyAlt);
    else add('Image alt text', 'pass', imgs.length ? `All ${imgs.length} images have alt text.` : 'No images on the page.');

    const links = all('a[href]');
    const noText = links.filter((a) => !(a.textContent.trim() || a.getAttribute('aria-label') || a.querySelector('img[alt]:not([alt=""])')));
    const dead = links.filter((a) => a.getAttribute('href') === '#' && !a.closest('.skills-grid'));
    noText.length
      ? add('Link text', 'fail', `${plural(noText.length, 'link has', 'links have')} no readable text.`, noText)
      : add('Link text', 'pass', 'Every link has readable text.');
    dead.length
      ? add('Links that go nowhere', 'warn', `${plural(dead.length, 'link points', 'links point')} to "#". Crawlers and visitors get nothing.`, dead)
      : add('Links that go nowhere', 'pass', 'No empty "#" links.');

    document.documentElement.lang
      ? add('Page language', 'pass', `lang="${document.documentElement.lang}"`)
      : add('Page language', 'fail', 'Add lang="en" to the <html> tag.');

    document.head.querySelector('meta[name="viewport"]')
      ? add('Mobile viewport', 'pass', 'Viewport meta tag found.')
      : add('Mobile viewport', 'fail', 'Missing viewport meta tag.');

    document.head.querySelector('link[rel="canonical"]')
      ? add('Canonical URL', 'pass', 'Canonical link found.')
      : add('Canonical URL', 'warn', 'Add <link rel="canonical"> to avoid duplicate-URL confusion.');

    const og = ['og:title', 'og:description', 'og:image'].filter((p) => metaContent(`meta[property="${p}"]`));
    og.length === 3 ? add('Social preview (Open Graph)', 'pass', 'Title, description and image are set.')
      : og.length ? add('Social preview (Open Graph)', 'warn', `Only ${og.length} of 3 tags set (title, description, image).`)
      : add('Social preview (Open Graph)', 'fail', 'No Open Graph tags. Shared links will look blank.');

    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')];
    if (!ld.length) add('Structured data', 'warn', 'No JSON-LD found. A Person or WebSite schema helps search engines know who you are.');
    else {
      try {
        const types = ld.flatMap((s) => [].concat(JSON.parse(s.textContent))).map((o) => o['@type']).filter(Boolean);
        add('Structured data', 'pass', types.length ? `Found: ${types.join(', ')}` : 'JSON-LD found.');
      } catch (_) {
        add('Structured data', 'fail', 'JSON-LD is present but is not valid JSON.');
      }
    }

    document.head.querySelector('link[rel~="icon"]')
      ? add('Favicon', 'pass', 'Favicon found.')
      : add('Favicon', 'warn', 'No favicon link. Browsers will request /favicon.ico.');

    /noindex/i.test(metaContent('meta[name="robots"]'))
      ? add('Indexing allowed', 'fail', 'A robots meta tag says noindex. Search engines will skip this page.')
      : add('Indexing allowed', 'pass', 'No noindex directive.');

    location.protocol === 'https:'
      ? add('HTTPS', 'pass', 'Served over HTTPS.')
      : add('HTTPS', 'warn', 'Not served over HTTPS here (normal on a local file or dev server).');

    return { checks: out, title, desc, heads };
  }

  /* ---------- UI ---------- */
  const btn = h('button', { type: 'button', class: 'xray-ui xray-toggle', 'aria-pressed': 'false', 'aria-controls': 'xray-panel', title: 'Alt+X' }, 'SEO X-ray');
  const titleEl = h('h2', { class: 'xray-title', tabindex: '-1' }, 'SEO X-ray');
  const closeBtn = h('button', { type: 'button', class: 'xray-icon-btn', 'aria-label': 'Close SEO X-ray' }, '✕');
  const body = h('div', { class: 'xray-body' });
  const panel = h('aside', { id: 'xray-panel', class: 'xray-ui xray-panel', 'aria-label': 'SEO X-ray' },
    h('div', { class: 'xray-head' }, h('div', {}, titleEl, h('p', { class: 'xray-sub' }, 'Live audit of this page')), closeBtn),
    body);
  panel.inert = true;
  document.body.append(btn, panel);

  let isOpen = false;
  const glyph = { pass: '✓', warn: '!', fail: '✕' };
  const word = { pass: 'Passed', warn: 'Warning', fail: 'Failed' };

  function flash(els) {
    if (!els.length) return;
    els.forEach((el) => el.classList.add('xray-flash'));
    els[0].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: matchMedia('(max-width: 640px)').matches ? 'start' : 'center' });
    setTimeout(() => els.forEach((el) => el.classList.remove('xray-flash')), 2800);
  }

  const speedBox = h('div', { class: 'xray-metrics' });
  function renderSpeed() {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const bytes = res.reduce((n, r) => n + (r.transferSize || 0), 0) + (nav ? nav.transferSize || 0 : 0);
    const rate = (v, good, ok) => (v == null ? '' : v <= good ? 'is-pass' : v <= ok ? 'is-warn' : 'is-fail');
    const m = (label, value, cls = '') => h('div', { class: `xray-metric ${cls}` }, h('span', {}, label), h('strong', {}, value));
    speedBox.replaceChildren(
      m('Largest paint (LCP)', ms(perf.lcp), rate(perf.lcp, 2500, 4000)),
      m('Layout shift (CLS)', perf.cls.toFixed(3), rate(perf.cls, 0.1, 0.25)),
      m('Server response', ms(nav && nav.responseStart), rate(nav && nav.responseStart, 800, 1800)),
      m('Page loaded', ms(nav && nav.loadEventEnd > 0 ? nav.loadEventEnd : null)),
      m('Requests', String(res.length + 1)),
      m('Transferred', bytes ? (bytes / 1024).toFixed(0) + ' KB' : '—')
    );
  }
  onPerf = () => { if (isOpen) renderSpeed(); };

  function scan() {
    const { checks, title, desc, heads } = audit();
    const pts = checks.reduce((n, c) => n + (c.status === 'pass' ? 1 : c.status === 'warn' ? 0.5 : 0), 0);
    const pct = Math.round((pts / checks.length) * 100);
    const fails = checks.filter((c) => c.status === 'fail').length;
    const warns = checks.filter((c) => c.status === 'warn').length;

    const ring = h('div', { class: 'xray-ring', style: `--p:${pct}`, role: 'img', 'aria-label': `${pct} percent of checks passed` }, h('span', {}, `${pct}`));
    const rescan = h('button', { type: 'button', class: 'xray-rescan', onclick: () => scan() }, 'Re-scan');

    const path = (location.host || 'localhost') + location.pathname.replace(/index\.html$/, '');
    const serp = h('div', {},
      h('div', { class: 'xray-serp' },
        h('div', { class: 'xray-serp-url' }, path),
        h('div', { class: 'xray-serp-title' }, clip(title || '(no title)', 60)),
        h('div', { class: 'xray-serp-desc' }, clip(desc || 'No meta description: search engines will choose text from the page.', 160))),
      h('p', { class: 'xray-note' }, 'Approximate. Search engines may rewrite what they show.'));

    const list = h('ul', { class: 'xray-list' }, checks.map((c) =>
      h('li', { class: `xray-item is-${c.status}` },
        h('span', { class: 'xray-glyph', 'aria-hidden': 'true' }, glyph[c.status]),
        h('div', {}, h('strong', {}, h('span', { class: 'xray-sr' }, word[c.status] + ': '), c.label), h('small', {}, c.detail)),
        c.els.length ? h('button', { type: 'button', class: 'xray-show', onclick: () => flash(c.els) }, 'Show') : null)));

    let prev = 0;
    const outline = h('ul', { class: 'xray-outline' }, heads.map((el) => {
      const lvl = +el.tagName[1];
      const skip = lvl - prev > 1;
      prev = lvl;
      return h('li', { style: `padding-left:${(lvl - 1) * 14}px` },
        h('button', { type: 'button', onclick: () => flash([el]) },
          h('b', {}, el.tagName), clip(el.textContent.trim(), 48), skip ? h('span', { class: 'xray-skip' }, 'skipped a level') : null));
    }));

    renderSpeed();
    body.replaceChildren(
      h('div', { class: 'xray-score' }, ring, h('div', {},
        h('strong', {}, fails || warns ? `${plural(fails, 'issue', 'issues')}, ${plural(warns, 'warning', 'warnings')}` : 'Everything passes'),
        h('p', { class: 'xray-sub' }, `${checks.length} checks on this page`), rescan)),
      h('section', {}, h('h3', {}, 'Search preview'), serp),
      h('section', {}, h('h3', {}, 'Checks'), list),
      h('section', {}, h('h3', {}, 'Heading outline'), outline),
      h('section', {}, h('h3', {}, 'Speed, measured in your browser'), speedBox,
        h('p', { class: 'xray-note' }, 'Live values from this visit, not a lab test. Run Lighthouse in DevTools for a full report.'))
    );
  }

  function setOpen(on) {
    isOpen = on;
    document.documentElement.classList.toggle('xray-on', on);
    panel.toggleAttribute('data-open', on);
    panel.inert = !on;
    btn.setAttribute('aria-pressed', String(on));
    if (on) { scan(); titleEl.focus({ preventScroll: true }); }
    else if (panel.contains(document.activeElement)) btn.focus();
  }

  btn.addEventListener('click', () => setOpen(!isOpen));
  closeBtn.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyX') { e.preventDefault(); setOpen(!isOpen); }
    else if (e.key === 'Escape' && isOpen && !document.querySelector('dialog[open]')) setOpen(false);
  });
  window.addEventListener('load', () => { if (isOpen) scan(); });
})();