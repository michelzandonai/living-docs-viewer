import type { AuthorsCatalog, TagsCatalog, ResolvedTag } from './types';

export function resolveAuthors(
  authorIds: string[],
  catalog: AuthorsCatalog
): string[] {
  return authorIds.map((id) => catalog[id]?.name ?? id);
}

export function resolveTags(
  tagIds: string[],
  catalog: TagsCatalog
): ResolvedTag[] {
  return tagIds.map((id) => ({
    id,
    label: catalog[id]?.label ?? id,
    category: catalog[id]?.category ?? 'other',
  }));
}
