/**
 * Golnar: static content for the store.
 * Palettes, weaving cities, the collection and the carpet-guide entries.
 */

/**
 * One palette per weaving city. Each carpet is drawn with indexes into `colors`:
 * 0 field, 1 medallion ring, 2 medallion centre, 3 outline, 4 accent,
 * 5 main border, 6 guard stripe, 7 highlight, 8 border detail, 9 field motif.
 * `geometric` switches the medallion to angular, Heriz and Bijar style drawing.
 */
// prettier-ignore
const PALETTES = {
  kashan:  { colors: ['#8E1F22', '#1F2A4F', '#E9DCC2', '#1A1416', '#C9923E', '#1F2A4F', '#B8473A', '#EADFC8', '#3F6B5E', '#7C1A1E'] },
  tabriz:  { colors: ['#E7DCC6', '#8F2329', '#22305A', '#231B1A', '#B98A45', '#8F2329', '#2E4870', '#F1E8D6', '#5A7A62', '#D9CBAE'] },
  isfahan: { colors: ['#EDE2CA', '#1E3566', '#9C2A2E', '#1B1D2A', '#2F8C8A', '#1E3566', '#C8A35A', '#F5ECD9', '#2F8C8A', '#DFD1B3'] },
  nain:    { colors: ['#EFE7D8', '#3E5F86', '#F6F0E4', '#28344A', '#8AA4BF', '#3E5F86', '#D3C6AC', '#F7F1E5', '#7C8F7A', '#E2D7C2'] },
  qom:     { colors: ['#2E8C8E', '#E2B24F', '#F2E7CF', '#183C45', '#B8463C', '#1D5A62', '#E2B24F', '#F5ECD6', '#7FB8A8', '#287C7E'] },
  heriz:   { colors: ['#A4432D', '#1E3550', '#E5D6BA', '#2A1E1A', '#4E7D80', '#1E3550', '#D8C29A', '#EDE0C8', '#4E7D80', '#933A26'], geometric: true },
  kerman:  { colors: ['#EBD9CF', '#B2626A', '#5E7FA0', '#4A3A44', '#8DA27E', '#B2626A', '#6E8CA8', '#F5EAE2', '#8DA27E', '#E0CABE'] },
  bijar:   { colors: ['#1B2647', '#A5262E', '#E4D3B0', '#10131F', '#C9A048', '#A5262E', '#3E6B6A', '#E9DCC0', '#3E6B6A', '#23305A'], geometric: true },
};

// Pre-compute RGB triplets once; the renderer works with numbers, not hex strings.
for (const palette of Object.values(PALETTES)) {
  palette.rgb = palette.colors.map((hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
}

/** Weaving cities in display order: [English, Persian]. */
const CITIES = [
  ['Kashan', 'کاشان'],
  ['Tabriz', 'تبریز'],
  ['Isfahan', 'اصفهان'],
  ['Nain', 'نائین'],
  ['Qom', 'قم'],
  ['Heriz', 'هریس'],
  ['Kerman', 'کرمان'],
  ['Bijar', 'بیجار'],
];

/** Persian name for each city, keyed by its English name. */
const CITY_FA = Object.fromEntries(CITIES);

/** The collection. Sizes are in centimetres; `raj` is knots per 7 cm of width. */
const RUGS = [
  {
    id: '0417',
    name: 'Shah Abbasi Medallion',
    city: 'Kashan',
    palette: 'kashan',
    width: 200,
    length: 300,
    raj: 50,
    weavers: 2,
    price: 18400,
    material: 'Kork wool pile on cotton',
    dyes: 'Madder, indigo, pomegranate',
    story:
      'A classic Kashan drawing: a navy medallion floating on a madder field, framed by ivory corners. The red has the slight abrash that only hand-dyed wool gives.',
  },
  {
    id: '0233',
    name: 'Mahi Garden',
    city: 'Tabriz',
    palette: 'tabriz',
    width: 250,
    length: 350,
    raj: 60,
    weavers: 3,
    price: 26900,
    material: 'Wool with silk highlights on cotton',
    dyes: 'Madder, indigo, weld',
    story:
      'Tabriz weavers are known for precise drawing. Silk outlines catch the light around the medallion so the design shifts as you walk past.',
  },
  {
    id: '0588',
    name: 'Chahar Bagh',
    city: 'Isfahan',
    palette: 'isfahan',
    width: 155,
    length: 230,
    raj: 70,
    weavers: 2,
    price: 31500,
    material: 'Kork wool and silk on silk foundation',
    dyes: 'Indigo, madder, pomegranate',
    story:
      'Named for the four-part Persian garden. A fine Isfahan with turquoise details and a silk foundation, made to be seen up close.',
  },
  {
    id: '0164',
    name: 'Six La Ivory',
    city: 'Nain',
    palette: 'nain',
    width: 140,
    length: 210,
    raj: 65,
    weavers: 1,
    price: 9800,
    material: 'Wool with silk accents on cotton',
    dyes: 'Indigo, walnut husk',
    story:
      '"Six la" is a Nain grade that refers to the six-ply warp. Ivory and soft blue, with the quiet palette Nain carpets are known for.',
  },
  {
    id: '0702',
    name: 'Firuzeh Silk',
    city: 'Qom',
    palette: 'qom',
    width: 100,
    length: 150,
    raj: 80,
    weavers: 1,
    price: 14200,
    material: 'Silk pile on silk',
    dyes: 'Natural and pure silk tones',
    story:
      'Firuzeh means turquoise. Qom silk is among the finest work in Iran; at 80 raj, a single square inch holds more than 500 knots.',
  },
  {
    id: '0349',
    name: 'Serapi Geometric',
    city: 'Heriz',
    palette: 'heriz',
    width: 240,
    length: 330,
    raj: 30,
    weavers: 2,
    price: 12600,
    material: 'Heavy wool on cotton',
    dyes: 'Madder, indigo, walnut husk',
    story:
      'Heriz carpets are drawn in bold, angular lines and woven densely packed. Built for a busy living room and for generations of use.',
  },
  {
    id: '0815',
    name: 'Rose Lavar',
    city: 'Kerman',
    palette: 'kerman',
    width: 170,
    length: 240,
    raj: 45,
    weavers: 2,
    price: 8900,
    material: 'Kork wool on cotton',
    dyes: 'Madder, indigo, weld',
    story:
      'Kerman weavers favoured softer colour. Rose, slate blue and sage, with a lobed medallion and a gentle, open field.',
  },
  {
    id: '0921',
    name: 'Iron Runner',
    city: 'Bijar',
    palette: 'bijar',
    width: 80,
    length: 300,
    raj: 40,
    weavers: 1,
    price: 6400,
    material: 'Wool, tightly beaten, on cotton',
    dyes: 'Indigo, madder, pomegranate',
    story:
      'Bijars are called the iron rugs of Persia because the wefts are beaten so hard the carpet barely folds. A hallway runner that will not wear out.',
  },
];

/** The carpet drawn in "How to read a Persian carpet". */
const STUDY_RUG = {
  id: '0102',
  name: 'Study piece',
  city: 'Tabriz',
  palette: 'tabriz',
  width: 200,
  length: 300,
};

/**
 * Carpet-guide entries. `region` matches the region codes in carpet.js:
 * 1 guard stripes, 3 main border, 4 field, 5 medallion, 6 corners, 7 fringe.
 */
const CARPET_PARTS = [
  {
    region: 5,
    fa: 'ترنج',
    transliteration: 'Toranj',
    name: 'Medallion',
    text: 'The central motif. Weavers often compare it to a pool or a fountain in a garden seen from above. The small shapes above and below it are pendants.',
  },
  {
    region: 6,
    fa: 'لچک',
    transliteration: 'Lachak',
    name: 'Corner spandrels',
    text: 'Quarter medallions in each corner. They echo the centre, so the design seems to continue past the edges of the frame.',
  },
  {
    region: 4,
    fa: 'متن',
    transliteration: 'Matn',
    name: 'Field',
    text: 'The ground the medallion sits on. Its colour usually names the carpet, as in a red-field Kashan or an ivory-field Nain.',
  },
  {
    region: 3,
    fa: 'حاشیه',
    transliteration: 'Hashieh',
    name: 'Main border',
    text: "The widest frame, here a row of rosettes joined by a winding vine. A carpet's corners show how carefully the border was planned.",
  },
  {
    region: 1,
    fa: 'حاشیه کوچک',
    transliteration: 'Hashieh-ye kuchak',
    name: 'Guard stripes',
    text: 'Narrow bands on either side of the main border. They hold the composition together, like the mat around a framed picture.',
  },
  {
    region: 7,
    fa: 'ریشه',
    transliteration: 'Risheh',
    name: 'Fringe',
    text: 'The ends of the warp threads the whole carpet is knotted on. On a hand-knotted piece the fringe is part of the structure, never sewn on.',
  },
];
