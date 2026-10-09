import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// El sitio sigue siendo estático (cada página se genera al hacer build).
// El adaptador de Vercel solo hace falta para el panel /keystatic.
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [react(), keystatic()],
  // URL del sitio: de aquí salen el canonical y las URLs de Open Graph.
  // Cuando conectes tu dominio propio, cámbiala aquí (y la URL de retorno de la GitHub App).
  site: 'https://scpresenciadigital.vercel.app',
});
