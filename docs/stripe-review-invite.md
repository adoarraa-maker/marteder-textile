# Invitation avis client après paiement Stripe

Le déclencheur fiable est un webhook Stripe côté serveur. Il programme un e-mail
transactionnel quelques jours après le paiement, afin de laisser au client le
temps de recevoir son colis.

## Endpoint webhook

Déclarer dans Stripe Dashboard -> Développeurs -> Webhooks :

```text
https://VOTRE-SITE-NETLIFY.netlify.app/api/stripe-webhook
```

Evénements à écouter :

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

La fonction ignore les sessions non payées (`payment_status !== "paid"`).

## Variables d'environnement Netlify

Variables requises :

```text
STRIPE_WEBHOOK_SECRET=whsec_...
BREVO_API_KEY=...
BREVO_SENDER_EMAIL=contact@votre-domaine.ch
REVIEW_FORM_URL=https://...
```

Variables optionnelles :

```text
STRIPE_SECRET_KEY=sk_live_...
BREVO_SENDER_NAME=Marteder Textile
REVIEW_INVITE_DELAY_DAYS=4
REVIEW_INVITE_REPLY_TO=contact@votre-domaine.ch
REVIEW_INVITE_SUBJECT=Votre avis compte pour Marteder Textile
```

`REVIEW_INVITE_DELAY_DAYS` vaut `4` par défaut. La fonction ne reste pas active
pendant plusieurs jours : elle confie l'envoi différé à Brevo via le champ
`scheduledAt`.

`STRIPE_SECRET_KEY` est déjà nécessaire pour la création des Checkout Sessions.
Le webhook l'utilise aussi, si elle est disponible, pour relire la session puis
marquer dans ses métadonnées qu'une invitation avis a été programmée. Cela évite
de programmer deux e-mails si Stripe redélivre le même événement.

## Parcours

```text
Paiement Stripe confirmé
        ↓
Webhook Stripe vers Netlify
        ↓
Vérification de la signature Stripe
        ↓
Lecture de l'e-mail client dans la Checkout Session
        ↓
Programmation Brevo à J+4 par défaut
        ↓
Client reçoit le lien vers le formulaire d'avis
```
