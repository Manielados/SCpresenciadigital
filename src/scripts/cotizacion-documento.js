// Documento autónomo: conserva los precios de la cotización al descargarlo.
export function quoteDocument(quote) {
  var escape = function (value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  };
  var rows = quote.lines.map(function (line) {
    return '<tr><td>' + escape(line.label) + '</td><td>' + escape(line.amount) + '</td></tr>';
  }).join('');
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cotización · SC Presencia Digital</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f4f1eb;color:#252525;font:16px/1.6 system-ui,sans-serif}
main{max-width:800px;margin:40px auto;padding:48px;background:white;border-top:6px solid #b5422d}
header{border-bottom:1px solid #ddd;padding-bottom:24px}.brand{font-weight:750;color:#a53624;letter-spacing:.04em}
h1{font-size:32px;line-height:1.2;margin:16px 0}h2{font-size:19px;margin-top:30px}p{margin:10px 0}
.muted{color:#595959;font-size:14px}table{width:100%;border-collapse:collapse;margin-top:16px}
th,td{text-align:left;padding:12px 0;border-bottom:1px solid #ddd}th:last-child,td:last-child{text-align:right;white-space:nowrap;padding-left:16px}
tfoot{font-weight:750;font-size:20px}.payments{display:flex;gap:24px;flex-wrap:wrap}.payments p{flex:1}
.maintenance{padding:16px;background:#f4f1eb}.notice{border-left:3px solid #b5422d;padding-left:16px}
a{color:#a53624;overflow-wrap:anywhere}button{background:#a53624;color:white;border:0;border-radius:6px;padding:12px 20px;font:inherit;cursor:pointer}
footer{border-top:1px solid #ddd;margin-top:32px;padding-top:16px}
@media(max-width:600px){main{margin:0;padding:24px}h1{font-size:26px}th,td{font-size:14px}}
@media print{@page{margin:18mm}body{background:white}main{margin:0;padding:0;max-width:none;border:0}.actions{display:none}tr,.maintenance,.payments,footer{break-inside:avoid}a{color:inherit}}
</style></head><body><main>
<header><div class="brand">SC PRESENCIA DIGITAL</div><h1>Cotización de tu página web</h1>
<p class="muted">Preparada el ${escape(quote.date)} · Moneda: ${escape(quote.currency)}</p>
<p class="muted">Estimado informativo, sujeto a confirmación del alcance y del precio final.</p></header>
<h2>Tu proyecto</h2><p>${escape(quote.pages)} · Diseño ${escape(quote.design)}</p>
<p>Textos: ${escape(quote.copy)}</p><p>Entrega ${quote.rush ? 'prioritaria' : 'normal'}: ${escape(quote.days)} días hábiles.</p>
<table><thead><tr><th scope="col">Concepto</th><th scope="col">Importe</th></tr></thead><tbody>${rows}</tbody>
<tfoot><tr><td>Creación de la web · desde</td><td>${escape(quote.total)}</td></tr></tfoot></table>
<h2>Forma de pago del proyecto</h2><div class="payments"><p>50% para empezar<br><strong>${escape(quote.deposit)}</strong></p><p>50% al entregar<br><strong>${escape(quote.balance)}</strong></p></div>
<h2>Mantenimiento mensual</h2><p class="maintenance">${quote.maintenance ? '<strong>' + escape(quote.maintenance) + ' / mes</strong>. Mantenimiento y actualizaciones mensuales. Este cargo recurrente se paga aparte y no forma parte del total ni de los anticipos del proyecto.' : 'No seleccionado. Puedes solicitarlo por US$50 o RD$3,000 al mes, aparte del costo de creación.'}</p>
<h2>Incluido en la creación</h2><ul><li>SEO básico: títulos y descripciones por página, estructura clara, velocidad optimizada y guía para tu perfil de Google Business.</li><li>2 rondas de ajustes.</li><li>15 días de garantía técnica.</li></ul>
${quote.custom ? '<p class="notice">Por el alcance elegido, este proyecto requiere una propuesta a medida. El importe y el plazo mostrados son orientativos.</p>' : ''}
<p class="notice">El precio final se confirma en la propuesta, antes de construir. Este documento conserva el estimado de la fecha indicada; al abrir el enlace del cotizador, los precios pueden haber cambiado.</p>
<footer><p><strong>Sterling Castillo · SC Presencia Digital</strong><br><a href="mailto:contacto@scpresenciadigital.com">contacto@scpresenciadigital.com</a></p>
<p><a href="${escape(quote.contactUrl)}">Hablar de esta cotización por WhatsApp</a></p><p><a href="${escape(quote.shareUrl)}">Volver a mis opciones en el cotizador</a></p></footer>
<p class="actions"><button type="button" onclick="window.print()">Imprimir / Guardar como PDF</button></p>
</main></body></html>`;
}
