// All site content lives here so copy and imagery are easy to update.
//
// Imagery note: the photographs below are Creative Commons placeholders from
// Wikimedia Commons (Java, Indonesia) so the layout can be reviewed with real
// subject matter. Replace each URL in `media`, `ABOUT_STRIP` and `GALLERY` with
// Nima's own frames before the site goes live, then remove IMAGE_CREDIT.

export const BRAND = {
  name: 'Nima Nabizada',
  short: 'Nima',
  tagline: 'Photography Tours',
  email: 'hello@nimanabizada.com',
}

const W = 'https://thumb.wikimedia.org/wikipedia/commons/thumb'

export const IMAGES = {
  bromoPanorama: `${W}/6/6a/Morning_Panorama_view_of_Mount_Bromo_and_Surrounding.jpg/1920px-Morning_Panorama_view_of_Mount_Bromo_and_Surrounding.jpg`,
  borobudurDawn: `${W}/1/1d/Borobudur_Sunrise_2012-01-05.jpg/1920px-Borobudur_Sunrise_2012-01-05.jpg`,
  bromoSunrise: `${W}/d/d0/Gunung_Bromo_sunrise_-_Indonesia.jpg/1920px-Gunung_Bromo_sunrise_-_Indonesia.jpg`,
  prambanan: `${W}/7/72/Prambanan_temple%2C_Central_Java%2C_Indonesia%2C_20220818_1311_9139.jpg/1920px-Prambanan_temple%2C_Central_Java%2C_Indonesia%2C_20220818_1311_9139.jpg`,
  ijenCrater: `${W}/2/28/Crater_of_Kawah_Ijen_volcano%2C_East_Java%2C_Indonesia%2C_20220821_0613_9738.jpg/1920px-Crater_of_Kawah_Ijen_volcano%2C_East_Java%2C_Indonesia%2C_20220821_0613_9738.jpg`,
  sulphurMiner: `${W}/7/73/Kawah-Ijen_Indonesia_Ijen-Sulfur-Miner-09.jpg/1920px-Kawah-Ijen_Indonesia_Ijen-Sulfur-Miner-09.jpg`,
  tumpakSewu: `${W}/8/8f/Air_rerjun_Tumpak_Sewu.jpg/1920px-Air_rerjun_Tumpak_Sewu.jpg`,
  riceTerraces: `${W}/6/6d/Rice_terraces_in_Java_-_Indonesia.jpg/1920px-Rice_terraces_in_Java_-_Indonesia.jpg`,
  horseman: `${W}/2/24/Bromo-Tengger_Horseman.jpg/1920px-Bromo-Tengger_Horseman.jpg`,
  ramayana: `${W}/6/69/Ramayana_Prambanan_4.jpg/1920px-Ramayana_Prambanan_4.jpg`,
  basketWoman: `${W}/7/7e/A_woman_carrying_basket.jpg/1920px-A_woman_carrying_basket.jpg`,
  sandSea: `${W}/d/de/The_Amazing_Tengger_Sand_Sea.jpg/1920px-The_Amazing_Tengger_Sand_Sea.jpg`,
  batik: `${W}/e/e9/Maestro_Batik_Tulis_di_Imogiri.jpg/1920px-Maestro_Batik_Tulis_di_Imogiri.jpg`,
  teaPlantation: `${W}/8/8e/Wonosari_Tea_Plantation%2C_East_Java.jpg/1920px-Wonosari_Tea_Plantation%2C_East_Java.jpg`,
  calderaFog: `${W}/2/2d/View_of_misty_Tengger_caldera%2C_Java%2C_Indonesia%2C_20220820_0610_9479.jpg/1920px-View_of_misty_Tengger_caldera%2C_Java%2C_Indonesia%2C_20220820_0610_9479.jpg`,
  calderaShadow: `${W}/5/57/Bromo-Tengger-Semeru-National-Park_Indonesia_Fog-in-the-Bromo-Caldera-01.jpg/1920px-Bromo-Tengger-Semeru-National-Park_Indonesia_Fog-in-the-Bromo-Caldera-01.jpg`,
  waterfall: `${W}/e/ee/Grenjengan_Kembar_waterfall_in_Magelang_Regency%2C_Indonesia.jpg/1920px-Grenjengan_Kembar_waterfall_in_Magelang_Regency%2C_Indonesia.jpg`,
  birdMarket: `${W}/5/54/Pasty_Pasar_Satwa_dan_Tanaman_Hias_Yogyakarta_-_50775977242.jpg/1920px-Pasty_Pasar_Satwa_dan_Tanaman_Hias_Yogyakarta_-_50775977242.jpg`,
}

export const IMAGE_CREDIT =
  'Sample imagery: Wikimedia Commons (CC BY-SA). Replace with your own work before publishing.'

export const media = {
  hero: IMAGES.bromoPanorama,
  itinerary: IMAGES.horseman,
  pricing: IMAGES.basketWoman,
  contact: IMAGES.riceTerraces,
}

export const NAV = [
  { id: 'gallery', label: 'Gallery', index: '03' },
  { id: 'itinerary', label: 'Schedule', index: '04' },
  { id: 'contact', label: 'Contact', index: '06' },
]

export const SECTIONS = [
  { id: 'home', index: '01', label: 'Home' },
  { id: 'about', index: '02', label: 'About' },
  { id: 'gallery', index: '03', label: 'Selected work' },
  { id: 'itinerary', index: '04', label: 'Schedule' },
  { id: 'pricing', index: '05', label: 'Price' },
  { id: 'contact', index: '06', label: 'Contact' },
]

export const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'Behance', href: 'https://behance.net/' },
]

export const ABOUT_STRIP = [
  IMAGES.borobudurDawn,
  IMAGES.riceTerraces,
  IMAGES.batik,
  IMAGES.ramayana,
  IMAGES.calderaFog,
  IMAGES.basketWoman,
]

export const GALLERY_FILTERS = ['All', 'Landscape', 'People', 'Culture']

export const GALLERY = [
  {
    id: 'g1',
    src: IMAGES.bromoSunrise,
    title: 'Ash Before Sunrise',
    place: 'Mount Bromo, East Java',
    alt: 'Mount Bromo and its surrounding peaks at sunrise',
    category: 'Landscape',
    span: 'wide',
  },
  {
    id: 'g2',
    src: IMAGES.basketWoman,
    title: 'The Basket Carrier',
    place: 'Central Java',
    alt: 'A woman carrying a large woven basket on her back',
    category: 'People',
    span: 'tall',
  },
  {
    id: 'g3',
    src: IMAGES.borobudurDawn,
    title: 'Stupas at First Light',
    place: 'Borobudur, Central Java',
    alt: 'The stone stupas of Borobudur at sunrise',
    category: 'Culture',
    span: 'tall',
  },
  {
    id: 'g4',
    src: IMAGES.tumpakSewu,
    title: 'Water Over Stone',
    place: 'Tumpak Sewu, East Java',
    alt: 'Tumpak Sewu waterfall falling into the rainforest',
    category: 'Landscape',
    span: 'wide',
  },
  {
    id: 'g5',
    src: IMAGES.sulphurMiner,
    title: 'Portrait of a Miner',
    place: 'Kawah Ijen, East Java',
    alt: 'A sulphur miner resting inside the Ijen crater',
    category: 'People',
    span: 'normal',
  },
  {
    id: 'g6',
    src: IMAGES.prambanan,
    title: 'The Gate of Heaven',
    place: 'Prambanan, Central Java',
    alt: 'Stone spires of the Prambanan temple complex',
    category: 'Culture',
    span: 'normal',
  },
  {
    id: 'g7',
    src: IMAGES.calderaShadow,
    title: 'Fog in the Caldera',
    place: 'Bromo Tengger, East Java',
    alt: 'Fog rolling through the Bromo caldera',
    category: 'Landscape',
    span: 'wide',
  },
  {
    id: 'g8',
    src: IMAGES.horseman,
    title: 'The Horseman of Tengger',
    place: 'Bromo Tengger, East Java',
    alt: 'A Tengger horseman on the sand sea of Mount Bromo',
    category: 'People',
    span: 'tall',
  },
  {
    id: 'g9',
    src: IMAGES.ijenCrater,
    title: 'The Sulphur Lake',
    place: 'Kawah Ijen, East Java',
    alt: 'The turquoise acidic lake inside the Kawah Ijen crater',
    category: 'Landscape',
    span: 'normal',
  },
  {
    id: 'g10',
    src: IMAGES.ramayana,
    title: 'Ramayana, Under Open Sky',
    place: 'Prambanan, Central Java',
    alt: 'Performers in costume during the Ramayana ballet at Prambanan',
    category: 'Culture',
    span: 'normal',
  },
  {
    id: 'g11',
    src: IMAGES.batik,
    title: 'Hands of the Batik Master',
    place: 'Imogiri, Central Java',
    alt: 'A batik artisan drawing a pattern by hand',
    category: 'Culture',
    span: 'normal',
  },
  {
    id: 'g12',
    src: IMAGES.waterfall,
    title: 'The Green Gorge',
    place: 'Magelang, Central Java',
    alt: 'Grenjengan Kembar waterfall in a green gorge',
    category: 'Landscape',
    span: 'wide',
  },
]

export const ITINERARY = [
  {
    day: 'Day 1',
    date: '3.08',
    title: 'Yogyakarta — Arrival & Orientation',
    text: 'We meet in the old royal city. After check-in we walk the evening streets of Malioboro and the bird market, talk gear and composition, and shoot the first golden light as the market opens. Dinner together, and a short briefing on the two weeks ahead.',
    tag: 'Arrival · Street photography',
  },
  {
    day: 'Day 2',
    date: '4.08',
    title: 'Borobudur Before Dawn',
    text: 'A 3:30 departure takes us above the mist for sunrise over the largest Buddhist temple on earth. We shoot the stupas in silhouette, then descend to the village fields to photograph farmers at first light.',
    tag: 'Temples · Sunrise',
  },
  {
    day: 'Day 3',
    date: '5.08',
    title: 'Prambanan & the Ramayana',
    text: 'Late afternoon at the Hindu temples of Prambanan, then the Ramayana ballet under open sky — a night of slow shutters, colour, and long-lens portraiture with the performers backstage.',
    tag: 'Culture · Night shoot',
  },
  {
    day: 'Day 4',
    date: '6.08',
    title: 'Towards the Volcano',
    text: 'A long drive east through coffee country to the Tengger caldera. We arrive in time for the blue hour over the Sea of Sand and set up for the sunrise shoot on Mount Bromo the following morning.',
    tag: 'Landscape · Volcano',
  },
  {
    day: 'Day 5',
    date: '7.08',
    title: 'Bromo Sunrise & the Tengger People',
    text: 'The most photographed sunrise in Indonesia — then we turn the lens on the horse riders and offerings of the Tengger community, working quietly with respect and patience.',
    tag: 'Landscape · Portraiture',
  },
  {
    day: 'Day 6',
    date: '8.08',
    title: 'Ijen, Sulphur & the Blue Fire',
    text: 'A night trek with the sulphur miners, head torches and gas masks, to photograph the blue flame and the crater lake at dawn. A hard, unforgettable day of documentary work.',
    tag: 'Documentary · Night trek',
  },
  {
    day: 'Day 7',
    date: '9.08',
    title: 'Waterfalls of Tumpak Sewu',
    text: 'Descend into the canyon of a hundred waterfalls. Long exposures, spray, and the rainforest light that makes this place feel prehistoric. Tripods provided if you travel light.',
    tag: 'Long exposure',
  },
  {
    day: 'Day 8',
    date: '10.08',
    title: 'Tea Country & the Crossing to Bali',
    text: 'Morning in the tea plantations of Wonosari, then the drive and short flight west. Check-in, first edit session with Nima — we review the week’s frames, sequence a small portfolio, and reset for the second half.',
    tag: 'Edit session',
  },
]

export const PRICING = {
  price: '2450 €',
  deposit: 'Deposit — 500 €',
  note: '14 days · 13 nights · max 8 photographers',
  includes: [
    '13 nights in boutique hotels & family guesthouses',
    'All private transfers and internal flights',
    'National park, temple and festival permits',
    'Local guides and translators',
    'Daily photography masterclasses with Nima',
    'Portfolio edit and sequencing session',
    'Breakfast every day, welcome and farewell dinners',
  ],
  excludes: [
    'International flights to Indonesia',
    'Lunches and dinners not listed',
    'Travel insurance (required)',
    'Visa on arrival fees',
    'Personal expenses and equipment rental',
  ],
}

export const DEPARTURES = [
  '3 – 17 August 2027',
  '12 – 26 October 2027',
  '9 – 23 March 2028',
]

export const FAQ = [
  {
    q: 'Do I need professional equipment?',
    a: 'No. A camera with a lens you trust is enough. We shoot in low light and at night, so a body that handles ISO 3200 comfortably helps, but Nima will advise you before you travel.',
  },
  {
    q: 'How fit do I need to be?',
    a: 'Two nights involve walking on volcanic terrain, one of them before dawn. Everything else is gentle. If you can walk two hours with a small backpack, you will be fine.',
  },
  {
    q: 'Is the tour suitable for solo travellers?',
    a: 'Most of our guests travel alone. The group is capped at eight people and we pair rooms only when asked — single supplements are available.',
  },
]
