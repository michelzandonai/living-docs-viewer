import type { DocsIndexEntry } from './types';

export const ARCHIVED_STATUSES = new Set(['deprecated', 'superseded']);

/** Higher = shown first when dates are tied */
const TYPE_PRIORITY: Record<string, number> = {
  planning: 4,
  task: 3,
  prd: 2,
  adr: 1,
  guideline: 0,
};

function getEffectiveDate(doc: DocsIndexEntry): string {
  return doc.dateModified || doc.dateCreated || '';
}

export function getRecentDocs(
  documents: DocsIndexEntry[],
  limit: number = 5
): DocsIndexEntry[] {
  return documents
    .filter((doc) => !ARCHIVED_STATUSES.has(doc.status))
    .sort((a, b) => {
      const dateCmp = getEffectiveDate(b).localeCompare(getEffectiveDate(a));
      if (dateCmp !== 0) return dateCmp;
      return (TYPE_PRIORITY[b.type] ?? 0) - (TYPE_PRIORITY[a.type] ?? 0);
    })
    .slice(0, limit);
}
