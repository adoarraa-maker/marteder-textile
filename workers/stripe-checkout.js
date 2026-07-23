/**
 * Alternative Cloudflare Worker (si vous n'utilisez pas Netlify).
 *
 * Déploiement :
 *   1. Créez un Worker sur https://dash.cloudflare.com
 *   2. Collez ce fichier
 *   3. Ajoutez le secret STRIPE_SECRET_KEY
 *   4. Dans index.html, avant main.js :
 *      <script>window.MARTEDER_STRIPE_CHECKOUT_URL = 'https://VOTRE-WORKER.workers.dev';</script>
 */

const CATALOG = {
  getzner: { name: 'Bazin Getzner (Lot de 5 yards)', unitAmountCents: 8000 },
  meches: { name: 'Mèches X-Pression Ultra Braid', unitAmountCents: 500 },
};

const SHIPPING = {
  geneve: { label: 'Livraison / Retrait sur Genève', amountCents: 0 },
  suisse: { label: 'Envoi postal en Suisse', amountCents: 1800, freeFromItems: 3 },
  europe: { label: 'Envoi postal en Europe', amountCents: 2500 },
  monde: { label: 'Envoi postal Reste du monde', amountCents: 3500 },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function sanitizeText(value, max = 200) {
  return String(value || '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, max);
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return Response.json({ error: 'Méthode non autorisée' }, { status: 405, headers: corsHeaders() });
    }

    if (!env.STRIPE_SECRET_KEY) {
      return Response.json(
        { error: 'STRIPE_SECRET_KEY manquante sur le Worker' },
        { status: 500, headers: corsHeaders() }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'JSON invalide' }, { status: 400, headers: corsHeaders() });
    }

    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) {
      return Response.json({ error: 'Panier vide' }, { status: 400, headers: corsHeaders() });
    }

    const email = sanitizeText(body.email, 254);
    const name = sanitizeText(body.name, 120);
    const phone = sanitizeText(body.phone, 40);
    const address = sanitizeText(body.address, 400);
    const shippingKey = sanitizeText(body.shipping, 20) || 'geneve';
    const shippingOption = SHIPPING[shippingKey] || SHIPPING.geneve;
    const origin = sanitizeText(body.origin, 300).replace(/\/$/, '') ||
      'https://adoarraa-maker.github.io/marteder-textile';

    const params = new URLSearchParams();
    params.set('mode', 'payment');
    params.set('locale', 'fr');
    params.set('success_url', `${origin}/commande-merci.html?paid=1&session_id={CHECKOUT_SESSION_ID}`);
    params.set('cancel_url', `${origin}/index.html?checkout=cancel`);
    params.set('phone_number_collection[enabled]', 'true');
    if (email) params.set('customer_email', email);
    params.set('metadata[customer_name]', name);
    params.set('metadata[customer_phone]', phone);
    params.set('metadata[customer_address]', address);
    params.set('metadata[shipping]', shippingKey);

    let itemCount = 0;
    let lineIndex = 0;

    for (const raw of items) {
      const productKey = sanitizeText(raw.productKey, 40);
      const catalogItem = CATALOG[productKey];
      if (!catalogItem) {
        return Response.json(
          { error: `Produit non autorisé : ${productKey || '?'}` },
          { status: 400, headers: corsHeaders() }
        );
      }

      const quantity = Math.min(99, Math.max(1, Math.round(Number(raw.quantity) || 0)));
      if (!quantity) {
        return Response.json(
          { error: `Quantité invalide pour ${productKey}` },
          { status: 400, headers: corsHeaders() }
        );
      }

      itemCount += quantity;
      const variantLabel = sanitizeText(raw.variantLabel, 120);
      const productName = variantLabel
        ? `${catalogItem.name} — ${variantLabel}`
        : catalogItem.name;

      params.set(`line_items[${lineIndex}][quantity]`, String(quantity));
      params.set(`line_items[${lineIndex}][price_data][currency]`, 'chf');
      params.set(
        `line_items[${lineIndex}][price_data][unit_amount]`,
        String(catalogItem.unitAmountCents)
      );
      params.set(`line_items[${lineIndex}][price_data][product_data][name]`, productName);
      params.set(
        `line_items[${lineIndex}][price_data][product_data][metadata][product_key]`,
        productKey
      );
      lineIndex += 1;
    }

    let shippingCents = shippingOption.amountCents;
    if (shippingOption.freeFromItems && itemCount >= shippingOption.freeFromItems) {
      shippingCents = 0;
    }

    if (shippingCents > 0) {
      params.set(`line_items[${lineIndex}][quantity]`, '1');
      params.set(`line_items[${lineIndex}][price_data][currency]`, 'chf');
      params.set(`line_items[${lineIndex}][price_data][unit_amount]`, String(shippingCents));
      params.set(
        `line_items[${lineIndex}][price_data][product_data][name]`,
        shippingOption.label
      );
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await stripeRes.json();
    if (!stripeRes.ok) {
      return Response.json(
        { error: data.error?.message || 'Impossible de créer la session Stripe' },
        { status: 500, headers: corsHeaders() }
      );
    }

    return Response.json({ id: data.id, url: data.url }, { headers: corsHeaders() });
  },
};
