/* Mobile menu behavior. Load AFTER script.js (it adds to the menu, never replaces it).
   Adds: aria-expanded, a ✕ icon when open, Esc to close, click outside to close,
   and auto-close when the window grows back to desktop width. */
(() => {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;

  btn.setAttribute('aria-controls', 'menu');
  btn.setAttribute('aria-expanded', 'false');
  if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Menu');
  const textIcon = btn.children.length === 0; // only swap the icon if it is plain text

  const sync = () => {
    const open = menu.classList.contains('show');
    btn.setAttribute('aria-expanded', String(open));
    if (textIcon) btn.textContent = open ? '✕' : '☰';
  };
  const close = () => { menu.classList.remove('show'); sync(); };

  btn.addEventListener('click', () => setTimeout(sync, 0));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setTimeout(sync, 0); });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('show') && !menu.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('show')) {
      const focusWasInside = menu.contains(document.activeElement);
      close();
      if (focusWasInside) btn.focus();
    }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', close);
  sync();
})();