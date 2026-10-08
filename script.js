/* ============================================================
   COTIZADOR · SC Presencia Digital
   Todos los precios y tiempos viven aquí. Edita solo este bloque.
   ============================================================ */
const CFG = {
  whatsapp: '18096278994',
  base: 12000,              // 1 página, textos del cliente, base de diseño trabajada
  baseDays: [5, 7],         // días hábiles de la base [mín, máx]
  perPage: 2500,            // cada página adicional
  perPageDays: 1,
  maxPages: 12,
  copy: { fee: 2000, perPage: 1000, days: 3 },   // cuando el cliente necesita ayuda con los textos
  usdRate: 59.58,                              // 1 USD = RD$59.58
  design: {
    base:    { fee: 0,    days: 0, label: 'con base trabajada' },
    similar: { fee: 4000, days: 2, label: 'parecido a otra web que te gusta' },
    custom:  { fee: 9000, days: 5, label: 'hecho a tu medida' }
  },
  customAt: { pages: 10, total: 50000 }          // a partir de aquí: "proyecto a medida"
};

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pages = 1, shown = CFG.base, tok = 0, touched = false, last = null;
  var STORAGE_KEY = 'sc-cotizador-currency';
  var savedCurrency = getSavedCurrency();
  var currency = savedCurrency || guessCurrency();

  function getSavedCurrency() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'USD' || saved === 'DOP' ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function saveCurrency(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) {}
  }

  // Moneda inicial sin servicios externos: zona horaria e idioma del navegador.
  // Si es de RD -> RD$. Si es claramente de otro lugar -> US$. Si no se sabe -> RD$.
  function guessCurrency() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']);
      var esDO = langs.some(function (l) { return /^es[-_]DO$/i.test(l); });
      if (tz === 'America/Santo_Domingo' || esDO) return 'DOP';
      if (tz && !/^(UTC|Etc\/)/i.test(tz)) return 'USD';
    } catch (e) {}
    return 'DOP';
  }

  function setCurrency(value, remember) {
    currency = value;
    if (remember) saveCurrency(value);
    document.querySelectorAll('.cur').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-cur') === value ? 'true' : 'false');
    });
    render();
  }

  var fmt = function (n) {
    if (currency === 'USD') {
      return 'US$' + (Math.round(n / CFG.usdRate / 5) * 5).toLocaleString('en-US');
    }
    return 'RD$' + n.toLocaleString('en-US');
  };
  var radio = function (n) { return document.querySelector('input[name=' + n + ']:checked').value; };

  function calc() {
    var help = radio('copy') === 'help', d = CFG.design[radio('design')];
    var price = CFG.base + (pages - 1) * CFG.perPage + d.fee +
      (help ? CFG.copy.fee + CFG.copy.perPage * pages : 0);
    var lo = CFG.baseDays[0] + (pages - 1) * CFG.perPageDays + d.days + (help ? CFG.copy.days : 0);
    var hi = lo + (CFG.baseDays[1] - CFG.baseDays[0]);
    return {
      price: price, lo: lo, hi: hi, help: help, d: d, maint: $('maint').checked,
      custom: pages >= CFG.customAt.pages || price >= CFG.customAt.total
    };
  }

  function tween(to) {
    var from = shown, id = ++tok; shown = to;
    if (reduce || from === to) { $('amt').textContent = fmt(to); return; }
    var t0 = performance.now();
    (function step(t) {
      if (id !== tok) return;
      var k = Math.min(1, (t - t0) / 280);
      $('amt').textContent = fmt(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function render() {
    var c = calc(); last = c;
    $('pg').textContent = pages;
    $('minus').disabled = pages <= 1;
    $('plus').disabled = pages >= CFG.maxPages;
    tween(c.price);
    $('days').textContent = c.lo + '–' + c.hi + ' días hábiles';
    $('sr').textContent = 'Estimado desde ' + fmt(c.price) + ', entrega en ' + c.lo + ' a ' + c.hi + ' días hábiles.';
    var items = [pages + (pages === 1 ? ' página' : ' páginas'),
      c.help ? 'Te ayudo a definir qué decir' : 'Ya tienes tus textos',
      'Diseño ' + c.d.label];
    if (c.maint) items.push('Mantenimiento mensual (se cotiza aparte)');
    $('picks').innerHTML = items.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    $('cust').hidden = !c.custom;
  }

  function summary() {
    if (!touched || !last) return '';
    var c = last;
    return '\n\nMi estimado en el cotizador:\n• ' + pages + (pages === 1 ? ' página' : ' páginas') +
      '\n• Textos: ' + (c.help ? 'necesito ayuda para definir qué decir' : 'ya los tengo') +
      '\n• Diseño: ' + c.d.label +
      (c.maint ? '\n• Mantenimiento mensual: quiero cotizarlo aparte' : '') +
      '\nDesde ' + fmt(c.price) + ' · ' + c.lo + '–' + c.hi + ' días hábiles.';
  }
  function open(text) {
    window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }

  $('minus').addEventListener('click', function () { if (pages > 1) { pages--; touched = true; render(); } });
  $('plus').addEventListener('click', function () { if (pages < CFG.maxPages) { pages++; touched = true; render(); } });
  document.querySelectorAll('.qt input').forEach(function (i) {
    i.addEventListener('change', function () { touched = true; render(); });
  });
  document.querySelectorAll('.cur').forEach(function (b) {
    b.addEventListener('click', function () { setCurrency(b.getAttribute('data-cur'), true); });
  });
  $('go').addEventListener('click', function () {
    open('Hola, estuve armando mi web en el cotizador y me gustaría hablar de mi proyecto.' + (touched ? summary() : ''));
  });
  $('f').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = function (i) { return $(i).value.trim(); };
    open('Hola, soy ' + v('n') + (v('c') ? ' (' + v('c') + ')' : '') + '. Me gustaría hablar de mi proyecto.' +
      (v('m') ? ' ' + v('m') : '') + (v('e') ? ' Mi correo: ' + v('e') : '') + summary());
  });
  $('wa').href = 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent('Hola, vi tu web y me gustaría hablar de mi proyecto.');
  $('rate').textContent = '1 USD = RD$' + CFG.usdRate;
  setCurrency(currency, false);

  // Botón flotante de WhatsApp: aparece solo cuando el hero ya quedó atrás.
  (function () {
    var wa = $('wa'), hero = document.querySelector('.hero');
    if (!wa || !hero || !('IntersectionObserver' in window)) { if (wa) wa.classList.add('show'); return; }
    new IntersectionObserver(function (entries) {
      wa.classList.toggle('show', !entries[0].isIntersecting);
    }).observe(hero);
  })();

  // FAQ: al abrir una pregunta, un scroll suave la deja completa a la vista.
  document.querySelectorAll('.faq details').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      requestAnimationFrame(function () {
        d.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  });
})();
