/**
 * Configuration Stripe Marteder Textile (chargée AVANT js/main.js).
 *
 * Le front peut être sur GitHub Pages ; la Checkout Session passe alors
 * par l’URL absolue du site Netlify Marteder ci-dessous.
 *
 * Si le site est servi UNIQUEMENT depuis Netlify, vous pouvez laisser ''.
 */
window.MARTEDER_STRIPE_CHECKOUT_URL =
  window.MARTEDER_STRIPE_CHECKOUT_URL ||
  'https://boisterous-twilight-47b574.netlify.app/.netlify/functions/create-checkout-session';

/** Payment Link Stripe — Coffret OKADY Pearl (69.00 CHF) */
window.MARTEDER_STRIPE_OKADY_LINK =
  window.MARTEDER_STRIPE_OKADY_LINK ||
  'https://buy.stripe.com/4gM28s2sxerCdszc6TcAo0c';
