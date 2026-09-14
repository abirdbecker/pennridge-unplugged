// Four Norms features, used on any page that has the matching markup:
// the sign-up form (#signup-form, posts to /api/join) and the upcoming events
// list (#events, reads /api/events).

(function () {
  const GENERIC_ERROR = "We couldn't complete your sign-up. Please try again.";

  // ---------- Sign-up ----------
  const form = document.getElementById('signup-form');
  if (form) {
    const success = document.getElementById('signup-success');
    const errorEl = form.querySelector('.signup-error');
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorEl.hidden = true;
      button.disabled = true;
      button.textContent = 'Signing up…';

      let result = null;
      try {
        const res = await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
        });
        result = await res.json();
      } catch {
        result = null;
      }

      button.disabled = false;
      button.textContent = 'Sign Up';

      if (!result || !result.ok) {
        errorEl.textContent = (result && result.error) || GENERIC_ERROR;
        errorEl.hidden = false;
        return;
      }

      success.querySelector('h3').textContent = result.already
        ? "You're already on the list."
        : "You're on the list.";
      success.querySelector('p').textContent = result.already
        ? 'That email is already signed up for updates from Pennridge Unplugged.'
        : "We'll keep you posted on local events, meetings, and ways to get involved.";
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });
  }

  // ---------- Upcoming events ----------
  const section = document.getElementById('events');
  if (section) {
    const list = document.getElementById('event-list');

    fetch('/api/events')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(({ events }) => {
        if (events.length === 0) {
          list.append(el('p', 'events-empty', 'No upcoming events are posted right now. Join the mailing list to hear about the next one.'));
        } else {
          events.forEach((event) => list.append(renderEvent(event)));
        }
        section.hidden = false;
        // The section is hidden at page load, so a link to #events can't land on it
        // until now.
        if (location.hash === '#events') section.scrollIntoView();
      })
      // If the feed is unavailable, leave the section hidden rather than show an error.
      .catch(() => {});
  }

  // Event text comes from Four Norms, so it's set via textContent, never HTML.
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderEvent(event) {
    const card = el('article', 'event');

    if (event.image) {
      const img = el('img', 'event-img');
      img.src = event.image;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => img.remove());
      card.append(img);
    }

    const date = el('div', 'event-date');
    date.append(el('span', 'event-month', event.month), el('span', 'event-day', event.day));

    const details = el('div', 'event-details');
    details.append(el('h3', null, event.title), el('p', 'event-when', event.when));
    if (event.where) details.append(el('p', 'event-where', event.where));
    if (event.excerpt) details.append(el('p', 'event-excerpt', event.excerpt));
    const link = el('a', 'event-link', 'Details & RSVP →');
    link.href = event.url;
    link.target = '_blank';
    link.rel = 'noopener';
    details.append(link);

    const body = el('div', 'event-body');
    body.append(date, details);
    card.append(body);
    return card;
  }
})();
