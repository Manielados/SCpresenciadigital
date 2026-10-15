/* ============================================================
   COTIZADOR · SC Presencia Digital
   Todos los precios y tiempos viven aquí. Edita solo este archivo.
   Lo usan el cotizador simple de la home y el completo de /cotizar.
   ============================================================ */
export const CFG = {
  whatsapp: '18096278994',
  base: 12000,              // 1 página, textos del cliente, base de diseño trabajada
  baseDays: [5, 7],         // días hábiles de la base [mín, máx]
  perPage: 2500,            // cada página adicional
  perPageDays: 1,
  maxPages: 12,
  copy: { fee: 2000, perPage: 1000, days: 3 },   // cuando el cliente necesita ayuda con los textos
  usdRate: 59.58,                              // 1 USD = RD$59.58
  maintenance: { DOP: 3000, USD: 50 },          // tarifa mensual fija por moneda
  design: {
    base:    { fee: 0,    days: 0, label: 'con base trabajada' },
    similar: { fee: 4000, days: 2, label: 'parecido a otra web que te gusta' },
    custom:  { fee: 9000, days: 5, label: 'hecho a tu medida' }
  },
  customAt: { pages: 10, total: 50000 },         // a partir de aquí: "proyecto a medida"

  /* ---- SOLO PARA /cotizar (el cotizador completo) ----
     ⚠️ PRECIOS DE EJEMPLO: ajústalos a lo que realmente cobras antes de publicar.
     fee = precio fijo · perPage = suma extra por cada página · days = días hábiles que añade */
  extras: {
    blog:      { label: 'Blog con panel para publicar tú mismo', hint: 'Escribes y publicas artículos sin tocar código.',                fee: 6000, days: 3 },
    form:      { label: 'Formulario de contacto con aviso a tu correo', hint: 'Los mensajes te llegan directo a tu bandeja.',           fee: 2500, days: 1 },
    gallery:   { label: 'Galería o portafolio de trabajos', hint: 'Muestra tus proyectos con fotos y una descripción.',                fee: 3500, days: 2 },
    seo:       { label: 'SEO local reforzado', hint: 'Google Business, datos estructurados y palabras clave de tu zona.',               fee: 4000, days: 2 },
    analytics: { label: 'Analítica y seguimiento de contactos', hint: 'Sabes cuánta gente llega y cuántos te escriben.',                fee: 2000, days: 1 },
    lang:      { label: 'Web en dos idiomas', hint: 'Español e inglés. Se suma por cada página.',                                       fee: 0, perPage: 1500, days: 3 }
  },
  rush: { pct: 0.25, daysFactor: 0.6 }           // entrega prioritaria: +25% y 40% menos días
};
