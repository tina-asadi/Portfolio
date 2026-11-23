/* =========================================================
   Data — single source of truth for every page
   ========================================================= */
const IMG = "assets/images/";

const PRODUCTS = [
  /* ---- Smart watches ---- */
  {
    id: "fossil-smart-luxury",
    name: "Fossil Super Luxury",
    category: "smartwatch",
    price: 399.0,
    image: IMG + "fossil-smart-luxury.webp",
    description: "Combines timeless elegance with modern craftsmanship, offering precision for a truly luxurious experience.",
    features: ["1.28″ AMOLED display", "Heart-rate & step rings", "Wear OS by Google", "Fast charging"],
  },
  {
    id: "fossil-gen7",
    name: "Fossil Gen 7",
    category: "smartwatch",
    price: 503.68,
    oldPrice: 599.0,
    image: IMG + "fossil-gen7.webp",
    description: "All-black stainless steel case, an always-on AMOLED display and Wear OS, made for everyday wear.",
    features: ["1.28″ AMOLED display", "Heart-rate & SpO2", "Up to 24h battery", "Water resistant 3 ATM"],
  },
  {
    id: "fossil-gen9",
    name: "Fossil Gen 9",
    category: "smartwatch",
    price: 908.99,
    image: IMG + "fossil-gen9.webp",
    description: "A rose-gold case set with crystals and a soft lavender strap. A statement piece that keeps up with your day.",
    features: ["Crystal-set bezel", "Wellness & sleep tracking", "Contactless payments", "Fast charging"],
  },
  {
    id: "fossil-gen6",
    name: "Fossil Gen 6",
    category: "smartwatch",
    price: 209.76,
    oldPrice: 279.0,
    image: IMG + "fossil-gen6.webp",
    description: "Bold orange complications on a matte black case. Sporty, fast and easy to read at a glance.",
    features: ["Snapdragon Wear 4100+", "Built-in GPS", "Fast charge to 80% in 30 min", "Swim-proof"],
  },
  {
    id: "aura-rose",
    name: "Aura Rose",
    category: "smartwatch",
    price: 329.0,
    image: IMG + "aura-rose.webp",
    description: "A slim, lightweight case in champagne gold with a blush silicone strap.",
    features: ["Lightweight 32 g", "Cycle & stress tracking", "7-day battery", "Custom watch faces"],
  },
  {
    id: "ivory-classic",
    name: "Ivory Classic",
    category: "smartwatch",
    price: 289.0,
    image: IMG + "ivory-classic.webp",
    description: "A traditional analog face on a modern smartwatch, with a polished steel case and ivory strap.",
    features: ["Hybrid analog display", "Notification alerts", "14-day battery", "Sapphire glass"],
  },
  {
    id: "pulse-sport",
    name: "Pulse Sport",
    category: "smartwatch",
    price: 199.0,
    image: IMG + "pulse-sport.webp",
    description: "Big, bright numerals and live training stats. Built for runners and gym days.",
    features: ["100+ workout modes", "Live heart-rate zones", "10-day battery", "5 ATM water rating"],
  },
  {
    id: "venu-lilac",
    name: "Venu Lilac",
    category: "smartwatch",
    price: 449.0,
    image: IMG + "venu-lilac.webp",
    description: "A soft lilac fitness smartwatch with a vivid AMOLED screen and on-wrist calls.",
    features: ["AMOLED display", "Bluetooth calls", "Body Battery energy", "Up to 10 days battery"],
  },
  {
    id: "titan-weave",
    name: "Titan Weave",
    category: "smartwatch",
    price: 379.0,
    image: IMG + "titan-weave.webp",
    description: "A titanium case and woven nylon strap that look like a classic watch and work like a smart one.",
    features: ["Titanium case", "Readiness score", "Dual-band GPS", "14-day battery"],
  },

  /* ---- Outdoor ---- */
  {
    id: "epix-pro",
    name: "Epix Pro",
    category: "outdoor",
    price: 899.0,
    image: IMG + "epix-pro.webp",
    description: "A premium adventure watch with an AMOLED display, a built-in LED flashlight and full topo maps.",
    features: ["Topo maps on wrist", "LED flashlight", "Multi-band GPS", "16-day battery"],
  },
  {
    id: "fenix-7",
    name: "Fenix 7",
    category: "outdoor",
    price: 699.0,
    image: IMG + "fenix-7.webp",
    description: "A rugged multisport GPS watch with a touchscreen, button controls and training readiness.",
    features: ["Touch + 5 buttons", "Training readiness", "Solar charging option", "10 ATM"],
  },
  {
    id: "instinct-solar",
    name: "Instinct Solar",
    category: "outdoor",
    price: 399.0,
    image: IMG + "instinct-solar.webp",
    description: "Built to U.S. military standards. Unlimited battery life in sunlight, in a tough navy case.",
    features: ["Solar charging", "MIL-STD-810 tested", "Tactical features", "Unlimited battery*"],
  },

  /* ---- Bands ---- */
  ...[
    ["band-mint", "Soft Mint Sport Band", "#cfe9d6"],
    ["band-pink", "Light Pink Sport Band", "#f2d4d7"],
    ["band-blue", "Light Blue Sport Band", "#b9d3e6"],
    ["band-midnight", "Midnight Sport Band", "#232a33"],
    ["band-starlight", "Starlight Sport Band", "#e8dfd2"],
    ["band-storm-blue", "Storm Blue Sport Band", "#40566b"],
    ["band-red", "Red Sport Band", "#e0313f"],
    ["band-clay", "Clay Sport Band", "#8a7a72"],
  ].map(([id, name, swatch]) => ({
    id,
    name,
    category: "band",
    price: 49.0,
    swatch,
    image: IMG + id + ".webp",
    description: "Soft, durable fluoroelastomer with a pin-and-tuck closure. Fits 41–45 mm cases.",
    features: ["Fits 41–45 mm cases", "Sweat & water resistant", "Tool-free swap", "S/M and M/L included"],
  })),
];

const CATEGORY_LABEL = {
  smartwatch: "Smart Watch",
  outdoor: "Outdoor",
  band: "Band",
};

/* Hero carousel */
const HERO_SLIDES = [
  {
    eyebrow: "Smart Watch",
    title: "Fossil",
    subtitle: "Super Luxury",
    text: "Combines timeless elegance with modern craftsmanship, offering precision for a truly luxurious experience.",
    productId: "fossil-smart-luxury",
  },
  {
    eyebrow: "New Arrival",
    title: "Fossil Gen 9",
    subtitle: "Rose Edition",
    text: "A crystal-set rose-gold case with a soft lavender strap. A statement piece that keeps up with your day.",
    productId: "fossil-gen9",
  },
  {
    eyebrow: "Outdoor",
    title: "Epix Pro",
    subtitle: "Built for Adventure",
    text: "Topo maps, a built-in flashlight and 16 days of battery life, made for long days off the grid.",
    productId: "epix-pro",
  },
];

/* Smart Watch Studio cascade, matching the Figma layout.
   Desktop coords are % of the whole grey box; mobile coords are % of the
   collage area under the text.
   [productId, x, y, width, mobileX, mobileY, mobileWidth] */
const STUDIO_LAYOUT = [
  ["pulse-sport", 81, -4, 11, 74, 0, 20],
  ["ivory-classic", 68, 20, 9.5, 52, 8, 18],
  ["titan-weave", 81, 34, 11, 76, 30, 22],
  ["aura-rose", 55, 36, 9.5, 28, 14, 18],
  ["fenix-7", 68, 56, 10, 52, 40, 19],
  ["instinct-solar", 42, 58, 10.5, 6, 36, 20],
  ["epix-pro", 55, 72, 10, 30, 50, 19],
  ["fossil-gen6", 81, 72, 11.5, 72, 64, 22],
  ["venu-lilac", 30, 76, 9.5, 8, 72, 18],
];

/* Stores — open/close hours are 24h, local time */
const STORES = [
  {
    name: "Miami Mall",
    photo: IMG + "about/store-miami.jpg",
    address: ["7535 Dadeland Mall", "Miami, FL 33156"],
    open: 10,
    close: 19,
    phone: "+1 (305) 555-0142",
  },
  {
    name: "Valley Mall",
    photo: IMG + "about/store-valley-mall.jpg",
    address: ["4325 Glenwood Avenue", "Raleigh, NC 27612"],
    open: 10,
    close: 19,
    phone: "+1 (919) 555-0187",
  },
  {
    name: "Valley Plaza",
    photo: IMG + "about/store-valley-plaza.jpg",
    address: ["2701 Ming Avenue", "Bakersfield, CA 93304"],
    open: 10,
    close: 20,
    phone: "+1 (661) 555-0119",
  },
];

const FREE_SHIPPING = 500;
