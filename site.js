// Four Norms features, used on any page that has the matching markup:
// the sign-up form (#signup-form, posts to /api/join) and the upcoming events
// list (#events, reads /api/events). Strings follow the language toggle (i18n.js).

(function () {
  const STRINGS = {
    en: {
      signingUp: 'Signing up…',
      signUp: 'Sign Up',
      genericError: "We couldn't complete your sign-up. Please try again.",
      successTitle: "You're on the list.",
      successBody: "We'll keep you posted on local events, meetings, and ways to get involved.",
      alreadyTitle: "You're already on the list.",
      alreadyBody: 'That email is already signed up for updates from Pennridge Unplugged.',
      eventsEmpty: 'No upcoming events are posted right now. Join the mailing list to hear about the next one.',
      details: 'Details & RSVP →',
    },
    es: {
      signingUp: 'Inscribiendo…',
      signUp: 'Inscribirse',
      genericError: 'No pudimos completar su inscripción. Inténtelo de nuevo.',
      successTitle: 'Ya está en la lista.',
      successBody: 'Le mantendremos al tanto de eventos locales, reuniones y formas de participar.',
      alreadyTitle: 'Ya estaba en la lista.',
      alreadyBody: 'Ese correo ya está inscrito para recibir novedades de Pennridge Unplugged.',
      eventsEmpty: 'Por ahora no hay próximos eventos publicados. Únase a la lista de correo para enterarse del próximo.',
      details: 'Detalles y confirmación →',
    },
  };

  const lang = () => (window.siteLang ? window.siteLang.get() : 'en');
  const t = (key) => STRINGS[lang()][key];

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
      button.textContent = t('signingUp');

      let result = null;
      try {
        const res = await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), lang: lang() }),
        });
        result = await res.json();
      } catch {
        result = null;
      }

      button.disabled = false;
      button.textContent = t('signUp');

      if (!result || !result.ok) {
        errorEl.textContent = (result && result.error) || t('genericError');
        errorEl.hidden = false;
        return;
      }

      success.querySelector('h3').textContent = t(result.already ? 'alreadyTitle' : 'successTitle');
      success.querySelector('p').textContent = t(result.already ? 'alreadyBody' : 'successBody');
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });
  }

  // ---------- Upcoming events ----------
  const section = document.getElementById('events');
  if (section) {
    const list = document.getElementById('event-list');
    let firstLoad = true;

    // Dates and labels are localized server-side, so switching language refetches.
    const loadEvents = () => {
      const requested = lang();
      fetch(`/api/events?lang=${requested}`)
        .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
        .then(({ events }) => {
          if (requested !== lang()) return; // toggled again while this was loading
          list.replaceChildren();
          if (events.length === 0) {
            list.append(el('p', 'events-empty', t('eventsEmpty')));
          } else {
            events.forEach((event) => list.append(renderEvent(event)));
          }
          section.hidden = false;
          // The section is hidden at page load, so a link to #events can't land on it
          // until now.
          if (firstLoad && location.hash === '#events') section.scrollIntoView();
          firstLoad = false;
        })
        // If the feed is unavailable, leave the section as it was rather than show an error.
        .catch(() => {});
    };

    loadEvents();
    if (window.siteLang) window.siteLang.onChange(loadEvents);
  }

  // Event text comes from Four Norms, so it's set via textContent, never HTML.
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // Stands in for a missing cover image so cards in the grid line up.
  function placeholder() {
    const box = el('div', 'event-img-placeholder');
    const logo = el('img');
    logo.src = 'assets/logo-transparent.png';
    logo.alt = '';
    box.append(logo);
    return box;
  }

  function renderEvent(event) {
    const card = el('article', 'event');

    if (event.image) {
      const img = el('img', 'event-img');
      img.src = event.image;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => img.replaceWith(placeholder()));
      card.append(img);
    } else {
      card.append(placeholder());
    }

    const date = el('div', 'event-date');
    date.append(el('span', 'event-month', event.month), el('span', 'event-day', event.day));

    const details = el('div', 'event-details');
    // Titles and descriptions are written in English on Four Norms.
    const title = el('h3', null, event.title);
    title.lang = 'en';
    details.append(title, el('p', 'event-when', event.when));
    if (event.where) details.append(el('p', 'event-where', event.where));
    if (event.excerpt) {
      const excerpt = el('p', 'event-excerpt', event.excerpt);
      excerpt.lang = 'en';
      details.append(excerpt);
    }
    const link = el('a', 'event-link', t('details'));
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
