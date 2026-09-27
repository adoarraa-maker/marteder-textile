/**
 * Enregistre un avis client et le transmet par e-mail (FormSubmit).
 * Aucune dépendance npm.
 *
 * Corps JSON attendu :
 *   { nom, commentaire, note, _honey? }
 */

const STORE_EMAIL = 'Adoarraa@gmail.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(body),
  };
}

function sanitizeText(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function validerAvis(body) {
  if (sanitizeText(body._honey, 200)) {
    return { ok: true, bot: true };
  }

  const nom = sanitizeText(body.nom, 80);
  const commentaire = sanitizeText(body.commentaire, 800);
  const note = Math.round(Number(body.note));

  if (nom.length < 2) {
    return { ok: false, error: 'Indiquez votre nom.' };
  }
  if (!Number.isInteger(note) || note < 1 || note > 5) {
    return { ok: false, error: 'Choisissez une note entre 1 et 5.' };
  }
  if (commentaire.length < 8) {
    return { ok: false, error: 'Le commentaire est trop court.' };
  }

  return {
    ok: true,
    avis: {
      nom,
      commentaire,
      note,
      date: new Date().toLocaleDateString('fr-FR', { timeZone: 'Europe/Zurich' }),
    },
  };
}

async function envoyerAvis(avis) {
  const response = await fetch(`https://formsubmit.co/ajax/${STORE_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: `Nouvel avis client — ${avis.note}/5 — Marteder Textile`,
      _template: 'table',
      _captcha: 'false',
      Nom: avis.nom,
      Note: `${avis.note}/5`,
      Commentaire: avis.commentaire,
      Date: avis.date,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail.slice(0, 300) || 'FormSubmit a refusé l’envoi');
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Méthode non autorisée' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'JSON invalide' });
  }

  const validation = validerAvis(body);
  if (!validation.ok) {
    return json(400, { error: validation.error });
  }
  if (validation.bot) {
    return json(200, { ok: true });
  }

  try {
    await envoyerAvis(validation.avis);
    return json(200, { ok: true });
  } catch (error) {
    console.error('enregistrer-avis', error);
    return json(502, { error: 'Impossible d’enregistrer l’avis pour le moment.' });
  }
};

exports.validerAvis = validerAvis;
