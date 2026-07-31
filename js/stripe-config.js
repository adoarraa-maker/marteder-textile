/**
 * Configuration Stripe Marteder Textile (chargée AVANT js/main.js).
 *
 * Le front est sur GitHub Pages ; les Netlify Functions ne répondent
 * qu’via une URL absolue (même pattern qu’AnimoSuisse).
 *
 * Si vous déployez Marteder sur son propre site Netlify, remplacez l’URL
 * ci-dessous par :
 *   'https://VOTRE-SITE.netlify.app/.netlify/functions/create-checkout-session'
 * Si le site est servi UNIQUEMENT depuis Netlify, vous pouvez laisser ''.
 */
window.MARTEDER_STRIPE_CHECKOUT_URL =
  window.MARTEDER_STRIPE_CHECKOUT_URL ||
  'https://phenomenal-crumble-63c3b0.netlify.app/.netlify/functions/create-checkout-session';
