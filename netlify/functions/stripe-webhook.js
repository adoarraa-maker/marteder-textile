/**
 * Webhook Stripe post-paiement.
 *
 * Variables d'environnement Netlify requises :
 *   STRIPE_WEBHOOK_SECRET = whsec_... (Dashboard Stripe -> Webhooks)
 *   BREVO_API_KEY = clé API transactionnelle Brevo
 *   BREVO_SENDER_EMAIL = adresse expéditrice validée dans Brevo
 *   REVIEW_FORM_URL = URL du formulaire d'avis client
 *
 * Variables optionnelles :
 *   STRIPE_SECRET_KEY = sk_live_... ou sk_test_... (anti-doublon conseillé)
 *   BREVO_SENDER_NAME = Marteder Textile
 *   REVIEW_INVITE_DELAY_DAYS = 4
 *   REVIEW_INVITE_REPLY_TO = adresse de réponse
 *   REVIEW_INVITE_SUBJECT = objet personnalisé
 *
 * Aucun setTimeout long : le délai est confié à Brevo via "scheduledAt".
 */

const crypto = require('crypto');

const STRIPE_SIGNATURE_TOLERANCE_SECONDS = 5 * 60;
const DEFAULT_REVIEW_INVITE_DELAY_DAYS = 4;
const SUPPORTED_EVENTS = new Set([
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
]);

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function getRawBody(event) {
  const body = event.body || '';
  return event.isBase64Encoded
    ? Buffer.from(body, 'base64')
    : Buffer.from(body, 'utf8');
}

function parseStripeSignature(signatureHeader) {
  return String(signatureHeader || '')
    .split(',')
    .reduce(
      (acc, part) => {
        const [key, value] = part.split('=');
        if (key === 't') acc.timestamp = value;
        if (key === 'v1') acc.signatures.push(value);
        return acc;
      },
      { timestamp: '', signatures: [] }
    );
}

function timingSafeEqualHex(left, right) {
  const leftBuffer = Buffer.from(left, 'hex');
  const rightBuffer = Buffer.from(right, 'hex');
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function verifyStripeSignature(rawBody, signatureHeader, webhookSecret) {
  const secret = String(webhookSecret || '').trim();
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET manquante.');
  }

  const { timestamp, signatures } = parseStripeSignature(signatureHeader);
  const timestampNumber = Number(timestamp);
  if (!timestamp || !Number.isFinite(timestampNumber) || signatures.length === 0) {
    throw new Error('Signature Stripe absente ou invalide.');
  }

  const ageSeconds = Math.abs(Date.now() / 1000 - timestampNumber);
  if (ageSeconds > STRIPE_SIGNATURE_TOLERANCE_SECONDS) {
    throw new Error('Signature Stripe expirée.');
  }

  const signedPayload = Buffer.concat([
    Buffer.from(`${timestamp}.`, 'utf8'),
    rawBody,
  ]);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  const isValid = signatures.some((signature) =>
    timingSafeEqualHex(expectedSignature, signature)
  );
  if (!isValid) {
    throw new Error('Signature Stripe invalide.');
  }
}

function sanitizeText(value, max = 200) {
  return String(value || '')
    .replace(/[\r\n\t]+/g, ' ')
    .trim()
    .slice(0, max);
}

function isPaidCheckoutSession(session) {
  return session?.object === 'checkout.session' && session.payment_status === 'paid';
}

function getDelayDays() {
  const raw = Number(process.env.REVIEW_INVITE_DELAY_DAYS);
  if (!Number.isFinite(raw)) return DEFAULT_REVIEW_INVITE_DELAY_DAYS;
  return Math.max(0, Math.min(30, raw));
}

function getScheduledAt(delayDays) {
  return new Date(Date.now() + delayDays * 24 * 60 * 60 * 1000).toISOString();
}

function getCustomerEmail(session) {
  return sanitizeText(
    session?.customer_details?.email ||
      session?.customer_email ||
      session?.metadata?.customer_email,
    254
  );
}

function getCustomerName(session) {
  return sanitizeText(
    session?.customer_details?.name ||
      session?.metadata?.customer_name ||
      [session?.metadata?.customer_first_name, session?.metadata?.customer_last_name]
        .filter(Boolean)
        .join(' '),
    120
  );
}

function formatAmount(session) {
  if (!Number.isFinite(Number(session?.amount_total))) return '';
  const currency = String(session.currency || 'chf').toUpperCase();
  return `${(Number(session.amount_total) / 100).toFixed(2)} ${currency}`;
}

function getStripeSecretKey() {
  const key = String(process.env.STRIPE_SECRET_KEY || '').trim();
  return key.startsWith('sk_live_') || key.startsWith('sk_test_') ? key : '';
}

function hasReviewInviteScheduled(session) {
  return Boolean(
    session?.metadata?.review_invite_scheduled_at ||
      session?.metadata?.review_invite_provider_message_id
  );
}

async function fetchCheckoutSession(sessionId) {
  const secret = getStripeSecretKey();
  if (!secret || !sessionId) return null;

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('stripe checkout session fetch error', data);
    return null;
  }

  return response.json();
}

async function markReviewInviteScheduled({ sessionId, stripeEventId, result }) {
  const secret = getStripeSecretKey();
  if (!secret || !sessionId) return;

  const params = new URLSearchParams();
  params.set('metadata[review_invite_scheduled_at]', result.scheduledAt);
  params.set('metadata[review_invite_event_id]', stripeEventId || '');
  if (result.providerMessageId) {
    params.set('metadata[review_invite_provider_message_id]', result.providerMessageId);
  }

  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error('stripe checkout session metadata update error', data);
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildReviewEmail({ session, reviewFormUrl, customerName, delayDays }) {
  const orderAmount = formatAmount(session);
  const greeting = customerName ? `Bonjour ${customerName},` : 'Bonjour,';
  const delayLabel =
    delayDays > 0
      ? `quelques jours après votre achat`
      : 'après votre achat';
  const subject =
    sanitizeText(process.env.REVIEW_INVITE_SUBJECT, 180) ||
    'Votre avis compte pour Marteder Textile';

  const textContent = [
    greeting,
    '',
    `Merci encore pour votre commande Marteder Textile${
      orderAmount ? ` (${orderAmount})` : ''
    }.`,
    `Nous vous envoyons ce message ${delayLabel}, afin de vous laisser le temps de recevoir votre colis.`,
    '',
    'Pouvez-vous partager votre avis via ce formulaire ?',
    reviewFormUrl,
    '',
    'Merci beaucoup pour votre confiance.',
    'Marteder Textile',
  ].join('\n');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #2d241f; line-height: 1.6;">
      <p>${escapeHtml(greeting)}</p>
      <p>
        Merci encore pour votre commande Marteder Textile${
          orderAmount ? ` (${escapeHtml(orderAmount)})` : ''
        }.
      </p>
      <p>
        Nous vous envoyons ce message ${escapeHtml(delayLabel)}, afin de vous
        laisser le temps de recevoir votre colis.
      </p>
      <p>Pouvez-vous partager votre avis via ce formulaire ?</p>
      <p>
        <a href="${escapeHtml(reviewFormUrl)}"
           style="display:inline-block;background:#8a5a44;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;">
          Donner mon avis
        </a>
      </p>
      <p>Merci beaucoup pour votre confiance.<br>Marteder Textile</p>
    </div>
  `;

  return { subject, textContent, htmlContent };
}

async function scheduleReviewInvite({ session }) {
  const apiKey = String(process.env.BREVO_API_KEY || '').trim();
  const senderEmail = sanitizeText(process.env.BREVO_SENDER_EMAIL, 254);
  const senderName = sanitizeText(process.env.BREVO_SENDER_NAME, 120) || 'Marteder Textile';
  const reviewFormUrl = String(process.env.REVIEW_FORM_URL || '').trim();
  const replyTo = sanitizeText(process.env.REVIEW_INVITE_REPLY_TO, 254);
  const customerEmail = getCustomerEmail(session);
  const customerName = getCustomerName(session);

  if (!apiKey) throw new Error('BREVO_API_KEY manquante.');
  if (!senderEmail) throw new Error('BREVO_SENDER_EMAIL manquante.');
  if (!reviewFormUrl) throw new Error('REVIEW_FORM_URL manquante.');
  if (!customerEmail) throw new Error('Adresse e-mail client introuvable dans la session Stripe.');

  const delayDays = getDelayDays();
  const scheduledAt = getScheduledAt(delayDays);
  const email = buildReviewEmail({
    session,
    reviewFormUrl,
    customerName,
    delayDays,
  });

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: customerEmail, name: customerName || undefined }],
    subject: email.subject,
    htmlContent: email.htmlContent,
    textContent: email.textContent,
    scheduledAt,
    tags: ['avis-client', 'stripe-checkout'],
    params: {
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent || '',
      review_form_url: reviewFormUrl,
      scheduled_at: scheduledAt,
    },
  };

  if (replyTo) {
    payload.replyTo = { email: replyTo, name: senderName };
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    console.error('brevo review invite error', data);
    throw new Error(data.message || "Impossible de programmer l'e-mail d'avis.");
  }

  return {
    providerMessageId: data.messageId || '',
    scheduledAt,
    recipient: customerEmail,
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Méthode non autorisée' });
  }

  const rawBody = getRawBody(event);

  try {
    verifyStripeSignature(
      rawBody,
      event.headers['stripe-signature'] || event.headers['Stripe-Signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('stripe webhook signature', error.message);
    return json(400, { error: error.message || 'Signature Stripe invalide.' });
  }

  let stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return json(400, { error: 'Payload Stripe JSON invalide.' });
  }

  if (!SUPPORTED_EVENTS.has(stripeEvent.type)) {
    return json(200, { received: true, ignored: stripeEvent.type });
  }

  let session = stripeEvent.data?.object;
  if (!isPaidCheckoutSession(session)) {
    return json(200, {
      received: true,
      skipped: 'checkout_session_not_paid',
      paymentStatus: session?.payment_status || '',
    });
  }

  try {
    const freshSession = await fetchCheckoutSession(session.id);
    if (freshSession) {
      session = freshSession;
    }

    if (hasReviewInviteScheduled(session)) {
      return json(200, {
        received: true,
        scheduled: false,
        skipped: 'review_invite_already_scheduled',
        eventId: stripeEvent.id,
        sessionId: session.id,
      });
    }

    const result = await scheduleReviewInvite({ session });
    await markReviewInviteScheduled({
      sessionId: session.id,
      stripeEventId: stripeEvent.id,
      result,
    });

    return json(200, {
      received: true,
      scheduled: true,
      eventId: stripeEvent.id,
      sessionId: session.id,
      scheduledAt: result.scheduledAt,
      providerMessageId: result.providerMessageId,
    });
  } catch (error) {
    console.error('stripe webhook review invite', error);
    return json(500, {
      error: error.message || "Impossible de programmer l'e-mail d'avis.",
    });
  }
};
