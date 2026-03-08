# Living Docs Viewer

![version](https://img.shields.io/badge/version-0.5.3-blue)
![license](https://img.shields.io/badge/license-MIT-green)
![tests](https://img.shields.io/badge/tests-208%20passed-brightgreen)
![types](https://img.shields.io/badge/types-TypeScript-blue)

Render architecture documents as an interactive SPA. Supports **ADRs**, **PRDs**, **Guidelines**, **Tasks** and **Planning Docs** with navigable sidebar, full-text search, dark mode, dependency graph, ReactFlow diagrams and 5-tab universal layout.

Works as **Express middleware**, **React component library** or **VS Code extension**.

---

## Table of Contents

- [Quick Start](#quick-start)
- [VS Code Extension](#vs-code-extension)
- [Features](#features)
- [Document Schema](#document-schema)
- [Folder Structure](#folder-structure)
- [Catalogs](#catalogs)
- [React Integration](#react-integration)
- [Bundled Guideline](#bundled-guideline)
- [Testing](#testing)
- [Development](#development)
- [License](#license)

---

## Quick Start

### Install

```bash
npm install github:michelzandonai/living-docs-viewer
```

### Express Middleware

```typescript
import express from 'express'
import { createLivingDocsMiddleware } from 'living-docs-viewer/express'
import { resolve } from 'path'

const app = express()

app.use('/docs', createLivingDocsMiddleware({
  docsPath: resolve(__dirname, '../docs'),
  title: 'My Project Docs',
  theme: 'dark',
  basePath: '/docs',
}))

app.listen(3000)
```

> Mount **before** Helmet — CSP blocks inline scripts.

Full middleware options and routes: [`src/server/middleware.ts`](src/server/middleware.ts)

---

## VS Code Extension

The extension renders `energimap-doc/v1` JSON files directly inside VS Code.

### How to use

1. Install the `.vsix` from [`vscode-extension/`](vscode-extension/)
2. Open any project that has a `docs/` folder with JSON docs
3. Click the **Living Docs** icon in the Activity Bar

### Features

| Feature | Description |
|---------|-------------|
| **Activity Bar panel** | Full docs viewer with sidebar, search and tabs |
| **Custom Editor** | Right-click any `.json` > "Open With..." > Living Docs Viewer |
| **Auto folder detection** | Scans `docs/` and `*/docs/` automatically |
| **Folder picker** | Manual selection saved to workspace settings |
| **Theme sync** | Follows VS Code light/dark theme |
| **Live reload** | Watches for file changes |
| **Auto dateModified** | Updates `metadata.dateModified` on save |
| **Version checker** | Notifies when `living-docs-viewer` lib is outdated |

Extension source: [`vscode-extension/src/extension/`](vscode-extension/src/extension/)

---

## Features

### Document Types

| Type | Folder | ID Pattern | Details |
|------|--------|------------|---------|
| ADR | `docs/adr/{scope}/` | `ADR-NNN` | [`DocAdrDetail.tsx`](src/components/DocAdrDetail.tsx) |
| PRD | `docs/prd/` | `PRD-name` | [`DocPrdDetail.tsx`](src/components/DocPrdDetail.tsx) |
| Guideline | `docs/guidelines/` | `GUIDELINE-NNN` | [`DocGuidelineDetail.tsx`](src/components/DocGuidelineDetail.tsx) |
| Task | `docs/tasks/` | `TASK-NNN` | [`DocTaskDetail.tsx`](src/components/DocTaskDetail.tsx) |
| Planning | `docs/planning/` | `PLAN-NNN` | [`DocPlanningDetail.tsx`](src/components/DocPlanningDetail.tsx) |

### 5-Tab Universal Layout

Every document maps content into 5 tabs:

| Tab | Content |
|-----|---------|
| **Resumo** | Overview, context, main decision |
| **Analise** | Technical details, consequences, alternatives |
| **Implementacao** | Step-by-step, conventions, checklist |
| **Dados** | Tables, metrics, structured fields |
| **Conexoes** | Cross-references, diagrams, changelog |

Tab mapping per type: [`DocDetail.tsx`](src/components/DocDetail.tsx)

### Sidebar

- Tree navigation by type, status and scope
- Full-text search across title and summary
- "Recent" section based on `dateModified`
- Expandable 5-by-5 with persistence

Source: [`DocsSidebar.tsx`](src/components/DocsSidebar.tsx)

### Diagrams

| Format | Renderer | Source |
|--------|----------|--------|
| ReactFlow JSON | `@xyflow/react` + `@dagrejs/dagre` | [`src/components/diagrams/`](src/components/diagrams/) |
| Mermaid | `mermaid` (lazy-loaded) | [`MermaidDiagram.tsx`](src/components/MermaidDiagram.tsx) |

ReactFlow is the recommended format for new diagrams (JSON nodes + edges with color palette).

### Dependency Graph

Interactive visualization of cross-document references using ReactFlow.

Source: [`src/components/diagrams/dependency-graph/`](src/components/diagrams/dependency-graph/)

### Dynamic Index with Cache

The middleware generates `docs-index.json` dynamically with aggregate stats (total, by type, by status, by scope). Cache invalidates when any subfolder `mtime` changes.

`generateDocsIndex(docsPath)` is also exported for programmatic use.

Source: [`src/server/middleware.ts`](src/server/middleware.ts)

### Dark Mode

Theme toggle with `localStorage` persistence. Initial theme configurable via middleware option or React prop.

---

## Document Schema

Documents follow the **energimap-doc/v1** schema:

```json
{
  "id": "ADR-001",
  "metadata": {
    "title": "ORM Selection",
    "status": "accepted",
    "dateCreated": "2026-01-15T14:30:00",
    "dateModified": "2026-02-01T14:30:00",
    "authorIds": ["michel"],
    "summary": "Why we chose Drizzle ORM"
  },
  "sections": [
    {
      "title": "Context",
      "content": "Markdown content..."
    }
  ],
  "adr": {
    "context": "...",
    "decision": "...",
    "consequences": { "positive": [], "negative": [], "mitigations": [] },
    "alternatives": [
      { "option": "Prisma", "pros": ["..."], "cons": ["..."] },
      { "option": "Drizzle", "pros": ["..."], "cons": ["..."], "chosen": true }
    ]
  },
  "references": [],
  "diagrams": [],
  "changelog": []
}
```

### Metadata Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Max 35 chars, content-based |
| `status` | string | Yes | `proposed`, `accepted`, `deprecated`, `superseded` |
| `dateCreated` | string | Yes | ISO `YYYY-MM-DDTHH:mm:ss` |
| `dateModified` | string | Yes | ISO `YYYY-MM-DDTHH:mm:ss` |
| `authorIds` | string[] | Yes | References `_catalogs/authors.json` |
| `summary` | string | No | Short description |
| `tagIds` | string[] | No | References `_catalogs/tags.json` |
| `scope` | string | No | `shared`, `api`, `frontend`, `mobile`, `cross-project` |

### Type-Specific Fields

| Type | Required Fields | Optional Fields |
|------|----------------|-----------------|
| **ADR** | `context`, `decision`, `consequences`, `alternatives` | `deciders`, `invariants`, `principles`, `phases` |
| **PRD** | `problemStatement` | `version`, `personas`, `scope`, `functionalRequirements`, `businessRules`, `metrics`, `risks`, `assumptions` |
| **Guideline** | `appliesTo`, `rules` | `checklist`, `antiPatterns` |
| **Task** | `context.problem`, `fixes` | `allFilesModified`, `verify`, `regressionTests`, `links` |
| **Planning** | `goal`, `phases` or `items` | `risks`, `files`, `verify` |

Full schema details: [`src/lib/types.ts`](src/lib/types.ts)

---

## Folder Structure

```
docs/
  adr/
    shared/ADR-001.json
    api/ADR-002.json
  prd/
    authentication.json
  guidelines/
    GUIDELINE-001.json
  tasks/
    TASK-001.json
  planning/
    PLAN-001.json
  _catalogs/
    authors.json
    tags.json
    glossary.json
```

**Conventions:**
- Folders in lowercase
- Only `.json` files are processed
- Subfolders scanned recursively
- `_catalogs`, `_schema`, `_deprecated`, `archived`, `node_modules` are ignored
- Deprecated docs use triple signal: `_deprecated/` folder + `DEPRECATED_` prefix + status `deprecated`

---

## Catalogs

Optional JSON files in `docs/_catalogs/` that enrich documents.

### `authors.json`

```json
{
  "michel": { "name": "Michel Zandonai", "role": "Tech Lead" },
  "claude": { "name": "Claude + Michel", "role": "AI-Assisted" }
}
```

### `tags.json`

```json
{
  "backend": { "label": "Backend", "category": "area" },
  "security": { "label": "Security", "category": "concern" }
}
```

### `glossary.json`

```json
{
  "orm": {
    "definition": "Object-Relational Mapping",
    "aliases": ["Object-Relational Mapper"]
  }
}
```

---

## React Integration

### Full Viewer

```tsx
import { DocsViewer } from 'living-docs-viewer'
import 'living-docs-viewer/styles.css'

<DocsViewer apiUrl="http://localhost:3000/docs" theme="dark" />
```

### Individual Components

```tsx
import { DocsLayoutShell, DocsSidebar, DocDetail, useDocsStore } from 'living-docs-viewer'
import 'living-docs-viewer/styles.css'

function DocsPage() {
  useEffect(() => { useDocsStore.getState().loadIndex('/docs') }, [])

  return (
    <DocsLayoutShell sidebar={<DocsSidebar />}>
      <DocDetail />
    </DocsLayoutShell>
  )
}
```

### Exported Components

| Component | Description |
|-----------|-------------|
| [`DocsViewer`](src/components/DocsViewer.tsx) | Complete viewer (sidebar + content) |
| [`DocsLayoutShell`](src/components/DocsLayoutShell.tsx) | Layout shell with resizable sidebar |
| [`DocsSidebar`](src/components/DocsSidebar.tsx) | Navigable sidebar with filters and search |
| [`DocDetail`](src/components/DocDetail.tsx) | Main content area with tabs |
| [`DocSearch`](src/components/DocSearch.tsx) | Full-text search field |
| [`DocsThemeToggle`](src/components/DocsThemeToggle.tsx) | Theme toggle button |
| [`DiagramRenderer`](src/components/diagrams/diagram-renderer.tsx) | ReactFlow diagram renderer |
| [`DependencyGraph`](src/components/diagrams/dependency-graph/) | Interactive dependency graph |

### Zustand Store

```tsx
import { useDocsStore } from 'living-docs-viewer'

const index = useDocsStore((s) => s.index)
const theme = useDocsStore((s) => s.theme)
const toggleTheme = useDocsStore((s) => s.toggleTheme)
const loadIndex = useDocsStore((s) => s.loadIndex)
const selectDoc = useDocsStore((s) => s.selectDoc)
```

Store source: [`src/hooks/use-docs-store.ts`](src/hooks/use-docs-store.ts)

---

## Bundled Guideline

The library bundles [GUIDELINE-001](src/docs/guidelines/GUIDELINE-001-living-docs-guide.json) — the canonical guide for creating and maintaining Living Docs. It covers schema rules, naming conventions, checklists and anti-patterns.

When using the Express middleware, bundled docs are automatically merged with your project's docs:
- **Priority:** local docs override bundled (by `id`)
- **Disable:** `includeBundledDocs: false`
- **Update:** `npm update living-docs-viewer` to get the latest guideline

This ensures all consumer projects share the same documentation standards without manual file copying.

---

## Testing

208 tests across 16 suites (vitest):

```bash
npm test           # Run all
npm run test:watch # Watch mode
```

| Suite | Tests | Description |
|-------|-------|-------------|
| [`middleware.test.ts`](test/middleware.test.ts) | 34 | Express routes, SPA fallback, config injection |
| [`generate-docs-index.test.ts`](test/generate-docs-index.test.ts) | 26 | Directory scan, ordering, skip dirs, invalid JSON |
| [`normalize-diagram-type.test.ts`](test/normalize-diagram-type.test.ts) | 22 | Diagram type normalization |
| [`search-docs.test.ts`](test/search-docs.test.ts) | 15 | Full-text search with accent support |
| [`build-graph.test.ts`](test/build-graph.test.ts) | 15 | Dependency graph construction |
| [`resolve-catalogs.test.ts`](test/resolve-catalogs.test.ts) | 14 | Author and tag resolution |
| [`recent-docs.test.ts`](test/recent-docs.test.ts) | 13 | Recent docs ordering and filtering |
| [`parse-file-badge.test.ts`](test/parse-file-badge.test.ts) | 11 | File badge parsing (NOVO/MODIFICA) |
| [`fix-card.test.tsx`](test/fix-card.test.tsx) | 11 | Fix card component rendering |
| [`task-overview.test.tsx`](test/task-overview.test.tsx) | 9 | Task overview component |
| [`get-task-labels.test.ts`](test/get-task-labels.test.ts) | 8 | Dynamic task labels |
| [`task-tab-labels.test.ts`](test/task-tab-labels.test.ts) | 8 | Task tab label rendering |
| [`url-sync.test.ts`](test/url-sync.test.ts) | 7 | URL hash synchronization |
| [`collapsible-section.test.tsx`](test/collapsible-section.test.tsx) | 7 | Collapsible section component |
| [`docs-viewer-hash.test.tsx`](test/docs-viewer-hash.test.tsx) | 4 | Viewer hash navigation |
| [`fix-status-icon.test.tsx`](test/fix-status-icon.test.tsx) | 4 | Status icon component |

---

## Development

### Requirements

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/michelzandonai/living-docs-viewer.git
cd living-docs-viewer
npm install
```

### Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Build library (tsc + Vite, ESM + CJS) |
| `npm run build:app` | Build standalone SPA (`dist/app/`) |
| `npm run build:server` | Build Express middleware (tsup, ESM + CJS) |
| `npm run build:docs` | Copy bundled docs to `dist/docs/` |
| `npm run build:all` | Full build (lib + app + server + docs) |
| `npm test` | Run tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run lint` | ESLint |

### Build Artifacts

| Artifact | Description |
|----------|-------------|
| `dist/index.es.js` / `dist/index.cjs.js` | React components (ESM + CJS) |
| `dist/app/` | Standalone SPA |
| `dist/server/middleware.js` | Express middleware |
| `dist/docs/` | Bundled documentation |
| `dist/living-docs-viewer.css` | Styles |

### Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, TypeScript, Tailwind CSS |
| State | Zustand |
| Diagrams | @xyflow/react, @dagrejs/dagre, Mermaid |
| Markdown | react-markdown, remark-gfm, rehype-highlight |
| Build | Vite (lib + SPA), tsup (server) |
| Tests | Vitest, happy-dom, supertest |
| VS Code | Custom Editor API, WebviewPanel |

### Architecture

```
src/
  components/        # React components (viewer, sidebar, detail pages, diagrams)
  hooks/             # Zustand store
  lib/               # Types, utilities, search, graph
  server/            # Express middleware
  styles/            # Tailwind CSS
  docs/              # Bundled docs (guideline)
  app/               # Standalone SPA entry
  index.ts           # Public API exports

vscode-extension/
  src/extension/     # VS Code extension host (Node.js)
  src/webview/       # VS Code webview (React, reuses src/components)
  src/shared/        # Message protocol types

test/                # 208 tests across 16 suites
```

---

## License

MIT
