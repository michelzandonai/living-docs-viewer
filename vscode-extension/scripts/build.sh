#!/bin/bash
set -e

echo "=== Building Living Docs VS Code Extension ==="
echo ""

echo "[1/2] Building extension host..."
node esbuild.extension.mjs
echo "  Done."

echo "[2/2] Building webview..."
npx vite build --config vite.webview.config.ts
echo "  Done."

echo ""
echo "Build complete!"
echo "Run 'npx @vscode/vsce package' to create .vsix"
