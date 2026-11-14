/* home.js: the home page only
   1 Project carousels · 2 Skill filter · 3 Case viewer · 4 Hero lens */
(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Project carousels ----------
     Desktop: three rows with arrow buttons (shown only when there is more to scroll).
     Phone: category chips pick ONE carousel; a counter and dots show position. */
  const projects = $$('#projects .project');
  const projectsSection = $('#projects');
  const phone = matchMedia('(max-width: 640px)');

  const carousel = (() => {
    const groups = $$('#projects .project-group');
    const states = [];
    const tabBtns = new Map();
    let activeCat = groups[0]?.dataset.cat;
    let tabs = null;

    // A card counts when no skill filter is active, or when it matches the filter
    const isShown = (card) => !projectsSection.classList.contains('projects-filtering') || card.classList.contains('is-match');
    const shownCards = (row) => $$('.project', row).filter(isShown);

    function scrollToCard(row, card) {
      const offset = phone.matches ? (row.clientWidth - card.offsetWidth) / 2 : 2;   // centred on phones
      const left = row.scrollLeft + card.getBoundingClientRect().left - row.getBoundingClientRect().left - offset;
      row.scrollTo({ left: Math.max(left, 0), behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    function update(st) {
      const { row, left, right, counter, dots } = st;
      left.hidden = row.scrollLeft <= 2;
      right.hidden = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
      if (!row.clientWidth) return;                                 // group is hidden
      const cards = shownCards(row);
      const rect = row.getBoundingClientRect();
      const mid = rect.left + rect.width / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs(r.left + r.width / 2 - mid);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      const text = cards.length ? `${best + 1} / ${cards.length}` : '';
      if (counter.textContent !== text) counter.textContent = text;
      $$('button', dots).forEach((b, i) => b.setAttribute('aria-current', String(i === best)));
    }

    function buildDots(st) {
      const cards = shownCards(st.row);
      st.dots.replaceChildren(...cards.map((card, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel-dot';
        b.setAttribute('aria-label', `Go to project ${i + 1} of ${cards.length}: ${$('h4', card).textContent}`);
        b.addEventListener('click', () => scrollToCard(st.row, card));
        return b;
      }));
    }

    groups.forEach((group) => {
      const wrapper = $('.projects-wrapper', group);
      const row = $('.projects', wrapper);
      if (!row) return;

      const arrow = (dir, label, glyph) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `scroll-btn ${dir}`;
        b.setAttribute('aria-label', label);
        b.textContent = glyph;
        b.addEventListener('click', () => {
          row.scrollBy({ left: (dir === 'left' ? -1 : 1) * row.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        return b;
      };
      const counter = document.createElement('p');
      counter.className = 'carousel-count';
      counter.setAttribute('aria-live', 'polite');
      const dots = document.createElement('div');
      dots.className = 'carousel-dots';
      const ui = document.createElement('div');
      ui.className = 'carousel-ui';
      ui.append(counter, dots);

      const st = { group, row, counter, dots, left: arrow('left', 'Scroll projects left', '‹'), right: arrow('right', 'Scroll projects right', '›') };
      wrapper.append(st.left, st.right, ui);
      states.push(st);

      let ticking = false;
      row.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { ticking = false; update(st); });
      }, { passive: true });
      new ResizeObserver(() => update(st)).observe(row);
    });

    function setCategory(cat) {
      activeCat = cat;
      groups.forEach((g) => g.classList.toggle('is-off', g.dataset.cat !== cat));
      tabBtns.forEach(({ b }, c) => b.setAttribute('aria-pressed', String(c === cat)));
      const st = states.find((s) => s.group.dataset.cat === cat);
      if (st) { st.row.scrollLeft = 0; update(st); }
    }

    if (groups.length > 1) {
      tabs = document.createElement('div');
      tabs.className = 'cat-tabs';
      tabs.setAttribute('role', 'group');
      tabs.setAttribute('aria-label', 'Project categories');
      groups.forEach((g) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'cat-chip';
        const count = document.createElement('span');
        count.className = 'cat-count';
        b.append(g.dataset.label || g.dataset.cat, count);
        b.addEventListener('click', () => setCategory(g.dataset.cat));
        tabBtns.set(g.dataset.cat, { b, count });
        tabs.appendChild(b);
      });
      groups[0].before(tabs);
      projectsSection.classList.add('js-groups');
    }

    // Recount, rebuild dots, and move to a category that still has projects (used by the skill filter)
    function refresh() {
      const count = (g) => $$('.project', g).filter(isShown).length;
      groups.forEach((g) => {
        const t = tabBtns.get(g.dataset.cat);
        if (!t) return;
        const n = count(g);
        t.count.textContent = n;
        t.b.disabled = n === 0;
      });
      const current = groups.find((g) => g.dataset.cat === activeCat);
      if (tabs && current && count(current) === 0) {
        const next = groups.find((g) => count(g) > 0);
        if (next) activeCat = next.dataset.cat;
      }
      states.forEach(buildDots);
      if (tabs) setCategory(activeCat); else states.forEach(update);
    }

    refresh();
    return { refresh, scrollToCard };
  })();

  /* ---------- 2. Skill filter: pick a skill to highlight the projects that use it ---------- */
  (() => {
    // Project chips that count as evidence for each skill (lowercase). Empty skills are dimmed.
    const SKILLS = {
      'html': ['html'],
      'css': ['css'],
      'javascript': ['javascript'],
      'ui/ux design': ['ui/ux', 'ui', 'ux', 'figma', 'high fidelity'],
      'responsive design': ['responsive'],
      'seo': ['seo', 'analytics', 'content strategy'],
      'wordpress': ['wordpress'],
      'bootstrap': ['bootstrap'],
      'git/github': ['git', 'github'],
      'bilingual sites': ['bilingual'],
      'wireframing': ['wireframes'],
      'prototyping': ['figma', 'high fidelity'],
    };

    const grid = $('#skills .skills-grid');
    const pills = $$('#skills .pill');
    if (!grid || !projectsSection || !pills.length) return;

    const chips = new Map(projects.map((p) => [p, $$('.chip', p).map((c) => c.textContent.trim().toLowerCase())]));
    const matchesFor = (name) => {
      const keys = SKILLS[name.toLowerCase()] || [name.toLowerCase()];
      return projects.filter((p) => chips.get(p).some((c) => keys.includes(c)));
    };

    const status = document.createElement('p');
    status.className = 'skill-status';
    status.setAttribute('aria-live', 'polite');
    grid.after(status);

    let active = null;

    const button = (label, onClick) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.addEventListener('click', onClick);
      return b;
    };

    function clearFilter() {
      active = null;
      pills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
      projects.forEach((p) => p.classList.remove('is-match'));
      projectsSection.classList.remove('projects-filtering');
      status.textContent = '';
      carousel.refresh();
    }

    function selectSkill(pill) {
      if (active === pill) return clearFilter();
      clearFilter();
      active = pill;
      pill.setAttribute('aria-pressed', 'true');

      const name = pill.textContent.trim();
      const hits = matchesFor(name);
      if (!hits.length) {
        status.textContent = `No projects are tagged with ${name} yet.`;
        return;
      }

      projectsSection.classList.add('projects-filtering');
      hits.forEach((p) => p.classList.add('is-match'));
      carousel.refresh();                              // recount tabs and dots; phones hide non-matches

      // Bring the first match in each row into view (desktop)
      if (!phone.matches) {
        $$('#projects .projects').forEach((row) => {
          const first = hits.find((p) => row.contains(p));
          if (first) carousel.scrollToCard(row, first);
        });
      }

      status.textContent = `${hits.length} ${hits.length === 1 ? 'project uses' : 'projects use'} ${name}. `;
      status.append(
        button('See them', () => projectsSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })),
        button('Clear filter', clearFilter)
      );
    }

    pills.forEach((pill) => {
      pill.setAttribute('aria-pressed', 'false');
      if (!matchesFor(pill.textContent.trim()).length) pill.setAttribute('data-empty', '');
      pill.addEventListener('click', () => selectSkill(pill));
    });
  })();

  /* ---------- 3. Case viewer ----------
     Only for cards that do not have a case-study page yet (href="#"): they open a dialog and the
     card image morphs into the dialog image. Cards that link to a page in /projects are plain links.
     Optional per-card attributes: data-problem, data-role, data-outcome, data-cta. */
  (() => {
    if (!projectsSection || !projects.length) return;

    const dlg = document.createElement('dialog');
    dlg.className = 'case';
    dlg.setAttribute('aria-labelledby', 'case-title');
    dlg.innerHTML =
      '<button type="button" class="case-close" aria-label="Close">✕</button>' +
      '<img class="case-hero" alt="">' +
      '<div class="case-body"><h3 id="case-title"></h3><div class="stack"></div>' +
      '<p class="case-summary"></p><dl class="case-facts"></dl><div class="case-actions"></div></div>';
    document.body.appendChild(dlg);

    const hero = $('.case-hero', dlg);
    const FACTS = [['problem', 'Problem'], ['role', 'My role'], ['outcome', 'Outcome']];
    let current = null;

    function fill(project) {
      const img = $('img', project);
      const href = $('a', project)?.getAttribute('href');
      hero.src = img.currentSrc || img.src;
      hero.alt = img.alt;
      $('#case-title', dlg).textContent = $('h4', project).textContent;
      $('.stack', dlg).innerHTML = $('.stack', project)?.innerHTML ?? '';
      $('.case-summary', dlg).textContent = $('p', project)?.textContent ?? '';

      const facts = $('.case-facts', dlg);
      facts.replaceChildren();
      FACTS.forEach(([key, label]) => {
        if (!project.dataset[key]) return;
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = label;
        dd.textContent = project.dataset[key];
        row.append(dt, dd);
        facts.appendChild(row);
      });

      const actions = $('.case-actions', dlg);
      actions.replaceChildren();
      if (href && href !== '#') {
        const a = document.createElement('a');
        a.className = 'btn-primary';
        a.href = href;
        a.textContent = project.dataset.cta || 'Open project';
        if (/^https?:/i.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
        actions.appendChild(a);
      }
    }

    // Shared-element morph (View Transitions API), with a plain fallback
    const transition = (fn) => {
      if (!reduceMotion && document.startViewTransition) return document.startViewTransition(fn);
      fn();
      return null;
    };

    function openCase(project) {
      current = project;
      const cardImg = $('img', project);
      fill(project);
      cardImg.style.viewTransitionName = 'case-hero';
      transition(() => {
        cardImg.style.viewTransitionName = '';
        hero.style.viewTransitionName = 'case-hero';
        dlg.showModal();
        dlg.scrollTop = 0;
      });
    }

    function closeCase() {
      if (!dlg.open || !current) return;
      const cardImg = $('img', current);
      const t = transition(() => {
        hero.style.viewTransitionName = '';
        dlg.close();
        cardImg.style.viewTransitionName = 'case-hero';
      });
      (t ? t.finished : Promise.resolve()).finally(() => { cardImg.style.viewTransitionName = ''; });
    }

    $('.case-close', dlg).addEventListener('click', closeCase);
    dlg.addEventListener('click', (e) => { if (e.target === dlg) closeCase(); });   // backdrop
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeCase(); });    // Esc

    projectsSection.addEventListener('click', (e) => {
      const link = e.target.closest('.project a');
      if (!link || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const project = link.closest('.project');
      const hasStory = FACTS.some(([key]) => project.dataset[key]);
      if (!hasStory && link.getAttribute('href') !== '#') return;   // real link, no story: just follow it
      e.preventDefault();
      openCase(project);
    });
  })();

  /* ---------- 4. Hero lens: wireframe layer revealed by a cursor-following circle (mouse only)
     or by the "Blueprint view" button (all devices, including phones and touch screens) ---------- */
  (() => {
    const hero = $('.hero');
    if (!hero) return;
    const followCursor = matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion;   // mouse only
    hero.classList.add('has-lens');

    const origs = $$('*', hero);                       // collected before the lens layers are added
    const wire = document.createElement('div');
    wire.className = 'hero-wire';
    wire.setAttribute('aria-hidden', 'true');
    wire.inert = true;
    [...hero.children].forEach((child) => wire.appendChild(child.cloneNode(true)));
    const clones = $$('*', wire);

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
    const toggle = $('button', ui);
    if (!followCursor) $('.lens-hint', ui).remove();   // no cursor lens here, so no hover hint
    hero.append(wire, clip, ui);

    // Give the clone the same layout as the real hero
    const layoutProps = ['display', 'flexDirection', 'flexWrap', 'alignItems', 'justifyContent', 'rowGap', 'columnGap',
      'gridTemplateColumns', 'gridTemplateRows', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'];
    const labelTags = ['h1', 'h2', 'p', 'a'];

    function sync() {
      const cs = getComputedStyle(hero);
      layoutProps.forEach((p) => { wire.style[p] = cs[p]; });
      wire.style.width = hero.clientWidth + 'px';
      wire.style.height = hero.clientHeight + 'px';
      origs.forEach((el, i) => {
        const tag = el.tagName.toLowerCase();
        if (tag === 'img') {
          const r = el.getBoundingClientRect();
          clones[i].parentElement.dataset.label = `img ${Math.round(r.width)}×${Math.round(r.height)}`;
        } else if (labelTags.includes(tag)) {
          const size = Math.round(parseFloat(getComputedStyle(el).fontSize));
          const cls = el.classList[0] ? '.' + el.classList[0] : '';
          clones[i].dataset.label = `${tag}${cls} ${size}px`;
        }
      });
    }
    sync();
    new ResizeObserver(sync).observe(hero);

    const RADIUS = 150;
    let tx = 0, ty = 0, x = 0, y = 0, r = 0, tr = 0, full = false, raf = 0;
    const fullRadius = () => Math.hypot(hero.clientWidth, hero.clientHeight) * 1.1;

    function tick() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      r += (tr - r) * 0.18;
      hero.style.setProperty('--x', x.toFixed(1) + 'px');
      hero.style.setProperty('--y', y.toFixed(1) + 'px');
      hero.style.setProperty('--r', Math.max(r, 0).toFixed(1) + 'px');
      hero.style.setProperty('--ring', r > 4 && !full ? '1' : '0');
      const settled = Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs(tr - r) < 0.3;
      raf = settled ? 0 : requestAnimationFrame(tick);
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    if (followCursor) hero.addEventListener('pointermove', (e) => {
      const b = hero.getBoundingClientRect();
      tx = e.clientX - b.left;
      ty = e.clientY - b.top;
      if (r < 1) { x = tx; y = ty; }                   // open at the pointer, not from a corner
      if (!full) tr = RADIUS;
      ui.classList.add('is-used');
      kick();
    });
    if (followCursor) hero.addEventListener('pointerleave', () => { if (!full) { tr = 0; kick(); } });

    toggle.addEventListener('click', () => {
      full = !full;
      toggle.setAttribute('aria-pressed', String(full));
      tr = full ? fullRadius() : 0;
      if (reduceMotion) r = tr;                        // no easing for reduced motion
      ui.classList.add('is-used');
      kick();
    });
    addEventListener('resize', () => { if (full) { tr = fullRadius(); kick(); } });
  })();
})();
