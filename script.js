// SC · Presencia Digital — lógica del modal de contacto (sin frameworks)

document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('contact-modal-backdrop');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButton = document.getElementById('modal-close');
  const form = document.getElementById('contact-form');
  const copyEmailBtn = document.getElementById('copy-email');
  const footerYear = document.getElementById('footer-year');

  // Año dinámico en el footer
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // Número de WhatsApp — EDITAR AQUÍ si cambia
  const WHATSAPP_NUMBER = '18095550199';
  const EMAIL = 'contacto@scpresenciadigital.com';

  function openModal() {
    backdrop.hidden = false;
  }

  function closeModal() {
    backdrop.hidden = true;
  }

  openButtons.forEach((btn) => btn.addEventListener('click', openModal));
  closeButton.addEventListener('click', closeModal);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !backdrop.hidden) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('field-name').value.trim();
    const business = document.getElementById('field-business').value.trim();
    const phone = document.getElementById('field-phone').value.trim();

    let text = `Hola SC Presencia Digital, soy ${name || 'un negocio local'}`;
    if (business) text += ` de "${business}"`;
    text += `. Me interesa tener una web propia que trabaje de forma autónoma. Mi teléfono de contacto es: ${phone || 'el de este chat'}.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });

  copyEmailBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      const original = copyEmailBtn.textContent;
      copyEmailBtn.textContent = '✓ Copiado al portapapeles';
      setTimeout(() => {
        copyEmailBtn.textContent = original;
      }, 2200);
    });
  });
});
