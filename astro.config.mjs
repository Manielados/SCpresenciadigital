import { defineConfig } from 'astro/config';

// Salida estática: Vercel la sirve tal cual, sin adaptador.
export default defineConfig({
  output: 'static',
  // URL final del sitio: de aquí salen el canonical y las URLs de Open Graph.
  // Cámbiala si tu dominio es otro.
  site: 'https://scpresenciadigital.com',
});
