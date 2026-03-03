# Living Docs Viewer

Biblioteca React + Express para visualizar documentos de arquitetura viva no padrão **energimap-doc/v1**. Suporta ADRs, PRDs, Guidelines, Tasks e Planning Docs com sidebar navegável, busca full-text, diagramas Mermaid e grafo de dependencias.

---

## Indice

- [Visao Geral](#visao-geral)
- [Requisitos](#requisitos)
- [Instalacao](#instalacao)
- [Integracao Rapida (Express)](#integracao-rapida-express)
- [Integracao como Biblioteca React](#integracao-como-biblioteca-react)
- [Integracao com Docker](#integracao-com-docker)
- [Estrutura de Pastas dos Documentos](#estrutura-de-pastas-dos-documentos)
- [Formato dos Documentos JSON](#formato-dos-documentos-json)
- [Catalogs (Autores, Tags, Glossario)](#catalogs-autores-tags-glossario)
- [API de Componentes](#api-de-componentes)
- [Store (Zustand)](#store-zustand)
- [Configuracao e Customizacao](#configuracao-e-customizacao)
- [Rotas Expostas pelo Middleware](#rotas-expostas-pelo-middleware)
- [Troubleshooting](#troubleshooting)
- [Testes](#testes)
- [Versionamento](#versionamento)

---

## Visao Geral

O Living Docs Viewer e composto por 3 artefatos independentes:

| Artefato | Descricao | Uso |
|----------|-----------|-----|
| **Library** (`dist/index.es.js`) | Componentes React exportados | Embed em apps React existentes |
| **SPA** (`dist/app/`) | Aplicacao standalone completa | Servida via middleware Express |
| **Middleware** (`dist/server/middleware.js`) | Router Express com indice dinamico | Monta endpoints `/api/*` + SPA |

### Tipos de Documento Suportados

| Tipo | Pasta | Descricao |
|------|-------|-----------|
| `adr` | `docs/ADR/` | Architecture Decision Records |
| `prd` | `docs/PRD/` | Product Requirement Documents |
| `guideline` | `docs/guidelines/` | Diretrizes e padroes |
| `task` | `docs/tasks/` | Tasks de desenvolvimento |
| `planning` | `docs/planning/` | Documentos de planejamento |

---

## Requisitos

| Dependencia | Versao Minima |
|-------------|---------------|
| Node.js | 18+ |
| React | 18+ |
| React DOM | 18+ |
| Express | 4+ (opcional, apenas para middleware) |

---

## Instalacao

### Via GitHub (recomendado para projetos internos)

```bash
npm install github:michelzandonai/living-docs-viewer#v0.4.2
```

### Via npm pack (recomendado para Docker)

```bash
# No diretorio do living-docs-viewer
npm run build:all
npm pack

# No projeto consumidor
npm install ./path/to/living-docs-viewer-0.4.2.tgz
```

---

## Integracao Rapida (Express)

A forma mais simples de integrar o viewer em um projeto Express existente. **3 linhas de codigo.**

### Passo 1 - Instalar

```bash
npm install github:michelzandonai/living-docs-viewer#v0.4.2
```

### Passo 2 - Montar o middleware

```typescript
// src/app.ts (ou equivalente)
import express from 'express'
import { createLivingDocsMiddleware } from 'living-docs-viewer/express'
import { resolve } from 'path'

const app = express()

// ... suas rotas existentes ...

// Montar Living Docs no path /docs
app.use('/docs', createLivingDocsMiddleware({
  docsPath: resolve(__dirname, '../docs'),  // pasta com JSONs
  title: 'Documentacao - Meu Projeto',      // titulo da pagina
  theme: 'light',                           // 'light' | 'dark'
  basePath: '/docs',                        // DEVE coincidir com app.use()
}))

app.listen(3000, () => {
  console.log('Server em http://localhost:3000')
  console.log('Docs em http://localhost:3000/docs')
})
```

### Passo 3 - Verificar

```bash
# Iniciar o servidor
npm run dev

# Acessar no navegador
open http://localhost:3000/docs
```

### Opcoes do Middleware

```typescript
interface LivingDocsOptions {
  docsPath: string          // Caminho absoluto para pasta docs/
  title?: string            // Titulo exibido na aba do navegador
  theme?: 'light' | 'dark'  // Tema padrao
  basePath?: string         // Prefixo das rotas (ex: '/docs')
}
```

> **Regra critica:** O valor de `basePath` DEVE ser identico ao path usado em `app.use()`. Se usar `app.use('/documentacao', ...)`, entao `basePath: '/documentacao'`.

---

## Integracao como Biblioteca React

Para projetos que ja possuem frontend React e querem embedar o viewer diretamente.

### Componente Completo (DocsViewer)

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

### Componentes Individuais (Composicao)

Para controle total do layout, importe componentes individuais:

```tsx
import {
  DocsLayoutShell,
  DocsSidebar,
  DocDetail,
  DocSearch,
  useDocsStore,
  useDocsTheme,
  DocsThemeToggle,
} from 'living-docs-viewer'
import 'living-docs-viewer/styles.css'

function CustomDocsLayout() {
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

### Props do DocsViewer

```typescript
interface DocsViewerProps {
  apiUrl: string                          // URL base da API
  theme?: 'light' | 'dark'               // Tema inicial
  className?: string                      // Classes CSS adicionais
  onDocSelect?: (docId: string) => void   // Callback ao selecionar doc
}
```

---

## Integracao com Docker

Projetos Docker precisam de cuidado especial porque `npm install` com `github:` cria symlinks que nao funcionam dentro de containers.

### Solucao: npm pack

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar o .tgz pre-gerado
COPY living-docs-viewer-0.4.2.tgz ./

# package.json deve referenciar o .tgz
# "living-docs-viewer": "file:./living-docs-viewer-0.4.2.tgz"
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### docker-compose.yml

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    volumes:
      # OBRIGATORIO: montar pasta docs para atualizacao em tempo real
      - ./docs:/app/docs:ro
    environment:
      - NODE_ENV=production
```

### Gerando o .tgz

```bash
cd /path/to/living-docs-viewer
npm run build:all
npm pack
# Produz: living-docs-viewer-0.4.2.tgz
```

### Atualizando package.json para Docker

```jsonc
{
  "dependencies": {
    // GitHub (desenvolvimento local)
    "living-docs-viewer": "github:michelzandonai/living-docs-viewer#v0.4.2"

    // Docker (producao)
    // "living-docs-viewer": "file:./living-docs-viewer-0.4.2.tgz"
  }
}
```

> **Regra critica:** Volume `docs/` DEVE estar montado no docker-compose para que alteracoes em documentos sejam refletidas sem rebuild.

---

## Estrutura de Pastas dos Documentos

O middleware escaneia a pasta `docsPath` recursivamente. A estrutura abaixo e **obrigatoria**:

```
docs/
├── ADR/
│   ├── shared/
│   │   ├── ADR-001-escolha-do-orm.json
│   │   └── ADR-002-estrategia-cache.json
│   ├── api/
│   │   └── ADR-003-autenticacao-jwt.json
│   └── frontend/
│       └── ADR-004-state-management.json
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

### Convencoes

| Regra | Descricao |
|-------|-----------|
| **Pasta = tipo** | O nome da pasta pai determina `type` do documento |
| **Subpasta = scope** | `shared`, `api`, `frontend`, `mobile`, `cross-project` |
| **Catalogs** | Pasta `catalogs/` na raiz de docs, nao dentro de tipos |
| **ID unico** | Campo `id` do JSON deve ser unico em todo o projeto |
| **Extensao** | Apenas arquivos `.json` sao processados |

---

## Formato dos Documentos JSON

### Schema Base (todos os tipos)

```jsonc
{
  "$docSchema": "energimap-doc/v1",
  "id": "ADR-001",
  "title": "Escolha do ORM",
  "type": "adr",
  "status": "accepted",          // accepted | proposed | deprecated | superseded
  "scope": "shared",             // shared | api | frontend | mobile | cross-project
  "dateCreated": "2025-01-15",
  "dateModified": "2025-02-01",
  "authorIds": ["michel"],       // Referencia ao catalogo de autores
  "tagIds": ["backend", "db"],   // Referencia ao catalogo de tags
  "summary": "Justificativa para uso do Drizzle ORM",
  "sections": [
    {
      "id": "contexto",
      "title": "Contexto",
      "content": "Markdown content here..."
    }
  ],
  "references": [
    {
      "targetId": "ADR-002",
      "type": "related"          // references | supersedes | depends_on | related
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

### Campos Tipo-Especificos

<details>
<summary><strong>ADR</strong> - Architecture Decision Record</summary>

```jsonc
{
  "adr": {
    "context": "Markdown: contexto do problema",
    "decision": "Markdown: decisao tomada",
    "consequences": {
      "positive": ["Beneficio 1", "Beneficio 2"],
      "negative": ["Trade-off 1"],
      "risks": ["Risco 1"]
    },
    "alternatives": [
      {
        "title": "Alternativa A",
        "description": "Descricao",
        "prosAndCons": {
          "pros": ["Pro 1"],
          "cons": ["Contra 1"]
        }
      }
    ]
  }
}
```
</details>

<details>
<summary><strong>PRD</strong> - Product Requirement Document</summary>

```jsonc
{
  "prd": {
    "objectives": ["Objetivo 1"],
    "requirements": {
      "functional": [
        { "id": "FR-01", "description": "O sistema deve...", "priority": "must" }
      ],
      "nonFunctional": [
        { "id": "NFR-01", "description": "Tempo de resposta < 200ms" }
      ]
    },
    "metrics": {
      "kpis": [
        { "name": "Taxa de conversao", "target": "> 5%", "current": "3.2%" }
      ]
    },
    "personas": [
      { "name": "Admin", "description": "Gerente de equipe" }
    ]
  }
}
```
</details>

<details>
<summary><strong>Guideline</strong> - Diretriz</summary>

```jsonc
{
  "guideline": {
    "rules": [
      {
        "id": "R1",
        "title": "Regra 1",
        "description": "Descricao da regra",
        "severity": "must"
      }
    ],
    "checklist": ["Item 1", "Item 2"],
    "antiPatterns": [
      {
        "title": "Anti-padrao",
        "description": "O que nao fazer",
        "correctApproach": "O que fazer ao inves"
      }
    ]
  }
}
```
</details>

<details>
<summary><strong>Task</strong> - Task de Desenvolvimento</summary>

```jsonc
{
  "context": {
    "bugDescription": "Descricao do bug",
    "rootCause": "Causa raiz identificada"
  },
  "fixes": [
    {
      "file": "src/services/auth.ts",
      "description": "Corrigir validacao de token",
      "diffSummary": "Adicionar check de expiracao"
    }
  ],
  "regressionTests": [
    {
      "file": "tests/auth.test.ts",
      "description": "Testar token expirado"
    }
  ]
}
```
</details>

<details>
<summary><strong>Planning</strong> - Documento de Planejamento</summary>

```jsonc
{
  "goal": "Objetivo macro do planejamento",
  "phases": [
    {
      "id": "phase-1",
      "title": "Fase 1 - Fundacao",
      "description": "Markdown da fase",
      "status": "completed",
      "tasks": ["TASK-001", "TASK-002"]
    }
  ],
  "risks": [
    {
      "id": "risk-1",
      "description": "Risco identificado",
      "impact": "high",
      "mitigation": "Plano de mitigacao"
    }
  ]
}
```
</details>

---

## Catalogs (Autores, Tags, Glossario)

Catalogs sao arquivos JSON opcionais em `docs/catalogs/` que enriquecem os documentos com metadados resolvidos.

### docs/catalogs/authors.json

```json
{
  "michel": { "name": "Michel Zandonai", "role": "Tech Lead" },
  "joao":   { "name": "Joao Silva", "role": "Backend Developer" }
}
```

### docs/catalogs/tags.json

```json
{
  "backend":  { "label": "Backend", "category": "area" },
  "security": { "label": "Seguranca", "category": "concern" }
}
```

### docs/catalogs/glossary.json

```json
{
  "orm": {
    "definition": "Object-Relational Mapping - camada de abstracao sobre o banco de dados",
    "aliases": ["Object-Relational Mapper"]
  }
}
```

---

## API de Componentes

### Componentes Principais

| Componente | Descricao | Import |
|------------|-----------|--------|
| `DocsViewer` | Viewer completo (sidebar + conteudo) | `living-docs-viewer` |
| `DocsLayoutShell` | Shell de layout com sidebar redimensionavel | `living-docs-viewer` |
| `DocsSidebar` | Sidebar com arvore navegavel | `living-docs-viewer` |
| `DocDetail` | Area principal de conteudo | `living-docs-viewer` |
| `DocSearch` | Campo de busca full-text | `living-docs-viewer` |
| `DocsThemeToggle` | Botao de alternar tema claro/escuro | `living-docs-viewer` |

### Componentes de Detalhe (por Tipo)

| Componente | Tipo | Abas Internas |
|------------|------|---------------|
| `DocAdrDetail` | ADR | Contexto/Decisao, Analise, Implementacao |
| `DocPrdDetail` | PRD | Visao Geral, Requisitos, Tecnico, Metricas |
| `DocGuidelineDetail` | Guideline | Visao Geral, Regras, Checklist, Anti-Padroes |
| `DocTaskDetail` | Task | Visao Geral, Correcoes, Tecnico |
| `DocPlanningDetail` | Planning | Visao Geral, Riscos, Tecnico |

### Componentes de Diagrama

| Componente | Descricao |
|------------|-----------|
| `DiagramRenderer` | Renderiza diagramas Mermaid (lazy-loaded) |
| `DependencyGraph` | Grafo interativo de dependencias entre documentos |
| `DiagramContainer` | Container com controles de zoom/pan |

---

## Store (Zustand)

O estado global e gerenciado via Zustand. Acesse com o hook `useDocsStore`:

```tsx
import { useDocsStore } from 'living-docs-viewer'

function MyComponent() {
  // Ler estado
  const index = useDocsStore((s) => s.index)
  const currentDoc = useDocsStore((s) => s.currentDoc)
  const loading = useDocsStore((s) => s.loading)
  const theme = useDocsStore((s) => s.theme)

  // Disparar acoes
  const loadIndex = useDocsStore((s) => s.loadIndex)
  const selectDoc = useDocsStore((s) => s.selectDoc)
  const setSearchQuery = useDocsStore((s) => s.setSearchQuery)
  const toggleTheme = useDocsStore((s) => s.toggleTheme)
}
```

### Estado Disponivel

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `apiUrl` | `string` | URL base da API |
| `index` | `DocsIndex \| null` | Indice com todos os documentos |
| `catalogs` | `Catalogs \| null` | Autores, tags e glossario |
| `currentDoc` | `Doc \| null` | Documento atualmente selecionado |
| `loading` | `boolean` | Carregamento em andamento |
| `error` | `string \| null` | Mensagem de erro |
| `searchQuery` | `string` | Texto de busca atual |
| `theme` | `'light' \| 'dark'` | Tema ativo |

### Acoes Disponiveis

| Acao | Assinatura | Descricao |
|------|-----------|-----------|
| `loadIndex` | `(url?: string) => Promise<void>` | Carrega indice da API |
| `selectDoc` | `(docId: string) => Promise<void>` | Seleciona e carrega documento |
| `setSearchQuery` | `(query: string) => void` | Atualiza busca |
| `toggleTheme` | `() => void` | Alterna claro/escuro |
| `toggleNode` | `(nodeId: string) => void` | Expande/recolhe no na sidebar |
| `expandAll` | `(nodeIds: string[]) => void` | Expande multiplos nos |

---

## Configuracao e Customizacao

### Variaveis CSS (Tema)

O viewer usa variaveis CSS para tematizacao. Override no seu CSS:

```css
:root {
  --ldv-bg: #ffffff;
  --ldv-text: #1a1a1a;
  --ldv-border: #e5e5e5;
  --ldv-accent: #3b82f6;
}

.dark {
  --ldv-bg: #0a0a0a;
  --ldv-text: #fafafa;
  --ldv-border: #27272a;
  --ldv-accent: #60a5fa;
}
```

### Dark Mode

O tema e controlado via classe CSS `dark` no elemento raiz (Tailwind convention):

```tsx
// Via componente
<DocsViewer apiUrl="/docs" theme="dark" />

// Via store
const toggleTheme = useDocsStore((s) => s.toggleTheme)
toggleTheme()

// Via botao pronto
<DocsThemeToggle />
```

### Tailwind CSS

Se o projeto consumidor usa Tailwind, adicione o content path:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/living-docs-viewer/dist/**/*.js', // <-- adicionar
  ],
  darkMode: 'class',
}
```

---

## Rotas Expostas pelo Middleware

Quando montado com `app.use('/docs', middleware)`:

| Rota | Metodo | Descricao |
|------|--------|-----------|
| `/docs/api/docs-index.json` | GET | Indice dinamico (gerado a cada request) |
| `/docs/api/ADR/shared/ADR-001.json` | GET | Documento JSON individual |
| `/docs/api/catalogs/authors.json` | GET | Catalogo de autores |
| `/docs/api/catalogs/tags.json` | GET | Catalogo de tags |
| `/docs/api/catalogs/glossary.json` | GET | Catalogo de glossario |
| `/docs/assets/*` | GET | Assets estaticos da SPA |
| `/docs/*` | GET | Fallback para SPA (index.html) |

> O indice e gerado dinamicamente a cada request, entao adicionar/remover JSONs reflete imediatamente sem restart.

---

## Troubleshooting

### Problema: Pagina em branco ao acessar /docs

**Causa:** `basePath` nao coincide com o path em `app.use()`.

```typescript
// ERRADO
app.use('/documentacao', createLivingDocsMiddleware({ basePath: '/docs' }))

// CORRETO
app.use('/docs', createLivingDocsMiddleware({ basePath: '/docs' }))
```

### Problema: "Cannot find module 'living-docs-viewer/express'"

**Causa:** Build nao foi executado ou versao antiga.

```bash
# No living-docs-viewer
npm run build:all

# No projeto consumidor
npm install github:michelzandonai/living-docs-viewer#v0.4.2
```

### Problema: Documentos nao aparecem no viewer

**Causa:** Pasta `docsPath` incorreta ou JSONs com formato invalido.

```bash
# Verificar se o path esta correto
ls -la /absolute/path/to/docs/

# Verificar se o JSON e valido
node -e "JSON.parse(require('fs').readFileSync('docs/ADR/shared/ADR-001.json'))"
```

### Problema: Estilos nao carregam (componentes sem estilo)

**Causa:** CSS nao importado.

```typescript
// Adicionar no entrypoint do app
import 'living-docs-viewer/styles.css'
```

### Problema: Docker - modulo nao encontrado

**Causa:** Symlinks do `github:` nao funcionam em containers.

```bash
# Gerar .tgz e usar file: protocol
cd living-docs-viewer && npm pack
# Copiar .tgz para o projeto e usar:
# "living-docs-viewer": "file:./living-docs-viewer-0.4.2.tgz"
```

---

## Testes

O projeto possui 113 testes automatizados em 6 suites:

```bash
npm test           # Rodar todos
npm run test:watch # Modo watch
```

| Suite | Testes | Cobertura |
|-------|--------|-----------|
| `middleware.test.ts` | 34 | Express middleware, SPA serving, config injection |
| `search-docs.test.ts` | 15 | Busca full-text com acentos |
| `recent-docs.test.ts` | 13 | Ordenacao e filtragem de recentes |
| `resolve-catalogs.test.ts` | 14 | Resolucao de autores e tags |
| `normalize-diagram-type.test.ts` | 22 | Mapeamento de tipos de diagrama |
| `build-graph.test.ts` | 15 | Construcao de grafo e ghost nodes |

---

## Versionamento

O projeto segue [Semantic Versioning](https://semver.org/). Releases sao distribuidas via tags Git.

### Atualizar em projetos consumidores

```bash
# Atualizar referencia no package.json
npm install github:michelzandonai/living-docs-viewer#v0.4.2

# Ou para Docker (gerar novo .tgz)
cd living-docs-viewer
npm run build:all
npm pack
```

### Historico de Versoes

| Versao | Data | Destaque |
|--------|------|----------|
| `0.4.2` | 2026-03-03 | Recentes expansivel de 5 em 5 com persistencia localStorage |
| `0.4.1` | 2026-03-01 | Ordenacao por mtime do filesystem |
| `0.4.0` | 2026-02-28 | Planning phases, markdown descriptions, GitHub install |

---

## Licenca

MIT
