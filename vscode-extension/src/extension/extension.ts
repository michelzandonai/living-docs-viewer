import * as vscode from 'vscode'
import { LivingDocsEditorProvider } from './custom-editor-provider'
import { LivingDocsPanelManager } from './panel-provider'
import { createFileWatcher } from './file-watcher'
import { checkLibraryVersion } from './version-checker'

export function activate(context: vscode.ExtensionContext) {
  const panelManager = new LivingDocsPanelManager(context)

  // Register the custom editor provider (per-file "Open With...")
  context.subscriptions.push(
    LivingDocsEditorProvider.register(context)
  )

  // Register file watcher for live reload
  context.subscriptions.push(
    createFileWatcher(context)
  )

  // Register command: open full panel from Activity Bar
  context.subscriptions.push(
    vscode.commands.registerCommand('livingDocs.openPanel', () => {
      panelManager.openOrReveal()
    })
  )

  // Register command: open preview for current file
  context.subscriptions.push(
    vscode.commands.registerCommand('livingDocs.openPreview', () => {
      const activeEditor = vscode.window.activeTextEditor
      if (activeEditor && activeEditor.document.fileName.endsWith('.json')) {
        vscode.commands.executeCommand(
          'vscode.openWith',
          activeEditor.document.uri,
          LivingDocsEditorProvider.viewType
        )
      } else {
        vscode.window.showInformationMessage(
          'Abra um arquivo JSON para usar o Living Docs Viewer.'
        )
      }
    })
  )

  // Auto-update dateModified on save for energimap-doc/v1 JSON files
  context.subscriptions.push(
    vscode.workspace.onWillSaveTextDocument((event) => {
      const doc = event.document
      if (doc.languageId !== 'json' && !doc.fileName.endsWith('.json')) return

      const text = doc.getText()

      // Quick string check before parsing (fast path)
      if (!text.includes('"energimap-doc/v1"')) return

      try {
        const json = JSON.parse(text)
        if (json.$docSchema !== 'energimap-doc/v1') return
        if (!json.metadata) return

        const now = new Date().toISOString()

        // Ensure dateCreated exists
        if (!json.metadata.dateCreated) {
          json.metadata.dateCreated = now
        }

        // Always update dateModified
        json.metadata.dateModified = now

        const newText = JSON.stringify(json, null, 2) + '\n'

        // Only apply edit if content actually changed
        if (newText !== text) {
          const fullRange = new vscode.Range(
            doc.positionAt(0),
            doc.positionAt(text.length)
          )
          const edit = vscode.TextEdit.replace(fullRange, newText)
          event.waitUntil(Promise.resolve([edit]))
        }
      } catch {
        // Invalid JSON — skip silently
      }
    })
  )

  // Check if living-docs-viewer library is up to date
  checkLibraryVersion(context)
}

export function deactivate() {
  // Cleanup handled by disposables
}
