// Upcoming Pennridge Unplugged events from Four Norms, for the homepage.
// Four Norms doesn't send CORS headers, so the browser can't call it directly;
// this reads the public group feed and trims it to what the page renders.
// Four Norms is the source of truth: new events appear within the hour.

const FEED = 'https://www.fournorms.com/api/v1/groups/pennridge-unplugged/events.json?limit=100';
const TIME_ZONE = 'America/New_York';
const EXCERPT_LENGTH = 240;

module.exports = async (req, res) => {
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
        month: format(start, { month: 'short' }),
        day: format(start, { day: 'numeric' }),
        when: formatWhen(start, e.end_time ? new Date(e.end_time) : null),
        where: formatWhere(e),
        excerpt: excerpt(e.description),
        image: e.cover_image_url || null,
        url: e.links.web_url,
      };
    });

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).json({ events: upcoming });
};

function format(date, options) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, ...options }).format(date);
}

// "Thursday, September 17 · 6:30–8:00 PM"
function formatWhen(start, end) {
  const date = format(start, { weekday: 'long', month: 'long', day: 'numeric' });
  const time = { hour: 'numeric', minute: '2-digit' };
  let from = format(start, time);
  if (!end) return `${date} · ${from}`;
  const to = format(end, time);
  if (from.slice(-2) === to.slice(-2)) from = from.slice(0, -3);
  return `${date} · ${from}–${to}`;
}

function formatWhere(e) {
  if (e.virtual) return 'Online';
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
