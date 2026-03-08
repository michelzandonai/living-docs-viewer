import * as vscode from 'vscode'
import { LivingDocsEditorProvider } from './custom-editor-provider'
import { createFileWatcher } from './file-watcher'

export function activate(context: vscode.ExtensionContext) {
  // Register the custom editor provider
  context.subscriptions.push(
    LivingDocsEditorProvider.register(context)
  )

  // Register file watcher for live reload
  context.subscriptions.push(
    createFileWatcher(context)
  )

  // Register command to open preview
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
}

export function deactivate() {
  // Cleanup handled by disposables
}
