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
  var fmt = function (n) { return 'RD$' + n.toLocaleString('en-US'); };
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
      c.help ? 'Te ayudamos a definir qué decir' : 'Ya tienes tus textos',
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
  $('go').addEventListener('click', function () {
    open('Hola, estuve armando mi web en el cotizador y me gustaría hablar de mi proyecto.' + (touched ? summary() : ''));
  });
  $('f').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = function (i) { return $(i).value.trim(); };
    open('Hola, soy ' + v('n') + (v('c') ? ' (' + v('c') + ')' : '') + '. Me gustaría hablar de mi proyecto.' +
      (v('m') ? ' ' + v('m') : '') + (v('e') ? ' Mi correo: ' + v('e') : '') + summary());
  });
  render();
})();
