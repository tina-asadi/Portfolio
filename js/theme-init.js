/* Runs in <head>, before the page paints.
   Applies the saved theme (so there is no flash) and marks that JavaScript is available. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  try {
    if (localStorage.getItem('theme') === 'light') root.classList.add('light');
  } catch (_) { /* storage blocked: keep the default dark theme */ }
})();
