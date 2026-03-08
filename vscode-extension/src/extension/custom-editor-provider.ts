import * as vscode from 'vscode'
import { getWebviewHtml } from './webview-html'
import { scanWorkspaceForDocs, loadCatalogs } from './workspace-scanner'
import { onDocsChanged } from './file-watcher'
import type { WebviewToExtensionMessage } from '../shared/messages'

export class LivingDocsEditorProvider implements vscode.CustomTextEditorProvider {
  static readonly viewType = 'livingDocs.docViewer'

  private readonly webviewPanels = new Set<vscode.WebviewPanel>()

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new LivingDocsEditorProvider(context)
    const registration = vscode.window.registerCustomEditorProvider(
      LivingDocsEditorProvider.viewType,
      provider,
      {
        webviewOptions: { retainContextWhenHidden: true },
      }
    )
    return registration
  }

  constructor(private readonly context: vscode.ExtensionContext) {
    // Listen for file changes and refresh all open webviews
    onDocsChanged.event(() => {
      this.refreshAllWebviews()
    })
  }

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    this.webviewPanels.add(webviewPanel)

    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview'),
      ],
    }

    webviewPanel.webview.html = getWebviewHtml(
      webviewPanel.webview,
      this.context.extensionUri
    )

    // Handle messages from webview
    webviewPanel.webview.onDidReceiveMessage(
      async (msg: WebviewToExtensionMessage) => {
        switch (msg.type) {
          case 'ready': {
            // Send the current document content
            await this.sendCurrentDoc(webviewPanel, document)
            // Send workspace index
            await this.sendIndex(webviewPanel, document)
            // Send catalogs
            await this.sendCatalogs(webviewPanel, document)
            // Detect and send theme
            const theme = vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark
              || vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast
              ? 'dark' : 'light'
            webviewPanel.webview.postMessage({ type: 'setTheme', payload: theme })
            break
          }
          case 'selectDoc': {
            await this.handleSelectDoc(webviewPanel, document, msg.payload)
            break
          }
          case 'requestIndex': {
            await this.sendIndex(webviewPanel, document)
            break
          }
          case 'requestCatalogs': {
            await this.sendCatalogs(webviewPanel, document)
            break
          }
        }
      },
      undefined,
      []
    )

    // Update when the document changes
    const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() === document.uri.toString()) {
        this.sendCurrentDoc(webviewPanel, document)
      }
    })

    // Listen for theme changes
    const themeSubscription = vscode.window.onDidChangeActiveColorTheme((theme) => {
      const isDark = theme.kind === vscode.ColorThemeKind.Dark
        || theme.kind === vscode.ColorThemeKind.HighContrast
      webviewPanel.webview.postMessage({
        type: 'setTheme',
        payload: isDark ? 'dark' : 'light',
      })
    })

    webviewPanel.onDidDispose(() => {
      this.webviewPanels.delete(webviewPanel)
      changeDocumentSubscription.dispose()
      themeSubscription.dispose()
    })
  }

  private async sendCurrentDoc(
    panel: vscode.WebviewPanel,
    document: vscode.TextDocument
  ) {
    try {
      const content = document.getText()
      const doc = JSON.parse(content)
      if (doc.$docSchema === 'energimap-doc/v1') {
        panel.webview.postMessage({ type: 'setDoc', payload: doc })
      }
    } catch {
      // Invalid JSON - ignore
    }
  }

  private async sendIndex(
    panel: vscode.WebviewPanel,
    document: vscode.TextDocument
  ) {
    try {
      panel.webview.postMessage({ type: 'setLoading', payload: true })
      const docsFolder = this.findDocsFolder(document.uri)
      if (docsFolder) {
        const index = await scanWorkspaceForDocs(docsFolder)
        panel.webview.postMessage({ type: 'setIndex', payload: index })
      }
      panel.webview.postMessage({ type: 'setLoading', payload: false })
    } catch (e) {
      panel.webview.postMessage({
        type: 'setError',
        payload: `Erro ao escanear workspace: ${e}`,
      })
    }
  }

  private async sendCatalogs(
    panel: vscode.WebviewPanel,
    document: vscode.TextDocument
  ) {
    try {
      const docsFolder = this.findDocsFolder(document.uri)
      if (docsFolder) {
        const catalogs = await loadCatalogs(docsFolder)
        panel.webview.postMessage({ type: 'setCatalogs', payload: catalogs })
      }
    } catch {
      // Catalogs are optional
    }
  }

  private async handleSelectDoc(
    panel: vscode.WebviewPanel,
    document: vscode.TextDocument,
    payload: { docId: string; path: string }
  ) {
    try {
      panel.webview.postMessage({ type: 'setLoading', payload: true })
      const docsFolder = this.findDocsFolder(document.uri)
      if (!docsFolder) return

      const docUri = vscode.Uri.joinPath(docsFolder, payload.path)
      const content = await vscode.workspace.fs.readFile(docUri)
      const text = new TextDecoder().decode(content)
      const doc = JSON.parse(text)
      panel.webview.postMessage({ type: 'setDoc', payload: doc })
    } catch (e) {
      panel.webview.postMessage({
        type: 'setError',
        payload: `Erro ao carregar documento: ${e}`,
      })
    }
  }

  private findDocsFolder(fileUri: vscode.Uri): vscode.Uri | null {
    // Walk up from the file to find the docs folder
    // Convention: the file is inside a "docs" folder
    const filePath = fileUri.fsPath
    const parts = filePath.split('/')

    // Find the "docs" segment in the path
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i] === 'docs') {
        const docsPath = parts.slice(0, i + 1).join('/')
        return vscode.Uri.file(docsPath)
      }
    }

    // Fallback: use the directory of the file
    const dirPath = parts.slice(0, -1).join('/')
    return vscode.Uri.file(dirPath)
  }

  private async refreshAllWebviews() {
    for (const panel of this.webviewPanels) {
      panel.webview.postMessage({ type: 'setLoading', payload: true })
      // Trigger re-scan - each panel will need its own document context
      // For now, just notify that changes happened
      panel.webview.postMessage({ type: 'setLoading', payload: false })
    }
  }
}
