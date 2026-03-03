import { Router } from 'express';

interface LivingDocsOptions {
    docsPath: string;
    title?: string;
    theme?: 'light' | 'dark';
    basePath?: string;
}
declare function createLivingDocsMiddleware(options: LivingDocsOptions): Router;

export { createLivingDocsMiddleware };
