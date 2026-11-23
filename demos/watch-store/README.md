# Watch — Smart Watch Store

A responsive, interactive storefront built from the **"Ui Project"** Figma file (`watch-store-high-fidelity` frames).
Plain HTML, CSS and JavaScript, no build step or dependencies.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| About Us / Our Stores | `about.html` |
| Products | `products.html` |
| Contact + FAQ | `contact.html` |

## Interactive features

- **Hero carousel**: auto-play with a progress ring on the active dot, arrows, keyboard (← →), swipe on touch, pause on hover/focus, 3D tilt and float on the watch
- **Quick view modal** (native `<dialog>`): click any product image, studio watch or search result; includes quantity, colour swatches for bands, and wishlist
- **Cart drawer**: add, change quantity, remove, subtotal, free-shipping progress bar ($500), saved in `localStorage`
- **Wishlist**: heart any product; header badge; filter at `products.html?category=wishlist`
- **Live search**: header search (press `/` anywhere) with instant suggestions
- **Products page**: category chips, search, sort, result count; filters are kept in the URL so links can be shared
- **Smart Watch Studio**: interactive collage; hover a watch to focus it and see its name and price, click to open it
- **Accessories rail**: scroll-snap carousel with arrow buttons
- **Stores**: live "Open / Closed" status, Google Maps directions and tap-to-call
- **Forms**: newsletter and contact validation, character counter, topic preselected from links (`contact.html?topic=demo`)
- **Polish**: 3D New Generation stage with hotspots, scroll reveals, solid header on scroll, back-to-top, toast with "View cart" action

## UX & accessibility decisions

- All tap targets are at least 44 × 44 px; buttons are 48 px tall
- Fluid type scale (`clamp`) and consistent section spacing; product images trimmed and contained so every card lines up
- Clear add-to-cart confirmation (the button switches to "Added ✓"), sale badges with the original price, free-shipping nudge
- Skip link, visible focus rings, ARIA labels, live regions, `aria-pressed` on toggles, Escape closes overlays
- Respects `prefers-reduced-motion`
- Images converted to WebP, trimmed and lazy-loaded (≈ 420 KB total)
- Copy fixes from the design: "Add to card" → "Add to cart", "Supper" → "Super", "Servises" → "Services"

## About-page photos

Export these from the Figma **Desktop about us** frame (JPG, 2x) into `assets/images/about/`.
Until a file is there, the page uses a watch product shot (or a map tile for stores), so nothing looks broken.

| File | Photo in Figma |
| --- | --- |
| `store-miami.jpg` | Miami Mall store interior |
| `store-valley-mall.jpg` | Valley Mall store front |
| `store-valley-plaza.jpg` | Valley Plaza store front |
| `about-shopping.jpg` | Woman checking her smart watch ("Best Online Shopping Experience") |
| `about-tradein.jpg` | Man adjusting his watch ("Bring in an eligible device…") |
| `about-support.jpg` | Hands fitting a smart watch ("Get expert service and support") |
| `about-business.jpg` | Analog watch at a desk ("Small Business Team") |

## Structure

```
watch-store/
├── index.html · about.html · products.html · contact.html
├── css/styles.css
├── js/products.js   # products, hero slides, studio layout, stores
├── js/main.js       # header/footer, cart, wishlist, quick view, carousel, filters, forms
└── assets/images/   # WebP product images from Figma
```

To add or edit a product, change `js/products.js`. Every page updates automatically.
