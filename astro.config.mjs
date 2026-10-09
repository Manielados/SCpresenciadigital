import { defineConfig } from 'astro/config';

// Salida estática: Vercel la sirve tal cual, sin adaptador.
export default defineConfig({
  output: 'static',
  // site: 'https://scpresenciadigital.com', // descomenta al conocer el dominio (sitemap, canonical)
});
