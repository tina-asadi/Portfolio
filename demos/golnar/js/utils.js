/**
 * Golnar: small helpers shared across the page.
 */

const CM_PER_RAJ = 7; // a raj counts knots across 7 cm of width
const CM_PER_INCH = 2.54;
const KNOTS_PER_WEAVER_DAY = 10000;
const WORKING_DAYS_PER_MONTH = 25;

const priceFormat = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

/** "$18,400" */
const formatPrice = (amount) => priceFormat.format(amount);

/** Runner, Room or Grand, from a carpet's proportions and area. */
function sizeCategory({ width, length }) {
  if (length / width >= 2.5) return 'Runner';
  return (width * length) / 1e4 >= 7.5 ? 'Grand' : 'Room';
}

/**
 * Knot density and loom time for a carpet.
 * @returns {{ perInch: number, perSquareInch: number, total: number, months: number }}
 */
function knotStats(width, length, raj, weavers) {
  const perCm = raj / CM_PER_RAJ;
  const perInch = perCm * CM_PER_INCH;
  const total = width * perCm * (length * perCm);
  const months = total / (KNOTS_PER_WEAVER_DAY * weavers) / WORKING_DAYS_PER_MONTH;
  return {
    perInch: Math.round(perInch),
    perSquareInch: Math.round(perInch * perInch),
    total,
    months: Math.max(1, Math.round(months)),
  };
}

/** Read and write localStorage without throwing in private windows or sandboxes. */
const storage = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: the bag simply won't persist */
    }
  },
};
