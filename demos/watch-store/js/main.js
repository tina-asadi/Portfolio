/* =========================================================
   Watch — shared site logic
   ========================================================= */

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 7H6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20Z"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 15 7-7 7 7"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 5.9a8 8 0 0 1-2.4.7 4.1 4.1 0 0 0 1.8-2.3 8.2 8.2 0 0 1-2.6 1 4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3.4 4.7a4.1 4.1 0 0 0 1.3 5.5 4 4 0 0 1-1.9-.5 4.1 4.1 0 0 0 3.3 4 4.1 4.1 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 18.3 11.6 11.6 0 0 0 8.3 20c7.5 0 11.7-6.3 11.7-11.7v-.5A8.3 8.3 0 0 0 22 5.9Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4V9.75Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
};

const NAV_LINKS = [
  { href: "index.html", label: "Home" },
  { href: "products.html", label: "Products" },
  { href: "contact.html", label: "Contact" },
  { href: "about.html", label: "About Us" },
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const money = (n) => `$${n.toFixed(2)}`;
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* Safe localStorage */
const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode — keep in memory */
    }
  },
};

/* =========================================================
   Header & footer
   ========================================================= */
function renderHeader() {
  const mount = $("#site-header");
  if (!mount) return;
  const current = location.pathname.split("/").pop() || "index.html";
  const overHero = document.body.dataset.header === "dark";

  mount.className = `site-header${overHero ? " site-header--over-hero" : ""}`;
  mount.innerHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <nav class="nav container" aria-label="Main">
      <a href="index.html" class="nav__logo">Watch</a>
      <ul class="nav__links" id="nav-links">
        ${NAV_LINKS.map((l) => `<li><a href="${l.href}"${l.href === current ? ' aria-current="page"' : ""}>${l.label}</a></li>`).join("")}
      </ul>
      <div class="nav__actions">
        <button class="icon-btn" data-search-toggle aria-label="Search" aria-expanded="false" aria-controls="search-bar">${ICONS.search}</button>
        <a class="icon-btn" href="products.html?category=wishlist" aria-label="Wishlist">${ICONS.heart}<span class="badge" data-wish-count></span></a>
        <button class="icon-btn" data-cart-open aria-label="Open cart">${ICONS.cart}<span class="badge" data-cart-count aria-live="polite"></span></button>
        <button class="icon-btn nav__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">${ICONS.menu}</button>
      </div>
    </nav>
    <div class="search-bar" id="search-bar">
      <form class="container search-bar__form" action="products.html" role="search" autocomplete="off">
        <label for="search-input" class="visually-hidden">Search products</label>
        <span class="search-bar__icon">${ICONS.search}</span>
        <input id="search-input" name="q" type="search" placeholder="Search watches & bands…" aria-controls="search-results" />
        <button class="btn btn--dark" type="submit">Search</button>
        <ul class="search-results" id="search-results" role="listbox"></ul>
      </form>
    </div>`;

  /* Mobile menu */
  const toggle = $(".nav__toggle", mount);
  const links = $("#nav-links", mount);
  const setMenu = (open) => {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = open ? ICONS.close : ICONS.menu;
    document.body.classList.toggle("menu-open", open);
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  links.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));

  /* Search with live suggestions */
  const bar = $("#search-bar", mount);
  const input = $("#search-input", mount);
  const results = $("#search-results", mount);
  const searchBtn = $("[data-search-toggle]", mount);
  const setSearch = (open) => {
    bar.classList.toggle("is-open", open);
    searchBtn.setAttribute("aria-expanded", open);
    if (open) setTimeout(() => input.focus(), 50);
  };
  searchBtn.addEventListener("click", () => setSearch(!bar.classList.contains("is-open")));
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return (results.innerHTML = "");
    const hits = PRODUCTS.filter((p) => `${p.name} ${CATEGORY_LABEL[p.category]}`.toLowerCase().includes(q)).slice(0, 5);
    results.innerHTML = hits.length
      ? hits
          .map(
            (p) => `<li role="option"><button type="button" data-quick="${p.id}">
              <img src="${p.image}" alt="" width="40" height="40"><span>${p.name}<small>${CATEGORY_LABEL[p.category]}</small></span><strong>${money(p.price)}</strong>
            </button></li>`
          )
          .join("")
      : `<li class="search-results__empty">No matches. Press Enter to search all products.</li>`;
  });
  results.addEventListener("click", (e) => e.target.closest("[data-quick]") && setSearch(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setSearch(false);
      setMenu(false);
    }
    if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      setSearch(true);
    }
  });

  /* Solid header after scrolling */
  const onScroll = () => mount.classList.toggle("is-scrolled", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function renderFooter() {
  const mount = $("#site-footer");
  if (!mount) return;
  mount.className = "site-footer";
  const col = (title, items) => `
    <div class="footer__col">
      <h2>${title}</h2>
      <ul>${items.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul>
    </div>`;
  mount.innerHTML = `
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="footer__logo">Watch</div>
          <p class="footer__tagline">Crafted for Moments</p>
          <div class="socials">
            <a href="#" aria-label="Twitter">${ICONS.twitter}</a>
            <a href="#" aria-label="LinkedIn">${ICONS.linkedin}</a>
            <a href="#" aria-label="Instagram">${ICONS.instagram}</a>
          </div>
        </div>
        ${col("Customer Services", [["FAQ's", "contact.html#faq"], ["Delivery", "contact.html#faq"], ["Returns", "contact.html#faq"], ["Contact", "contact.html"]])}
        ${col("Shopping Online", [["All Products", "products.html"], ["Wishlist", "products.html?category=wishlist"], ["Bands", "products.html?category=band"], ["Plans & Pricing", "about.html#services"]])}
        ${col("About Us", [["Our Stores", "about.html"], ["Careers", "contact.html"], ["Terms and Conditions", "#"], ["Sitemap", "index.html"]])}
      </div>
      <div class="footer__bottom">
        <p>© ${new Date().getFullYear()} designer Ink. All rights reserved.</p>
        <ul>
          <li><a href="#">Terms of service</a></li>
          <li><a href="#">Privacy policy</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>
    </div>`;
}

/* =========================================================
   Wishlist
   ========================================================= */
const Wishlist = {
  ids: new Set(store.get("watch-wishlist", [])),
  has(id) {
    return this.ids.has(id);
  },
  toggle(id) {
    const added = !this.ids.has(id);
    added ? this.ids.add(id) : this.ids.delete(id);
    store.set("watch-wishlist", [...this.ids]);
    toast(added ? `${byId(id).name} saved to wishlist` : "Removed from wishlist");
    this.sync();
    document.dispatchEvent(new CustomEvent("wishlist:change"));
  },
  sync() {
    $$("[data-wish]").forEach((b) => {
      const on = this.has(b.dataset.wish);
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-pressed", on);
    });
    $$("[data-wish-count]").forEach((el) => {
      el.textContent = this.ids.size || "";
      el.classList.toggle("is-visible", this.ids.size > 0);
    });
  },
};

/* =========================================================
   Cart
   ========================================================= */
const Cart = {
  items: store.get("watch-cart", []).filter((i) => byId(i.id)),

  save() {
    store.set("watch-cart", this.items);
    this.render();
  },
  add(id, qty = 1) {
    const p = byId(id);
    if (!p) return;
    const line = this.items.find((i) => i.id === id);
    line ? (line.qty += qty) : this.items.push({ id, qty });
    this.save();
    toast(`${p.name} added to cart`, { label: "View cart", action: () => this.open() });
    $$("[data-cart-count]").forEach((b) => {
      b.classList.remove("bump");
      void b.offsetWidth;
      b.classList.add("bump");
    });
  },
  setQty(id, qty) {
    const line = this.items.find((i) => i.id === id);
    if (!line) return;
    line.qty = Math.min(qty, 10);
    if (line.qty <= 0) this.items = this.items.filter((i) => i.id !== id);
    this.save();
  },
  count() {
    return this.items.reduce((n, i) => n + i.qty, 0);
  },
  total() {
    return this.items.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
  },

  mount() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div class="overlay" data-cart-close></div>
       <aside class="cart" aria-label="Shopping cart" aria-hidden="true" tabindex="-1">
         <div class="cart__head">
           <h2>Your Cart <span data-cart-items></span></h2>
           <button class="icon-btn" data-cart-close aria-label="Close cart">${ICONS.close}</button>
         </div>
         <div class="shipping">
           <p data-shipping-text></p>
           <div class="shipping__bar"><span data-shipping-bar></span></div>
         </div>
         <ul class="cart__items"></ul>
         <div class="cart__foot">
           <div class="cart__row"><span>Subtotal</span><span data-cart-total>$0.00</span></div>
           <div class="cart__row cart__row--muted"><span>Shipping</span><span data-cart-shipping>—</span></div>
           <button class="btn btn--dark btn--block" data-checkout>Checkout</button>
           <button class="btn btn--ghost btn--block" data-cart-close>Continue shopping</button>
         </div>
       </aside>`
    );

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (t.closest("[data-cart-open]")) this.open();
      if (t.closest("[data-cart-close]")) this.close();
      const add = t.closest("[data-add]");
      if (add) {
        this.add(add.dataset.add);
        add.classList.add("is-added");
        setTimeout(() => add.classList.remove("is-added"), 1200);
      }
      const q = t.closest("[data-qty]");
      if (q) {
        const line = this.items.find((i) => i.id === q.dataset.id);
        if (line) this.setQty(line.id, line.qty + Number(q.dataset.qty));
      }
      const rm = t.closest("[data-remove]");
      if (rm) this.setQty(rm.dataset.remove, 0);
      if (t.closest("[data-checkout]")) {
        if (!this.items.length) return toast("Your cart is empty");
        this.items = [];
        this.save();
        this.close();
        toast("Thanks! Your order has been placed.");
      }
    });
    document.addEventListener("keydown", (e) => e.key === "Escape" && this.close());
    this.render();
  },
  open() {
    const cart = $(".cart");
    this.lastFocus = document.activeElement;
    cart.classList.add("is-open");
    cart.setAttribute("aria-hidden", "false");
    $(".overlay").classList.add("is-open");
    document.body.classList.add("no-scroll");
    setTimeout(() => cart.focus(), 50);
  },
  close() {
    const cart = $(".cart");
    if (!cart?.classList.contains("is-open")) return;
    cart.classList.remove("is-open");
    cart.setAttribute("aria-hidden", "true");
    $(".overlay").classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    this.lastFocus?.focus?.();
  },
  render() {
    const count = this.count();
    $$("[data-cart-count]").forEach((b) => {
      b.textContent = count || "";
      b.classList.toggle("is-visible", count > 0);
    });
    const list = $(".cart__items");
    if (!list) return;
    $("[data-cart-items]").textContent = count ? `(${count})` : "";
    list.innerHTML = this.items.length
      ? this.items
          .map((i) => {
            const p = byId(i.id);
            return `<li class="cart-item">
              <div class="cart-item__img"><img src="${p.image}" alt=""></div>
              <div class="cart-item__info">
                <p class="cart-item__name">${p.name}</p>
                <p class="cart-item__price">${money(p.price)}</p>
                <div class="qty" aria-label="Quantity">
                  <button data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button>
                  <span>${i.qty}</span>
                  <button data-qty="1" data-id="${p.id}" aria-label="Increase quantity" ${i.qty >= 10 ? "disabled" : ""}>+</button>
                </div>
              </div>
              <div class="cart-item__end">
                <strong>${money(p.price * i.qty)}</strong>
                <button class="link-btn" data-remove="${p.id}">Remove</button>
              </div>
            </li>`;
          })
          .join("")
      : `<li class="cart__empty">${ICONS.bag}<p>Your cart is empty.</p><a class="btn btn--dark" href="products.html">Browse products</a></li>`;

    const total = this.total();
    const left = Math.max(0, FREE_SHIPPING - total);
    $("[data-cart-total]").textContent = money(total);
    $("[data-cart-shipping]").textContent = !total ? "—" : left ? "$9.99" : "Free";
    $("[data-shipping-text]").innerHTML = left
      ? `You're <strong>${money(left)}</strong> away from free shipping`
      : `${ICONS.check} You've unlocked <strong>free shipping</strong>`;
    $("[data-shipping-bar]").style.width = `${Math.min(100, (total / FREE_SHIPPING) * 100)}%`;
    $(".cart__foot").hidden = !this.items.length;
    $(".shipping").hidden = !this.items.length;
  },
};

/* =========================================================
   Toast (with optional action)
   ========================================================= */
let toastTimer;
function toast(msg, action) {
  let el = $(".toast");
  if (!el) {
    document.body.insertAdjacentHTML("beforeend", `<div class="toast" role="status" aria-live="polite"></div>`);
    el = $(".toast");
  }
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button class="toast__action">${action.label}</button>` : ""}`;
  if (action) $(".toast__action", el).onclick = () => {
    el.classList.remove("is-visible");
    action.action();
  };
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3200);
}

/* =========================================================
   Quick view (native <dialog>)
   ========================================================= */
const QuickView = {
  mount() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `<dialog class="quick-view" aria-labelledby="qv-title">
         <button class="icon-btn quick-view__close" data-qv-close aria-label="Close">${ICONS.close}</button>
         <div class="quick-view__body"></div>
       </dialog>`
    );
    this.el = $(".quick-view");
    this.el.addEventListener("click", (e) => {
      if (e.target === this.el || e.target.closest("[data-qv-close]")) this.el.close();
      const step = e.target.closest("[data-qv-step]");
      if (step) {
        const out = $("[data-qv-qty]", this.el);
        out.textContent = Math.min(10, Math.max(1, Number(out.textContent) + Number(step.dataset.qvStep)));
      }
      const addBtn = e.target.closest("[data-qv-add]");
      if (addBtn) {
        Cart.add(addBtn.dataset.qvAdd, Number($("[data-qv-qty]", this.el).textContent));
        this.el.close();
      }
      const sw = e.target.closest("[data-qv-swap]");
      if (sw) this.open(sw.dataset.qvSwap);
    });
    document.addEventListener("click", (e) => {
      const q = e.target.closest("[data-quick]");
      if (q) {
        e.preventDefault();
        this.open(q.dataset.quick);
      }
    });
  },
  open(id) {
    const p = byId(id);
    if (!p) return;
    const bands = PRODUCTS.filter((x) => x.category === "band");
    $(".quick-view__body", this.el).innerHTML = `
      <div class="quick-view__media"><img src="${p.image}" alt="${p.name}"></div>
      <div class="quick-view__info">
        <p class="eyebrow">${CATEGORY_LABEL[p.category]}</p>
        <h2 id="qv-title">${p.name}</h2>
        <p class="quick-view__price">${money(p.price)} ${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ""}</p>
        <p class="quick-view__desc">${p.description}</p>
        <ul class="ticks">${p.features.map((f) => `<li>${ICONS.check}${f}</li>`).join("")}</ul>
        ${
          p.category === "band"
            ? `<p class="eyebrow">Colour</p>
               <div class="swatches">${bands
                 .map((b) => `<button class="swatch${b.id === p.id ? " is-active" : ""}" style="--swatch:${b.swatch}" data-qv-swap="${b.id}" aria-label="${b.name}" aria-pressed="${b.id === p.id}"></button>`)
                 .join("")}</div>`
            : ""
        }
        <div class="quick-view__actions">
          <div class="qty qty--lg" aria-label="Quantity">
            <button data-qv-step="-1" aria-label="Decrease quantity">−</button>
            <span data-qv-qty>1</span>
            <button data-qv-step="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn--dark" data-qv-add="${p.id}">${ICONS.bag} Add to cart</button>
          <button class="icon-btn wish-btn wish-btn--outline" data-wish="${p.id}" aria-label="Save to wishlist">${ICONS.heart}</button>
        </div>
        <p class="quick-view__note">Free shipping over ${money(FREE_SHIPPING)} · 30-day returns</p>
      </div>`;
    Wishlist.sync();
    if (!this.el.open) this.el.showModal();
  },
};

/* =========================================================
   Product cards & lists
   ========================================================= */
function productCard(p) {
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return `<article class="product-card reveal">
    ${off ? `<span class="product-card__badge">-${off}%</span>` : ""}
    <button class="icon-btn wish-btn" data-wish="${p.id}" aria-label="Save ${p.name} to wishlist" aria-pressed="false">${ICONS.heart}</button>
    <button class="product-card__media" data-quick="${p.id}" aria-label="Quick view ${p.name}">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <span class="product-card__peek">${ICONS.eye} Quick view</span>
    </button>
    <p class="product-card__cat">${CATEGORY_LABEL[p.category]}</p>
    <h3 class="product-card__name">${p.name}</h3>
    <p class="product-card__price">${money(p.price)}${p.oldPrice ? ` <s>${money(p.oldPrice)}</s>` : ""}</p>
    <button class="btn btn--outline btn--block add-btn" data-add="${p.id}">
      <span class="add-btn__default">${ICONS.bag} Add to cart</span>
      <span class="add-btn__done">${ICONS.check} Added</span>
    </button>
  </article>`;
}

function renderList(selector, ids) {
  const el = $(selector);
  if (el) el.innerHTML = ids.map(byId).filter(Boolean).map(productCard).join("");
}

/* Accessories grid */
function initRail() {
  const grid = $("#accessories");
  if (grid) grid.innerHTML = PRODUCTS.filter((p) => p.category === "band").map(productCard).join("");
}

/* Smart Watch Studio collage */
function initStudio() {
  const el = $("#studio-collage");
  if (!el) return;
  el.innerHTML = STUDIO_LAYOUT.map(([id, x, y, w, mx, my, mw], i) => {
    const p = byId(id);
    return `<button class="studio__item" data-quick="${id}" style="--x:${x}%;--y:${y}%;--w:${w}%;--mx:${mx}%;--my:${my}%;--mw:${mw}%;--i:${i}" aria-label="Quick view ${p.name}">
      <img src="${p.image}" alt="" loading="lazy">
      <span class="studio__tag">${p.name} · ${money(p.price)}</span>
    </button>`;
  }).join("");
}

/* Products page */
function initCatalogue() {
  const grid = $("#catalogue");
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const state = {
    category: params.get("category") || "all",
    q: params.get("q") || "",
    sort: params.get("sort") || "featured",
  };
  const search = $("#catalogue-search");
  const sort = $("#catalogue-sort");
  const count = $("#catalogue-count");
  search.value = state.q;
  sort.value = state.sort;

  const draw = () => {
    const q = state.q.trim().toLowerCase();
    let items = PRODUCTS.filter((p) => {
      const inCat = state.category === "all" || (state.category === "wishlist" ? Wishlist.has(p.id) : p.category === state.category);
      return inCat && (!q || `${p.name} ${p.description} ${CATEGORY_LABEL[p.category]}`.toLowerCase().includes(q));
    });
    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    };
    if (sorters[state.sort]) items = [...items].sort(sorters[state.sort]);

    count.textContent = `${items.length} product${items.length === 1 ? "" : "s"}`;
    grid.innerHTML = items.length
      ? items.map(productCard).join("")
      : `<div class="empty-state">${ICONS[state.category === "wishlist" ? "heart" : "search"]}
           <p>${state.category === "wishlist" ? "Your wishlist is empty. Tap the heart on any product to save it." : `No products match “${esc(state.q)}”.`}</p>
           <button class="btn btn--outline" data-reset>Show all products</button>
         </div>`;
    $$(".chip").forEach((c) => {
      const on = c.dataset.filter === state.category;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-pressed", on);
    });
    $("[data-chip-wish]").textContent = Wishlist.ids.size ? `(${Wishlist.ids.size})` : "";

    const url = new URL(location);
    ["category", "q", "sort"].forEach((k) => {
      const def = { category: "all", q: "", sort: "featured" }[k];
      state[k] && state[k] !== def ? url.searchParams.set(k, state[k]) : url.searchParams.delete(k);
    });
    history.replaceState(null, "", url);

    Wishlist.sync();
    observeReveals(grid);
  };

  $$(".chip").forEach((c) => c.addEventListener("click", () => ((state.category = c.dataset.filter), draw())));
  search.addEventListener("input", () => ((state.q = search.value), draw()));
  sort.addEventListener("change", () => ((state.sort = sort.value), draw()));
  grid.addEventListener("click", (e) => {
    if (!e.target.closest("[data-reset]")) return;
    Object.assign(state, { category: "all", q: "" });
    search.value = "";
    draw();
  });
  document.addEventListener("wishlist:change", () => state.category === "wishlist" && draw());
  draw();
}

/* Stores with live open/closed status */
function renderStores() {
  const el = $("#stores");
  if (!el) return;
  const hour = new Date().getHours() + new Date().getMinutes() / 60;
  const fmt = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? "A.M" : "P.M"}`;
  el.innerHTML = STORES.map((s) => {
    const open = hour >= s.open && hour < s.close;
    const q = encodeURIComponent(`${s.name} ${s.address.join(" ")}`);
    return `<article class="store-card reveal">
      <div class="store-card__map" aria-hidden="true"><span class="store-card__pin">${ICONS.pin}</span>${s.photo ? `<img class="store-card__photo" src="${s.photo}" alt="" loading="lazy" onerror="this.remove()" onload="this.classList.add('is-loaded')">` : ""}</div>
      <div class="store-card__body">
        <span class="status ${open ? "status--open" : "status--closed"}">${open ? `Open until ${fmt(s.close)}` : `Closed · opens ${fmt(s.open)}`}</span>
        <h3 class="store-card__name">${s.name}</h3>
        <p class="store-card__address">${s.address.join("<br>")}</p>
        <div class="store-card__links">
          <a class="btn btn--dark btn--sm" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${ICONS.pin} Directions</a>
          <a class="btn btn--outline btn--sm" href="tel:${s.phone.replace(/[^\d+]/g, "")}">${ICONS.phone} Call</a>
        </div>
      </div>
    </article>`;
  }).join("");
}

/* =========================================================
   Hero carousel — dots, arrows, swipe, keyboard, progress
   ========================================================= */
function initHero() {
  const hero = $(".hero");
  if (!hero) return;
  const dotsWrap = $(".hero__dots", hero);
  dotsWrap.innerHTML = HERO_SLIDES.map(
    (s, i) => `<button class="hero__dot" role="tab" aria-label="Slide ${i + 1}: ${s.title}" aria-selected="false"><span></span></button>`
  ).join("");
  const dots = $$(".hero__dot", dotsWrap);
  const media = $(".hero__media", hero);
  const DURATION = 6000;
  let index = -1;
  let timer;

  const fill = (i) => {
    const s = HERO_SLIDES[i];
    const p = byId(s.productId);
    $("[data-hero-eyebrow]", hero).textContent = s.eyebrow;
    $("[data-hero-title]", hero).textContent = s.title;
    $("[data-hero-subtitle]", hero).textContent = s.subtitle;
    $("[data-hero-text]", hero).textContent = s.text;
    const btn = $("[data-hero-btn]", hero);
    btn.dataset.add = p.id;
    $(".add-btn__default", btn).innerHTML = `${ICONS.bag}<span>Add to cart<span class="hero__price"> · ${money(p.price)}</span></span>`;
    $("[data-hero-more]", hero).dataset.quick = p.id;
    const img = $("img", media);
    img.src = p.image;
    img.alt = p.name;
    dots.forEach((d, n) => {
      d.classList.toggle("is-active", n === i);
      d.setAttribute("aria-selected", n === i);
    });
  };

  /* "Putting on a watch": the old watch slides down off the wrist, the new one
     drops in from above and settles with a small bounce. Text follows top → down. */
  const drop = $(".hero__drop", hero);
  const dropIn = () => {
    drop.classList.remove("is-out", "is-in");
    void drop.offsetWidth;
    drop.classList.add("is-in");
  };
  let switching = false;
  const go = (i) => {
    i = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
    if (i === index || switching) return;
    const first = index === -1;
    index = i;
    if (reducedMotion()) return fill(i);
    if (first) {
      fill(i);
      return dropIn();
    }
    switching = true;
    hero.classList.add("is-out");
    drop.classList.remove("is-in");
    drop.classList.add("is-out");
    setTimeout(() => {
      fill(index);
      hero.classList.remove("is-out");
      hero.classList.add("is-pre");
      void hero.offsetWidth;
      dropIn();
      setTimeout(() => {
        hero.classList.remove("is-pre");
        switching = false;
      }, 140);
    }, 420);
  };

  const play = () => {
    clearInterval(timer);
    hero.classList.remove("is-paused");
    if (reducedMotion()) return;
    hero.style.setProperty("--hero-duration", `${DURATION}ms`);
    timer = setInterval(() => go(index + 1), DURATION);
  };
  const pause = () => {
    clearInterval(timer);
    hero.classList.add("is-paused");
  };

  dots.forEach((d, i) => d.addEventListener("click", () => (go(i), play())));
  $("[data-hero-prev]", hero).addEventListener("click", () => (go(index - 1), play()));
  $("[data-hero-next]", hero).addEventListener("click", () => (go(index + 1), play()));
  hero.addEventListener("mouseenter", pause);
  hero.addEventListener("mouseleave", play);
  hero.addEventListener("focusin", pause);
  hero.addEventListener("focusout", play);
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  });

  /* Swipe */
  let startX = null;
  hero.addEventListener("pointerdown", (e) => (startX = e.clientX), { passive: true });
  hero.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) (go(index + (dx < 0 ? 1 : -1)), play());
    startX = null;
  });

  /* Subtle 3D tilt on the watch */
  if (!reducedMotion() && matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("mousemove", (e) => {
      const r = media.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / innerWidth;
      const y = (e.clientY - (r.top + r.height / 2)) / innerHeight;
      media.style.setProperty("--tilt-x", `${(-y * 14).toFixed(2)}deg`);
      media.style.setProperty("--tilt-y", `${(x * 18).toFixed(2)}deg`);
    });
    hero.addEventListener("mouseleave", () => {
      media.style.setProperty("--tilt-x", "0deg");
      media.style.setProperty("--tilt-y", "0deg");
    });
  }

  go(0);
  play();
}

/* =========================================================
   New Generation stage: scroll-driven 3D, mouse tilt, hotspots
   ========================================================= */
function initStage() {
  const stage = $("[data-stage]");
  if (!stage) return;
  const watch = $("[data-stage-watch]", stage);
  const hotspots = $$(".hotspot", stage);

  /* Scroll: the watch tilts up from lying flat to facing you */
  if (!reducedMotion()) {
    let ticking = false;
    const update = () => {
      const r = stage.getBoundingClientRect();
      // 0 when the stage enters at the bottom, 1 when it is centred
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight / 2 + r.height / 2)));
      stage.style.setProperty("--p", p.toFixed(3));
      ticking = false;
    };
    addEventListener("scroll", () => !ticking && (ticking = requestAnimationFrame(update)), { passive: true });
    addEventListener("resize", update);
    update();

    /* Mouse: gentle turn toward the cursor */
    if (matchMedia("(pointer: fine)").matches) {
      stage.addEventListener("pointermove", (e) => {
        const r = stage.getBoundingClientRect();
        stage.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2)}deg`);
        stage.style.setProperty("--rx", `${(((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2)}deg`);
      });
      stage.addEventListener("pointerleave", () => {
        stage.style.setProperty("--ry", "0deg");
        stage.style.setProperty("--rx", "0deg");
      });
    }
  } else {
    stage.style.setProperty("--p", 1);
  }

  /* Hotspots: appear one by one when the stage is in view; tap to open */
  const io = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      hotspots.forEach((h, i) => setTimeout(() => h.classList.add("is-shown"), 500 + i * 220));
      io.disconnect();
    },
    { threshold: 0.45 }
  );
  io.observe(stage);

  hotspots.forEach((h) =>
    h.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !h.classList.contains("is-open");
      hotspots.forEach((x) => x.classList.remove("is-open"));
      h.classList.toggle("is-open", open);
    })
  );
  document.addEventListener("click", () => hotspots.forEach((x) => x.classList.remove("is-open")));
}

/* Count-up numbers */
function initCounters() {
  const els = $$("[data-count]");
  if (!els.length || reducedMotion()) return;
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target;
        const end = parseFloat(el.dataset.count);
        const dec = Number(el.dataset.decimals || 0);
        const start = performance.now();
        const tick = (t) => {
          const k = Math.min(1, (t - start) / 1400);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = (end * eased).toFixed(dec) + (el.dataset.suffix || "");
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.6 }
  );
  els.forEach((el) => io.observe(el));
}

/* Thin reading-progress bar under the header */
function initProgress() {
  document.body.insertAdjacentHTML("afterbegin", '<div class="scroll-progress" aria-hidden="true"></div>');
  const bar = $(".scroll-progress");
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", update, { passive: true });
  update();
}

/* Spotlight that follows the cursor on cards */
function initSpotlight() {
  if (!matchMedia("(pointer: fine)").matches) return;
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".product-card, .store-card, .tile, .feature");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--sx", `${e.clientX - r.left}px`);
    card.style.setProperty("--sy", `${e.clientY - r.top}px`);
  });
}

/* Magnetic buttons pull slightly toward the cursor */
function initMagnetic() {
  if (reducedMotion() || !matchMedia("(pointer: fine)").matches) return;
  $$("[data-magnetic]").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.translate = ""));
  });
}

/* Scroll reveal */
let revealObserver;
function observeReveals(root = document) {
  const els = $$(".reveal:not(.is-visible)", root);
  if (!("IntersectionObserver" in window) || reducedMotion()) return els.forEach((el) => el.classList.add("is-visible"));
  revealObserver ||= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-visible");
        revealObserver.unobserve(e.target);
      }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealObserver.observe(el);
  });
}

/* Back to top */
function initBackToTop() {
  document.body.insertAdjacentHTML("beforeend", `<button class="to-top" aria-label="Back to top">${ICONS.up}</button>`);
  const btn = $(".to-top");
  addEventListener("scroll", () => btn.classList.toggle("is-visible", scrollY > innerHeight * 1.2), { passive: true });
  btn.addEventListener("click", () => scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" }));
}

/* Forms */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function initNewsletter() {
  $$("[data-newsletter]").forEach((form) =>
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", form);
      const msg = form.parentElement.querySelector(".form-msg");
      const ok = EMAIL_RE.test(input.value.trim());
      msg.textContent = ok ? "You're in! Check your inbox for your $100 voucher." : "Please enter a valid email address.";
      msg.classList.toggle("is-error", !ok);
      input.setAttribute("aria-invalid", !ok);
      if (ok) form.reset();
    })
  );
}

function initContactForm() {
  const form = $("#contact-form");
  if (!form) return;
  const success = $(".c-success");
  const rules = {
    name: (v) => v.trim().length >= 2 || "Please enter your name.",
    email: (v) => EMAIL_RE.test(v.trim()) || "Please enter a valid email address.",
    message: (v) => v.trim().length >= 10 || "Please write at least 10 characters.",
  };
  const check = (name) => {
    const field = form.elements[name];
    const res = rules[name](field.value);
    field.closest(".float-field").querySelector(".error").textContent = res === true ? "" : res;
    field.setAttribute("aria-invalid", res !== true);
    return res === true;
  };
  Object.keys(rules).forEach((n) => {
    const f = form.elements[n];
    f.addEventListener("blur", () => f.value && check(n));
    f.addEventListener("input", () => f.getAttribute("aria-invalid") === "true" && check(n));
  });
  const msg = form.elements.message;
  const counter = $("[data-counter]", form);
  msg.addEventListener("input", () => {
    counter.textContent = `${msg.value.length}/500`;
    counter.classList.toggle("is-near", msg.value.length > 450);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check);
    if (ok.includes(false)) {
      form.classList.remove("shake");
      void form.offsetWidth;
      form.classList.add("shake");
      return form.querySelector('[aria-invalid="true"]').focus();
    }
    const btn = $(".c-submit", form);
    btn.disabled = true;
    btn.classList.add("is-loading");
    $("span", btn).textContent = "Sending…";
    setTimeout(() => {
      const first = form.elements.name.value.trim().split(" ")[0];
      $("[data-success-text]", success).textContent = `Thanks ${first}, we’ll reply to ${form.elements.email.value.trim()} within 24 hours.`;
      form.hidden = true;
      success.hidden = false;
      success.classList.add("is-in");
      form.reset();
      counter.textContent = "0/500";
      btn.disabled = false;
      btn.classList.remove("is-loading");
      $("span", btn).textContent = "Send message";
    }, 900);
  });

  $("[data-new-message]")?.addEventListener("click", () => {
    success.hidden = true;
    form.hidden = false;
    form.elements.name.focus();
  });

  /* Preselect topic from links like contact.html?topic=demo */
  const topic = new URLSearchParams(location.search).get("topic");
  if (topic && form.querySelector(`input[name="topic"][value="${topic}"]`)) form.elements.topic.value = topic;
}

/* Live support status (Mon–Fri 10–20, Sat 10–18) */
function initLiveStatus() {
  const el = $("[data-live-status]");
  if (!el) return;
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  const close = day === 0 ? 0 : day === 6 ? 18 : 20;
  const online = day !== 0 && h >= 10 && h < close;
  el.classList.toggle("is-online", online);
  $("[data-live-text]", el).textContent = online
    ? `Support is online now · until ${close}:00`
    : `We’re offline · back ${day === 6 && h >= 18 ? "Monday" : day === 0 ? "Monday" : h >= close ? "tomorrow" : "today"} at 10:00`;
}

/* FAQ: live search + smooth open/close */
function initFaq() {
  const list = $("#faq-list");
  if (!list) return;
  const items = $$("details", list);
  const empty = $(".faq__empty", list);
  $("#faq-search")?.addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((d) => {
      const hit = !q || d.textContent.toLowerCase().includes(q);
      d.hidden = !hit;
      if (hit) shown++;
      if (q && hit) d.open = true;
    });
    empty.hidden = shown > 0;
  });
  if (reducedMotion()) return;
  items.forEach((d) => {
    const summary = $("summary", d);
    const body = $(".faq__body", d);
    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (d.open) {
        body.animate([{ height: `${body.scrollHeight}px`, opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 260, easing: "ease-in" }).onfinish = () => (d.open = false);
      } else {
        d.open = true;
        body.animate([{ height: "0px", opacity: 0 }, { height: `${body.scrollHeight}px`, opacity: 1 }], { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
      }
    });
  });
}

/* About photos: use the real photo when it exists, otherwise fall back to the
   product cut-out so the page never shows a broken image. */
function initPhotoFallbacks() {
  $$("img[data-fallback]").forEach((img) => {
    const media = img.closest(".feature__media");
    const useFallback = () => {
      if (img.dataset.fellBack) return;
      img.dataset.fellBack = "1";
      img.src = img.dataset.fallback;
      media?.classList.add("is-cutout");
    };
    const usePhoto = () => !img.dataset.fellBack && media?.classList.add("has-photo");
    img.addEventListener("error", useFallback);
    img.addEventListener("load", usePhoto);
    if (img.complete) (img.naturalWidth ? usePhoto() : useFallback());
  });
}

/* =========================================================
   Boot
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  Cart.mount();
  QuickView.mount();

  renderList("#offers", ["fossil-gen6", "fossil-gen9", "fossil-gen7"]);
  initRail();
  initStudio();
  renderStores();
  initCatalogue();
  initHero();
  initStage();
  initCounters();
  initProgress();
  initSpotlight();
  initMagnetic();
  initNewsletter();
  initContactForm();
  initLiveStatus();
  initFaq();
  initBackToTop();
  initPhotoFallbacks();

  Wishlist.sync();
  observeReveals();
  document.addEventListener("click", (e) => {
    const w = e.target.closest("[data-wish]");
    if (w) Wishlist.toggle(w.dataset.wish);
  });
});
