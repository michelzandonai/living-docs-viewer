import * as vscode from 'vscode'

/**
 * Event emitter that fires when docs JSON files change in the workspace.
 * The CustomEditorProvider listens to this to refresh webviews.
 */
export const onDocsChanged = new vscode.EventEmitter<void>()

export function createFileWatcher(
  _context: vscode.ExtensionContext
): vscode.Disposable {
  const watcher = vscode.workspace.createFileSystemWatcher('**/*.json')

  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  const scheduleRefresh = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      onDocsChanged.fire()
    }, 500)
  }

  const shouldIgnore = (uri: vscode.Uri): boolean => {
    const path = uri.fsPath
    return (
      path.includes('node_modules') ||
      path.includes('.git') ||
      path.includes('/dist/') ||
      path.includes('/build/') ||
      path.includes('package-lock.json') ||
      path.includes('package.json') ||
      path.includes('tsconfig')
    )
  }

  const onChange = watcher.onDidChange((uri: vscode.Uri) => {
    if (!shouldIgnore(uri)) scheduleRefresh()
  })
  const onCreate = watcher.onDidCreate((uri: vscode.Uri) => {
    if (!shouldIgnore(uri)) scheduleRefresh()
  })
  const onDelete = watcher.onDidDelete((uri: vscode.Uri) => {
    if (!shouldIgnore(uri)) scheduleRefresh()
  })

  const disposable = vscode.Disposable.from(
    watcher,
    onChange,
    onCreate,
    onDelete,
    onDocsChanged,
    { dispose: () => { if (debounceTimer) clearTimeout(debounceTimer) } }
  )

  return disposable
}
