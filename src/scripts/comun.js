/* Comportamiento común a todas las páginas (botón de WhatsApp y FAQ). */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* Menú hamburguesa: abrir/cerrar en móvil. */
(function () {
  var nav = document.getElementById('nav');
  var btn = nav && nav.querySelector('.nav-toggle');
  if (!nav || !btn) return;
  function set(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
  nav.querySelectorAll('.menu a').forEach(function (a) {
    a.addEventListener('click', function () { set(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); }
  });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) set(false); });
  var desktop = window.matchMedia('(min-width: 821px)');
  desktop.addEventListener('change', function (e) { if (e.matches) set(false); });
})();

