// Signs someone up as a supporter of Pennridge Unplugged on Four Norms, which
// owns the record; this is only the form handler. The API key stays server-side
// (FOUR_NORMS_API_KEY in Vercel, the same org key paunplugged.org uses).
// Supporters get updates; full membership needs a Four Norms account, which the
// page links to separately. Error messages follow the page language (lang: "es").

const SUPPORTERS = 'https://www.fournorms.com/api/v1/groups/pennridge-unplugged/supporters.json';

const MESSAGES = {
  en: {
    method: 'Method not allowed.',
    missing: 'Please fill in every field.',
    email: 'Please enter a valid email address.',
    zip: 'Please enter a 5-digit ZIP code.',
    unavailable: 'Sign-ups are unavailable right now.',
    failed: "We couldn't complete your sign-up. Please try again.",
    unreachable: "We couldn't reach Four Norms. Please try again.",
  },
  es: {
    method: 'Método no permitido.',
    missing: 'Por favor, complete todos los campos.',
    email: 'Ingrese un correo electrónico válido.',
    zip: 'Ingrese un código postal de 5 dígitos.',
    unavailable: 'Las inscripciones no están disponibles en este momento.',
    failed: 'No pudimos completar su inscripción. Inténtelo de nuevo.',
    unreachable: 'No pudimos conectar con Four Norms. Inténtelo de nuevo.',
  },
};

module.exports = async (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const field = (key) => (typeof body[key] === 'string' ? body[key].trim() : '');
  const msg = MESSAGES[field('lang') === 'es' ? 'es' : 'en'];

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: msg.method });
  }

  // Hidden honeypot field: people never see it, bots fill it in. Pretend success.
  if (field('company')) return res.status(200).json({ ok: true });

  const firstName = field('first_name');
  const lastName = field('last_name');
  const email = field('email');
  const zip = field('zip');

  if (!firstName || !lastName || !email || !zip) {
    return res.status(400).json({ ok: false, error: msg.missing });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: msg.email });
  }
  if (!/^\d{5}$/.test(zip)) {
    return res.status(400).json({ ok: false, error: msg.zip });
  }

  const key = process.env.FOUR_NORMS_API_KEY;
  if (!key) {
    console.error('FOUR_NORMS_API_KEY is not set');
    return res.status(503).json({ ok: false, error: msg.unavailable });
  }

  try {
    const upstream = await fetch(SUPPORTERS, {
      method: 'POST',
      headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supporter: {
          first_name: firstName,
          last_name: lastName,
          email,
          address_attributes: { zip_code: zip },
        },
      }),
    });
    if (!upstream.ok) {
      const text = await upstream.text();
      // Signing up twice comes back 422 "Email already subscribed!". They're on
      // the list, so that's a success from the reader's point of view.
      if (upstream.status === 422 && /already subscribed/i.test(text)) {
        return res.status(200).json({ ok: true, already: true });
      }
      console.error(`Four Norms supporter POST ${upstream.status}: ${text.slice(0, 300)}`);
      return res.status(502).json({ ok: false, error: msg.failed });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Four Norms supporter POST failed:', err);
    return res.status(502).json({ ok: false, error: msg.unreachable });
  }
};
