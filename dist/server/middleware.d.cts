import { Router } from 'express';

/** Resolve the path to bundled docs shipped with the library */
declare function getBundledDocsPath(): string | null;
interface LivingDocsOptions {
    docsPath: string;
    title?: string;
    theme?: 'light' | 'dark';
    basePath?: string;
    includeBundledDocs?: boolean;
}
/**
 * Generate docs-index.json by scanning the docs directory.
 * Writes the index to disk and returns the number of documents indexed.
 * When extraDocsPaths is provided, bundled docs are merged (local override wins).
 */
declare function generateDocsIndex(docsPath: string, extraDocsPaths?: string[]): Promise<number>;
declare function createLivingDocsMiddleware(options: LivingDocsOptions): Router;

export { type LivingDocsOptions, createLivingDocsMiddleware, generateDocsIndex, getBundledDocsPath };
