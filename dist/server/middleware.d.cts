import { Router } from 'express';

interface LivingDocsOptions {
    docsPath: string;
    title?: string;
    theme?: 'light' | 'dark';
    basePath?: string;
}
/**
 * Generate docs-index.json by scanning the docs directory.
 * Writes the index to disk and returns the number of documents indexed.
 */
declare function generateDocsIndex(docsPath: string): Promise<number>;
declare function createLivingDocsMiddleware(options: LivingDocsOptions): Router;

export { createLivingDocsMiddleware, generateDocsIndex };
