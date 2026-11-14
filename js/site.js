/* site.js: shared by every page
   Theme toggle · Footer year · Mobile menu */
(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);

  /* ---------- Theme (the saved theme is applied earlier by theme-init.js) ---------- */
  $('#themeToggle')?.addEventListener('click', () => {
    const root = document.documentElement;
    root.classList.toggle('light');
    try { localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark'); } catch (_) { /* storage blocked */ }
  });

  /* ---------- Footer year ---------- */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const btn = $('#hamburger');
  const menu = $('#menu');
  if (!btn || !menu) return;
  const textIcon = btn.children.length === 0;

  const setOpen = (open) => {
    menu.classList.toggle('show', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (textIcon) btn.textContent = open ? '✕' : '☰';
  };

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('show')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('show') && !menu.contains(e.target) && !btn.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !menu.classList.contains('show')) return;
    const focusInside = menu.contains(document.activeElement);
    setOpen(false);
    if (focusInside) btn.focus();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', () => setOpen(false));
})();
