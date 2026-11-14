# Portfolio: structure

```
index.html                 home page
favicon.svg
css/
  base.css                 shared: tokens, typography, header and menu, buttons, footer
  home.css                 home page only
  case-study.css           every project page
  xray.css                 SEO X-ray panel
js/
  theme-init.js            runs in <head>: saved theme, no flash
  site.js                  shared: theme toggle, footer year, mobile menu
  home.js                  home page: carousels, skill filter, viewer, blueprint lens
  case-study.js            project pages: reveal, rail, slider, count-up, prototype
  xray.js                  SEO X-ray (all pages)
projects/
  _template.html           copy this for each new project
  portfolio-website.html
  seo-report.html
images/  files/            assets (one folder per project inside images/)
```

Add a project: copy `projects/_template.html`, fill it in (the comment at the top explains each block),
then link the project card in `index.html` to it. No CSS or JavaScript changes are needed.
