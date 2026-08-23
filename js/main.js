const STORE_EMAIL = 'Adoarraa@gmail.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${STORE_EMAIL}`;
const CART_STORAGE_KEY = 'marteder-cart';

const OUT_OF_STOCK_PRODUCT_IDS = new Set(['1', '2']);
const OUT_OF_STOCK_NAMES = [
  'Bazin Riche Getzner Authentique (Schwer) – Lot de 5 Yards',
  'Bazin riche doré brodé',
];

function isOutOfStockProduct(productId, productName) {
  if (productId != null && OUT_OF_STOCK_PRODUCT_IDS.has(String(productId))) return true;
  if (!productName) return false;
  return OUT_OF_STOCK_NAMES.some((name) => productName === name || productName.startsWith(name));
}

function purgeOutOfStockFromCart() {
  const before = cart.length;
  cart = cart.filter((item) => !isOutOfStockProduct(null, item.name));
  if (cart.length !== before) saveCart();
}

const products = {
  9: {
    name: 'Coffret Soin Visage OKADY Pearl – Rituel Éclat & Anti-Âge (7 pièces)',
    price: 69,
    stripeProduct: 'okady',
  },
  10: {
    name: 'Gel Essence Réparateur au Collagène (D-nutrimec · 30 g)',
    price: 30,
    stripeProduct: 'dnutrimec',
  },
};

const STRIPE_PRODUCTS = {
  getzner: {
    unitPrice: 80,
    label: 'Bazin Getzner',
  },
  getznerWifi: {
    unitPrice: 85,
    label: 'Bazin Getzner Motif Wifi',
    paymentLink: 'https://buy.stripe.com/4gM5kEc371EQ2NV5IvcAo0w',
  },
  meches: {
    unitPrice: 5,
    label: 'Mèches X-Pression Ultra Braid',
  },
  frenchCurls: {
    unitPrice: 13.5,
    label: 'Extensions French Curls (24" / 150g)',
  },
  okady: {
    unitPrice: 69,
    label: 'Coffret OKADY Pearl',
  },
  dnutrimec: {
    unitPrice: 30,
    label: 'Gel Essence Réparateur au Collagène',
  },
  bazinBrode: {
    unitPrice: 80,
    label: 'Bazin Brodé Géométrique & Cérémonie',
    paymentLink: 'https://buy.stripe.com/aFabJ29UZerCgEL3AncAo0x',
  },
  dentelleSuisse: {
    unitPrice: 250,
    label: 'Dentelle Suisse Haute Cérémonie',
    paymentLink: 'https://buy.stripe.com/28E5kE3wB83ecov1sfcAo0y',
  },
};

/**
 * URL de l'API qui crée la Checkout Session Stripe (panier complet).
 * - Hébergé sur Netlify : chemins relatifs /.netlify/functions/...
 * - Hébergé sur GitHub Pages : window.MARTEDER_STRIPE_CHECKOUT_URL
 *   (voir js/stripe-config.js) vers l’URL absolue Netlify.
 */
function isGitHubPagesHost() {
  try {
    return /\.github\.io$/i.test(window.location.hostname);
  } catch {
    return false;
  }
}

function getConfiguredCheckoutApiUrl() {
  return String(window.MARTEDER_STRIPE_CHECKOUT_URL || '').trim();
}

const STRIPE_CHECKOUT_API_URL =
  getConfiguredCheckoutApiUrl() ||
  '/.netlify/functions/create-checkout-session';

const GETZNER_WIFI_STRIPE_LINK =
  STRIPE_PRODUCTS.getznerWifi.paymentLink ||
  'https://buy.stripe.com/4gM5kEc371EQ2NV5IvcAo0w';

function getStripeCheckoutApiFallbacks() {
  const list = [];
  const configured = getConfiguredCheckoutApiUrl();
  if (configured) list.push(configured);

  // Sur GitHub Pages, les chemins Netlify relatifs ne marchent jamais.
  if (!isGitHubPagesHost()) {
    list.push('/.netlify/functions/create-checkout-session');
    list.push('/api/create-checkout-session');
  }

  // Toujours tenter aussi l’URL relative si l’hôte n’est pas GH Pages
  if (STRIPE_CHECKOUT_API_URL && !list.includes(STRIPE_CHECKOUT_API_URL)) {
    list.unshift(STRIPE_CHECKOUT_API_URL);
  }

  return list.filter((url, index, arr) => url && arr.indexOf(url) === index);
}

const STRIPE_PENDING_KEY = 'marteder-stripe-pending';
const TWINT_NUMBER = '+41 76 842 96 83';
const WHATSAPP_ORDER = '41765761672';

const TISSUS_SCHWER = 'images/tissus';

const schwerLocal = {
  violet: `${TISSUS_SCHWER}/violet.jpg`,
  'vert-clair': `${TISSUS_SCHWER}/vert-clair.jpg`,
  blanc: `${TISSUS_SCHWER}/blanc.jpg`,
  'beige-dore': `${TISSUS_SCHWER}/beige-dore.jpg`,
};

/**
 * Images de secours Getzner Schwer — VIDÉES le 09.08.2026.
 * Elles pointaient vers des photos de banque d'images (Unsplash) qui ne sont
 * pas nos tissus. Déposez vos vraies photos dans images/tissus/ avec les noms
 * indiqués dans images/tissus/LISEZMOI.txt : le code les prendra tout seul.
 */
const schwerFallback = {
  violet: '',
  'vert-clair': '',
  blanc: '',
  'beige-dore': '',
};

const GETZNER_ARRIVAL_CATALOG = [
  { id: 'pal1', file: 'getzner-pal1.jpg', label: 'Blanc damassé' },
  { id: 'pal2', file: 'getzner-pal2.jpg', label: 'Violet' },
  { id: 'pal3', file: 'getzner-pal3.jpg', label: 'Jaune or' },
  { id: 'pal4', file: 'getzner-pal4.jpg', label: 'Blanc argenté' },
  { id: 'pal5', file: 'getzner-pal5.jpg', label: 'Bronze' },
  { id: 'pal6', file: 'getzner-pal6.jpg', label: 'Fuchsia' },
  { id: 'pal7', file: 'getzner-pal7.jpg', label: 'Rose clair' },
  { id: 'pal8', file: 'getzner-pal8.jpg', label: 'Vert olive clair' },
  { id: 'pal9', file: 'getzner-pal9.jpg', label: 'Noir anthracite' },
  { id: 'pal11', file: 'getzner-pal11.jpg', label: "Jaune d'or" },
  { id: 'pal12', file: 'getzner-pal12.jpg', label: 'Vert olive' },
  { id: 'pal13', file: 'getzner-pal13.jpg', label: 'Vert forêt' },
  { id: 'pal14', file: 'getzner-pal14.jpg', label: 'Bleu cobalt' },
  { id: 'pal15', file: 'getzner-pal15.jpg', label: 'Bleu ciel' },
  { id: 'pal16', file: 'getzner-pal16.jpg', label: 'Jaune moutarde' },
];

const GETZNER_ARRIVAL_IDS = new Set(GETZNER_ARRIVAL_CATALOG.map((item) => item.id));

function getGetznerArrivalVariant(id) {
  return GETZNER_ARRIVAL_CATALOG.find((item) => item.id === id) || null;
}

function buildGetznerArrivalVariants() {
  return GETZNER_ARRIVAL_CATALOG.reduce((acc, item) => {
    acc[item.id] = {
      label: item.label,
      image: item.file,
      palId: item.id,
      alt: `Getzner — ${item.label}`,
    };
    return acc;
  }, {});
}

const fabricProducts = {
  'getzner-wifi': {
    baseName: 'Bazin Getzner Motif Wifi (Authentique / 5 yards - 4 mètres)',
    price: 85,
    packNote: 'Coupon de 5 yards (4 mètres)',
    previewPrefix: 'Coloris sélectionné',
    defaultVariant: 'bleu',
    stripeProduct: 'getznerWifi',
    variants: {
      bleu: {
        label: 'Bleu irisé',
        image: 'getzner-wifi-bleu.jpg',
        alt: 'Bazin Getzner motif Wifi — coloris bleu irisé',
      },
      bordeaux: {
        label: 'Bordeaux or',
        image: 'getzner-wifi-bordeaux.jpg',
        alt: 'Bazin Getzner motif Wifi — coloris bordeaux or',
      },
    },
  },
  'marteder-getzner': {
    baseName: 'Création exclusive Marteder',
    price: 80,
    packNote: 'Par coupon de 5 yards',
    previewPrefix: 'Couleur sélectionnée',
    defaultVariant: 'pal1',
    stripeProduct: 'getzner',
    variants: buildGetznerArrivalVariants(),
  },
  'bazin-brode': {
    baseName: 'Bazin Brodé Géométrique & Cérémonie',
    price: 80,
    packNote: 'Coupon 5 yards / 4,5 m',
    previewPrefix: 'Coupon sélectionné',
    defaultVariant: 'coupon',
    stripeProduct: 'bazinBrode',
    paymentLink: 'https://buy.stripe.com/aFabJ29UZerCgEL3AncAo0x',
    variants: {
      coupon: {
        label: 'Coupon 5 yards / 4,5 m',
        image: 'images/ceremonie/a1.jpg',
        alt: 'Bazin brodé géométrique blanc, coupon de cérémonie',
      },
    },
  },
  'dentelle-suisse': {
    baseName: 'Dentelle Suisse Haute Cérémonie – Motifs Floraux & Cristaux',
    price: 250,
    packNote: 'Coupon 5 yards / 4,5 m',
    previewPrefix: 'Coupon sélectionné',
    defaultVariant: 'coupon',
    stripeProduct: 'dentelleSuisse',
    paymentLink: 'https://buy.stripe.com/28E5kE3wB83ecov1sfcAo0y',
    variants: {
      coupon: {
        label: 'Coupon 5 yards / 4,5 m',
        image: 'images/ceremonie/b1.jpg',
        alt: 'Dentelle suisse haute cérémonie, motifs floraux et cristaux',
      },
    },
  },
  1: {
    baseName: 'Bazin Riche Getzner Authentique (Schwer) – Lot de 5 Yards',
    price: 80,
    packNote: 'Vendu en lot de 5 yards',
    previewPrefix: 'Couleur sélectionnée',
    defaultVariant: 'beige-dore',
    stripeProduct: 'getzner',
    variants: {
      violet: {
        label: 'Getzner Schwer — Violet',
        image: schwerFallback.violet,
        localImage: schwerLocal.violet,
        alt: 'Bazin Getzner Schwer violet améthyste',
      },
      'vert-clair': {
        label: 'Getzner Schwer — Vert Clair',
        image: schwerFallback['vert-clair'],
        localImage: schwerLocal['vert-clair'],
        alt: 'Bazin Getzner Schwer vert clair',
      },
      blanc: {
        label: 'Getzner Schwer — Blanc',
        image: schwerFallback.blanc,
        localImage: schwerLocal.blanc,
        alt: 'Bazin Getzner Schwer blanc',
      },
      'beige-dore': {
        label: 'Getzner Schwer — Beige / Doré',
        image: schwerFallback['beige-dore'],
        localImage: schwerLocal['beige-dore'],
        alt: 'Bazin Getzner Schwer beige doré',
      },
    },
  },
  2: {
    baseName: 'Bazin riche doré brodé',
    price: 120,
    packNote: 'Vendu par lot de 3 pagnes',
    previewPrefix: 'Modèle sélectionné',
    defaultVariant: 'or-classique',
    variants: {
      'or-classique': {
        label: 'Or classique brodé',
        image: '',
        alt: 'Bazin doré brodé or classique',
      },
      'or-rose': {
        label: 'Or rose brodé',
        image: '',
        alt: 'Bazin doré brodé or rose',
      },
    },
  },
  3: {
    baseName: 'Wax hollandais Vlisco',
    price: 45,
    packNote: 'Vendu par lot de 3 pagnes',
    previewPrefix: 'Motif sélectionné',
    defaultVariant: 'classique',
    variants: {
      classique: {
        label: 'Motif classique',
        image: '',
        alt: 'Wax hollandais Vlisco motif classique',
      },
      indigo: {
        label: 'Motif indigo',
        image: '',
        alt: 'Wax hollandais Vlisco motif indigo',
      },
      floral: {
        label: 'Motif floral',
        image: '',
        alt: 'Wax hollandais Vlisco motif floral',
      },
    },
  },
  4: {
    baseName: 'Wax super wax motifs géométriques',
    price: 38,
    packNote: 'Vendu par lot de 3 pagnes',
    previewPrefix: 'Motif sélectionné',
    defaultVariant: 'geo-noir',
    variants: {
      'geo-noir': {
        label: 'Géométrique noir & or',
        image: '',
        alt: 'Wax super wax géométrique noir et or',
      },
      'geo-rouge': {
        label: 'Géométrique rouge',
        image: '',
        alt: 'Wax super wax géométrique rouge',
      },
      'geo-bleu': {
        label: 'Géométrique bleu',
        image: '',
        alt: 'Wax super wax géométrique bleu',
      },
    },
  },
  6: {
    baseName: 'Pagne wax premium multicolore',
    price: 42,
    packNote: 'Vendu par lot de 3 pagnes',
    previewPrefix: 'Modèle sélectionné',
    defaultVariant: 'multi-vif',
    variants: {
      'multi-vif': {
        label: 'Multicolore vif',
        image: '',
        alt: 'Pagne wax premium multicolore vif',
      },
      'multi-terre': {
        label: 'Tons terre',
        image: '',
        alt: 'Pagne wax premium tons terre',
      },
      'multi-sunset': {
        label: 'Sunset orange',
        image: '',
        alt: 'Pagne wax premium sunset orange',
      },
    },
  },
};

const xpressionProductName = 'X-Pression Ultra Braid';
const frenchCurlProductName = 'Extensions de Cheveux Tressés Frisés – French Curls (24 Pouces / 150g)';

/**
 * Référence fournisseur Alibaba (échantillon / réassort).
 * Sert au suivi interne et aux e-mails de commande — ne passe pas les
 * commandes clients automatiquement sur Alibaba (pas d’API dropshipping).
 */
const FRENCH_CURL_SUPPLIER = {
  name: 'Zhengzhou Yinesi International Trade Co., Ltd.',
  productTitle:
    'Box Spiral French Curl Braiding Hair Extensions 12 Inch 24 Inch 150g/Pack',
  alibabaOrderNo: '29605148501040027',
  specs: '24 Inch · 150g/Pack (Box Spiral French Curl)',
  platform: 'Alibaba',
};

const xpressionImages = {
  clean: {
    src: 'xpression-paquets-propres.png',
    alt: 'Paquets de mèches X-Pression Ultra Braid — 5.00 CHF',
  },
  portrait: {
    src: 'rasta-model.png',
    alt: 'X-Pression Ultra Braid — modèle coiffé au salon Marteder',
  },
  closeup: {
    src: 'rasta-zoom.jpg',
    alt: 'X-Pression Ultra Braid — gros plan sur les tresses',
  },
  pack1b: {
    src: 'images/meches/xpression-pack-1b.jpg',
    alt: 'Paquets X-Pression Ultra Braid — teinte 1B Noir naturel',
  },
  pack350: {
    src: 'images/meches/xpression-pack-350.jpg',
    alt: 'Paquet X-Pression Ultra Braid — teinte 350 Cuivré Roux',
  },
  pack2: {
    src: 'images/meches/xpression-pack-2-brun.jpg',
    alt: 'Paquet X-Pression Ultra Braid — teinte 2 Brun foncé',
  },
  color1: {
    src: 'xpression-color-1.png',
    alt: 'Coque de mèches X-Pression — Color 1',
  },
  color1b: {
    src: 'xpression-color-1b.png',
    alt: 'Coque de mèches X-Pression — Color 1B',
  },
};

const xpressionVariants = {
  '1b': {
    label: 'Teinte 1B (Noir naturel)',
    shortLabel: '1B — Noir naturel',
    imageKey: 'clean',
    price: 5,
    stripeProduct: 'meches',
  },
  '350': {
    label: 'Teinte 350 (Cuivré / Roux)',
    shortLabel: '350 — Cuivré / Roux',
    imageKey: 'pack350',
    price: 5,
    stripeProduct: 'meches',
  },
  '2': {
    label: 'Teinte 2 (Brun foncé)',
    shortLabel: '2 — Brun foncé',
    imageKey: 'pack2',
    price: 5,
    stripeProduct: 'meches',
  },
};

/** Galerie French Curls — nouvelles photos Inez (cadrage vertical, fond clair) */
const FRENCH_CURL_MEDIA = [
  { file: 'Screenshot_20260805_221015_Gallery.jpg', alt: 'French Curls — modèle porté, longues mèches ondulées', color: null },
  { file: 'french-curl-collection.jpg', alt: 'French Curls — aperçu de la collection', color: null },
  { file: 'french-curl-nuancier.jpg', alt: 'French Curls — nuancier des teintes (dont Noir 1B)', color: '1b' },
  { file: 'french-curl-27.jpg', alt: 'French Curls — Blond 27#', color: '27' },
  { file: 'french-curl-mes11.jpg', alt: 'French Curls — Marron 30#', color: '30' },
  { file: 'french-curl-350.jpg', alt: 'French Curls — Roux 350 / Cuivré', color: '350' },
  { file: 'french-curl-t27.jpg', alt: 'French Curls — Ombré Blond T27', color: 't27' },
  { file: 'french-curl-ot27.jpg', alt: 'French Curls — Ombré Blond T27, autre vue', color: 't27' },
  { file: 'french-curl-t30.jpg', alt: 'French Curls — Ombré Marron T30', color: 't30' },
  { file: 'french-curl-tbug.jpg', alt: 'French Curls — Bordeaux T-Bug', color: 'tbug' },
  { file: 'french-curl-mes10.jpg', alt: 'French Curls — Ombré Noir / Cuivré', color: 'cuivre' },
  { file: 'french-curl-t350.jpg', alt: 'French Curls — Ombré Cuivré T350', color: 'cuivre' },
  { file: 'french-curl-ombre-cuivre.jpg', alt: 'French Curls — Ombré cuivré', color: 'cuivre' },
  { file: 'french-curl-t1b-33.jpg', alt: 'French Curls — Ombré T1B/33', color: 't1b33' },
  { file: 'french-curl-bug.jpg', alt: 'French Curls — Bordeaux Bug', color: 'bug' },
  { file: 'french-curl-red.jpg', alt: 'French Curls — Rouge', color: 'red' },
  { file: 'french-curl-pink.jpg', alt: 'French Curls — Rose', color: 'pink' },
  { file: 'french-curl-green.jpg', alt: 'French Curls — Vert', color: 'green' },
  { file: 'french-curl-grey.jpg', alt: 'French Curls — Gris', color: 'grey' },
  { file: 'french-curl-tgrey.jpg', alt: 'French Curls — Ombré Gris', color: 'tgrey' },
  { file: 'french-curl-dark-grey.jpg', alt: 'French Curls — Gris foncé', color: 'grey' },
  { file: 'french-curl-p27-30.jpg', alt: 'French Curls — Mix 27# / 30#', color: '30' },
  { file: 'french-curl-mix-27.jpg', alt: 'French Curls — Mix blond 27#', color: '27' },
  { file: 'french-curl-mix-blond-brun.jpg', alt: 'French Curls — Mix blond / brun', color: '30' },
  { file: 'french-curl-mix-cuivre.jpg', alt: 'French Curls — Mix cuivré', color: '350' },
  { file: 'french-curl-piano-cuivre.jpg', alt: 'French Curls — Piano cuivré', color: 'cuivre' },
  { file: 'french-curl-c14.jpg', alt: 'French Curls — Ombré noir / blond', color: 't27' },
  { file: 'french-curl-ot33-27.jpg', alt: 'French Curls — Ombré 33 / 27', color: 't30' },
];

const frenchCurlGalleryFiles = FRENCH_CURL_MEDIA.map((item) => item.file);

const frenchCurlImages = Object.fromEntries(
  FRENCH_CURL_MEDIA.map((item, index) => [
    `g${index}`,
    {
      src: `images/meches/${item.file}`,
      alt: item.alt,
    },
  ]),
);

/** Teintes commandables — chaque pastille pointe vers la photo bundle correspondante */
const frenchCurlColorVariants = {
  '1b': {
    label: 'Noir 1B',
    shortLabel: '1B',
    swatch: '#1a1512',
    file: 'french-curl-nuancier.jpg',
    alt: 'French Curls — nuancier (référence Noir 1B)',
  },
  '27': {
    label: 'Blond 27#',
    shortLabel: '27#',
    swatch: '#d4b07a',
    file: 'french-curl-27.jpg',
    alt: 'French Curls — Blond 27#',
  },
  '30': {
    label: 'Marron 30#',
    shortLabel: '30#',
    swatch: '#5c3a28',
    file: 'french-curl-mes11.jpg',
    alt: 'French Curls — Marron 30#',
  },
  '350': {
    label: 'Roux 350',
    shortLabel: '350',
    swatch: '#c45a28',
    file: 'french-curl-350.jpg',
    alt: 'French Curls — Roux 350',
  },
  t27: {
    label: 'Ombré Blond T27',
    shortLabel: 'T27',
    swatch: 'linear-gradient(180deg, #2a1a12 28%, #c9a46a 72%)',
    file: 'french-curl-t27.jpg',
    alt: 'French Curls — Ombré Blond T27',
  },
  t30: {
    label: 'Ombré Marron T30',
    shortLabel: 'T30',
    swatch: 'linear-gradient(180deg, #1c1210 30%, #8a4a2e 100%)',
    file: 'french-curl-t30.jpg',
    alt: 'French Curls — Ombré Marron T30',
  },
  tbug: {
    label: 'Bordeaux T-Bug',
    shortLabel: 'T-Bug',
    swatch: 'linear-gradient(180deg, #1a1012 32%, #8a1428 100%)',
    file: 'french-curl-tbug.jpg',
    alt: 'French Curls — Bordeaux T-Bug',
  },
  cuivre: {
    label: 'Ombré Noir / Cuivré',
    shortLabel: 'Cuivré',
    swatch: 'linear-gradient(180deg, #141010 32%, #b85a32 100%)',
    file: 'french-curl-mes10.jpg',
    alt: 'French Curls — Ombré Noir / Cuivré',
  },
  t1b33: {
    label: 'Ombré T1B/33',
    shortLabel: 'T1B/33',
    swatch: 'linear-gradient(180deg, #1a1512 36%, #6b2e22 100%)',
    file: 'french-curl-t1b-33.jpg',
    alt: 'French Curls — Ombré T1B/33',
  },
  bug: {
    label: 'Bordeaux Bug',
    shortLabel: 'Bug',
    swatch: '#6b1528',
    file: 'french-curl-bug.jpg',
    alt: 'French Curls — Bordeaux Bug',
  },
  red: {
    label: 'Rouge',
    shortLabel: 'Rouge',
    swatch: '#c4122e',
    file: 'french-curl-red.jpg',
    alt: 'French Curls — Rouge',
  },
  pink: {
    label: 'Rose',
    shortLabel: 'Rose',
    swatch: '#e8a0b4',
    file: 'french-curl-pink.jpg',
    alt: 'French Curls — Rose',
  },
  green: {
    label: 'Vert',
    shortLabel: 'Vert',
    swatch: '#0d6b5c',
    file: 'french-curl-green.jpg',
    alt: 'French Curls — Vert',
  },
  grey: {
    label: 'Gris',
    shortLabel: 'Gris',
    swatch: '#8a8a8a',
    file: 'french-curl-grey.jpg',
    alt: 'French Curls — Gris',
  },
  tgrey: {
    label: 'Ombré Gris',
    shortLabel: 'T-Grey',
    swatch: 'linear-gradient(180deg, #1a1a1a 30%, #c5c5c8 100%)',
    file: 'french-curl-tgrey.jpg',
    alt: 'French Curls — Ombré Gris',
  },
};

Object.values(frenchCurlColorVariants).forEach((variant) => {
  variant.src = `images/meches/${variant.file}`;
});

const FRENCH_CURL_DEFAULT_COLOR = 't27';

function getGetznerPalIdFromSrc(src) {
  const match = String(src || '').match(/(?:^|[\\/])getzner-(pal\d+)\.jpe?g(?:\?|$)/i);
  return match ? match[1].toLowerCase() : '';
}

function isGetznerCartItem(item) {
  if (!item) return false;
  const key = String(item.variantKey || '');
  const name = String(item.displayName || item.name || '');
  return (
    item.stripeProduct === 'getzner' ||
    key.startsWith('marteder-getzner:') ||
    /getzner|création exclusive marteder/i.test(name)
  );
}

function isCurrentGetznerArrivalItem(item) {
  if (!isGetznerCartItem(item)) return true;
  const key = String(item.variantKey || '');
  const palId = key.includes(':') ? key.split(':').pop() : '';
  const variant = getGetznerArrivalVariant(palId);
  if (!variant || !GETZNER_ARRIVAL_IDS.has(palId)) return false;
  if (item.image && item.image !== variant.file) return false;
  return true;
}

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCurrentGetznerArrivalItem);
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* stockage indisponible */
  }
}

let cart = loadCart();
saveCart();

function formatCartSummary() {
  return cart.map((item) => {
    const variant = item.variantLabel ? ` (${item.variantLabel})` : '';
    let line = `- ${item.displayName || item.name}${variant} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
    if (item.stripeProduct === 'frenchCurls' || item.name === frenchCurlProductName) {
      line += `\n  Fournisseur: ${FRENCH_CURL_SUPPLIER.name}`;
      line += `\n  Produit Alibaba: ${FRENCH_CURL_SUPPLIER.productTitle}`;
      line += `\n  N° commande échantillon Alibaba: ${FRENCH_CURL_SUPPLIER.alibabaOrderNo}`;
    }
    return line;
  }).join('\n');
}

function cartContainsFrenchCurls() {
  return cart.some((item) => {
    const normalized = normalizeCartItem(item);
    return normalized.stripeProduct === 'frenchCurls' || item.name === frenchCurlProductName;
  });
}

function formatPrice(price) {
  const value = Number(price);
  const needsCents = !Number.isInteger(value);
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: needsCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function filterProducts(category) {
  const cards = document.querySelectorAll('#productsGrid .product-card');
  cards.forEach((card) => {
    const match = category === 'all' || card.dataset.category === category;
    card.classList.toggle('hidden', !match);
  });

  const spotlight = document.getElementById('french-curls-spotlight');
  if (spotlight) {
    const showSpotlight = category === 'all' || category === 'meches';
    spotlight.classList.toggle('hidden', !showSpotlight);
  }

  document.querySelectorAll('.ceremonie-duo').forEach((row) => {
    const visible = [...row.querySelectorAll('.product-card')].some(
      (card) => !card.classList.contains('hidden'),
    );
    row.classList.toggle('hidden', !visible);
  });
}

const SHIPPING_OPTIONS = {
  geneve: {
    label: 'Livraison / Retrait sur Genève',
    baseCost: 0,
  },
  suisse: {
    label: 'Envoi postal en Suisse',
    baseCost: 18,
    freeFromItems: 3,
  },
  europe: {
    label: 'Envoi postal en Europe',
    baseCost: 25,
  },
  monde: {
    label: 'Envoi postal Reste du monde',
    baseCost: 35,
  },
};

function getCartItemCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getCartTotal() {
  return getCartSubtotal() + getShippingCost();
}

function getSelectedShippingKey() {
  const select = document.getElementById('checkoutShipping');
  return select?.value || 'geneve';
}

function getShippingCost(key = getSelectedShippingKey()) {
  const option = SHIPPING_OPTIONS[key];
  if (!option) return 0;
  if (option.freeFromItems && getCartItemCount() >= option.freeFromItems) return 0;
  return option.baseCost;
}

function getShippingLabel(key = getSelectedShippingKey()) {
  const option = SHIPPING_OPTIONS[key];
  if (!option) return 'Livraison / Retrait sur Genève — Gratuit';
  const cost = getShippingCost(key);
  if (cost === 0) {
    if (key === 'suisse' && getCartItemCount() >= 3) {
      return `${option.label} — GRATUIT (dès 3 articles)`;
    }
    return `${option.label} — GRATUIT`;
  }
  return `${option.label} — ${formatPrice(cost)}`;
}

function updateShippingSelectLabels() {
  const select = document.getElementById('checkoutShipping');
  const hint = document.getElementById('cartShippingHint');
  if (!select) return;

  const itemCount = getCartItemCount();
  const labels = {
    geneve: 'Livraison / Retrait sur Genève — GRATUIT (0 CHF)',
    suisse: itemCount >= 3
      ? 'Envoi postal en Suisse — GRATUIT (dès 3 articles)'
      : 'Envoi postal en Suisse — 18.00 CHF (GRATUIT dès 3 articles)',
    europe: 'Envoi postal en Europe — 25.00 CHF',
    monde: 'Envoi postal Reste du monde — 35.00 CHF',
  };

  Array.from(select.options).forEach((option) => {
    if (labels[option.value]) option.textContent = labels[option.value];
  });

  if (hint) {
    if (select.value === 'suisse' && itemCount >= 3) {
      hint.textContent = 'Livraison Suisse offerte : vous avez 3 articles ou plus.';
    } else if (select.value === 'suisse') {
      hint.textContent = `Ajoutez encore ${3 - itemCount} article(s) pour une livraison Suisse gratuite.`;
    } else {
      hint.textContent = '';
    }
  }
}

function normalizeCartItem(item) {
  if (item.stripeProduct) return item;
  if (item.stripeEligible && item.price === 80) {
    return { ...item, stripeProduct: 'getzner' };
  }
  if (item.name === xpressionProductName || item.price === 5) {
    return { ...item, stripeProduct: 'meches' };
  }
  if (item.name === frenchCurlProductName || item.price === 13.5) {
    return { ...item, stripeProduct: 'frenchCurls' };
  }
  if (item.name && String(item.name).includes('OKADY Pearl')) {
    return { ...item, stripeProduct: 'okady' };
  }
  if (
    item.name &&
    (String(item.name).includes('Gel Essence Réparateur au Collagène') ||
      String(item.name).includes('D-nutrimec'))
  ) {
    return { ...item, stripeProduct: 'dnutrimec' };
  }
  return { ...item, stripeProduct: null };
}

function getStripeGroups() {
  const groups = {};
  cart.forEach((rawItem) => {
    const item = normalizeCartItem(rawItem);
    const key = item.stripeProduct;
    if (!key || !STRIPE_PRODUCTS[key]) return;
    if (!groups[key]) {
      groups[key] = {
        key,
        label: STRIPE_PRODUCTS[key].label,
        unitPrice: STRIPE_PRODUCTS[key].unitPrice,
        quantity: 0,
        amount: 0,
      };
    }
    groups[key].quantity += item.quantity;
    groups[key].amount += item.price * item.quantity;
  });
  return Object.values(groups);
}

function getStripePaymentPlan() {
  const subtotal = getCartSubtotal();
  const shipping = getShippingCost();
  const total = subtotal + shipping;
  const stripeGroups = getStripeGroups();
  const hasNonStripe = cart.some((item) => !normalizeCartItem(item).stripeProduct);

  if (cart.length === 0) {
    return {
      mode: 'empty',
      payments: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      buttonLabel: 'Payer par carte (Stripe)',
      note: 'Ajoutez des articles pour payer.',
      canCheckout: false,
    };
  }

  const payLabel = `Payer par carte (Stripe) — ${formatPrice(total)}`;

  if (hasNonStripe) {
    return {
      mode: 'manual',
      payments: stripeGroups,
      subtotal,
      shipping,
      total,
      buttonLabel: payLabel,
      note: `Certains articles ne sont pas payables en ligne. Livraison : ${getShippingLabel()}.`,
      canCheckout: false,
    };
  }

  if (stripeGroups.length === 0) {
    return {
      mode: 'manual',
      payments: [],
      subtotal,
      shipping,
      total,
      buttonLabel: payLabel,
      note: `Commande enregistrée. Livraison : ${getShippingLabel()}.`,
      canCheckout: false,
    };
  }

  return {
    mode: 'checkout',
    payments: stripeGroups,
    subtotal,
    shipping,
    total,
    buttonLabel: payLabel,
    note: `Paiement Stripe sécurisé du montant exact. Livraison : ${getShippingLabel()}.`,
    canCheckout: true,
  };
}

function getCheckoutEmail() {
  return document.getElementById('checkoutEmail')?.value?.trim() || '';
}

function getCheckoutCustomer() {
  const lastName = document.getElementById('checkoutLastName')?.value?.trim() || '';
  const firstName = document.getElementById('checkoutFirstName')?.value?.trim() || '';
  const street = document.getElementById('checkoutStreet')?.value?.trim() || '';
  const postal = document.getElementById('checkoutPostal')?.value?.trim() || '';
  const city = document.getElementById('checkoutCity')?.value?.trim() || '';
  const name = [firstName, lastName].filter(Boolean).join(' ').trim();
  const address = [street, [postal, city].filter(Boolean).join(' ')].filter(Boolean).join(', ');

  return {
    lastName,
    firstName,
    name,
    email: getCheckoutEmail(),
    phone: document.getElementById('checkoutPhone')?.value?.trim() || '',
    street,
    postal,
    city,
    address,
    shipping: getSelectedShippingKey(),
  };
}

const CHECKOUT_REQUIRED_FIELDS = [
  { id: 'checkoutLastName', message: 'Veuillez remplir ce champ obligatoirement.' },
  { id: 'checkoutFirstName', message: 'Veuillez remplir ce champ obligatoirement.' },
  { id: 'checkoutEmail', message: 'Veuillez indiquer un e-mail valide.', type: 'email' },
  { id: 'checkoutPhone', message: 'Veuillez remplir ce champ obligatoirement.' },
  { id: 'checkoutStreet', message: 'Veuillez remplir ce champ obligatoirement.' },
  { id: 'checkoutPostal', message: 'Veuillez remplir ce champ obligatoirement.' },
  { id: 'checkoutCity', message: 'Veuillez remplir ce champ obligatoirement.' },
  { id: 'checkoutShipping', message: 'Veuillez choisir un mode de livraison.' },
];

function clearCheckoutFieldErrors() {
  const formError = document.getElementById('cartCheckoutFormError');
  if (formError) {
    formError.hidden = true;
    formError.textContent = '';
  }

  CHECKOUT_REQUIRED_FIELDS.forEach(({ id }) => {
    const field = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    field?.classList.remove('is-invalid');
    field?.removeAttribute('aria-invalid');
    if (error) error.hidden = true;
  });
}

function markCheckoutFieldInvalid(id, message) {
  const field = document.getElementById(id);
  const error = document.getElementById(`${id}Error`);
  field?.classList.add('is-invalid');
  field?.setAttribute('aria-invalid', 'true');
  if (error) {
    if (message) error.textContent = message;
    error.hidden = false;
  }
}

function isCheckoutFieldValid(fieldConfig) {
  const field = document.getElementById(fieldConfig.id);
  if (!field) return true;
  const value = String(field.value || '').trim();
  if (!value) return false;
  if (fieldConfig.type === 'email') {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
  return true;
}

function validateCheckoutForm() {
  clearCheckoutFieldErrors();

  let firstInvalidId = '';
  let invalidCount = 0;

  CHECKOUT_REQUIRED_FIELDS.forEach((fieldConfig) => {
    if (!isCheckoutFieldValid(fieldConfig)) {
      markCheckoutFieldInvalid(fieldConfig.id, fieldConfig.message);
      invalidCount += 1;
      if (!firstInvalidId) firstInvalidId = fieldConfig.id;
    }
  });

  if (invalidCount === 0) return '';

  const formError = document.getElementById('cartCheckoutFormError');
  if (formError) {
    formError.textContent =
      invalidCount === 1
        ? 'Veuillez remplir ce champ obligatoirement.'
        : 'Veuillez remplir tous les champs obligatoires.';
    formError.hidden = false;
  }

  document.getElementById(firstInvalidId)?.focus();
  return formError?.textContent || 'Veuillez remplir tous les champs obligatoires.';
}

function buildCheckoutSessionPayload() {
  const customer = getCheckoutCustomer();
  // Fusionne les lignes identiques (même produit + variante) pour Stripe
  const merged = {};
  cart.forEach((rawItem) => {
    const item = normalizeCartItem(rawItem);
    const productKey = item.stripeProduct;
    if (!productKey || !STRIPE_PRODUCTS[productKey]) return;
    if (productKey === 'getzner' && !isCurrentGetznerArrivalItem(item)) return;

    const variantLabel = item.variantLabel || '';
    const mergeKey = `${productKey}::${variantLabel}`;
    if (!merged[mergeKey]) {
      merged[mergeKey] = {
        productKey,
        quantity: 0,
        variantLabel,
        name: item.displayName || item.name,
      };
    }
    merged[mergeKey].quantity += Math.max(1, Math.round(Number(item.quantity) || 0));
  });

  return {
    items: Object.values(merged),
    shop: 'marteder',
    email: customer.email,
    name: customer.name,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    address: customer.address,
    street: customer.street,
    postal: customer.postal,
    city: customer.city,
    shipping: customer.shipping,
    origin: getSiteOriginPath(),
  };
}

function saveCheckoutCustomerSnapshot(customer, plan) {
  const snapshot = {
    savedAt: new Date().toISOString(),
    name: customer.name || '',
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    street: customer.street || '',
    postal: customer.postal || '',
    city: customer.city || '',
    shipping: customer.shipping || '',
    shippingLabel: getShippingLabel(),
    totalLabel: plan ? formatPrice(plan.total) : '',
    order: formatCartSummary(),
  };

  try {
    sessionStorage.setItem('marteder-last-order', JSON.stringify(snapshot));
    sessionStorage.setItem('marteder-last-customer', JSON.stringify(snapshot));
    sessionStorage.removeItem(STRIPE_PENDING_KEY);
  } catch (error) {
    console.error('sessionStorage order', error);
  }

  try {
    localStorage.setItem('marteder-last-customer', JSON.stringify(snapshot));
  } catch (error) {
    console.error('localStorage customer', error);
  }

  return snapshot;
}

function getSiteOriginPath() {
  try {
    const { origin, pathname } = window.location;
    // GitHub Pages project site: /marteder-textile/index.html → /marteder-textile
    if (pathname.endsWith('.html')) {
      return origin + pathname.replace(/\/[^/]*$/, '');
    }
    return origin + pathname.replace(/\/$/, '');
  } catch {
    return window.location.origin;
  }
}

function isGetznerWifiCartItem(item) {
  const normalized = normalizeCartItem(item);
  const variantKey = String(
    item?.variantKey ||
    item?.variantKey ||
    normalized.variantKey ||
    normalized.variantKey ||
    ''
  );
  return (
    normalized.stripeProduct === 'getznerWifi' ||
    variantKey.startsWith('getzner-wifi:')
  );
}

function addGetznerWifiFromCard(card, options = {}) {
  const fabric = fabricProducts['getzner-wifi'];
  if (!fabric) return false;
  const variantKey =
    (card ? getFabricVariantKey(card) : fabric.defaultVariant) || fabric.defaultVariant;
  const variant = fabric.variants[variantKey];
  if (!variant) return false;
  addToCart(
    {
      name: fabric.baseName,
      displayName: `${fabric.baseName} — ${variant.label}`,
      variantKey: `getzner-wifi:${variantKey}`,
      variantLabel: variant.label,
      variantType: 'Coloris',
      packNote: fabric.packNote,
      price: fabric.price,
      stripeProduct: fabric.stripeProduct || 'getznerWifi',
      image: variant.image || '',
    },
    options
  );
  return true;
}

function isGetznerWifiOnlyCart() {
  return cart.length > 0 && cart.every(isGetznerWifiCartItem);
}

function getExclusiveStripePaymentLink() {
  if (!cart.length) return '';
  const products = cart.map((item) => normalizeCartItem(item).stripeProduct);
  if (products.some((key) => !key)) return '';
  const unique = [...new Set(products)];
  if (unique.length !== 1) return '';
  const key = unique[0];
  if (key === 'getznerWifi') return '';
  const link = STRIPE_PRODUCTS[key]?.paymentLink;
  if (!link) return '';
  const qty = cart.reduce(
    (sum, item) => sum + Math.max(1, Math.round(Number(item.quantity) || 0)),
    0
  );
  const url = new URL(link);
  if (qty > 1) url.searchParams.set('quantity', String(qty));
  const email = String(getCheckoutCustomer().email || '').trim();
  if (email) url.searchParams.set('prefilled_email', email);
  return url.toString();
}

function getGetznerWifiCartQuantity() {
  return cart.reduce((sum, item) => {
    if (!isGetznerWifiCartItem(item)) return sum;
    return sum + Math.max(1, Math.round(Number(item.quantity) || 0));
  }, 0);
}

function buildGetznerWifiPaymentUrl(customer = {}) {
  const url = new URL(GETZNER_WIFI_STRIPE_LINK);
  const quantity = Math.max(1, getGetznerWifiCartQuantity());
  if (quantity > 1) url.searchParams.set('quantity', String(quantity));
  const email = String(customer.email || '').trim();
  if (email) url.searchParams.set('prefilled_email', email);
  return url.toString();
}

async function createStripeCheckoutSession(options = {}) {
  const plan = getStripePaymentPlan();
  if (!plan.canCheckout) {
    throw new Error(plan.note || 'Paiement Stripe indisponible pour ce panier.');
  }

  if (isGetznerWifiOnlyCart()) {
    const customer = getCheckoutCustomer();
    saveCheckoutCustomerSnapshot(customer, plan);
    return {
      url: buildGetznerWifiPaymentUrl(customer),
      id: 'plink_getzner_wifi',
    };
  }

  const exclusivePayUrl = getExclusiveStripePaymentLink();
  if (exclusivePayUrl) {
    const customer = getCheckoutCustomer();
    saveCheckoutCustomerSnapshot(customer, plan);
    return {
      url: exclusivePayUrl,
      id: 'plink_official',
    };
  }

  if (!options.skipValidation) {
    const formError = validateCheckoutForm();
    if (formError) throw new Error(formError);
  }

  const payload = buildCheckoutSessionPayload();
  if (!payload.items.length) {
    throw new Error('Aucun article payable en ligne dans le panier.');
  }

  // Sauvegarde locale des coordonnées avant redirection Stripe
  saveCheckoutCustomerSnapshot(getCheckoutCustomer(), plan);

  let lastError = 'Impossible de créer le paiement Stripe.';

  for (const endpoint of getStripeCheckoutApiFallbacks()) {
    let response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      lastError = 'Réseau indisponible. Vérifiez votre connexion puis réessayez.';
      console.error('checkout fetch', endpoint, error);
      continue;
    }

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (response.ok && data.url) {
      return data;
    }

    if (response.status === 404 || response.status === 405) {
      lastError =
        'API de paiement introuvable. Déployez le site sur Netlify (function create-checkout-session) ou définissez window.MARTEDER_STRIPE_CHECKOUT_URL.';
      continue;
    }

    lastError =
      data.error ||
      (response.status === 500
        ? 'Erreur serveur Stripe. Vérifiez STRIPE_SECRET_KEY (sk_live_…) sur Netlify.'
        : 'Impossible de créer le paiement Stripe.');
    // Erreur métier / config : inutile d'essayer un autre endpoint
    break;
  }

  throw new Error(lastError);
}

function showCartPayError(message) {
  const formError = document.getElementById('cartCheckoutFormError');
  if (formError) {
    formError.textContent = message || 'Paiement Stripe indisponible. Réessayez.';
    formError.hidden = false;
    formError.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  showToast(message);
}

function redirectToStripe(payUrl) {
  const url = String(payUrl || '').trim();
  if (!url) {
    throw new Error('Session de paiement Stripe introuvable.');
  }
  try {
    window.location.href = url;
  } catch (error) {
    console.error('redirectToStripe', error);
    window.location.assign(url);
  }
}

function notifyOrderInBackground(payload) {
  try {
    fetch(FORMSUBMIT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* ne bloque jamais le paiement Stripe */
    });
  } catch (error) {
    console.error('notifyOrderInBackground', error);
  }
}

function updateStripeQtyHint(plan) {
  const hint = document.getElementById('cartStripeQtyHint');
  if (!hint) return;

  if (!plan?.canCheckout || plan.total <= 0) {
    hint.hidden = true;
    hint.textContent = '';
    return;
  }

  const details = (plan.payments || [])
    .map((payment) => `${payment.quantity} × ${payment.label} = ${formatPrice(payment.amount)}`)
    .join(' · ');

  hint.hidden = false;
  hint.innerHTML =
    `<strong>Total Stripe :</strong> ${formatPrice(plan.total)}` +
    (details ? ` (${details}` + (plan.shipping > 0 ? ` + livraison ${formatPrice(plan.shipping)}` : '') + ')' : '') +
    '. Le montant exact sera prérempli sur la page de paiement.';
}

function updateStripePayLink() {
  const link = document.getElementById('cartStripePayLink');
  if (!link) return;

  const plan = getStripePaymentPlan();
  const empty = cart.length === 0 || !plan.canCheckout;

  link.textContent = plan.buttonLabel || 'Payer par carte (Stripe)';
  link.classList.toggle('is-disabled', empty);
  if (empty) {
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('disabled', 'disabled');
  } else {
    link.removeAttribute('aria-disabled');
    link.removeAttribute('disabled');
  }

  updateStripeQtyHint(plan);
}

function updateCheckoutButton() {
  updateShippingSelectLabels();
  updateStripePayLink();

  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  const note = document.querySelector('.cart-checkout-note');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartShipping = document.getElementById('cartShipping');
  const cartTotal = document.getElementById('cartTotal');
  const cartFinalTotal = document.getElementById('cartFinalTotal');
  const plan = getStripePaymentPlan();

  if (cartSubtotal) cartSubtotal.textContent = formatPrice(plan.subtotal);
  if (cartShipping) {
    cartShipping.textContent = plan.shipping > 0 ? formatPrice(plan.shipping) : 'Gratuit';
  }
  if (cartTotal) cartTotal.textContent = formatPrice(plan.total);
  if (cartFinalTotal) cartFinalTotal.textContent = formatPrice(plan.total);

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
    checkoutBtn.textContent = 'Continuer vers le paiement';
  }
  if (note && !note.classList.contains('hidden')) {
    note.textContent = plan.note;
  }
}

function renderCart() {
  const cartList = document.getElementById('cartList');
  const cartCountEls = document.querySelectorAll('.cart-count');

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
  } else {
    cartList.innerHTML = cart.map((item, index) => `
      <div class="cart-item${item.image ? ' cart-item--photo' : ''}">
        ${item.image ? `<img class="cart-item-photo" src="${item.image}" alt="${item.variantLabel || item.name}">` : ''}
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          ${item.variantLabel ? `<p class="cart-item-variant">${item.variantType || 'Variante'} : <strong>${item.variantLabel}</strong></p>` : ''}
          ${item.packNote ? `<p class="cart-item-note">${item.packNote}</p>` : ''}
        </div>
        <div class="cart-item-meta">
          <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
          <div class="cart-item-qty-controls">
            <button type="button" class="cart-qty-btn" data-qty-delta="-1" data-index="${index}" aria-label="Diminuer la quantité">−</button>
            <span class="cart-item-qty">${item.quantity}</span>
            <button type="button" class="cart-qty-btn" data-qty-delta="1" data-index="${index}" aria-label="Augmenter la quantité">+</button>
          </div>
        </div>
        <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Retirer du panier">&times;</button>
      </div>
    `).join('');
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountEls.forEach((el) => {
    el.textContent = String(totalItems);
  });
  document.querySelectorAll('.cart-btn').forEach((btn) => {
    btn.classList.toggle('has-items', totalItems > 0);
  });

  updateCheckoutButton();
}

function addToCart(item, options = {}) {
  if (item.stripeProduct === 'getzner' && !isCurrentGetznerArrivalItem({ ...item, quantity: 1 })) {
    showToast('Cette référence Getzner n’est plus disponible. Choisissez une couleur du nouvel arrivage.');
    return;
  }
  const existing = cart.find(
    (entry) => entry.name === item.name && entry.variantKey === item.variantKey,
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
  saveCart();
  if (options.silent) return;
  openCartPanel();
  showToast(`« ${item.displayName} » ajouté au panier`);
}

function getFabricVariantKey(card) {
  const activeSwatch = card.querySelector('.fabric-swatch.active');
  if (activeSwatch) return activeSwatch.dataset.variant;

  const select = card.querySelector('.fabric-variant-select');
  return select?.value;
}

function initCart() {
  document.body.addEventListener('click', (e) => {
    const wifiPay = e.target.closest('[data-wifi-pay]');
    if (wifiPay) {
      e.preventDefault();
      const card =
        wifiPay.closest('.product-card') ||
        document.querySelector('[data-product-id="getzner-wifi"]');
      addGetznerWifiFromCard(card, { silent: true });
      showToast('Redirection vers le paiement Stripe…');
      redirectToStripe(buildGetznerWifiPaymentUrl(getCheckoutCustomer()));
      return;
    }

    const stripePay = e.target.closest('[data-stripe-pay]');
    if (stripePay) {
      e.preventDefault();
      const productId = stripePay.getAttribute('data-stripe-pay');
      const payUrl = fabricProducts[productId]?.paymentLink || stripePay.href;
      if (!payUrl) return;
      showToast('Redirection vers le paiement Stripe…');
      redirectToStripe(payUrl);
      return;
    }

    const qtyBtn = e.target.closest('.cart-qty-btn');
    if (qtyBtn) {
      const index = parseInt(qtyBtn.dataset.index, 10);
      const delta = parseInt(qtyBtn.dataset.qtyDelta, 10);
      const item = cart[index];
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) cart.splice(index, 1);
      renderCart();
      saveCart();
      return;
    }

    const removeBtn = e.target.closest('.cart-item-remove');
    if (removeBtn) {
      const index = parseInt(removeBtn.dataset.index, 10);
      cart.splice(index, 1);
      renderCart();
      saveCart();
      return;
    }

    const mecheBtn = e.target.closest('.add-cart-meche');
    if (mecheBtn) {
      e.preventDefault();
      const select = document.getElementById('xpressionVariantSelect');
      const variant = xpressionVariants[select?.value];
      if (!variant) return;

      addToCart({
        name: xpressionProductName,
        displayName: `${xpressionProductName} — ${variant.label}`,
        variantKey: select.value,
        variantLabel: variant.label,
        variantType: 'Teinte',
        packNote: '5 CHF le paquet',
        price: variant.price,
        stripeProduct: 'meches',
        image: (xpressionImages[variant.imageKey] || xpressionImages.clean).src,
      });
      return;
    }

    const frenchCurlBtn = e.target.closest('.add-cart-french-curls');
    if (frenchCurlBtn) {
      e.preventDefault();
      const select = document.getElementById('frenchCurlColorSelect');
      const colorKey = select?.value || FRENCH_CURL_DEFAULT_COLOR;
      const color = frenchCurlColorVariants[colorKey] || frenchCurlColorVariants[FRENCH_CURL_DEFAULT_COLOR];

      addToCart({
        name: frenchCurlProductName,
        displayName: `${frenchCurlProductName} — ${color.label}`,
        variantKey: colorKey,
        variantLabel: color.label,
        variantType: 'Couleur',
        packNote: '13.50 CHF le paquet',
        price: 13.5,
        stripeProduct: 'frenchCurls',
      });
      return;
    }

    const fabricBtn = e.target.closest('.add-cart-fabric');
    if (fabricBtn) {
      e.preventDefault();
      const productId = fabricBtn.dataset.id;
      if (isOutOfStockProduct(productId)) {
        showToast('Ce produit est en rupture de stock.');
        return;
      }
      const fabric = fabricProducts[productId];
      const card = fabricBtn.closest('.product-card') || fabricBtn.closest('.getzner-product-details');
      if (!fabric) return;
      if (fabric.stripeProduct === 'getzner' && productId !== 'marteder-getzner') {
        showToast('Ce modèle n’est plus disponible. Choisissez le nouvel arrivage Getzner.');
        return;
      }

      if (productId === 'bazin-brode' || productId === 'dentelle-suisse') {
        const payUrl = fabric.paymentLink;
        if (payUrl) {
          showToast('Redirection vers le paiement Stripe…');
          redirectToStripe(payUrl);
          return;
        }
        const main = card?.querySelector('[data-photo-main]');
        const variant = fabric.variants[fabric.defaultVariant];
        addToCart({
          name: fabric.baseName,
          displayName: fabric.baseName,
          variantKey: `${productId}:coupon`,
          variantLabel: fabric.packNote,
          variantType: 'Coupon',
          packNote: fabric.packNote,
          price: fabric.price,
          stripeProduct: fabric.stripeProduct || null,
          image: main?.getAttribute('src') || variant?.image || '',
        });
        return;
      }

      let variantKey = card ? getFabricVariantKey(card) : fabric.defaultVariant;
      if (productId === 'marteder-getzner') {
        const martederSelect = document.querySelector('[data-marteder-select]');
        const gallery = document.querySelector('[data-marteder-gallery]');
        variantKey = martederSelect?.value || gallery?.dataset.selectedVariant || '';
        const arrival = getGetznerArrivalVariant(variantKey);
        const mainImage = document.querySelector('[data-marteder-main]');
        const fromImage = getGetznerPalIdFromSrc(mainImage?.getAttribute('src') || mainImage?.currentSrc || '');
        const fromGallery = String(gallery?.dataset.selectedVariant || '');
        const fromSelect = String(martederSelect?.value || '');
        const idsMatch =
          arrival &&
          fromSelect === arrival.id &&
          (!fromGallery || fromGallery === arrival.id) &&
          (!fromImage || fromImage === arrival.id);
        if (!idsMatch) {
          showToast('Veuillez choisir une couleur du nouvel arrivage Getzner.');
          return;
        }
        addToCart({
          name: fabric.baseName,
          displayName: `${fabric.baseName} — ${arrival.label}`,
          variantKey: `${productId}:${arrival.id}`,
          variantLabel: `${arrival.label} · ${arrival.id}`,
          variantType: 'Couleur / motif',
          packNote: fabric.packNote,
          price: fabric.price,
          stripeProduct: fabric.stripeProduct || null,
          image: arrival.file,
        });
        return;
      }
      const variant = fabric.variants[variantKey];
      if (!variant) {
        showToast('Cette variante n’est plus disponible.');
        return;
      }

      addToCart({
        name: fabric.baseName,
        displayName: `${fabric.baseName} — ${variant.label}`,
        variantKey: `${productId}:${variantKey}`,
        variantLabel: variant.label,
        variantType: fabric.previewPrefix.replace(' sélectionné', '').replace(' sélectionnée', ''),
        packNote: fabric.packNote,
        price: fabric.price,
        stripeProduct: fabric.stripeProduct || null,
        image: variant.image || '',
      });
      return;
    }

    const btn = e.target.closest('.add-cart');
    if (!btn) return;

    e.preventDefault();
    const id = btn.dataset.id;
    if (isOutOfStockProduct(id)) {
      showToast('Ce produit est en rupture de stock.');
      return;
    }
    const product = products[id];
    if (!product) return;

    addToCart({
      name: product.name,
      displayName: product.name,
      variantKey: null,
      variantLabel: null,
      variantType: null,
      packNote: null,
      price: product.price,
      stripeProduct: product.stripeProduct || null,
    });
  });
}

function openCartPanel() {
  const panel = document.getElementById('cartPanel');
  const toggle = document.getElementById('cartToggle');
  if (!panel) return;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeCartPanel() {
  const panel = document.getElementById('cartPanel');
  const toggle = document.getElementById('cartToggle');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function initCartPanel() {
  const toggle = document.getElementById('cartToggle');
  const close = document.getElementById('cartClose');
  const backdrop = document.getElementById('cartBackdrop');

  toggle?.addEventListener('click', () => {
    const panel = document.getElementById('cartPanel');
    if (panel?.classList.contains('open')) {
      closeCartPanel();
    } else {
      renderCart();
      openCartPanel();
    }
  });

  close?.addEventListener('click', closeCartPanel);
  backdrop?.addEventListener('click', closeCartPanel);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCartPanel();
  });
}

function setFabricImage(img, variant) {
  if (!img || !variant) return;

  img.alt = variant.alt;
  img.src = variant.image;

  if (!variant.localImage) return;

  const probe = new Image();
  probe.onload = () => {
    img.src = variant.localImage;
  };
  probe.src = variant.localImage;
}

function syncFabricSwatchImages(card, fabric) {
  Object.entries(fabric.variants).forEach(([variantKey, variant]) => {
    const swatchImg = card.querySelector(`.fabric-swatch[data-variant="${variantKey}"] img`);
    if (swatchImg) setFabricImage(swatchImg, variant);
  });
}

function updateFabricCard(card, variantKey) {
  const productId = card.dataset.productId;
  const fabric = fabricProducts[productId];
  if (!fabric) return;

  const variant = fabric.variants[variantKey];
  if (!variant) return;

  const image = card.querySelector('.product-image');
  const preview = card.querySelector('.fabric-variant-preview');
  const select = card.querySelector('.fabric-variant-select');
  const swatches = card.querySelectorAll('.fabric-swatch');

  if (image) setFabricImage(image, variant);

  if (select) select.value = variantKey;

  swatches.forEach((swatch) => {
    swatch.classList.toggle('active', swatch.dataset.variant === variantKey);
  });

  if (preview) {
    preview.innerHTML = `${fabric.previewPrefix} : <strong>${variant.label}</strong>`;
  }
}

function initFabricVariants() {
  document.querySelectorAll('.product-card[data-product-id]').forEach((card) => {
    const productId = card.dataset.productId;
    const fabric = fabricProducts[productId];
    if (!fabric) return;
    // La galerie Marteder et la fiche Wifi gèrent leurs propres variantes
    if (card.querySelector('[data-marteder-gallery], [data-wifi-gallery], [data-photo-gallery]')) return;

    const select = card.querySelector('.fabric-variant-select');
    const swatches = card.querySelectorAll('.fabric-swatch');

    const applyVariant = (variantKey) => {
      updateFabricCard(card, variantKey);
    };

    select?.addEventListener('change', () => {
      applyVariant(select.value);
    });

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => applyVariant(swatch.dataset.variant));
    });

    syncFabricSwatchImages(card, fabric);
    applyVariant(fabric.defaultVariant);
  });
}

function initXpressionVariant() {
  const select = document.getElementById('xpressionVariantSelect');
  const image = document.getElementById('xpressionVariantImage');
  const preview = document.getElementById('xpressionVariantPreview');
  const mainZoom = document.getElementById('xpressionMainZoom');
  const thumbs = document.querySelectorAll('#xpressionProduct .meche-thumb');

  if (!select || !image) return;

  const setMainImage = (imageKey, updateThumbs = true) => {
    const photo = xpressionImages[imageKey];
    if (!photo) return;

    image.src = photo.src;
    image.alt = photo.alt;
    const isProductShot = imageKey === 'clean'
      || imageKey.startsWith('pack')
      || imageKey.startsWith('color');
    image.classList.toggle('is-pack-shot', isProductShot);

    if (mainZoom) {
      mainZoom.dataset.imageKey = imageKey;
      mainZoom.dataset.caption = photo.alt;
    }

    if (updateThumbs) {
      thumbs.forEach((thumb) => {
        thumb.classList.toggle('active', thumb.dataset.imageKey === imageKey);
      });
    }
  };

  const updateFromVariant = () => {
    const variant = xpressionVariants[select.value];
    if (!variant) return;

    setMainImage(variant.imageKey);

    if (preview) {
      preview.innerHTML = `Teinte sélectionnée : <strong>${variant.label}</strong>`;
    }
  };

  select.addEventListener('change', updateFromVariant);

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      setMainImage(thumb.dataset.imageKey);
    });
  });

  updateFromVariant();
}

function initMecheVariant() {
  const image = document.getElementById('mecheVariantImage');
  const galleryRow = document.getElementById('mecheGalleryRow');
  const mainZoom = document.getElementById('mecheMainZoom');
  const select = document.getElementById('frenchCurlColorSelect');
  const swatchList = document.getElementById('frenchCurlSwatches');
  const preview = document.getElementById('mecheVariantPreview');
  const counter = document.getElementById('frenchCurlCounter');
  const prevBtn = document.getElementById('frenchCurlPrev');
  const nextBtn = document.getElementById('frenchCurlNext');

  if (!image || !galleryRow) return;

  let currentIndex = 0;
  const total = frenchCurlGalleryFiles.length;

  const updateCounter = (index) => {
    if (counter) counter.textContent = `${index + 1} / ${total}`;
  };

  const scrollThumbIntoView = (index) => {
    const thumb = galleryRow.querySelector(`.meche-thumb[data-gallery-index="${index}"]`);
    thumb?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const setMainByIndex = (index, { syncColor = false } = {}) => {
    const safeIndex = ((index % total) + total) % total;
    currentIndex = safeIndex;
    const key = `g${safeIndex}`;
    const photo = frenchCurlImages[key];
    if (!photo) return;

    image.src = photo.src;
    image.alt = photo.alt;
    const isPackShot = Boolean(FRENCH_CURL_MEDIA[safeIndex]?.file?.startsWith('french-curl'));
    image.classList.toggle('is-pack-shot', isPackShot);
    image.classList.remove('french-curl-fade');
    void image.offsetWidth;
    image.classList.add('french-curl-fade');

    if (mainZoom) {
      mainZoom.dataset.imageKey = key;
      mainZoom.dataset.galleryIndex = String(safeIndex);
      mainZoom.dataset.caption = photo.alt;
    }

    galleryRow.querySelectorAll('.meche-thumb').forEach((thumb) => {
      thumb.classList.toggle('active', Number(thumb.dataset.galleryIndex) === safeIndex);
    });

    updateCounter(safeIndex);
    scrollThumbIntoView(safeIndex);

    if (syncColor) {
      const mediaColor = FRENCH_CURL_MEDIA[safeIndex]?.color;
      const match = mediaColor
        ? [mediaColor, frenchCurlColorVariants[mediaColor]]
        : Object.entries(frenchCurlColorVariants).find(
            ([, color]) => color.file === frenchCurlGalleryFiles[safeIndex],
          );
      if (match && match[1]) {
        const [colorKey, color] = match;
        if (select) select.value = colorKey;
        if (preview) {
          preview.innerHTML = `Couleur sélectionnée : <strong>${color.label}</strong>`;
        }
        swatchList?.querySelectorAll('.french-curl-swatch').forEach((btn) => {
          const active = btn.dataset.color === colorKey;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      }
    }
  };

  const setColorVariant = (colorKey) => {
    const color = frenchCurlColorVariants[colorKey];
    if (!color) return;

    if (select) select.value = colorKey;

    const galleryIndex = FRENCH_CURL_MEDIA.findIndex((item) => item.color === colorKey && item.file === color.file);
    const fallbackIndex = frenchCurlGalleryFiles.indexOf(color.file);
    const targetIndex = galleryIndex >= 0 ? galleryIndex : fallbackIndex;
    if (targetIndex >= 0) {
      setMainByIndex(targetIndex);
    } else {
      image.src = color.src;
      image.alt = color.alt;
      image.classList.add('is-pack-shot');
      if (mainZoom) {
        mainZoom.removeAttribute('data-image-key');
        mainZoom.dataset.caption = color.alt;
      }
      updateCounter(currentIndex);
    }

    if (preview) {
      preview.innerHTML = `Couleur sélectionnée : <strong>${color.label}</strong>`;
    }

    swatchList?.querySelectorAll('.french-curl-swatch').forEach((btn) => {
      const active = btn.dataset.color === colorKey;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  if (select) {
    const selected = select.value;
    select.replaceChildren(
      ...Object.entries(frenchCurlColorVariants).map(([key, color]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = color.label;
        return option;
      }),
    );
    select.value = frenchCurlColorVariants[selected] ? selected : FRENCH_CURL_DEFAULT_COLOR;
  }

  if (swatchList) {
    const fragment = document.createDocumentFragment();
    Object.entries(frenchCurlColorVariants).forEach(([key, color]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'french-curl-swatch';
      button.dataset.color = key;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', 'false');
      button.title = color.label;
      button.setAttribute('aria-label', `Couleur ${color.label}`);

      const swatch = document.createElement('span');
      swatch.className = 'french-curl-swatch-tone';
      swatch.style.background = color.swatch;
      swatch.setAttribute('aria-hidden', 'true');
      button.appendChild(swatch);

      const name = document.createElement('span');
      name.className = 'french-curl-swatch-name';
      name.textContent = color.shortLabel;
      button.appendChild(name);

      button.addEventListener('click', () => setColorVariant(key));
      fragment.appendChild(button);
    });
    swatchList.replaceChildren(fragment);
  }

  select?.addEventListener('change', () => setColorVariant(select.value));

  const fragment = document.createDocumentFragment();
  frenchCurlGalleryFiles.forEach((file, index) => {
    const key = `g${index}`;
    const photo = frenchCurlImages[key];
    const n = index + 1;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'meche-thumb';
    button.dataset.imageKey = key;
    button.dataset.productZoom = '';
    button.dataset.productGallery = 'french-curls';
    button.dataset.galleryIndex = String(index);
    button.dataset.caption = `French Curls — photo ${n} sur ${total}`;
    button.setAttribute('aria-label', `Voir la photo ${n} sur ${total}`);

    const thumbImg = document.createElement('img');
    thumbImg.src = photo.src;
    thumbImg.alt = photo.alt;
    thumbImg.loading = 'lazy';
    button.appendChild(thumbImg);

    button.addEventListener('click', () => {
      setMainByIndex(index, { syncColor: true });
    });

    fragment.appendChild(button);
  });
  galleryRow.replaceChildren(fragment);

  prevBtn?.addEventListener('click', () => {
    setMainByIndex(currentIndex - 1, { syncColor: true });
  });
  nextBtn?.addEventListener('click', () => {
    setMainByIndex(currentIndex + 1, { syncColor: true });
  });

  // Flèches clavier quand la fiche est focusée
  const card = document.getElementById('mecheProduct');
  card?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setMainByIndex(currentIndex - 1, { syncColor: true });
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setMainByIndex(currentIndex + 1, { syncColor: true });
    }
  });

  if (select) select.value = frenchCurlColorVariants[select.value] ? select.value : FRENCH_CURL_DEFAULT_COLOR;
  setMainByIndex(0);
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const scrollTarget = btn.dataset.scroll;
      if (scrollTarget) {
        document.querySelector(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      filterProducts(btn.dataset.filter);
    });
  });
}

function initNav() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  const toggleVisibility = () => {
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    button.hidden = scrolled <= 300;
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initCartCheckout() {
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  const checkoutForm = document.getElementById('cartCheckoutForm');
  const cancelBtn = document.getElementById('cartCheckoutCancel');
  const stripePayLink = document.getElementById('cartStripePayLink');

  if (!checkoutBtn || !checkoutForm) return;

  const showCheckoutForm = (show) => {
    checkoutForm.classList.toggle('hidden', !show);
    checkoutBtn.classList.toggle('hidden', show);
    document.querySelector('.cart-checkout-note')?.classList.toggle('hidden', show);
    updateCheckoutButton();
    if (show) {
      const scroller = document.querySelector('.cart-panel-scroll');
      if (scroller) {
        scroller.scrollTo({
          top: scroller.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  document.getElementById('checkoutShipping')?.addEventListener('change', () => {
    updateCheckoutButton();
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    if (isGetznerWifiOnlyCart()) {
      showToast('Redirection vers le paiement Stripe…');
      redirectToStripe(buildGetznerWifiPaymentUrl(getCheckoutCustomer()));
      return;
    }
    updateCheckoutButton();
    showCheckoutForm(true);
  });

  cancelBtn?.addEventListener('click', () => showCheckoutForm(false));

  // Bouton Stripe → Checkout Session (montant exact du panier)
  updateStripePayLink();

  stripePayLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Réactive le bouton s'il était resté désactivé après une tentative précédente
    if (stripePayLink.classList.contains('is-disabled') && cart.length > 0) {
      const planCheck = getStripePaymentPlan();
      if (planCheck.canCheckout) {
        stripePayLink.classList.remove('is-disabled');
        stripePayLink.removeAttribute('disabled');
        stripePayLink.removeAttribute('aria-disabled');
      }
    }

    if (cart.length === 0) return;
    if (stripePayLink.classList.contains('is-disabled') || stripePayLink.hasAttribute('disabled')) {
      return;
    }

    if (!isGetznerWifiOnlyCart()) {
      const formError = validateCheckoutForm();
      if (formError) {
        showCartPayError(formError);
        return;
      }
    }

    const customer = getCheckoutCustomer();
    const plan = getStripePaymentPlan();
    if (!plan.canCheckout) {
      showCartPayError(plan.note || 'Paiement Stripe indisponible pour ce panier.');
      return;
    }

    const previousLabel = stripePayLink.textContent;
    stripePayLink.classList.add('is-disabled');
    stripePayLink.setAttribute('disabled', 'disabled');
    stripePayLink.textContent = 'Redirection vers Stripe…';

    // Sauvegarde immédiate des champs saisis au clic "Payer"
    saveCheckoutCustomerSnapshot(customer, plan);

    let payUrl = '';
    let stripeSessionId = '';
    let paymentMode = 'Stripe Checkout Session';
    let checkoutError = '';

    try {
      const session = await createStripeCheckoutSession({ skipValidation: true });
      if (session?.url) {
        payUrl = session.url;
        stripeSessionId = session.id || '';
        if (session.id === 'plink_getzner_wifi') {
          paymentMode = 'Stripe Payment Link — Bazin Getzner Wifi';
        }
      } else {
        checkoutError = 'Réponse Stripe invalide (URL manquante).';
      }
    } catch (error) {
      checkoutError = error?.message || 'Impossible de créer la session Stripe.';
      console.error('Checkout Session', error);
    }

    if (!payUrl) {
      showCartPayError(
        checkoutError ||
          'Impossible d’ouvrir le paiement Stripe. Vérifiez le déploiement Netlify et STRIPE_SECRET_KEY.'
      );
      stripePayLink.textContent = previousLabel;
      updateStripePayLink();
      return;
    }

    notifyOrderInBackground({
      _subject: `Commande Marteder — ${formatPrice(plan.total)}`,
      name: customer.name,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      street: customer.street,
      postal: customer.postal,
      city: customer.city,
      shipping: getShippingLabel(),
      order: formatCartSummary(),
      total: formatPrice(plan.total),
      payment: paymentMode,
      stripe_session_id: stripeSessionId,
      ...(cartContainsFrenchCurls()
        ? {
            french_curls_supplier: FRENCH_CURL_SUPPLIER.name,
            french_curls_alibaba_product: FRENCH_CURL_SUPPLIER.productTitle,
            french_curls_alibaba_sample_order: FRENCH_CURL_SUPPLIER.alibabaOrderNo,
            french_curls_specs: FRENCH_CURL_SUPPLIER.specs,
          }
        : {}),
    });

    try {
      redirectToStripe(payUrl);
    } catch (error) {
      console.error('stripe redirect', error);
      showCartPayError(error.message || 'Redirection Stripe impossible.');
      stripePayLink.textContent = previousLabel;
      updateStripePayLink();
    }
  });

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    stripePayLink?.click();
  });

  CHECKOUT_REQUIRED_FIELDS.forEach(({ id }) => {
    const field = document.getElementById(id);
    if (!field) return;
    const clearOnEdit = () => {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      const error = document.getElementById(`${id}Error`);
      if (error) error.hidden = true;
      const formError = document.getElementById('cartCheckoutFormError');
      if (formError && !checkoutForm.querySelector('.form-input.is-invalid')) {
        formError.hidden = true;
        formError.textContent = '';
      }
    };
    field.addEventListener('input', clearOnEdit);
    field.addEventListener('change', clearOnEdit);
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nextInput = form.querySelector('input[name="_next"]');
  if (nextInput && window.location.protocol !== 'file:') {
    nextInput.value = new URL('contact-merci.html', window.location.href).href;
  }

  form.addEventListener('submit', () => {
    const btn = form.querySelector('.contact-submit-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';
    }
  });
}

function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    showToast('Merci pour votre inscription !');
    input.value = '';
  });
}

function initMartederGallery() {
  const gallery = document.querySelector('[data-marteder-gallery]');
  const lightbox = document.getElementById('martederLightbox');
  if (!gallery || !lightbox) return;

  const mainImage = gallery.querySelector('[data-marteder-main]');
  const labelEl = gallery.querySelector('[data-marteder-label]');
  const previewEl = document.querySelector('[data-marteder-preview]');
  const colorSelect = document.querySelector('[data-marteder-select]');
  const thumbs = Array.from(gallery.querySelectorAll('.marteder-thumb')).filter((thumb) =>
    GETZNER_ARRIVAL_IDS.has(thumb.dataset.variant),
  );
  const zoomBtn = gallery.querySelector('[data-marteder-zoom]');
  const lightboxImage = document.getElementById('martederLightboxImage');
  const lightboxLabel = document.getElementById('martederLightboxLabel');
  let index = 0;

  const getSlide = (i) => {
    const thumb = thumbs[i];
    const arrival = getGetznerArrivalVariant(thumb?.dataset.variant);
    if (!arrival) {
      return { src: '', label: '', variant: '' };
    }
    return {
      src: arrival.file,
      label: arrival.label,
      variant: arrival.id,
    };
  };

  const showSlide = (i) => {
    index = (i + thumbs.length) % thumbs.length;
    const slide = getSlide(index);
    if (mainImage.getAttribute('src') === slide.src) {
      mainImage.src = `${slide.src}?v=${encodeURIComponent(slide.variant)}`;
    } else {
      mainImage.src = slide.src;
    }
    mainImage.alt = `Création exclusive Marteder — ${slide.label}`;
    gallery.dataset.selectedVariant = slide.variant || '';
    if (labelEl) labelEl.textContent = slide.label;
    if (previewEl) {
      previewEl.innerHTML = `Couleur sélectionnée : <strong>${slide.label}</strong>`;
    }
    if (colorSelect && slide.variant) colorSelect.value = slide.variant;
    thumbs.forEach((thumb, thumbIndex) => {
      const active = thumbIndex === index;
      thumb.classList.toggle('active', active);
      thumb.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  const syncLightbox = () => {
    const slide = getSlide(index);
    lightboxImage.src = slide.src;
    lightboxImage.alt = `Création exclusive Marteder — ${slide.label}`;
    lightboxLabel.textContent = slide.label;
  };

  const openLightbox = () => {
    syncLightbox();
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  gallery.querySelector('.marteder-gallery-prev')?.addEventListener('click', () => showSlide(index - 1));
  gallery.querySelector('.marteder-gallery-next')?.addEventListener('click', () => showSlide(index + 1));
  thumbs.forEach((thumb, thumbIndex) => {
    thumb.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextIndex = Number(thumb.dataset.index);
      showSlide(Number.isNaN(nextIndex) ? thumbIndex : nextIndex);
    });
  });
  colorSelect?.addEventListener('change', () => {
    const nextIndex = thumbs.findIndex((thumb) => thumb.dataset.variant === colorSelect.value);
    if (nextIndex >= 0) showSlide(nextIndex);
  });
  zoomBtn?.addEventListener('click', openLightbox);

  lightbox.querySelectorAll('[data-marteder-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });
  lightbox.querySelector('.marteder-lightbox-prev')?.addEventListener('click', () => {
    showSlide(index - 1);
    syncLightbox();
  });
  lightbox.querySelector('.marteder-lightbox-next')?.addEventListener('click', () => {
    showSlide(index + 1);
    syncLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.hidden) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        showSlide(index - 1);
        syncLightbox();
      }
      if (e.key === 'ArrowRight') {
        showSlide(index + 1);
        syncLightbox();
      }
    }
  });

  showSlide(0);
}

function initPhotoGalleries() {
  document.querySelectorAll('[data-photo-gallery]').forEach((gallery) => {
    const main = gallery.querySelector('[data-photo-main]');
    const labelEl = gallery.querySelector('[data-photo-label]');
    const zoomBtn = gallery.querySelector('[data-product-zoom]');
    const thumbs = Array.from(gallery.querySelectorAll('[data-photo-thumb]'));
    if (!main || thumbs.length === 0) return;

    let index = Math.max(0, thumbs.findIndex((thumb) => thumb.classList.contains('active')));

    const show = (nextIndex) => {
      index = (nextIndex + thumbs.length) % thumbs.length;
      const thumb = thumbs[index];
      const src = thumb.dataset.src;
      const label = thumb.dataset.label || '';
      const alt = thumb.querySelector('img')?.alt || label;
      main.src = src;
      main.alt = alt;
      if (labelEl) labelEl.textContent = label;
      if (zoomBtn) {
        zoomBtn.dataset.caption = alt;
        zoomBtn.dataset.galleryStartIndex = String(index);
      }
      thumbs.forEach((item, i) => {
        const active = i === index;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    };

    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        show(i);
      });
    });

    gallery.querySelector('[data-photo-prev]')?.addEventListener('click', () => show(index - 1));
    gallery.querySelector('[data-photo-next]')?.addEventListener('click', () => show(index + 1));
  });
}

function initGetznerWifiGallery() {
  const card = document.querySelector('[data-product-id="getzner-wifi"]');
  const gallery = card?.querySelector('[data-wifi-gallery]');
  if (!card || !gallery) return;

  const still = gallery.querySelector('[data-wifi-still]');
  const labelEl = gallery.querySelector('[data-wifi-label]');
  const preview = gallery.querySelector('[data-wifi-preview]');
  const select = gallery.querySelector('[data-wifi-select]');
  const thumbs = Array.from(gallery.querySelectorAll('[data-wifi-thumb]'));
  const video = gallery.querySelector('.wifi-video');
  const fabric = fabricProducts['getzner-wifi'];

  const applyColor = (variantKey) => {
    const variant = fabric?.variants[variantKey];
    const thumb = thumbs.find((btn) => btn.dataset.variant === variantKey);
    if (!variant || !thumb) return;

    if (still) {
      still.src = variant.image;
      still.alt = variant.alt;
    }
    if (labelEl) labelEl.textContent = variant.label;
    if (preview) {
      preview.innerHTML = `Coloris sélectionné : <strong>${variant.label}</strong>`;
    }
    if (select) select.value = variantKey;

    thumbs.forEach((btn) => {
      const active = btn === thumb;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', (event) => {
      event.preventDefault();
      applyColor(thumb.dataset.variant);
    });
  });

  select?.addEventListener('change', () => applyColor(select.value));

  startMutedLoopVideo(video);
  applyColor(select?.value || fabric?.defaultVariant || 'bleu');
}

function initDNutrimecGallery() {
  const mainImage = document.getElementById('dnutrimecMainImage');
  const mainTrigger = mainImage?.closest('[data-product-zoom]');
  const thumbs = Array.from(document.querySelectorAll('[data-dnutrimec-thumb]'));
  const faceZoom = document.querySelector('.product-face-zoom');
  if (!mainImage || !mainTrigger || thumbs.length === 0) return;

  const showImage = (thumb) => {
    mainImage.src = thumb.dataset.src;
    mainImage.alt = thumb.dataset.alt;
    mainTrigger.dataset.caption = thumb.dataset.caption;
    mainTrigger.dataset.galleryStartIndex = thumb.dataset.galleryIndex;
    thumbs.forEach((item) => item.classList.toggle('active', item === thumb));
    if (faceZoom) {
      const index = thumb.dataset.galleryIndex;
      faceZoom.hidden = index !== '0' && index !== '2';
    }
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      showImage(thumb);
    });
  });

  showImage(thumbs[0]);
}

function startMutedLoopVideo(video) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.loop = true;
  video.play()?.catch(() => {});
}

function initOkadyCoffretMedia() {
  const mainImage = document.getElementById('okadyCoffretMainImage');
  const mainTrigger = mainImage?.closest('[data-product-zoom]');
  const thumbs = Array.from(document.querySelectorAll('[data-okady-coffret-thumb]'));
  const video = document.querySelector('.okady-coffret-video');

  if (mainImage && mainTrigger && thumbs.length > 0) {
    const showImage = (thumb) => {
      mainImage.src = thumb.dataset.src;
      mainImage.alt = thumb.dataset.alt;
      mainTrigger.dataset.caption = thumb.dataset.caption;
      mainTrigger.dataset.galleryIndex = thumb.dataset.galleryIndex;
      thumbs.forEach((item) => item.classList.toggle('active', item === thumb));
    };

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        showImage(thumb);
      });
    });

    showImage(thumbs[0]);
  }

  startMutedLoopVideo(video);
}

function initOkadyGallery() {
  const mainImage = document.getElementById('okadyMainImage');
  const mainTrigger = document.getElementById('okadyMainTrigger');
  const mainCaption = document.getElementById('okadyMainCaption');
  const productTriggers = Array.from(document.querySelectorAll('[data-okady-product]'));
  if (!mainImage || !mainTrigger || !mainCaption || productTriggers.length === 0) return;

  const showProduct = (trigger) => {
    const sourceImage = trigger.querySelector('img');
    if (!sourceImage) return;

    const card = trigger.closest('.cosmetique-card');
    const productName = card?.querySelector('.cosmetique-name')?.textContent?.trim()
      || trigger.dataset.caption;
    const selectedIndex = trigger.dataset.galleryStartIndex
      ?? trigger.dataset.galleryIndex
      ?? '0';

    mainImage.src = sourceImage.currentSrc || sourceImage.src;
    mainImage.alt = sourceImage.alt;
    mainCaption.textContent = productName;
    mainTrigger.dataset.caption = trigger.dataset.caption || productName;
    mainTrigger.dataset.galleryStartIndex = selectedIndex;

    productTriggers.forEach((item) => {
      item.closest('.cosmetique-card')?.classList.toggle('okady-selected', item === trigger);
    });
  };

  productTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => showProduct(trigger));
  });

  showProduct(productTriggers[0]);
}

function initProductLightbox() {
  const lightbox = document.getElementById('productLightbox');
  const image = document.getElementById('productLightboxImage');
  const caption = document.getElementById('productLightboxCaption');
  const triggers = Array.from(document.querySelectorAll('[data-product-zoom]'));
  const galleryItems = Array.from(document.querySelectorAll('[data-product-gallery]'));
  if (!lightbox || !image || !caption || triggers.length === 0) return;

  const closeButton = lightbox.querySelector('.marteder-lightbox-close');
  const previousButton = lightbox.querySelector('[data-product-lightbox-prev]');
  const nextButton = lightbox.querySelector('[data-product-lightbox-next]');
  let lastTrigger = null;
  let galleryTriggers = [];
  let galleryIndex = 0;

  const showTrigger = (trigger) => {
    const sourceImage = trigger.querySelector('img')
      || trigger.closest('.product-zoom-wrap')?.querySelector('img');
    if (!sourceImage) return;

    const galleryPhoto = trigger.dataset.imageKey
      ? (frenchCurlImages[trigger.dataset.imageKey] || xpressionImages[trigger.dataset.imageKey])
      : null;
    image.src = galleryPhoto?.src || sourceImage.currentSrc || sourceImage.src;
    image.alt = galleryPhoto?.alt || sourceImage.alt;
    caption.textContent = trigger.dataset.caption || sourceImage.alt;
  };

  const openLightbox = (trigger) => {
    lastTrigger = trigger;

    const galleryName = trigger.dataset.productGallery;
    galleryTriggers = galleryName
      ? galleryItems
        .filter((item) => (
          item.dataset.productGallery === galleryName
          && !item.hasAttribute('data-gallery-exclude')
        ))
        .sort((a, b) => Number(a.dataset.galleryIndex) - Number(b.dataset.galleryIndex))
      : [trigger];

    const requestedIndex = trigger.dataset.galleryStartIndex;
    const requestedPosition = requestedIndex === undefined
      ? galleryTriggers.indexOf(trigger)
      : galleryTriggers.findIndex((item) => item.dataset.galleryIndex === requestedIndex);
    galleryIndex = Math.max(0, requestedPosition);

    showTrigger(galleryTriggers[galleryIndex]);
    const hasNavigation = galleryTriggers.length > 1;
    if (previousButton) previousButton.hidden = !hasNavigation;
    if (nextButton) nextButton.hidden = !hasNavigation;
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton?.focus();
  };

  const navigateGallery = (direction) => {
    if (galleryTriggers.length < 2) return;
    galleryIndex = (galleryIndex + direction + galleryTriggers.length) % galleryTriggers.length;
    showTrigger(galleryTriggers[galleryIndex]);
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  lightbox.querySelectorAll('[data-product-lightbox-close]').forEach((element) => {
    element.addEventListener('click', closeLightbox);
  });
  previousButton?.addEventListener('click', () => navigateGallery(-1));
  nextButton?.addEventListener('click', () => navigateGallery(1));

  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') navigateGallery(-1);
    if (event.key === 'ArrowRight') navigateGallery(1);
  });
}

function initHeroCarousel() {
  const root = document.querySelector('.hero--carousel');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const prevBtn = root.querySelector('[data-hero-prev]');
  const nextBtn = root.querySelector('[data-hero-next]');
  if (slides.length < 2) return;

  let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
  if (index < 0) index = 0;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intervalMs = 6000;
  let timer = null;

  const setSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    if (reduceMotion) return;
    stop();
    timer = setInterval(() => setSlide(index + 1), intervalMs);
  };

  prevBtn?.addEventListener('click', () => {
    setSlide(index - 1);
    start();
  });

  nextBtn?.addEventListener('click', () => {
    setSlide(index + 1);
    start();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = Number(dot.dataset.heroDot);
      if (Number.isNaN(target)) return;
      setSlide(target);
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) start();
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setSlide(index - 1);
      start();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setSlide(index + 1);
      start();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  setSlide(index);
  start();
}

document.addEventListener('DOMContentLoaded', () => {
  purgeOutOfStockFromCart();
  renderCart();
  initCart();
  initCartPanel();
  initCartCheckout();
  initContactForm();
  initFabricVariants();
  initXpressionVariant();
  initMecheVariant();
  initMartederGallery();
  initPhotoGalleries();
  initGetznerWifiGallery();
  initDNutrimecGallery();
  initOkadyCoffretMedia();
  initOkadyGallery();
  initProductLightbox();
  initFilters();
  initHeroCarousel();
  initNav();
  initBackToTop();
  initNewsletter();

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'cancel') {
      showToast('Paiement annulé. Votre panier est toujours disponible.');
      params.delete('checkout');
      const clean = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', clean);
    }
  } catch (error) {
    /* ignore */
  }
});
