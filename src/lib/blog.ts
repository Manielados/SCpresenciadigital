import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

/** Fecha legible: "9 de octubre de 2026". */
export function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-DO', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

/** Artículos publicados (sin borradores), del más nuevo al más antiguo. */
export async function getPosts() {
  const all = await reader.collections.blog.all();
  return all
    .filter((p) => !p.entry.borrador)
    .sort((a, b) => (b.entry.fecha ?? '').localeCompare(a.entry.fecha ?? ''))
    .map((p) => ({ slug: p.slug, ...p.entry }));
}

/** Un artículo con su contenido ya convertido a HTML. */
export async function getPost(slug: string) {
  const post = await reader.collections.blog.read(slug);
  if (!post || post.borrador) return null;
  const { node } = await post.contenido();
  const html = Markdoc.renderers.html(Markdoc.transform(node));
  return { slug, ...post, contenido: undefined, html };
}
