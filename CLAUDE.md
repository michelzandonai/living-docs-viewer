# CLAUDE.md - Living Docs Viewer

## Visao Geral

Biblioteca React + Express para visualizar documentos Living Docs (`energimap-doc/v1`).
Renderiza JSONs como SPA interativa com sidebar, busca, tabs e diagramas ReactFlow.

- **Repo**: github:michelzandonai/living-docs-viewer
- **Versao**: 0.5.1
- **Consumidores**: agencia-api, energy-map-api, talentos, ajuri-api, indica-api

## Comandos

```bash
npm run dev            # Dev server (Vite)
npm run build          # Build library (tsc + Vite)
npm run build:app      # Build standalone app
npm run build:server   # Build server middleware (tsup, ESM + CJS)
npm run build:docs     # Copia src/docs para dist/docs (bundled docs)
npm run build:all      # Build completo (lib + app + server + docs)
npm run lint           # ESLint
npm test               # Testes (Vitest)
npm run test:watch     # Testes em modo watch
npm pack               # Gerar .tgz para distribuicao
```

## Arquitetura

```
src/
├── app/               # Standalone app entry (main.tsx, index.html)
├── components/        # React components
│   ├── DocsSidebar, DocsViewer, DocSearch
│   ├── DocDetail, DocMetadataHeader, DocSectionRenderer
│   ├── DocAdrDetail, DocPrdDetail, DocGuidelineDetail
│   ├── DocTaskDetail, DocPlanningDetail
│   ├── DocTabs, DocTableView, DocReferences, DocChangelog
│   ├── DocsLayoutShell, DocsThemeProvider, DocsThemeToggle
│   ├── MermaidDiagram
│   └── diagrams/      # ReactFlow diagrams
│       ├── flowchart/  # Flowchart nodes, edges, layout
│       ├── state/      # State diagram (parse, nodes, edges)
│       ├── sequence/   # Sequence diagram
│       ├── er/         # ER diagram
│       ├── dependency-graph, diagram-renderer, diagram-container
│       ├── doc-node, doc-edge
│       └── index files
├── hooks/             # useDocsStore (Zustand)
├── lib/               # Utilitarios e tipos
│   ├── types.ts       # DocBase, DocAdr, DocPrd, DocGuideline, DocTask, DocPlanning, etc.
│   ├── search-docs.ts, recent-docs.ts, build-graph.ts
│   ├── resolve-catalogs.ts, normalize-diagram-type.ts
│   └── cn.ts          # Tailwind class merge
├── server/            # Express middleware
│   └── middleware.ts  # createLivingDocsMiddleware, generateDocsIndex, escapeHtml
├── styles/            # CSS (Tailwind)
└── index.ts           # Public API exports
```

### Exports

```typescript
// Componentes React (library)
import { DocsViewer, DocsSidebar, DocDetail, ... } from 'living-docs-viewer'
import 'living-docs-viewer/styles.css'

// Express middleware
import { createLivingDocsMiddleware } from 'living-docs-viewer/express'
```

### Middleware Express

```typescript
import { createLivingDocsMiddleware } from 'living-docs-viewer/express'

app.use('/docs', createLivingDocsMiddleware({
  docsPath: path.join(__dirname, 'docs'),
  title: 'Meu Projeto',
  basePath: '/docs',
  theme: 'light' // ou 'dark'
}))
```

Montar ANTES do Helmet (CSP bloqueia inline scripts).

### Stack Tecnica

- **Build lib**: Vite + vite-plugin-dts (ESM + CJS)
- **Build server**: tsup (ESM + CJS)
- **State**: Zustand
- **Styling**: Tailwind CSS + tailwind-merge + clsx
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Diagrams**: @xyflow/react + @dagrejs/dagre + Mermaid
- **Immutability**: Immer
- **Icons**: lucide-react
- **Test**: Vitest + happy-dom + supertest

## Schema energimap-doc/v1

O viewer renderiza JSONs com esta estrutura:
- `id`, `metadata` (title, status, dates, authors)
- `sections[]` (title + content em Markdown)
- `references[]`, `tables[]`, `diagrams[]`, `changelog[]`
- Campos especificos por tipo: `adr`, `prd`, `guideline`, `task`, `planning`

### Diretorios ignorados pelo generateDocsIndex

`_catalogs`, `_schema`, `_skill`, `_deprecated`, `archived`, `node_modules`, `.git`

## Bundled Docs

A lib inclui docs bundled em `src/docs/` (copiados para `dist/docs/` no build).
O middleware automaticamente mescla bundled docs com docs do projeto:

- **Prioridade**: doc local vence sobre bundled (override por `id`)
- **Opcao**: `includeBundledDocs: false` para desabilitar
- **Bundled atual**: `GUIDELINE-001-living-docs-guide.json`

Isso permite que a GUIDELINE-001 esteja disponivel em todos os projetos consumidores
sem precisar copiar o arquivo manualmente.

## Testes

139 testes em 7 suites (Vitest). Testes cobrem:
- **middleware.test.ts** - Rotas Express, static files, SPA fallback, injecao de config, escapeHtml
- **generate-docs-index.test.ts** - Scan de diretorio, ordering, skip dirs, JSON invalido
- **search-docs.test.ts** - Busca em documentos
- **build-graph.test.ts** - Construcao de grafo de dependencias
- **recent-docs.test.ts** - Documentos recentes
- **normalize-diagram-type.test.ts** - Normalizacao de tipos de diagrama
- **resolve-catalogs.test.ts** - Resolucao de catalogos

## Ordem de Leitura

1. `src/server/middleware.ts` — Ponto de entrada do servidor
2. `src/lib/types.ts` — Tipos e interfaces do schema
3. `src/components/` — Componentes React de renderizacao
4. `test/` — Testes como documentacao de comportamento

## Documentacao de Referencia

- GUIDELINE-001-living-docs-guide.json e bundled na lib (src/docs/guidelines/) — fonte canonica
- Projetos consumidores herdam automaticamente via middleware (bundled docs merge)
- Override local: colocar GUIDELINE-001 em docs/guidelines/ do projeto substitui a bundled
