import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';

// El sitio sigue siendo estático (cada página se genera al hacer build).
// El adaptador de Vercel solo hace falta para el panel /keystatic.
export default defineConfig({
  output: 'static',
  adapter: vercel({
    // El adaptador deja un `import "rolldown"` en el arranque de la función, y Vercel
    // no empaqueta su componente nativo solo. Lo incluimos a mano para que no falle.
    includeFiles: [
      './node_modules/@rolldown/binding-linux-x64-gnu/package.json',
      './node_modules/@rolldown/binding-linux-x64-gnu/rolldown-binding.linux-x64-gnu.node',
    ],
  }),
  integrations: [react(), keystatic()],
  // URL del sitio: de aquí salen el canonical y las URLs de Open Graph.
  // Cuando conectes tu dominio propio, cámbiala aquí (y la URL de retorno de la GitHub App).
  site: 'https://scpresenciadigital.vercel.app',
});
