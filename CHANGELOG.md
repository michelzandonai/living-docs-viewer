# Changelog

Todas as mudancas notaveis neste projeto serao documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Tests

- 39 testes de componentes React (FixStatusIcon, CollapsibleSection, FixCard com markdown + expansao, TaskOverview com links, URL hash sync)
- 30 testes de logica pura (parseFileBadge com assertions exatas, getTaskLabels com edge cases, URL sync com erro fetch, tab labels importados do source)

## [0.5.1] - 2026-03-07

### Added

- URL sync com hash — doc selecionado reflete na URL, preserva estado em refresh/navegacao
- Task viewer: labels dinamicos baseados no status (Etapas/Entregas)
- Task viewer: suporte a Markdown nos campos description e logic dos fixes
- Task viewer: badges visuais nos arquivos (NEW, MOD, REF)
- Task viewer: progress visual por etapa (pending, in_progress, completed)
- Task viewer: layout em cards colapsiveis com secoes description/logic/files

## [0.5.0] - 2026-03-04

### Added

- Bundled docs merge — GUIDELINE-001 como fonte unica na lib, merge automatico com docs locais
- ADR-001 documentando decisao de bundled docs merge
- TASK-001 registro da implementacao do bundled docs

## [0.4.4] - 2026-03-04

### Added

- Version badge no header exibindo versao da biblioteca

## [0.4.3] - 2026-03-04

### Added

- generateDocsIndex com cache, scan de diretorio e enrichment de documentos

### Tests

- 22 testes para middleware index generation e caching

## [0.4.2] - 2026-03-03

### Added

- Recentes expandivel de 5 em 5 com persistencia localStorage

## [0.4.1] - 2026-03-03

### Added

- Ordenacao de recentes por mtime do filesystem

## [0.4.0] - 2026-03-03

### Added

- Commit inicial com SPA build e Express middleware
- Port completo do docs viewer do energimap-web
- docs-index.json dinamico via filesystem scan
- Fases de planning, descricoes markdown e suporte a instalacao via GitHub
- Guideline de integracao do living-docs-viewer

### Fixed

- Resolver issues de code review e adicionar testes de regressao E2E
- Tratar appliesTo como string ou array no guideline detail
- Enriquecer documentos com campos derivados no serve

[Unreleased]: https://github.com/michelzandonai/living-docs-viewer/compare/v0.5.1...HEAD
[0.5.1]: https://github.com/michelzandonai/living-docs-viewer/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/michelzandonai/living-docs-viewer/compare/v0.4.4...v0.5.0
[0.4.4]: https://github.com/michelzandonai/living-docs-viewer/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/michelzandonai/living-docs-viewer/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/michelzandonai/living-docs-viewer/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/michelzandonai/living-docs-viewer/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/michelzandonai/living-docs-viewer/releases/tag/v0.4.0
