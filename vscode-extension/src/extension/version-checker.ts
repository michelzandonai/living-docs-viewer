import * as vscode from 'vscode'
import * as https from 'https'
import * as path from 'path'
import * as fs from 'fs'

const NPM_REGISTRY_URL = 'https://registry.npmjs.org/living-docs-viewer/latest'
const PACKAGE_NAME = 'living-docs-viewer'

interface NpmRegistryResponse {
  version: string
}

function getInstalledVersion(workspaceRoot: string): string | null {
  try {
    const pkgPath = path.join(workspaceRoot, 'node_modules', PACKAGE_NAME, 'package.json')
    if (!fs.existsSync(pkgPath)) return null
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    return pkg.version || null
  } catch {
    return null
  }
}

function fetchLatestVersion(): Promise<string | null> {
  return new Promise((resolve) => {
    const req = https.get(NPM_REGISTRY_URL, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json: NpmRegistryResponse = JSON.parse(data)
          resolve(json.version || null)
        } catch {
          resolve(null)
        }
      })
    })
    req.on('error', () => resolve(null))
    req.setTimeout(5000, () => { req.destroy(); resolve(null) })
  })
}

function compareVersions(installed: string, latest: string): boolean {
  const parse = (v: string) => v.split('.').map(Number)
  const [a1, a2, a3] = parse(installed)
  const [b1, b2, b3] = parse(latest)
  if (a1 !== b1) return a1 < b1
  if (a2 !== b2) return a2 < b2
  return a3 < b3
}

export async function checkLibraryVersion(_context: vscode.ExtensionContext) {
  const workspaceFolders = vscode.workspace.workspaceFolders
  if (!workspaceFolders || workspaceFolders.length === 0) return

  // Check each workspace folder
  for (const folder of workspaceFolders) {
    const installed = getInstalledVersion(folder.uri.fsPath)
    if (!installed) continue // lib not installed in this workspace

    const latest = await fetchLatestVersion()
    if (!latest) return // couldn't reach npm, skip silently

    if (compareVersions(installed, latest)) {
      const action = await vscode.window.showInformationMessage(
        `Living Docs Viewer: versao ${installed} instalada, ${latest} disponivel.`,
        'Atualizar',
        'Ignorar'
      )

      if (action === 'Atualizar') {
        const terminal = vscode.window.createTerminal('Living Docs Update')
        terminal.show()
        terminal.sendText(`cd "${folder.uri.fsPath}" && npm update ${PACKAGE_NAME}`)
      }
    }

    break // check only the first workspace that has the lib
  }
}
