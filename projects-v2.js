/* Projects v2: skill-driven filter + case-study viewer.
   Load after script.js. Works with your existing markup. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const projectsSection = document.getElementById('projects');
  const projects = [...document.querySelectorAll('#projects .project')];
  if (!projectsSection || !projects.length) return;

  // Label the arrow buttons that script.js creates
  document.querySelectorAll('.scroll-btn.left').forEach((b) => b.setAttribute('aria-label', 'Scroll projects left'));
  document.querySelectorAll('.scroll-btn.right').forEach((b) => b.setAttribute('aria-label', 'Scroll projects right'));

  /* ---------- 1. Skill filter ---------- */
  // Which project chips count as evidence for each skill (all lowercase).
  // Skills with no matching chip are dimmed; tag a project with that chip to link it.
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

  const chipsOf = new Map(
    projects.map((p) => [p, [...p.querySelectorAll('.chip')].map((c) => c.textContent.trim().toLowerCase())])
  );
  const matchesFor = (name) => {
    const keys = SKILLS[name.toLowerCase()] || [name.toLowerCase()];
    return projects.filter((p) => chipsOf.get(p).some((c) => keys.includes(c)));
  };

  const grid = document.querySelector('#skills .skills-grid');
  const pills = [...document.querySelectorAll('#skills .pill')];
  const status = document.createElement('p');
  status.className = 'skill-status';
  status.setAttribute('aria-live', 'polite');
  if (grid) grid.after(status);

  let active = null;

  function clearFilter() {
    active = null;
    pills.forEach((p) => p.setAttribute('aria-pressed', 'false'));
    projects.forEach((p) => p.classList.remove('is-match'));
    projectsSection.classList.remove('projects-filtering');
    status.textContent = '';
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

    // Bring the first match in each scrolling row into view
    document.querySelectorAll('#projects .projects').forEach((row) => {
      const first = hits.find((p) => row.contains(p));
      if (first) row.scrollTo({ left: Math.max(first.offsetLeft - row.offsetLeft - 2, 0), behavior: reduce ? 'auto' : 'smooth' });
    });

    status.textContent = `${hits.length} ${hits.length === 1 ? 'project uses' : 'projects use'} ${name}. `;
    const see = document.createElement('button');
    see.type = 'button';
    see.textContent = 'See them';
    see.addEventListener('click', () => projectsSection.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }));
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.textContent = 'Clear filter';
    clear.addEventListener('click', clearFilter);
    status.append(see, clear);
  }

  pills.forEach((pill) => {
    pill.setAttribute('role', 'button');
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('aria-pressed', 'false');
    if (!matchesFor(pill.textContent.trim()).length) pill.setAttribute('data-empty', '');
    pill.addEventListener('click', () => selectSkill(pill));
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSkill(pill); }
    });
  });

  /* ---------- 2. Case-study viewer ---------- */
  const dlg = document.createElement('dialog');
  dlg.className = 'case';
  dlg.setAttribute('aria-labelledby', 'case-title');
  dlg.innerHTML =
    '<button type="button" class="case-close" aria-label="Close case study">✕</button>' +
    '<img class="case-hero" alt="">' +
    '<div class="case-body"><h3 id="case-title"></h3><div class="stack"></div>' +
    '<p class="case-summary"></p><dl class="case-facts"></dl><div class="case-actions"></div></div>';
  document.body.appendChild(dlg);

  const hero = dlg.querySelector('.case-hero');
  const titleEl = dlg.querySelector('#case-title');
  const stackEl = dlg.querySelector('.stack');
  const summaryEl = dlg.querySelector('.case-summary');
  const factsEl = dlg.querySelector('.case-facts');
  const actionsEl = dlg.querySelector('.case-actions');

  const FACTS = [['problem', 'Problem'], ['role', 'My role'], ['outcome', 'Outcome']];

  function fill(project) {
    const img = project.querySelector('img');
    const link = project.querySelector('a');
    hero.src = img.currentSrc || img.src;
    hero.alt = img.alt;
    titleEl.textContent = project.querySelector('h3').textContent;
    stackEl.innerHTML = project.querySelector('.stack') ? project.querySelector('.stack').innerHTML : '';
    summaryEl.textContent = project.querySelector('p') ? project.querySelector('p').textContent : '';

    factsEl.replaceChildren();
    FACTS.forEach(([key, label]) => {
      if (!project.dataset[key]) return;
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = project.dataset[key];
      row.append(dt, dd);
      factsEl.appendChild(row);
    });

    actionsEl.replaceChildren();
    const href = link && link.getAttribute('href');
    if (href && href !== '#') {
      const a = document.createElement('a');
      a.className = 'btn-primary';
      a.href = href;
      a.textContent = project.dataset.cta || 'Open project';
      if (/^https?:/i.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
      actionsEl.appendChild(a);
    }
  }

  // Shared-element morph from the card image to the dialog image (View Transitions API)
  const transition = (fn) => {
    if (!reduce && document.startViewTransition) return document.startViewTransition(fn);
    fn();
    return null;
  };

  let current = null;

  function openCase(project) {
    current = project;
    const cardImg = project.querySelector('img');
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
    const cardImg = current.querySelector('img');
    const t = transition(() => {
      hero.style.viewTransitionName = '';
      dlg.close();
      cardImg.style.viewTransitionName = 'case-hero';
    });
    (t ? t.finished : Promise.resolve()).finally(() => { cardImg.style.viewTransitionName = ''; });
  }

  dlg.querySelector('.case-close').addEventListener('click', closeCase);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) closeCase(); });   // backdrop click
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeCase(); });    // Esc key

  // Open the viewer when a card has case-study data, or has no real link (href="#").
  // Cards with a real link and no data keep behaving as normal links.
  projectsSection.addEventListener('click', (e) => {
    const a = e.target.closest('.project a');
    if (!a || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const project = a.closest('.project');
    const hasStory = FACTS.some(([key]) => project.dataset[key]);
    if (!hasStory && a.getAttribute('href') !== '#') return;
    e.preventDefault();
    openCase(project);
  });
})();