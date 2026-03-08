/**
 * Message protocol between VS Code extension host and webview.
 * Both sides import these types for type-safe communication.
 */

// --- Extension → Webview ---

export interface SetIndexMessage {
  type: 'setIndex'
  payload: unknown // DocsIndex
}

export interface SetCatalogsMessage {
  type: 'setCatalogs'
  payload: {
    authors: Record<string, { name: string; role: string }>
    tags: Record<string, { label: string; category: string }>
    glossary: Record<string, { definition: string; aliases: string[] }>
  }
}

export interface SetDocMessage {
  type: 'setDoc'
  payload: unknown // Doc
}

export interface SetLoadingMessage {
  type: 'setLoading'
  payload: boolean
}

export interface SetErrorMessage {
  type: 'setError'
  payload: string | null
}

export interface SetThemeMessage {
  type: 'setTheme'
  payload: 'light' | 'dark'
}

export type ExtensionToWebviewMessage =
  | SetIndexMessage
  | SetCatalogsMessage
  | SetDocMessage
  | SetLoadingMessage
  | SetErrorMessage
  | SetThemeMessage

// --- Webview → Extension ---

export interface ReadyMessage {
  type: 'ready'
}

export interface RequestIndexMessage {
  type: 'requestIndex'
}

export interface SelectDocMessage {
  type: 'selectDoc'
  payload: { docId: string; path: string }
}

export interface RequestCatalogsMessage {
  type: 'requestCatalogs'
}

export type WebviewToExtensionMessage =
  | ReadyMessage
  | RequestIndexMessage
  | SelectDocMessage
  | RequestCatalogsMessage
