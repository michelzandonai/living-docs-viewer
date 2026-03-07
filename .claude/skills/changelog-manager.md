---
description: "Gerencia CHANGELOG.md, adiciona entradas e faz version bump. Use quando: adicionar changelog, fazer release, bumpar versao, registrar mudanca, nova versao, preparar release."
---

# Changelog Manager

Skill para gerenciar o CHANGELOG.md seguindo o formato Keep a Changelog (https://keepachangelog.com).

## Passos

### 1. Ler estado atual

- Ler `CHANGELOG.md` na raiz do projeto para ver entradas existentes
- Ler `package.json` para obter a versao atual (`version`)
- Ler `CLAUDE.md` para localizar a linha de versao (`- **Versao**: X.Y.Z`)

### 2. Determinar a acao

Se o usuario pediu para **adicionar uma entrada**:
- Perguntar o que adicionar (se nao especificou)
- Categorizar na secao correta dentro de `[Unreleased]`:
  - **Added** - Funcionalidades novas
  - **Changed** - Alteracoes em funcionalidades existentes
  - **Fixed** - Correcoes de bugs
  - **Removed** - Funcionalidades removidas
- Inserir o item na categoria correspondente dentro de `[Unreleased]`
- Se a categoria ainda nao existe em `[Unreleased]`, criar

Se o usuario pediu para **fazer release / bumpar versao**:
- Ir direto ao passo 3

### 3. Perguntar sobre version bump

Perguntar ao usuario se deseja criar uma nova versao:
- **patch** (X.Y.Z+1) - Correcoes de bugs, ajustes menores
- **minor** (X.Y+1.0) - Novas funcionalidades, sem breaking changes
- **major** (X+1.0.0) - Breaking changes

Se o usuario nao quiser bump, encerrar aqui.

### 4. Executar version bump

Se o usuario confirmou o bump:

1. **CHANGELOG.md**: Mover todos os itens de `[Unreleased]` para uma nova secao com a versao e data:
   ```
   ## [Unreleased]

   ## [X.Y.Z] - YYYY-MM-DD
   ### Added
   - Item que estava em Unreleased
   ```

2. **package.json**: Atualizar o campo `"version"` para a nova versao

3. **CLAUDE.md**: Atualizar a linha `- **Versao**: X.Y.Z` para a nova versao

4. **Sugerir commit message**:
   ```
   chore: release vX.Y.Z
   ```

## Formato do CHANGELOG.md

Sempre manter este formato:

```markdown
# Changelog

Todas as mudancas notaveis deste projeto serao documentadas neste arquivo.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

## [X.Y.Z] - YYYY-MM-DD
### Added
- Descricao do que foi adicionado

### Changed
- Descricao do que mudou

### Fixed
- Descricao do que foi corrigido

### Removed
- Descricao do que foi removido
```

## Regras

- Sempre manter a secao `[Unreleased]` no topo, mesmo que vazia
- Cada entrada deve ser uma frase concisa começando com verbo ou substantivo
- Nao incluir categorias vazias (so criar a categoria se houver itens)
- Datas no formato ISO 8601: YYYY-MM-DD
- Versoes mais recentes ficam no topo do arquivo
- Links de comparacao no final do arquivo sao opcionais para este projeto
- Sempre responder em portugues ao interagir com o usuario
