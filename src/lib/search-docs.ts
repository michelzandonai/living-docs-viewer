import type { DocsIndexEntry } from './types';

function normalize(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function searchDocs(
  docs: DocsIndexEntry[],
  query: string
): DocsIndexEntry[] {
  if (!query.trim()) return docs;

  const normalizedQuery = normalize(query);

  return docs.filter((doc) => {
    const fields = [doc.title, doc.summary, doc.id, ...doc.tagIds];
    return fields.some((field) => normalize(field).includes(normalizedQuery));
  });
}
