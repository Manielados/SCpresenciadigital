import { CFG } from './cotizador-config.js';
import { quoteDocument } from './cotizacion-documento.js';

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var root = document.querySelector('.qt');
  if (!root) return;
  // Versión completa (/cotizar): extras, entrega prioritaria, desglose y enlace para compartir.
  var pro = root.hasAttribute('data-pro');
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
  var maintenancePrice = function () {
    return (currency === 'USD' ? 'US$' : 'RD$') + CFG.maintenance[currency].toLocaleString('en-US');
  };
  var radio = function (n) {
    var el = document.querySelector('input[name=' + n + ']:checked');
    return el ? el.value : null;
  };
  var pagesText = function () { return pages + (pages === 1 ? ' página' : ' páginas'); };

  function calc() {
    var help = radio('copy') === 'help', d = CFG.design[radio('design')];
    var lines = [{ label: 'Base · 1 página', amt: CFG.base }];
    var subtotal = CFG.base, extraDays = 0, chosen = [];
    if (pages > 1) {
      var more = (pages - 1) * CFG.perPage;
      lines.push({ label: 'Páginas adicionales × ' + (pages - 1), amt: more });
      subtotal += more;
    }
    if (help) {
      var cp = CFG.copy.fee + CFG.copy.perPage * pages;
      lines.push({ label: 'Ayuda con los textos', amt: cp });
      subtotal += cp;
    }
    if (d.fee) { lines.push({ label: 'Diseño ' + d.label, amt: d.fee }); subtotal += d.fee; }

    if (pro) {
      document.querySelectorAll('input[name=extra]:checked').forEach(function (i) {
        var x = CFG.extras[i.value];
        if (!x) return;
        var amt = (x.fee || 0) + (x.perPage || 0) * pages;
        chosen.push(x);
        lines.push({ label: x.label, amt: amt });
        subtotal += amt;
        extraDays += x.days || 0;
      });
    }

    var rush = pro && radio('speed') === 'rush', rushFee = 0;
    if (rush) {
      rushFee = Math.round(subtotal * CFG.rush.pct / 100) * 100;
      lines.push({ label: 'Entrega prioritaria (+' + Math.round(CFG.rush.pct * 100) + '%)', amt: rushFee });
    }
    var price = subtotal + rushFee;

    var lo = CFG.baseDays[0] + (pages - 1) * CFG.perPageDays + d.days + (help ? CFG.copy.days : 0) + extraDays;
    var hi = lo + (CFG.baseDays[1] - CFG.baseDays[0]);
    if (rush) {
      lo = Math.max(2, Math.ceil(lo * CFG.rush.daysFactor));
      hi = Math.max(lo + 1, Math.ceil(hi * CFG.rush.daysFactor));
    }
    return {
      price: price, lo: lo, hi: hi, help: help, d: d, lines: lines, extras: chosen, rush: rush,
      maint: $('maint').checked,
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

    if ($('picks')) {
      var items = [pagesText(),
        c.help ? 'Te ayudo a definir qué decir' : 'Ya tienes tus textos',
        'Diseño ' + c.d.label];
      if (c.maint) items.push('Mantenimiento mensual: ' + maintenancePrice() + ' / mes (pago aparte)');
      $('picks').innerHTML = items.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    }
    if ($('brk')) {
      $('brk').innerHTML = c.lines.map(function (l) {
        return '<li><span>' + l.label + '</span><b>' + fmt(l.amt) + '</b></li>';
      }).join('') + (c.maint ? '<li class="note"><span>Mantenimiento mensual · pago aparte</span><b>' + maintenancePrice() + ' / mes</b></li>' : '');
    }
    if ($('pay')) {
      var half = Math.round(c.price / 2);
      $('pay').innerHTML = '<span>50% para empezar <b>' + fmt(half) + '</b></span>' +
        '<span>50% al entregar <b>' + fmt(c.price - half) + '</b></span>';
    }
    document.querySelectorAll('.pr[data-x]').forEach(function (el) {
      var x = CFG.extras[el.getAttribute('data-x')], t = [];
      if (x.fee) t.push('+' + fmt(x.fee));
      if (x.perPage) t.push('+' + fmt(x.perPage) + ' por página');
      el.textContent = t.join(' ');
    });
    $('maint-price').textContent = maintenancePrice() + ' / mes';
    $('cust').hidden = !c.custom;
    if (pro && touched) syncUrl();
  }

  /* ---- Enlace para guardar o compartir la cotización (solo /cotizar) ---- */
  function shareQuery() {
    var q = new URLSearchParams();
    q.set('p', pages);
    q.set('c', radio('copy'));
    q.set('d', radio('design'));
    q.set('cur', currency);
    var xs = [];
    document.querySelectorAll('input[name=extra]:checked').forEach(function (i) { xs.push(i.value); });
    if (xs.length) q.set('x', xs.join(','));
    if (radio('speed') === 'rush') q.set('r', '1');
    if ($('maint').checked) q.set('m', '1');
    return q.toString();
  }
  function shareUrl() { return location.origin + location.pathname + '?' + shareQuery(); }
  function syncUrl() {
    try { history.replaceState(null, '', location.pathname + '?' + shareQuery()); } catch (e) {}
  }
  function check(sel, on) { var el = document.querySelector(sel); if (el) el.checked = on; }
  function loadFromUrl() {
    var q = new URLSearchParams(location.search);
    if (q.get('cur') === 'DOP' || q.get('cur') === 'USD') currency = q.get('cur');
    if (!q.has('p') && !q.has('x') && !q.has('d') && !q.has('c')) return;
    var p = parseInt(q.get('p'), 10);
    if (p >= 1 && p <= CFG.maxPages) pages = p;
    if (q.get('c') === 'own' || q.get('c') === 'help') check('input[name=copy][value=' + q.get('c') + ']', true);
    if (CFG.design[q.get('d')]) check('input[name=design][value=' + q.get('d') + ']', true);
    var xs = (q.get('x') || '').split(',');
    Object.keys(CFG.extras).forEach(function (k) { check('input[name=extra][value=' + k + ']', xs.indexOf(k) !== -1); });
    check('input[name=speed][value=' + (q.get('r') === '1' ? 'rush' : 'normal') + ']', true);
    $('maint').checked = q.get('m') === '1';
    touched = true;
    shown = calc().price;
  }

  function summary() {
    if (!(touched || pro) || !last) return '';
    var c = last;
    return '\n\nMi estimado en el cotizador:\n• ' + pagesText() +
      '\n• Textos: ' + (c.help ? 'necesito ayuda para definir qué decir' : 'ya los tengo') +
      '\n• Diseño: ' + c.d.label +
      (c.extras.length ? '\n• Extras: ' + c.extras.map(function (x) { return x.label; }).join(', ') : '') +
      (c.rush ? '\n• Entrega prioritaria' : '') +
      (c.maint ? '\n• Mantenimiento mensual: ' + maintenancePrice() + ' / mes (pago aparte)' : '') +
      '\nDesde ' + fmt(c.price) + ' · ' + c.lo + '–' + c.hi + ' días hábiles.' +
      (pro ? '\nMi cotización: ' + shareUrl() : '');
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
    open('Hola, estuve armando mi web en el cotizador y me gustaría hablar de mi proyecto.' + (touched || pro ? summary() : ''));
  });
  // El formulario de contacto solo existe en la home.
  var form = $('f');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var v = function (i) { return $(i).value.trim(); };
      open('Hola, soy ' + v('n') + (v('c') ? ' (' + v('c') + ')' : '') + '. Me gustaría hablar de mi proyecto.' +
        (v('m') ? ' ' + v('m') : '') + (v('e') ? ' Mi correo: ' + v('e') : '') + summary());
    });
  }
  var copy = $('copylink');
  var download = $('downloadquote');
  if (pro && download) {
    download.addEventListener('click', function () {
      var c = calc();
      last = c;
      var now = new Date();
      var half = Math.round(c.price / 2);
      var html = quoteDocument({
        date: now.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
        currency: currency === 'USD' ? 'USD · dólares estadounidenses' : 'DOP · pesos dominicanos',
        pages: pagesText(), design: c.d.label,
        copy: c.help ? 'Ayuda para definir el mensaje y escribir los textos' : 'Textos proporcionados por el cliente',
        days: c.lo + '–' + c.hi, rush: c.rush, custom: c.custom,
        lines: c.lines.map(function (line) { return { label: line.label, amount: fmt(line.amt) }; }),
        total: fmt(c.price), deposit: fmt(half), balance: fmt(c.price - half),
        maintenance: c.maint ? maintenancePrice() : null,
        shareUrl: shareUrl(),
        contactUrl: 'https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent('Hola, quiero hablar de mi cotización.' + summary())
      });
      var url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
      var link = document.createElement('a');
      link.href = url;
      link.download = 'cotizacion-sc-' + now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + '.html';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      $('copied').textContent = 'Cotización descargada. Abre el archivo para verla, imprimirla o guardarla como PDF.';
    });
  }
  if (copy) {
    copy.addEventListener('click', function () {
      var msg = $('copied');
      var done = function (ok) {
        msg.textContent = ok ? 'Enlace copiado. Ábrelo cuando quieras para volver a tu cotización.'
          : 'No se pudo copiar. Copia la dirección desde la barra del navegador.';
      };
      syncUrl();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl()).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  }
  $('rate').textContent = '1 USD = RD$' + CFG.usdRate;
  if (pro) loadFromUrl();
  setCurrency(currency, false);
})();
