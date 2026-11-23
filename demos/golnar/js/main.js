/**
 * Golnar: page behaviour.
 * Hero, collection and filters, bag, product detail, carpet guide,
 * raj calculator and the private-viewing form.
 * Depends on data.js, utils.js and carpet.js, loaded before it.
 */

(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const findRug = (id) => RUGS.find((rug) => rug.id === id);

  const BAG_KEY = 'golnar-bag';
  const state = {
    city: 'All',
    size: 'All',
    bag: storage.get(BAG_KEY, []).filter((id) => findRug(id)),
  };

  /* ---------- Toast ---------- */

  const toastEl = $('#toast');
  let toastTimer;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('on'), 2600);
  }

  /* ---------- Hero ---------- */

  function initHero() {
    const rug = RUGS[0];
    const mount = $('#heroRug');
    attachKnotLoupe(mount, createCarpet(rug, 90, 6, mount));

    const { months } = knotStats(rug.width, rug.length, rug.raj, rug.weavers);
    $('#heroSpec').innerHTML = `
    <span>No. ${rug.id} · ${rug.city}</span>
    <b>${rug.name}</b>
    <span>${rug.width} × ${rug.length} cm · ${rug.raj} raj</span>
    <span>${rug.weavers} weavers · ${months} months on the loom</span>`;
  }

  /* ---------- Collection ---------- */

  function initCityRow() {
    const row = $('#cityRow');
    for (const [english, persian] of CITIES) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'city';
      button.innerHTML = `<span class="fa" lang="fa">${persian}</span><span>${english}</span>`;
      button.addEventListener('click', () => {
        state.city = english;
        renderFilters();
        renderGrid();
        $('#collection').scrollIntoView();
      });
      row.append(button);
    }
  }

  function renderChipGroup(container, options, key) {
    container.replaceChildren(
      ...options.map((option) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.textContent = option;
        chip.setAttribute('aria-pressed', String(state[key] === option));
        chip.addEventListener('click', () => {
          state[key] = option;
          renderFilters();
          renderGrid();
        });
        return chip;
      }),
    );
  }

  function renderFilters() {
    renderChipGroup($('#cityChips'), ['All', ...CITIES.map(([english]) => english)], 'city');
    renderChipGroup($('#sizeChips'), ['All', 'Runner', 'Room', 'Grand'], 'size');
  }

  function renderGrid() {
    const grid = $('#grid');
    const list = RUGS.filter(
      (rug) =>
        (state.city === 'All' || rug.city === state.city) &&
        (state.size === 'All' || sizeCategory(rug) === state.size),
    );

    $('#countNote').textContent =
      `${list.length} ${list.length === 1 ? 'piece' : 'pieces'} shown. ` +
      'Each carpet is one of a kind; once reserved, it leaves the collection.';

    if (!list.length) {
      grid.innerHTML =
        '<p class="empty">No pieces match these filters right now. Try another city or size.</p>';
      return;
    }

    grid.replaceChildren(...list.map(productCard));
  }

  function productCard(rug) {
    const { perSquareInch } = knotStats(rug.width, rug.length, rug.raj, rug.weavers);
    const inBag = state.bag.includes(rug.id);

    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
    <button class="frame" type="button" aria-label="View ${rug.name}">
      <span class="no">No. ${rug.id}</span>
      <div class="rug"></div>
    </button>
    <div class="card-meta">
      <div class="card-city">
        <span class="eyebrow">${rug.city}</span>
        <span class="fa" lang="fa">${CITY_FA[rug.city]}</span>
      </div>
      <h3>${rug.name}</h3>
      <p class="specline">${rug.width} × ${rug.length} cm · ${rug.raj} raj · ${perSquareInch} knots/in²</p>
    </div>
    <div class="card-foot">
      <span class="price">${formatPrice(rug.price)}<small>CAD</small></span>
      <button class="add" type="button" ${inBag ? 'disabled' : ''}>${inBag ? 'In your bag' : 'Add to bag'}</button>
    </div>`;

    createCarpet(rug, 56, 4, $('.rug', card));
    $('.frame', card).addEventListener('click', () => openDetail(rug.id));
    $('.add', card).addEventListener('click', () => addToBag(rug.id));
    return card;
  }

  /* ---------- Bag ---------- */

  const drawer = $('#drawer');
  const scrim = $('#scrim');
  const detail = $('#modal');

  function saveBag() {
    storage.set(BAG_KEY, state.bag);
  }

  function addToBag(id) {
    if (state.bag.includes(id)) return;
    state.bag.push(id);
    saveBag();
    renderBag();
    renderGrid();
    toast(`${findRug(id).name} added to your bag`);
    if (detail.classList.contains('open')) openDetail(id);
  }

  function removeFromBag(id) {
    state.bag = state.bag.filter((item) => item !== id);
    saveBag();
    renderBag();
    renderGrid();
  }

  function renderBag() {
    $('#bagCount').textContent = state.bag.length;
    const list = $('#bagList');

    if (!state.bag.length) {
      list.innerHTML =
        '<li class="bag-empty">Your bag is empty. Add a piece from the collection to reserve it.</li>';
    } else {
      list.replaceChildren(
        ...state.bag.map((id) => {
          const rug = findRug(id);
          const item = document.createElement('li');
          item.className = 'bag-item';
          item.innerHTML = `
          <div class="thumb"></div>
          <div>
            <b>${rug.name}</b>
            <span>${rug.city} · ${rug.width} × ${rug.length} cm · ${formatPrice(rug.price)}</span>
          </div>
          <button class="rm" type="button">Remove</button>`;
          createCarpet(rug, 40, 2, $('.thumb', item));
          $('.rm', item).addEventListener('click', () => removeFromBag(id));
          return item;
        }),
      );
    }

    const subtotal = state.bag.reduce((sum, id) => sum + findRug(id).price, 0);
    $('#subtotal').textContent = formatPrice(subtotal);
  }

  function openBag() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    scrim.classList.add('on');
    $('#bagClose').focus();
  }

  function closeOverlays() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    detail.classList.remove('open');
    detail.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('on');
  }

  function initBag() {
    $('#bagBtn').addEventListener('click', openBag);
    $('#bagClose').addEventListener('click', closeOverlays);
    scrim.addEventListener('click', closeOverlays);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeOverlays();
    });
    $('#checkout').addEventListener('click', () =>
      toast(
        state.bag.length
          ? 'Checkout is turned off in this portfolio demo.'
          : 'Add a piece to your bag first.',
      ),
    );
    detail.addEventListener('click', (event) => {
      if (event.target === detail) closeOverlays();
    });
    renderBag();
  }

  /* ---------- Product detail ---------- */

  function openDetail(id) {
    const rug = findRug(id);
    const stats = knotStats(rug.width, rug.length, rug.raj, rug.weavers);
    const inBag = state.bag.includes(id);

    detail.innerHTML = `
    <div class="panel">
      <button class="x" type="button" aria-label="Close">✕</button>
      <div class="panel-art"><div class="rug"></div></div>
      <div class="panel-copy">
        <div class="card-city">
          <span class="eyebrow">${rug.city} · No. ${rug.id}</span>
          <span class="fa" lang="fa">${CITY_FA[rug.city]}</span>
        </div>
        <h2 id="mTitle">${rug.name}</h2>
        <p class="story">${rug.story}</p>
        <dl class="specs">
          <dt>Size</dt><dd>${rug.width} × ${rug.length} cm (${sizeCategory(rug).toLowerCase()})</dd>
          <dt>Density</dt><dd>${rug.raj} raj · ${stats.perSquareInch} knots per square inch</dd>
          <dt>Knots</dt><dd>About ${(stats.total / 1e6).toFixed(1)} million, tied by hand</dd>
          <dt>On the loom</dt><dd>${rug.weavers} ${rug.weavers > 1 ? 'weavers' : 'weaver'} · about ${stats.months} months</dd>
          <dt>Materials</dt><dd>${rug.material}</dd>
          <dt>Dyes</dt><dd>${rug.dyes}</dd>
        </dl>
        <div class="panel-buy">
          <span class="price">${formatPrice(rug.price)}<small>CAD</small></span>
          <button class="btn primary add-m" type="button" ${inBag ? 'disabled' : ''}>${inBag ? 'In your bag' : 'Add to bag'}</button>
        </div>
        <p class="assume">Move across the carpet to inspect the knots.</p>
      </div>
    </div>`;

    const mount = $('.rug', detail);
    attachKnotLoupe(mount, createCarpet(rug, 84, 5, mount));
    $('.x', detail).addEventListener('click', closeOverlays);
    $('.add-m', detail).addEventListener('click', () => addToBag(id));

    detail.classList.add('open');
    detail.setAttribute('aria-hidden', 'false');
    scrim.classList.add('on');
    $('.x', detail).focus();
  }

  /* ---------- Carpet guide ---------- */

  function initCarpetGuide() {
    const mount = $('#anatRug');
    const carpet = createCarpet(STUDY_RUG, 80, 5, mount);
    const list = $('#parts');
    const description = $('#partDesc');
    let active = REGION.MEDALLION;

    // The fringe lives outside the canvas (CSS pseudo-elements), so it is highlighted with classes.
    const preview = (region) => {
      mount.classList.toggle('hl-fringe', region === REGION.FRINGE);
      mount.classList.toggle('dim-fringe', region !== REGION.FRINGE);
      carpet.paint(region === REGION.FRINGE ? -1 : region);
    };

    const select = (region) => {
      active = region;
      for (const button of $$('.part', list)) {
        const on = Number(button.dataset.region) === region;
        button.setAttribute('aria-pressed', String(on));
        if (on && list.scrollWidth > list.clientWidth) {
          list.scrollTo({ left: Math.max(0, button.parentElement.offsetLeft - 4), behavior: 'smooth' });
        }
      }

      const index = CARPET_PARTS.findIndex((part) => part.region === region);
      const part = CARPET_PARTS[index];
      description.innerHTML = `
      <div class="pd-title"><b>${part.name}</b><i>${part.transliteration}</i></div>
      <span class="fa" lang="fa">${part.fa}</span>
      <p>${part.text}</p>
      <div class="pd-nav">
        <span>${index + 1} of ${CARPET_PARTS.length} · swipe the carpet</span>
        <div>
          <button type="button" data-step="-1" aria-label="Previous part">‹</button>
          <button type="button" data-step="1" aria-label="Next part">›</button>
        </div>
      </div>`;
      preview(region);
    };

    const step = (direction) => {
      const index = CARPET_PARTS.findIndex((part) => part.region === active);
      select(CARPET_PARTS[(index + direction + CARPET_PARTS.length) % CARPET_PARTS.length].region);
    };

    for (const part of CARPET_PARTS) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'part';
      button.dataset.region = part.region;
      button.innerHTML = `
      <span class="term"><span class="fa" lang="fa">${part.fa}</span><i>${part.transliteration}</i></span>
      <strong>${part.name}</strong>
      <span class="desc">${part.text}</span>`;
      button.addEventListener('click', () => select(part.region));
      button.addEventListener('mouseenter', () => preview(part.region));
      button.addEventListener('mouseleave', () => preview(active));
      item.append(button);
      list.append(item);
    }

    description.addEventListener('click', (event) => {
      const button = event.target.closest('[data-step]');
      if (button) step(Number(button.dataset.step));
    });

    // Swipe left or right on the carpet to move between parts on touch screens.
    let touchX = null;
    let touchY = null;
    mount.addEventListener(
      'touchstart',
      (event) => {
        touchX = event.touches[0].clientX;
        touchY = event.touches[0].clientY;
      },
      { passive: true },
    );
    mount.addEventListener(
      'touchend',
      (event) => {
        if (touchX === null) return;
        const dx = event.changedTouches[0].clientX - touchX;
        const dy = event.changedTouches[0].clientY - touchY;
        touchX = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
      },
      { passive: true },
    );

    select(active);
  }

  /* ---------- Raj calculator ---------- */

  function initDensityCalculator() {
    const rajInput = $('#rajIn');
    const sizeInput = $('#sizeIn');
    const weaversInput = $('#weavIn');
    const swatch = $('#swatch');
    const ctx = swatch.getContext('2d');
    const sample = createPattern(RUGS[0], 90); // the swatch borrows colours from the hero Kashan

    const update = () => {
      const raj = Number(rajInput.value);
      const [width, length] = sizeInput.value.split('x').map(Number);
      const weavers = Number(weaversInput.value);
      const stats = knotStats(width, length, raj, weavers);

      $('#rajOut').textContent = raj;
      $('#weavOut').textContent = weavers;
      $('#areaOut').textContent = `${((width * length) / 1e4).toFixed(1).replace('.0', '')} m²`;
      $('#kpsiOut').textContent = stats.perSquareInch;
      $('#totOut').textContent = `${(stats.total / 1e6).toFixed(1)}M`;
      $('#moOut').textContent = stats.months;
      $('#swatchCap').textContent = `One square inch · ${stats.perInch} knots across`;

      // Draw one square inch of knots at the chosen density.
      const n = stats.perInch;
      const size = swatch.width;
      const cell = size / n;
      const gap = Math.max(1, cell * 0.08);
      const startX = Math.floor(sample.W / 2 - n / 2);
      const startY = Math.floor(sample.H / 2 - n * 0.9);

      ctx.fillStyle = '#E8DECA';
      ctx.fillRect(0, 0, size, size);
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const kx = Math.min(sample.W - 1, Math.max(0, startX + i));
          const ky = Math.min(sample.H - 1, Math.max(0, startY + j));
          const x0 = i * cell;
          const y0 = j * cell;

          ctx.fillStyle = sample.palette.colors[sample.color[ky * sample.W + kx]];
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x0 + gap / 2, y0 + gap / 2, cell - gap, cell - gap, cell * 0.28);
          else ctx.rect(x0 + gap / 2, y0 + gap / 2, cell - gap, cell - gap);
          ctx.fill();

          const tuft = ctx.createLinearGradient(0, y0, 0, y0 + cell);
          tuft.addColorStop(0, 'rgba(255,255,255,.16)');
          tuft.addColorStop(1, 'rgba(0,0,0,.3)');
          ctx.fillStyle = tuft;
          ctx.fill();
        }
      }
    };

    for (const input of [rajInput, sizeInput, weaversInput]) input.addEventListener('input', update);
    update();
  }

  /* ---------- Private viewing form ---------- */

  function initVisitForm() {
    const form = $('#visitForm');
    const note = $('#formNote');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameInput = $('#vName');
      const emailInput = $('#vEmail');
      const name = nameInput.value.trim();

      if (!name) {
        note.textContent = 'Please add your name so we know who to expect.';
        nameInput.focus();
        return;
      }
      if (!emailInput.value.trim() || !emailInput.checkValidity()) {
        note.textContent = 'Please enter an email address like name@example.com.';
        emailInput.focus();
        return;
      }

      note.textContent = `Thank you, ${name}. This is a portfolio demo, so no request was sent.`;
      form.reset();
    });
  }

  /* ---------- Start ---------- */

  initHero();
  initCityRow();
  renderFilters();
  renderGrid();
  initBag();
  initCarpetGuide();
  initDensityCalculator();
  initVisitForm();
})();
