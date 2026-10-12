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

    blog: collection({
      label: 'Blog',
      slugField: 'titulo',
      path: 'src/content/blog/*/',
      entryLayout: 'content',
      format: { contentField: 'contenido' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título' } }),
        resumen: fields.text({
          label: 'Resumen',
          description: '1–2 frases. Aparece en el listado del blog y como descripción en Google.',
          multiline: true,
          validation: { length: { min: 40, max: 200 } },
        }),
        fecha: fields.date({ label: 'Fecha de publicación', defaultValue: { kind: 'today' } }),
        imagen: fields.image({
          label: 'Imagen de portada (opcional)',
          description: 'Ideal: 1200×630 px. También se usa al compartir el artículo en redes y WhatsApp.',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        borrador: fields.checkbox({
          label: 'Borrador',
          description: 'Si está marcado, el artículo no aparece en la web.',
          defaultValue: false,
        }),
        contenido: fields.markdoc({
          label: 'Contenido',
          options: { image: { directory: 'public/images/blog', publicPath: '/images/blog/' } },
        }),
      },
    }),
  },
});
