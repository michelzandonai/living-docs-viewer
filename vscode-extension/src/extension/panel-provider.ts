import * as vscode from 'vscode'
import { getWebviewHtml } from './webview-html'
import { scanWorkspaceForDocs, loadCatalogs } from './workspace-scanner'
import { onDocsChanged } from './file-watcher'
import type { WebviewToExtensionMessage } from '../shared/messages'

/**
 * Opens the Living Docs viewer as a full editor tab (WebviewPanel).
 * Scans the workspace for a "docs/" folder and loads all docs.
 *
 * Docs folder resolution order:
 * 1. Workspace setting livingDocs.docsPath (saved per-project)
 * 2. Auto-detect: root/docs/, then subdir/docs/ one level deep
 * 3. Prompt user with folder picker, saves to workspace settings
 */
export class LivingDocsPanelManager {
  private panel: vscode.WebviewPanel | undefined
  private disposables: vscode.Disposable[] = []
  private cachedDocsFolder: vscode.Uri | null = null

  constructor(private readonly context: vscode.ExtensionContext) {}

  openOrReveal() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One)
      return
    }

    this.panel = vscode.window.createWebviewPanel(
      'livingDocs.panel',
      'Living Docs',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.context.extensionUri, 'dist', 'webview'),
        ],
      }
    )

    this.panel.iconPath = {
      light: vscode.Uri.joinPath(this.context.extensionUri, 'media', 'icon-light.svg'),
      dark: vscode.Uri.joinPath(this.context.extensionUri, 'media', 'icon-dark.svg'),
    }

    this.panel.webview.html = getWebviewHtml(
      this.panel.webview,
      this.context.extensionUri
    )

    // Handle messages from webview
    this.panel.webview.onDidReceiveMessage(
      async (msg: WebviewToExtensionMessage) => {
        switch (msg.type) {
          case 'ready':
            await this.sendIndex()
            await this.sendCatalogs()
            this.sendTheme()
            break
          case 'selectDoc':
            await this.handleSelectDoc(msg.payload)
            break
          case 'requestIndex':
            await this.sendIndex()
            break
          case 'requestCatalogs':
            await this.sendCatalogs()
            break
          case 'selectFolder':
            await this.promptSelectFolder()
            break
        }
      },
      undefined,
      this.disposables
    )

    // Listen for theme changes
    const themeDisposable = vscode.window.onDidChangeActiveColorTheme(() => {
      this.sendTheme()
    })
    this.disposables.push(themeDisposable)

    // Listen for file changes
    const docsChangedDisposable = onDocsChanged.event(async () => {
      this.cachedDocsFolder = null
      await this.sendIndex()
    })
    this.disposables.push(docsChangedDisposable)

    this.panel.onDidDispose(() => {
      this.panel = undefined
      this.disposables.forEach((d) => d.dispose())
      this.disposables = []
    })
  }

  private sendTheme() {
    if (!this.panel) return
    const isDark =
      vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ||
      vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast
    this.panel.webview.postMessage({
      type: 'setTheme',
      payload: isDark ? 'dark' : 'light',
    })
  }

  // --- Docs folder resolution ---

  private async resolveDocsFolder(): Promise<vscode.Uri | null> {
    if (this.cachedDocsFolder) return this.cachedDocsFolder

    // 1. Check workspace setting
    const savedPath = vscode.workspace
      .getConfiguration('livingDocs')
      .get<string>('docsPath')

    if (savedPath) {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri
      if (workspaceRoot) {
        const savedUri = savedPath.startsWith('/')
          ? vscode.Uri.file(savedPath)
          : vscode.Uri.joinPath(workspaceRoot, savedPath)

        if (await this.hasEnergiMapDocs(savedUri)) {
          this.cachedDocsFolder = savedUri
          return savedUri
        }
      }
    }

    // 2. Auto-detect
    const detected = await this.autoDetectDocsFolder()
    if (detected) {
      this.cachedDocsFolder = detected
      return detected
    }

    // 3. Not found — return null (caller will prompt user)
    return null
  }

  private async autoDetectDocsFolder(): Promise<vscode.Uri | null> {
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders || workspaceFolders.length === 0) return null

    for (const folder of workspaceFolders) {
      // Check root/docs/
      const rootDocs = vscode.Uri.joinPath(folder.uri, 'docs')
      if (await this.hasEnergiMapDocs(rootDocs)) return rootDocs

      // Check */docs/ (one level deeper)
      try {
        const entries = await vscode.workspace.fs.readDirectory(folder.uri)
        for (const [name, type] of entries) {
          if (type !== vscode.FileType.Directory) continue
          if (name.startsWith('.') || name === 'node_modules' || name === 'dist') continue
          const subDocs = vscode.Uri.joinPath(folder.uri, name, 'docs')
          if (await this.hasEnergiMapDocs(subDocs)) return subDocs
        }
      } catch {
        // ignore
      }
    }

    return null
  }

  private async hasEnergiMapDocs(docsUri: vscode.Uri): Promise<boolean> {
    try {
      const stat = await vscode.workspace.fs.stat(docsUri)
      if (stat.type !== vscode.FileType.Directory) return false
      const pattern = new vscode.RelativePattern(docsUri, '**/*.json')
      const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**', 1)
      if (files.length === 0) return false
      const content = await vscode.workspace.fs.readFile(files[0])
      const text = new TextDecoder().decode(content)
      const doc = JSON.parse(text)
      return doc.$docSchema === 'energimap-doc/v1' || (doc.metadata && doc.sections)
    } catch {
      return false
    }
  }

  // --- Folder picker ---

  private async promptSelectFolder() {
    const result = await vscode.window.showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false,
      openLabel: 'Selecionar pasta de documentacao',
      title: 'Selecione a pasta que contem os JSONs energimap-doc/v1',
    })

    if (!result || result.length === 0) return

    const selectedUri = result[0]

    // Validate it has energimap docs
    if (!(await this.hasEnergiMapDocs(selectedUri))) {
      vscode.window.showWarningMessage(
        'A pasta selecionada nao contem documentos energimap-doc/v1.'
      )
      return
    }

    // Save to workspace settings (relative path if possible)
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri
    let pathToSave = selectedUri.fsPath

    if (workspaceRoot && selectedUri.fsPath.startsWith(workspaceRoot.fsPath)) {
      // Save as relative path
      pathToSave = selectedUri.fsPath.slice(workspaceRoot.fsPath.length + 1)
    }

    await vscode.workspace
      .getConfiguration('livingDocs')
      .update('docsPath', pathToSave, vscode.ConfigurationTarget.Workspace)

    vscode.window.showInformationMessage(
      `Living Docs: pasta configurada como "${pathToSave}"`
    )

    // Reload with the new folder
    this.cachedDocsFolder = selectedUri
    await this.sendIndex()
    await this.sendCatalogs()
  }

  // --- Send data to webview ---

  private async sendIndex() {
    if (!this.panel) return
    try {
      this.panel.webview.postMessage({ type: 'setLoading', payload: true })
      const docsFolder = await this.resolveDocsFolder()

      if (docsFolder) {
        const index = await scanWorkspaceForDocs(docsFolder)
        this.panel.webview.postMessage({ type: 'setIndex', payload: index })
        this.panel.webview.postMessage({ type: 'setError', payload: null })
      } else {
        // Not found — send special error so webview shows "select folder" button
        this.panel.webview.postMessage({
          type: 'setError',
          payload: '__NO_DOCS_FOLDER__',
        })
      }
      this.panel.webview.postMessage({ type: 'setLoading', payload: false })
    } catch (e) {
      this.panel.webview.postMessage({
        type: 'setError',
        payload: `Erro ao escanear workspace: ${e}`,
      })
    }
  }

  private async sendCatalogs() {
    if (!this.panel) return
    try {
      const docsFolder = await this.resolveDocsFolder()
      if (docsFolder) {
        const catalogs = await loadCatalogs(docsFolder)
        this.panel.webview.postMessage({ type: 'setCatalogs', payload: catalogs })
      }
    } catch {
      // Catalogs are optional
    }
  }

  private async handleSelectDoc(payload: { docId: string; path: string }) {
    if (!this.panel) return
    try {
      this.panel.webview.postMessage({ type: 'setLoading', payload: true })
      const docsFolder = await this.resolveDocsFolder()
      if (!docsFolder) return

      const docUri = vscode.Uri.joinPath(docsFolder, payload.path)
      const content = await vscode.workspace.fs.readFile(docUri)
      const text = new TextDecoder().decode(content)
      const doc = JSON.parse(text)
      this.panel.webview.postMessage({ type: 'setDoc', payload: doc })
    } catch (e) {
      this.panel.webview.postMessage({
        type: 'setError',
        payload: `Erro ao carregar documento: ${e}`,
      })
    }
  }

  dispose() {
    this.panel?.dispose()
  }
}
