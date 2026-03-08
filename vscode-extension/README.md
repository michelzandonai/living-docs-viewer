# Living Docs Viewer - VS Code Extension

Visualize arquivos JSON `energimap-doc/v1` diretamente no VS Code com a mesma interface do web viewer.

## Features

- Custom Editor para arquivos JSON com schema energimap-doc/v1
- Sidebar com navegacao em arvore por tipo, scope e status
- Visualizacao de ADRs, PRDs, Tasks, Guidelines e Plannings
- Diagramas interativos (Mermaid, Flowchart, ER, State, Sequence)
- Tema claro/escuro sincronizado com o VS Code
- Auto-reload quando arquivos sao modificados
- Busca e filtro de documentos

## Instalacao

### Via .vsix

1. Baixe o arquivo `.vsix` da [pagina de releases](https://github.com/michelzandonai/living-docs-viewer/releases)
2. No VS Code: Extensions > ... > Install from VSIX
3. Selecione o arquivo `.vsix`

### Via source

```bash
cd vscode-extension
npm install
npm run build
npx @vscode/vsce package
```

## Uso

1. Abra um projeto que contenha uma pasta `docs/` com arquivos JSON energimap-doc/v1
2. Clique com botao direito em qualquer `.json` > "Open With..." > "Living Docs Viewer"
3. Ou use `Cmd+Shift+P` > "Living Docs: Open Preview"

## Desenvolvimento

```bash
cd vscode-extension
npm install
npm run build
```

Para debug: pressione F5 no VS Code (abre uma instancia de Extension Development Host).

## Estrutura

```
vscode-extension/
  src/
    extension/         # Extension host (Node.js)
      extension.ts     # Entry point (activate/deactivate)
      custom-editor-provider.ts  # CustomTextEditorProvider
      workspace-scanner.ts       # Scan workspace for docs
      file-watcher.ts            # Watch for file changes
      webview-html.ts            # Generate webview HTML
    webview/           # Webview (Browser/React)
      App.tsx          # Main React component
      index.tsx        # React entry point
      index.css        # Tailwind + custom styles
      VscodeLayoutShell.tsx  # Layout adapted for VS Code
      setup-store-bridge.ts  # Zustand store postMessage bridge
    shared/            # Shared between extension and webview
      messages.ts      # PostMessage protocol types
  dist/
    extension/         # Bundled extension code
    webview/           # Bundled React SPA
```
