# Living Docs Viewer

![version](https://img.shields.io/badge/version-0.4.2-blue)
![license](https://img.shields.io/badge/license-MIT-green)

Biblioteca React + Express para visualizar documentos de arquitetura viva no padrao **energimap-doc/v1**. Suporta ADRs, PRDs, Guidelines, Tasks e Planning Docs com sidebar navegavel, busca full-text, dark mode, secao de recentes, diagramas Mermaid e grafo de dependencias.

---

## Indice

- [Instalacao](#instalacao)
- [Uso Rapido (Middleware Express)](#uso-rapido-middleware-express)
- [Configuracao](#configuracao)
- [Features](#features)
- [Schema dos Documentos](#schema-dos-documentos)
- [Estrutura de Pastas Esperada](#estrutura-de-pastas-esperada)
- [Catalogs](#catalogs)
- [Integracao como Biblioteca React](#integracao-como-biblioteca-react)
- [Testes](#testes)
- [Desenvolvimento](#desenvolvimento)
- [Licenca](#licenca)

---

## Instalacao

```bash
npm install github:michelzandonai/living-docs-viewer
```

Peer dependencies:

| Dependencia | Versao |
|-------------|--------|
| React       | >= 18  |
| React DOM   | >= 18  |
| Express     | >= 4 (opcional, apenas para middleware) |

---

## Uso Rapido (Middleware Express)

Tres linhas integram o viewer a qualquer aplicacao Express existente:

```typescript
import express from 'express'
import { createLivingDocsMiddleware } from 'living-docs-viewer/express'
import { resolve } from 'path'

const app = express()

app.use('/docs', createLivingDocsMiddleware({
  docsPath: resolve(__dirname, '../docs'),
  title: 'Documentacao - Meu Projeto',
  theme: 'dark',
  basePath: '/docs',
}))

app.listen(3000, () => {
  console.log('Docs em http://localhost:3000/docs')
})
```

O middleware serve a SPA do viewer, expoe uma API para os documentos JSON e gera um indice dinamico automaticamente.

---

## Configuracao

### Opcoes do Middleware

```typescript
interface LivingDocsOptions {
  docsPath: string          // Caminho absoluto para a pasta de documentos
  title?: string            // Titulo exibido na aba do navegador (padrao: "Documentacao")
  theme?: 'light' | 'dark'  // Tema inicial (padrao: 'light')
  basePath?: string         // Prefixo das rotas (deve coincidir com app.use())
}
```

**Regra critica:** O valor de `basePath` DEVE ser identico ao path usado em `app.use()`. Se usar `app.use('/documentacao', ...)`, entao `basePath: '/documentacao'`.

### Rotas Expostas

Quando montado com `app.use('/docs', middleware)`:

| Rota | Descricao |
|------|-----------|
| `GET /docs/api/docs-index.json` | Indice dinamico gerado com cache inteligente |
| `GET /docs/api/ADR/shared/ADR-001.json` | Documento JSON individual |
| `GET /docs/api/catalogs/authors.json` | Catalogo de autores |
| `GET /docs/*` | Fallback para SPA (index.html) |

---

## Features

### Tipos de Documento

| Tipo | Pasta | Icone/Cor |
|------|-------|-----------|
| ADR | `docs/ADR/` | Cada tipo tem icone e cor proprios no viewer |
| PRD | `docs/PRD/` | |
| Guideline | `docs/guidelines/` | |
| Task | `docs/tasks/` | |
| Planning | `docs/planning/` | |

Todos os tipos suportam filtro por tipo, status e scope na sidebar, alem de busca textual por titulo e summary.

### Geracao Dinamica de Index com Cache

O middleware gera o indice de documentos (`docs-index.json`) dinamicamente. O index inclui estatisticas agregadas (total, por tipo, por status, por scope).

O cache em memoria e invalidado automaticamente quando o `mtime` de qualquer subpasta de documentos muda, evitando leitura desnecessaria do filesystem a cada request.

A funcao `generateDocsIndex(docsPath)` tambem e exportada para uso programatico.

### Dark Mode com Persistencia

O viewer inclui toggle de tema claro/escuro. A preferencia do usuario e salva em `localStorage('living-docs-theme')` e prevalece sobre a configuracao do servidor.

O tema inicial pode ser definido via opcao `theme` do middleware ou via prop `theme` do componente React.

### Secao "Recentes" na Sidebar

A sidebar exibe os documentos mais recentemente modificados, baseado no campo `metadata.dateModified` dos JSONs.

- Expansivel de 5 em 5 documentos (botao "Ver mais")
- Quantidade visivel persistida em `localStorage`
- Suporta formatos ISO com horas (`YYYY-MM-DDTHH:mm:ss`) e apenas data (`YYYY-MM-DD`)
- Filtra apenas documentos com status `accepted`, `implemented` ou `active`

### Diagramas Mermaid

Documentos que incluem diagramas Mermaid tem renderizacao inline diretamente no viewer, com lazy-loading para performance.

### Grafo de Dependencias

Visualizacao interativa das dependencias entre documentos, baseada no campo `references` dos JSONs. Usa Cytoscape/React Flow para renderizacao do grafo com zoom e pan.

---

## Schema dos Documentos

Os documentos seguem o schema **energimap-doc/v1**. Estrutura base:

```json
{
  "$docSchema": "energimap-doc/v1",
  "id": "ADR-001",
  "type": "adr",
  "metadata": {
    "title": "Escolha do ORM",
    "status": "accepted",
    "scope": "shared",
    "dateCreated": "2025-01-15",
    "dateModified": "2025-02-01T14:30:00",
    "authorIds": ["michel"],
    "tagIds": ["backend", "db"],
    "summary": "Justificativa para uso do Drizzle ORM"
  },
  "sections": [
    {
      "id": "contexto",
      "title": "Contexto",
      "content": "Conteudo em Markdown..."
    }
  ],
  "references": [
    {
      "targetId": "ADR-002",
      "type": "related"
    }
  ],
  "tables": [],
  "diagrams": [],
  "changelog": [
    {
      "version": "1.0",
      "date": "2025-01-15",
      "description": "Versao inicial"
    }
  ]
}
```

### Campos de Metadata

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `title` | string | Titulo do documento |
| `status` | string | `accepted`, `proposed`, `deprecated`, `superseded`, `implemented`, `active` |
| `scope` | string | `shared`, `api`, `frontend`, `mobile`, `cross-project` |
| `dateCreated` | string | Data de criacao (ISO) |
| `dateModified` | string | Data de modificacao (ISO, com ou sem horas) |
| `authorIds` | string[] | IDs referenciando o catalogo de autores |
| `tagIds` | string[] | IDs referenciando o catalogo de tags |
| `summary` | string | Resumo curto do documento |

### Tipos de Referencia

| Tipo | Descricao |
|------|-----------|
| `references` | Referencia generica |
| `supersedes` | Este documento substitui o alvo |
| `depends_on` | Depende do documento alvo |
| `related` | Relacionado ao documento alvo |

Cada tipo de documento (ADR, PRD, Guideline, Task, Planning) possui campos tipo-especificos adicionais alem da estrutura base.

---

## Estrutura de Pastas Esperada

```
docs/
├── ADR/
│   ├── shared/
│   │   └── ADR-001-escolha-do-orm.json
│   └── frontend/
│       └── ADR-002-state-management.json
├── PRD/
│   └── shared/
│       └── PRD-001-modulo-relatorios.json
├── guidelines/
│   └── shared/
│       └── GUIDELINE-001-code-review.json
├── tasks/
│   └── shared/
│       └── TASK-001-fix-login-bug.json
├── planning/
│   └── shared/
│       └── PLANNING-001-sprint-42.json
└── catalogs/
    ├── authors.json
    ├── tags.json
    └── glossary.json
```

**Convencoes:**

- O nome da pasta pai determina o `type` do documento
- A subpasta determina o `scope` (`shared`, `api`, `frontend`, `mobile`)
- Apenas arquivos `.json` sao processados
- O campo `id` deve ser unico em todo o projeto

---

## Catalogs

Catalogs sao arquivos JSON opcionais em `docs/catalogs/` que enriquecem os documentos.

### authors.json

```json
{
  "michel": { "name": "Michel Zandonai", "role": "Tech Lead" },
  "joao": { "name": "Joao Silva", "role": "Backend Developer" }
}
```

### tags.json

```json
{
  "backend": { "label": "Backend", "category": "area" },
  "security": { "label": "Seguranca", "category": "concern" }
}
```

### glossary.json

```json
{
  "orm": {
    "definition": "Object-Relational Mapping - camada de abstracao sobre o banco de dados",
    "aliases": ["Object-Relational Mapper"]
  }
}
```

---

## Integracao como Biblioteca React

Para projetos com frontend React proprio, os componentes podem ser importados diretamente:

```tsx
import { DocsViewer } from 'living-docs-viewer'
import 'living-docs-viewer/styles.css'

function DocsPage() {
  return (
    <DocsViewer
      apiUrl="http://localhost:3000/docs"
      theme="light"
      className="h-screen"
      onDocSelect={(docId) => console.log('Selecionou:', docId)}
    />
  )
}
```

### Composicao com Componentes Individuais

```tsx
import {
  DocsLayoutShell,
  DocsSidebar,
  DocDetail,
  useDocsStore,
  DocsThemeToggle,
} from 'living-docs-viewer'
import 'living-docs-viewer/styles.css'

function CustomLayout() {
  const loadIndex = useDocsStore((s) => s.loadIndex)

  useEffect(() => {
    loadIndex('http://localhost:3000/docs')
  }, [])

  return (
    <DocsLayoutShell
      sidebar={<DocsSidebar />}
      content={<DocDetail />}
    />
  )
}
```

### Componentes Exportados

| Componente | Descricao |
|------------|-----------|
| `DocsViewer` | Viewer completo (sidebar + conteudo) |
| `DocsLayoutShell` | Shell de layout com sidebar redimensionavel |
| `DocsSidebar` | Sidebar com arvore navegavel e filtros |
| `DocDetail` | Area principal de conteudo |
| `DocSearch` | Campo de busca full-text |
| `DocsThemeToggle` | Botao de alternar tema claro/escuro |
| `DiagramRenderer` | Renderiza diagramas Mermaid (lazy-loaded) |
| `DependencyGraph` | Grafo interativo de dependencias |

### Store (Zustand)

O estado global e acessivel via `useDocsStore`:

```tsx
import { useDocsStore } from 'living-docs-viewer'

const index = useDocsStore((s) => s.index)
const theme = useDocsStore((s) => s.theme)
const toggleTheme = useDocsStore((s) => s.toggleTheme)
const loadIndex = useDocsStore((s) => s.loadIndex)
const selectDoc = useDocsStore((s) => s.selectDoc)
```

---

## Testes

O projeto possui 38 testes automatizados em 7 suites, usando **vitest**:

```bash
npm test           # Rodar todos
npm run test:watch # Modo watch
```

| Suite | Descricao |
|-------|-----------|
| `recent-docs.test.ts` | Ordenacao, formatacao de datas, filtros e expansao de recentes |
| `generate-docs-index.test.ts` | Geracao de index, cache por mtime, middleware, read-only |
| `middleware.test.ts` | Express middleware, SPA serving, config injection |
| `search-docs.test.ts` | Busca full-text com suporte a acentos |
| `resolve-catalogs.test.ts` | Resolucao de autores e tags |
| `normalize-diagram-type.test.ts` | Mapeamento de tipos de diagrama |
| `build-graph.test.ts` | Construcao de grafo e ghost nodes |

---

## Desenvolvimento

### Requisitos

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/michelzandonai/living-docs-viewer.git
cd living-docs-viewer
npm install
```

### Scripts

| Script | Descricao |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build da biblioteca (ES + CJS + tipos) |
| `npm run build:app` | Build da SPA do viewer (`dist/app/`) |
| `npm run build:server` | Build do middleware Express (tsup) |
| `npm run build:all` | Build completo (lib + app + server) |
| `npm test` | Rodar testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run lint` | Linting com ESLint |

### Artefatos de Build

| Artefato | Descricao |
|----------|-----------|
| `dist/index.es.js` / `dist/index.cjs.js` | Componentes React (ES + CJS) |
| `dist/app/` | SPA standalone completa |
| `dist/server/middleware.js` | Middleware Express |
| `dist/living-docs-viewer.css` | Estilos CSS |

### Stack

- React 19, TypeScript, Tailwind CSS
- Zustand (estado global), Mermaid (diagramas), React Flow (grafo)
- Vite (build lib + SPA), tsup (build server)
- vitest (testes)

---

## Licenca

MIT
