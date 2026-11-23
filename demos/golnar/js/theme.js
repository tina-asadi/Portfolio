/**
 * Golnar: theme override.
 * Loaded in <head> (not deferred) so the theme is set before first paint.
 * `?theme=light` or `?theme=dark` fixes the theme, which the portfolio case study
 * uses to preview both; with no parameter the page follows the visitor's system setting.
 */
(() => {
  try {
    const theme = new URLSearchParams(location.search).get('theme');
    if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  } catch {
    /* ignore: the page falls back to the system theme */
  }
})();
