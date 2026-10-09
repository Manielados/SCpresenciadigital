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
