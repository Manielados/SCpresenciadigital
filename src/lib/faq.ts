import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

/** Preguntas frecuentes (las que se editan en Keystatic), ordenadas. */
export async function getFaq() {
  return (await reader.collections.faq.all())
    .map((e) => e.entry)
    .sort((a, b) => a.orden - b.orden);
}
