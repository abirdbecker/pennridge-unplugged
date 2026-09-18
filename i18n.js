// English/Spanish toggle. English is the source text in the HTML. Any element
// with data-i18n="key" swaps its contents for the Spanish string below, and
// data-i18n-placeholder does the same for input placeholders. The choice is
// remembered per browser. site.js reads window.siteLang for its own strings.
//
// When English copy in the HTML changes, update the matching Spanish here too.
// A missing key simply shows the English.

(function () {
  const STORAGE_KEY = 'pennridge-lang';

  const ES = {
    // ---------- Shared: nav + footer ----------
    'nav.about': 'Acerca de',
    'nav.resources': 'Recursos',
    'nav.events': 'Eventos',
    'nav.involved': 'Participe',
    'footer.parent': 'Una iniciativa comunitaria de <a href="https://bucksunplugged.org" target="_blank" rel="noopener">Bucks Unplugged</a>',
    'footer.pa': 'Parte de la red de <a href="https://paunplugged.org" target="_blank" rel="noopener">PA Unplugged</a>',

    // ---------- Home ----------
    'title.home': 'Pennridge Unplugged | Ayudando a las familias a recuperar la infancia',
    'home.hero': 'Pennridge Unplugged es un grupo comunitario que trabaja por un uso más intencional de la tecnología en el hogar y en la escuela. Conectamos a las familias, compartimos recursos y abogamos por enfoques sensatos sobre las pantallas y los dispositivos en la vida de nuestros hijos.',
    'home.join': 'Únase a Pennridge Unplugged',
    'home.why': '¿Por qué Pennridge Unplugged?',
    'home.why1': 'Las investigaciones son claras: el aumento de la ansiedad, la depresión, los problemas de sueño y la pérdida de experiencias de la infancia están relacionados con el uso temprano y excesivo de las pantallas. Y en las aulas, el uso excesivo de dispositivos está afectando la concentración, el aprendizaje y las relaciones entre maestros y estudiantes que nuestros hijos necesitan.',
    'home.why2': 'Pero es difícil impulsar un cambio por su cuenta, ya sea al poner límites en casa cuando todos los demás niños tienen un teléfono inteligente, o al pedirle a su distrito escolar que reconsidere cómo se usa la tecnología en el aula.',
    'home.why3': 'Por eso existe Pennridge Unplugged. <strong>Juntos somos más fuertes.</strong> Somos padres y miembros de la comunidad que abogamos por un uso más intencional de la tecnología tanto en el hogar como en nuestras escuelas.',
    'card.home.title': 'En el hogar',
    'card.home.lead': 'Apoyar a las familias para crear una infancia más equilibrada y conectada en un mundo digital.',
    'card.home.body': 'Reunimos a las familias para compartir experiencias, recursos prácticos e ideas para manejar la tecnología en casa. Eso puede significar retrasar los teléfonos inteligentes y las redes sociales, dar el ejemplo con hábitos digitales más saludables y crear más oportunidades para que los niños desarrollen su independencia, adquieran habilidades para la vida real y simplemente jueguen.',
    'card.school.title': 'En la escuela',
    'card.school.lead': 'Contribuir a políticas tecnológicas bien pensadas mediante un diálogo informado y constructivo.',
    'card.school.body': 'Colaborar con familias, educadores y líderes escolares para apoyar políticas tecnológicas basadas en la evidencia y adecuadas para el desarrollo. Ayudamos a incorporar la investigación, la perspectiva de las familias y el diálogo abierto en las decisiones sobre cómo se usa la tecnología en nuestras escuelas, con el aprendizaje, el bienestar y las relaciones de los estudiantes en el centro.',
    'card.together.title': 'Juntos',
    'card.together.lead': 'Crear más oportunidades para que niños, familias y vecinos se conecten, aprendan y sientan que pertenecen.',
    'card.together.body': 'Trabajar con escuelas, organizaciones comunitarias y negocios para fortalecer la conexión en el mundo real y el uso intencional de la tecnología. A través de espacios libres de teléfonos, clubes de lectura comunitarios, conversaciones y aprendizaje compartido, podemos facilitar que las familias se relacionen entre sí y construir una comunidad más unida.',
    'home.cta.title': 'Participe',
    'home.cta.body': 'Inscríbase para unirse a Pennridge Unplugged y conectar con familias de su zona. Le mantendremos al tanto de eventos locales, recursos y formas de marcar la diferencia en nuestras escuelas y nuestra comunidad.',
    'home.cta.signup': 'Inscribirse',
    'home.cta.ways': 'Formas de participar',
    'contact.button': 'Contáctenos',
    'events.title': 'Próximos eventos',
    'events.note': 'Los títulos y las descripciones de los eventos se publican en inglés.',

    // ---------- About ----------
    'title.about': 'Acerca de | Pennridge Unplugged',
    'about.title': 'Quiénes somos',
    'about.subtitle': 'Padres, educadores y vecinos que trabajan por una cultura tecnológica más intencional en Pennridge.',
    'about.p1': 'Pennridge Unplugged es un grupo de padres, educadores, profesionales de la salud mental y miembros de la comunidad que aportan diversas trayectorias y experiencias a este trabajo. No estamos en contra de la tecnología. Buscamos usarla con intención. Compartimos el deseo de ayudar a los niños, las familias y las escuelas a navegar un mundo digital que cambia rápidamente.',
    'about.p2': 'Sabemos que las familias y las escuelas ya tienen mucho que atender. Al crear normas compartidas, políticas bien pensadas y soluciones prácticas, podemos hacer que la tecnología sea más fácil de manejar y reducir la energía que se gasta en controlar distracciones y hacer cumplir límites, devolviendo tiempo y atención a lo que más importa: la conexión, el juego, el aprendizaje y la vida fuera de las pantallas. Para las escuelas, eso significa más espacio para que los maestros enseñen, los estudiantes aprendan y los administradores se enfoquen en la educación.',
    'about.p3': 'Este es un momento importante para ser parte de estas conversaciones. Mientras se debaten a nivel local, estatal y nacional preguntas sobre la inteligencia artificial (IA), la tecnología educativa (EdTech) y las escuelas libres de teléfonos, estamos creando un espacio de conexión y diálogo constructivo aquí en Pennridge. Abogamos por enfoques bien pensados, reunimos a personas y perspectivas diversas, y buscamos ser un recurso confiable y una voz asesora para nuestras escuelas y toda la comunidad.',
    'about.p4': '¿Quiere saber más? Escríbanos a <a href="mailto:info@pennridgeunplugged.org">info@pennridgeunplugged.org</a>.',

    // ---------- Get Involved ----------
    'title.involved': 'Participe | Pennridge Unplugged',
    'involved.title': 'Participe',
    'involved.subtitle': 'Hay tres formas de ser parte de Pennridge Unplugged, y en esta conversación hay lugar para todos.',
    'ways.informed': 'Únase a la lista de correo, venga a una reunión mensual o asista a un evento.',
    'ways.involved': 'Conecte con otras familias y sume su voz a la conversación.',
    'ways.action': 'Construya comunidad, colabore a nivel local, alce la voz o aporte sus habilidades.',
    'ways.more': 'Vea cómo &darr;',
    'involved.intro2': 'Nuestra labor de defensa y de construcción de relaciones se enfoca en las escuelas de Pennridge, y damos la bienvenida a cualquier persona que viva dentro del distrito a nuestras reuniones, nuestra lista de correo y nuestros eventos. Esperamos que este sea un espacio para conectar, aprender, compartir ideas y contribuir a una cultura tecnológica más intencional en nuestra comunidad. En esta conversación hay lugar para todos.',
    'informed.title': 'Manténgase informado',
    'informed.lead': 'Manténgase al tanto de lo que sucede en Pennridge y más allá.',
    'informed.li1': 'Únase a nuestra lista de correo para recibir noticias, recursos, próximos eventos y formas de participar.',
    'informed.li2': 'Asista a un <a href="index.html#events">próximo evento comunitario</a> o conversación.',
    'informed.li3': 'Venga a una de nuestras reuniones mensuales, que se realizan el tercer jueves de cada mes de 6:30 a 8 p. m., para conocer más sobre lo que estamos haciendo.',
    'informed.li4': 'Siga nuestras novedades mientras compartimos ideas y oportunidades para un uso más intencional de la tecnología en el hogar, en la escuela y en nuestra comunidad.',
    'signup.title': 'Inscríbase en nuestra lista de correo y reciba información sobre eventos y reuniones',
    'form.first': 'Nombre',
    'form.last': 'Apellido',
    'form.email': 'Correo electrónico',
    'form.zip': 'Código postal',
    'form.submit': 'Inscribirse',
    'signup.member': '¿Quiere ayudar a liderar este trabajo? <a href="https://www.fournorms.com/pa-unplugged/pennridge-unplugged" target="_blank" rel="noopener">Hágase miembro en Four Norms</a>.',
    'involve.title': 'Participe activamente',
    'involve.lead': 'Conecte con otras familias y sume su voz a la conversación.',
    'involve.li1': 'Responda la <a href="https://survey.paunplugged.org" target="_blank" rel="noopener">encuesta para padres de PA Unplugged</a> y contribuya a los datos estatales sobre las experiencias de las familias con la tecnología en las escuelas.',
    'involve.li2': 'Conecte con otras familias de su escuela primaria, comprométase a retrasar los teléfonos inteligentes y las redes sociales hasta después del 8.º grado, comparta recursos y encuentre apoyo local en el camino.',
    'involve.li3': '<a href="mailto:info@pennridgeunplugged.org">Hable con nosotros</a> sobre lo que está viendo en su familia, escuela o comunidad, y lo que le gustaría que cambiara.',
    'action.title': 'Pase a la acción',
    'action.lead': 'Ayude a crear una comunidad donde los niños tengan más oportunidades de conexión, independencia, juego y vida más allá de las pantallas.',
    'action.intro': 'Hay muchas formas de pasar a la acción, y siempre buscamos personas con ideas, contactos y energía para contribuir. Usted podría:',
    'involve.c1': 'Comparta su experiencia',
    'involve.c2': 'Conecte con otras familias',
    'involve.c3': 'Hable con nosotros',
    'action.c1': 'Construir comunidad',
    'action.t1': 'Ayudar a organizar un evento, una conversación o una actividad familiar; llevar Pennridge Unplugged a su escuela, vecindario o grupo comunitario; o ayudar a conectar a las familias con oportunidades libres de teléfonos y con poca tecnología.',
    'action.c2': 'Colaborar a nivel local',
    'action.t2': 'Trabajar con escuelas, organizaciones y negocios para crear espacios y prácticas que apoyen el uso intencional de la tecnología.',
    'action.c3': 'Alzar la voz',
    'action.t3': 'Asistir a las reuniones de la junta escolar y compartir su perspectiva durante los comentarios públicos, conectar con líderes escolares y del distrito, o abogar a nivel del condado y del estado por políticas que apoyen un uso saludable de la tecnología y el bienestar de los niños.',
    'action.c4': 'Aportar sus habilidades',
    'action.t4': 'Compartir información y recursos, crear contactos o aportar sus ideas y experiencia a un proyecto que le interese.',
    'contact.title': '¿Quiere encontrar su lugar?',
    'contact.lead': 'Comuníquese con nosotros. Cuéntenos qué le interesa, qué preguntas tiene o en qué le gustaría ayudar. Nos encantaría conversar sobre cómo sumarle a lo que ya está en marcha, o trabajar juntos para crear algo nuevo.',
    'contact.email': 'Escríbanos a <a href="mailto:info@pennridgeunplugged.org">info@pennridgeunplugged.org</a>',

    // ---------- Resources ----------
    'title.resources': 'Recursos | Pennridge Unplugged',
    'res.title': 'Recursos',
    'res.intro': '¿Está empezando? Estas son algunas de las voces de confianza que lideran la conversación a nivel estatal y nacional.',
    'res.callout.label': 'Empiece aquí · A nivel estatal',
    'res.callout.body': 'Datos estatales y páginas informativas sobre teléfonos, EdTech, IA y más, todo en un solo lugar.',
    'res.visit.pau': 'Visite paunplugged.org →',
    'res.learn': 'Aprenda',
    'res.go': 'Visitar →',
    'res.pfs': 'Escuelas libres de teléfonos',
    'res.edtech': 'EdTech y dispositivos 1:1',
    'res.ai': 'La IA y su familia',
    'res.slow': 'Una vida con tecnología más pausada',
    'res.alt': 'Dispositivos alternativos',
    'res.data': 'Datos estatales',
    'res.pays': 'Datos de la Encuesta Juvenil de Pensilvania (PAYS)',
    'res.dashboard': 'Tiempo de pantalla y uso de tecnología en las escuelas K-12 de PA',
    'res.b2b': 'Seguimiento de políticas de teléfonos durante toda la jornada escolar',
    'res.bills': 'Seguimiento de legislación de PA',
    'res.national': 'Voces nacionales',
    'res.letgrow': 'Una organización nacional sin fines de lucro que busca que sea fácil, normal y legal darles a los niños la independencia y el juego libre que necesitan para prosperar.',
    'res.visit.letgrow': 'Visite letgrow.org →',
    'res.network': 'Nuestra red',
    'res.network.lead': 'Pennridge Unplugged es parte de una red creciente de grupos dirigidos por padres en el condado de Bucks y en todo Pensilvania.',
    'res.bucks': 'Una comunidad de base en el condado de Bucks que ayuda a las familias a retrasar los teléfonos inteligentes y las redes sociales para los niños y a construir una relación más sana con la tecnología.',
    'res.visit.bucks': 'Visite bucksunplugged.org →',
    'res.pau': 'La red estatal que conecta a los grupos locales Unplugged que trabajan por un uso más intencional de la tecnología en el hogar y en las escuelas.',
  };

  const englishHtml = new Map();
  const englishPlaceholder = new Map();
  const listeners = [];
  let current = 'en';

  try {
    if (localStorage.getItem(STORAGE_KEY) === 'es') current = 'es';
  } catch {
    // Storage blocked (private mode etc.): default to English.
  }

  function apply(lang) {
    current = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach((node) => {
      if (!englishHtml.has(node)) englishHtml.set(node, node.innerHTML);
      const spanish = ES[node.dataset.i18n];
      node.innerHTML = lang === 'es' && spanish != null ? spanish : englishHtml.get(node);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      if (!englishPlaceholder.has(node)) englishPlaceholder.set(node, node.placeholder);
      const spanish = ES[node.dataset.i18nPlaceholder];
      node.placeholder = lang === 'es' && spanish != null ? spanish : englishPlaceholder.get(node);
    });

    // The button names the language you'd switch to, in that language.
    document.querySelectorAll('[data-lang-toggle]').forEach((button) => {
      button.textContent = lang === 'es' ? 'English' : 'Español';
      button.lang = lang === 'es' ? 'en' : 'es';
    });

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}

    listeners.forEach((fn) => fn(lang));
  }

  window.siteLang = {
    get: () => current,
    onChange: (fn) => listeners.push(fn),
  };

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-lang-toggle]')) apply(current === 'es' ? 'en' : 'es');
  });

  apply(current);
})();
