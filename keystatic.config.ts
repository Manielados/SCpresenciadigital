import { config, fields, collection } from '@keystatic/core';

// Repositorio de GitHub donde Keystatic guarda los cambios (usuario/repositorio).
const REPO = 'Manielados/SCpresenciadigital';

export default config({
  // En tu PC (npm run dev) edita archivos locales; en el sitio publicado guarda en GitHub.
  // Para probar o configurar el modo GitHub desde tu PC, pon PUBLIC_KEYSTATIC_MODE=github en el archivo .env
  storage:
    import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_MODE === 'github'
      ? { kind: 'github', repo: REPO as `${string}/${string}` }
      : { kind: 'local' },

  ui: {
    brand: { name: 'SC Presencia Digital' },
  },

  collections: {
    faq: collection({
      label: 'Preguntas frecuentes',
      slugField: 'pregunta',
      path: 'src/content/faq/*',
      format: { data: 'yaml' },
      schema: {
        pregunta: fields.slug({ name: { label: 'Pregunta' } }),
        respuesta: fields.text({ label: 'Respuesta', multiline: true }),
        orden: fields.integer({
          label: 'Orden',
          description: 'Número menor = aparece antes (1, 2, 3...).',
          defaultValue: 99,
        }),
      },
    }),
  },
});
