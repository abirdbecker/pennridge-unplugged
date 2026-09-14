// Upcoming Pennridge Unplugged events from Four Norms, for the homepage.
// Four Norms doesn't send CORS headers, so the browser can't call it directly;
// this reads the public group feed and trims it to what the page renders.
// Four Norms is the source of truth: new events appear within the hour.
//
// ?lang=es formats dates and labels in Spanish. Titles and descriptions are
// passed through as written on Four Norms (English).

const FEED = 'https://www.fournorms.com/api/v1/groups/pennridge-unplugged/events.json?limit=100';
const TIME_ZONE = 'America/New_York';
const EXCERPT_LENGTH = 240;
const LOCALES = { en: 'en-US', es: 'es-US' };
const ONLINE = { en: 'Online', es: 'En línea' };

module.exports = async (req, res) => {
  const lang = req.query && req.query.lang === 'es' ? 'es' : 'en';
  const locale = LOCALES[lang];

  let events;
  try {
    const upstream = await fetch(FEED);
    if (!upstream.ok) throw new Error(`Four Norms returned ${upstream.status}`);
    events = (await upstream.json()).data || [];
  } catch (err) {
    console.error('Four Norms events feed failed:', err);
    // Short cache so an outage doesn't stick for an hour.
    res.setHeader('Cache-Control', 's-maxage=300');
    return res.status(502).json({ events: [] });
  }

  const now = Date.now();
  const upcoming = events
    .filter((e) => e.published !== false)
    .filter((e) => new Date(e.end_time || e.start_time).getTime() >= now)
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .map((e) => {
      const start = new Date(e.start_time);
      return {
        title: e.title.trim(),
        month: format(locale, start, { month: 'short' }).replace('.', ''),
        day: format(locale, start, { day: 'numeric' }),
        when: formatWhen(locale, start, e.end_time ? new Date(e.end_time) : null),
        where: e.virtual ? ONLINE[lang] : formatWhere(e),
        excerpt: excerpt(e.description),
        image: e.cover_image_url || null,
        url: e.links.web_url,
      };
    });

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json({ events: upcoming });
};

function format(locale, date, options) {
  return new Intl.DateTimeFormat(locale, { timeZone: TIME_ZONE, ...options }).format(date);
}

// Clock time and AM/PM marker separately, so a shared marker can be dropped
// from the start time ("6:30–8:00 PM", "6:30–8:00 p.m.").
function timeParts(locale, date) {
  const parts = new Intl.DateTimeFormat(locale, {
    timeZone: TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(date);
  const period = (parts.find((p) => p.type === 'dayPeriod') || {}).value || '';
  const clock = parts.filter((p) => p.type !== 'dayPeriod').map((p) => p.value).join('').trim();
  return { clock, period };
}

// "Thursday, September 17 · 6:30–8:00 PM" / "Jueves, 17 de septiembre · 6:30–8:00 p.m."
function formatWhen(locale, start, end) {
  let date = format(locale, start, { weekday: 'long', month: 'long', day: 'numeric' });
  date = date.charAt(0).toUpperCase() + date.slice(1);
  const from = timeParts(locale, start);
  if (!end) return `${date} · ${from.clock} ${from.period}`;
  const to = timeParts(locale, end);
  const fromText = from.period === to.period ? from.clock : `${from.clock} ${from.period}`;
  return `${date} · ${fromText}–${to.clock} ${to.period}`;
}

function formatWhere(e) {
  const name = (e.location && e.location.name || '').trim();
  const city = (e.location && e.location.city || '').trim();
  if (name && city && !name.includes(city)) return `${name}, ${city}`;
  return name || city || null;
}

// Plain-text preview: URLs dropped (the RSVP page has the full description),
// whitespace collapsed, cut at a word boundary.
function excerpt(description) {
  if (!description) return null;
  const text = description.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  if (text.length <= EXCERPT_LENGTH) return text;
  const cut = text.slice(0, EXCERPT_LENGTH);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.–-]+$/, '')}…`;
}
