import * as vscode from 'vscode'

export function getWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const webviewDistUri = vscode.Uri.joinPath(extensionUri, 'dist', 'webview')

  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(webviewDistUri, 'assets', 'index.js')
  )
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(webviewDistUri, 'assets', 'style.css')
  )

  const nonce = getNonce()

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="
    default-src 'none';
    style-src ${webview.cspSource} 'unsafe-inline';
    script-src 'nonce-${nonce}' ${webview.cspSource};
    img-src ${webview.cspSource} https: data:;
    font-src ${webview.cspSource};
  ">
  <link rel="stylesheet" href="${styleUri}">
  <title>Living Docs Viewer</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}" type="module"></script>
</body>
</html>`
}

function getNonce(): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
