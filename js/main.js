const STORE_EMAIL = 'Adoarraa@gmail.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${STORE_EMAIL}`;
const CART_STORAGE_KEY = 'marteder-cart';

const products = {
  8: { name: 'Foulard en bazin imprimé', price: 35 },
};

const TISSUS_SCHWER = 'images/tissus';

const schwerLocal = {
  violet: `${TISSUS_SCHWER}/violet.jpg`,
  'vert-clair': `${TISSUS_SCHWER}/vert-clair.jpg`,
  blanc: `${TISSUS_SCHWER}/blanc.jpg`,
  'beige-dore': `${TISSUS_SCHWER}/beige-dore.jpg`,
};

const schwerFallback = {
  violet: 'https://images.unsplash.com/photo-1607300110843-b3994a493d98?w=800&q=85',
  'vert-clair': 'https://images.unsplash.com/photo-1527167598984-8802d8028eea?w=800&q=85',
  blanc: 'https://images.unsplash.com/photo-1744502671977-702d9105533d?w=800&q=85',
  'beige-dore': 'https://images.unsplash.com/photo-1631663027473-3671aa7c4503?w=800&q=85',
};

const fabricProducts = {
  1: {
    baseName: 'Bazin Riche Getzner Authentique (Schwer) – Lot de 5 Yards',
    price: 80,
    packNote: 'Vendu en lot de 5 yards',
    previewPrefix: 'Couleur sélectionnée',
    defaultVariant: 'beige-dore',
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
        image: 'https://images.unsplash.com/photo-1707569620487-1fcff5e22f9f?w=800&q=85',
        alt: 'Bazin doré brodé or classique',
      },
      'or-rose': {
        label: 'Or rose brodé',
        image: 'https://images.unsplash.com/photo-1777148783728-510bbeeba075?w=800&q=85',
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
        image: 'https://images.unsplash.com/photo-1768212565426-58b089b6386d?w=800&q=85',
        alt: 'Wax hollandais Vlisco motif classique',
      },
      indigo: {
        label: 'Motif indigo',
        image: 'https://images.unsplash.com/photo-1630084305900-b297cff3a608?w=800&q=85',
        alt: 'Wax hollandais Vlisco motif indigo',
      },
      floral: {
        label: 'Motif floral',
        image: 'https://images.unsplash.com/photo-1768212565424-efa3a3852b81?w=800&q=85',
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
        image: 'https://images.unsplash.com/photo-1630084305900-b297cff3a608?w=800&q=85',
        alt: 'Wax super wax géométrique noir et or',
      },
      'geo-rouge': {
        label: 'Géométrique rouge',
        image: 'https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?w=800&q=85',
        alt: 'Wax super wax géométrique rouge',
      },
      'geo-bleu': {
        label: 'Géométrique bleu',
        image: 'https://images.unsplash.com/photo-1768212565426-58b089b6386d?w=800&q=85',
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
        image: 'https://images.unsplash.com/photo-1768212565424-efa3a3852b81?w=800&q=85',
        alt: 'Pagne wax premium multicolore vif',
      },
      'multi-terre': {
        label: 'Tons terre',
        image: 'https://images.unsplash.com/photo-1768212566108-4ce4f329e4d2?w=800&q=85',
        alt: 'Pagne wax premium tons terre',
      },
      'multi-sunset': {
        label: 'Sunset orange',
        image: 'https://images.unsplash.com/photo-1768212565426-58b089b6386d?w=800&q=85',
        alt: 'Pagne wax premium sunset orange',
      },
    },
  },
  7: {
    baseName: 'Bazin Riche Getzner Brodé de Luxe',
    price: 165,
    packNote: null,
    previewPrefix: 'Modèle sélectionné',
    defaultVariant: 'brode-or',
    variants: {
      'brode-or': {
        label: 'Broderie or',
        image: 'https://images.unsplash.com/photo-1777148783728-510bbeeba075?w=800&q=85',
        alt: 'Bazin Getzner brodé de luxe or',
      },
      'brode-blanc': {
        label: 'Broderie blanc & or',
        image: 'https://images.unsplash.com/photo-1744502671977-702d9105533d?w=800&q=85',
        alt: 'Bazin Getzner brodé de luxe blanc et or',
      },
      'brode-violet': {
        label: 'Broderie violet',
        image: 'https://images.unsplash.com/photo-1607300110843-b3994a493d98?w=800&q=85',
        alt: 'Bazin Getzner brodé de luxe violet',
      },
    },
  },
};

const mecheProductName = 'X-Pression Ultra Braid';

const mecheImages = {
  portrait: {
    src: 'https://images.unsplash.com/photo-1763256377889-c4e85bdd1a6c?w=800&q=85',
    alt: 'X-Pression Ultra Braid — look porté',
  },
  closeup: {
    src: 'https://images.unsplash.com/photo-1759756655332-d66200497312?w=800&q=85',
    alt: 'X-Pression Ultra Braid — gros plan mèches cuivrées',
  },
  pack1b: {
    src: 'meches-expression.png',
    alt: 'Paquets de mèches X-Pression Ultra Braid — présentation boutique',
  },
  pack350: {
    src: 'images/meches/xpression-pack-350.jpg',
    alt: 'Paquet X-Pression Ultra Braid — teinte 350 Cuivré / Roux',
  },
  pack2: {
    src: 'images/meches/xpression-pack-2-brun.jpg',
    alt: 'Paquet X-Pression Ultra Braid — teinte 2 Brun foncé',
  },
};

const mecheVariants = {
  '1b': {
    label: 'Teinte 1B (Noir naturel)',
    shortLabel: '1B — Noir naturel',
    imageKey: 'pack1b',
    price: 5,
  },
  '350': {
    label: 'Teinte 350 (Cuivré / Roux)',
    shortLabel: '350 — Cuivré / Roux',
    imageKey: 'pack350',
    price: 5,
  },
};

let cart = loadCart();

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
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

function formatCartSummary() {
  return cart.map((item) => {
    const variant = item.variantLabel ? ` (${item.variantLabel})` : '';
    return `- ${item.displayName || item.name}${variant} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
  }).join('\n');
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
  }).format(price);
}

function filterProducts(category) {
  const cards = document.querySelectorAll('#productsGrid .product-card');
  cards.forEach((card) => {
    const match = category === 'all' || card.dataset.category === category;
    card.classList.toggle('hidden', !match);
  });
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function renderCart() {
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const cartCountEl = document.querySelector('.cart-count');

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="cart-empty">Votre panier est vide.</p>';
  } else {
    cartList.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          ${item.variantLabel ? `<p class="cart-item-variant">${item.variantType || 'Variante'} : <strong>${item.variantLabel}</strong></p>` : ''}
          ${item.packNote ? `<p class="cart-item-note">${item.packNote}</p>` : ''}
        </div>
        <div class="cart-item-meta">
          <span class="cart-item-price">${formatPrice(item.price)}</span>
          <span class="cart-item-qty">× ${item.quantity}</span>
        </div>
        <button type="button" class="cart-item-remove" data-index="${index}" aria-label="Retirer du panier">&times;</button>
      </div>
    `).join('');
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) cartCountEl.textContent = totalItems;
  if (cartTotal) cartTotal.textContent = formatPrice(getCartTotal());

  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

function addToCart(item) {
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
      const select = document.getElementById('mecheVariantSelect');
      const variant = mecheVariants[select.value];
      if (!variant) return;

      addToCart({
        name: mecheProductName,
        displayName: `${mecheProductName} — ${variant.label}`,
        variantKey: select.value,
        variantLabel: variant.label,
        variantType: 'Teinte',
        packNote: '5 CHF le paquet',
        price: variant.price,
      });
      return;
    }

    const fabricBtn = e.target.closest('.add-cart-fabric');
    if (fabricBtn) {
      e.preventDefault();
      const productId = parseInt(fabricBtn.dataset.id, 10);
      const fabric = fabricProducts[productId];
      const card = fabricBtn.closest('.product-card');
      if (!fabric || !card) return;

      const variantKey = getFabricVariantKey(card);
      const variant = fabric.variants[variantKey];
      if (!variant) return;

      addToCart({
        name: fabric.baseName,
        displayName: `${fabric.baseName} — ${variant.label}`,
        variantKey: `${productId}:${variantKey}`,
        variantLabel: variant.label,
        variantType: fabric.previewPrefix.replace(' sélectionné', '').replace(' sélectionnée', ''),
        packNote: fabric.packNote,
        price: fabric.price,
      });
      return;
    }

    const btn = e.target.closest('.add-cart');
    if (!btn) return;

    e.preventDefault();
    const id = parseInt(btn.dataset.id, 10);
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
  const productId = parseInt(card.dataset.productId, 10);
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
    const productId = parseInt(card.dataset.productId, 10);
    const fabric = fabricProducts[productId];
    if (!fabric) return;

    const select = card.querySelector('.fabric-variant-select');
    const swatches = card.querySelectorAll('.fabric-swatch');

    const applyVariant = (variantKey) => {
      updateFabricCard(card, variantKey);
    };

    select?.addEventListener('change', () => {
      applyVariant(select.value);
    });

    swatches.forEach((swatch) => {
      swatch.addEventListener('click', () => {
        applyVariant(swatch.dataset.variant);
      });
    });

    syncFabricSwatchImages(card, fabric);
    applyVariant(fabric.defaultVariant);
  });
}

function initMecheVariant() {
  const select = document.getElementById('mecheVariantSelect');
  const image = document.getElementById('mecheVariantImage');
  const preview = document.getElementById('mecheVariantPreview');
  const thumbs = document.querySelectorAll('.meche-thumb');

  if (!select || !image) return;

  const setMainImage = (imageKey, updateThumbs = true) => {
    const photo = mecheImages[imageKey];
    if (!photo) return;

    image.src = photo.src;
    image.alt = photo.alt;
    image.classList.toggle('is-pack-shot', imageKey.startsWith('pack'));

    if (updateThumbs) {
      thumbs.forEach((thumb) => {
        thumb.classList.toggle('active', thumb.dataset.imageKey === imageKey);
      });
    }
  };

  const updateFromVariant = () => {
    const variant = mecheVariants[select.value];
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

function initCartCheckout() {
  const checkoutBtn = document.getElementById('cartCheckoutBtn');
  const checkoutForm = document.getElementById('cartCheckoutForm');
  const cancelBtn = document.getElementById('cartCheckoutCancel');
  const submitBtn = document.getElementById('cartSubmitOrderBtn');

  if (!checkoutBtn || !checkoutForm) return;

  const showCheckoutForm = (show) => {
    checkoutForm.classList.toggle('hidden', !show);
    checkoutBtn.classList.toggle('hidden', show);
    document.querySelector('.cart-checkout-note')?.classList.toggle('hidden', show);
  };

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;
    showCheckoutForm(true);
  });

  cancelBtn?.addEventListener('click', () => showCheckoutForm(false));

  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const formData = new FormData(checkoutForm);
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const address = formData.get('address')?.toString().trim();

    if (!name || !email || !phone || !address) {
      showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Nouvelle commande Marteder Textile — ${name}`,
          _template: 'table',
          type: 'Commande boutique',
          name,
          email,
          phone,
          address,
          total: formatPrice(getCartTotal()),
          order: formatCartSummary(),
        }),
      });

      if (!response.ok) throw new Error('Erreur réseau');

      cart = [];
      saveCart();
      renderCart();
      checkoutForm.reset();
      showCheckoutForm(false);
      closeCartPanel();
      window.location.href = 'commande-merci.html';
    } catch {
      showToast('Impossible d\'envoyer la commande. Réessayez ou contactez-nous par téléphone.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer la commande';
    }
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
  const whatsappBtn = document.querySelector('[data-marteder-whatsapp]');
  const thumbs = Array.from(gallery.querySelectorAll('.marteder-thumb'));
  const zoomBtn = gallery.querySelector('[data-marteder-zoom]');
  const lightboxImage = document.getElementById('martederLightboxImage');
  const lightboxLabel = document.getElementById('martederLightboxLabel');
  let index = 0;

  const getSlide = (i) => {
    const thumb = thumbs[i];
    return {
      src: thumb.dataset.src,
      label: thumb.dataset.label,
    };
  };

  const updateWhatsappLink = (label) => {
    if (!whatsappBtn) return;
    const message = `Bonjour, je souhaite commander la Création exclusive Marteder (Getzner) — couleur : ${label}, coupon de 5 yards à 80 CHF.`;
    whatsappBtn.href = `https://wa.me/41765761672?text=${encodeURIComponent(message)}`;
  };

  const showSlide = (i) => {
    index = (i + thumbs.length) % thumbs.length;
    const slide = getSlide(index);
    mainImage.src = slide.src;
    mainImage.alt = `Création exclusive Marteder — ${slide.label}`;
    if (labelEl) labelEl.textContent = slide.label;
    if (previewEl) {
      previewEl.innerHTML = `Couleur sélectionnée : <strong>${slide.label}</strong>`;
    }
    if (colorSelect) colorSelect.value = String(index);
    updateWhatsappLink(slide.label);
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
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => showSlide(Number(thumb.dataset.index)));
  });
  colorSelect?.addEventListener('change', () => {
    showSlide(Number(colorSelect.value));
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

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  initCart();
  initCartPanel();
  initCartCheckout();
  initContactForm();
  initFabricVariants();
  initMecheVariant();
  initMartederGallery();
  initFilters();
  initNav();
  initNewsletter();
});
