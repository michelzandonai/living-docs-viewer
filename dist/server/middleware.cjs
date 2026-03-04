"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/middleware.ts
var middleware_exports = {};
__export(middleware_exports, {
  createLivingDocsMiddleware: () => createLivingDocsMiddleware,
  generateDocsIndex: () => generateDocsIndex,
  getBundledDocsPath: () => getBundledDocsPath
});
module.exports = __toCommonJS(middleware_exports);
var import_express = require("express");
var import_fs = require("fs");
var import_path = require("path");
var import_url = require("url");
var import_meta = {};
function getCurrentDirname() {
  try {
    if (typeof import_meta?.url === "string") {
      return (0, import_path.dirname)((0, import_url.fileURLToPath)(import_meta.url));
    }
  } catch {
  }
  return __dirname;
}
var currentDir = getCurrentDirname();
function getBundledDocsPath() {
  const bundledPath = (0, import_path.resolve)(currentDir, "../docs");
  try {
    if ((0, import_fs.existsSync)(bundledPath) && (0, import_fs.statSync)(bundledPath).isDirectory()) {
      return bundledPath;
    }
  } catch {
  }
  return null;
}
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
var SKIP_DIRS = /* @__PURE__ */ new Set(["_catalogs", "_schema", "_skill", "_deprecated", "archived", "node_modules", ".git"]);
var SKIP_FILES = /* @__PURE__ */ new Set(["docs-index.json"]);
function deriveType(relPath) {
  const first = relPath.split("/")[0];
  const map = {
    adr: "adr",
    prd: "prd",
    planning: "planning",
    tasks: "task",
    guidelines: "guideline"
  };
  return map[first] ?? null;
}
function walkJsonFiles(dir, root) {
  const results = [];
  let entries;
  try {
    entries = (0, import_fs.readdirSync)(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const name = String(entry.name);
    if (name.startsWith(".") || SKIP_DIRS.has(name)) continue;
    const fullPath = (0, import_path.join)(dir, name);
    if (entry.isDirectory()) {
      results.push(...walkJsonFiles(fullPath, root));
    } else if (entry.isFile() && (0, import_path.extname)(name) === ".json" && !SKIP_FILES.has(name)) {
      results.push(fullPath);
    }
  }
  return results;
}
function buildIndex(docsPath, extraDocsPaths = []) {
  const files = walkJsonFiles(docsPath, docsPath);
  const documents = [];
  const graphNodes = [];
  const graphEdges = [];
  const byType = {};
  const byStatus = {};
  const seenIds = /* @__PURE__ */ new Set();
  function processFile(filePath, basePath) {
    try {
      const raw = (0, import_fs.readFileSync)(filePath, "utf-8");
      const doc = JSON.parse(raw);
      if (!doc.id || !doc.metadata) return;
      if (seenIds.has(doc.id)) return;
      seenIds.add(doc.id);
      const relPath = (0, import_path.relative)(basePath, filePath);
      const type = doc.type || deriveType(relPath) || "unknown";
      const stat = (0, import_fs.statSync)(filePath);
      documents.push({
        id: doc.id,
        type,
        title: doc.metadata.title || doc.id,
        status: doc.metadata.status || "unknown",
        scope: doc.metadata.scope || "shared",
        dateCreated: doc.metadata.dateCreated || "",
        dateModified: doc.metadata.dateModified,
        _fileMtime: stat.mtime.toISOString(),
        tagIds: doc.metadata.tagIds || [],
        summary: doc.metadata.summary || "",
        path: relPath
      });
      byType[type] = (byType[type] || 0) + 1;
      byStatus[doc.metadata.status || "unknown"] = (byStatus[doc.metadata.status || "unknown"] || 0) + 1;
      graphNodes.push({
        id: doc.id,
        type,
        scope: doc.metadata.scope || "shared",
        status: doc.metadata.status || "unknown"
      });
      if (Array.isArray(doc.references)) {
        for (const ref of doc.references) {
          if (ref.targetId) {
            graphEdges.push({ source: doc.id, target: ref.targetId, type: ref.type || "related" });
          }
        }
      }
    } catch {
      const fileName = filePath.split("/").pop() || filePath;
      console.warn(`[living-docs] Skipping ${fileName}: invalid JSON or unreadable`);
    }
  }
  for (const filePath of files) {
    processFile(filePath, docsPath);
  }
  for (const extraPath of extraDocsPaths) {
    const extraFiles = walkJsonFiles(extraPath, extraPath);
    for (const filePath of extraFiles) {
      processFile(filePath, extraPath);
    }
  }
  documents.sort((a, b) => a.id.localeCompare(b.id));
  const now = /* @__PURE__ */ new Date();
  const generatedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  return {
    $docSchema: "energimap-doc/v1",
    generatedAt,
    stats: { total: documents.length, byType, byStatus },
    documents,
    graph: { nodes: graphNodes, edges: graphEdges }
  };
}
async function generateDocsIndex(docsPath, extraDocsPaths = []) {
  const index = buildIndex(docsPath, extraDocsPaths);
  const indexPath = (0, import_path.join)(docsPath, "docs-index.json");
  (0, import_fs.writeFileSync)(indexPath, JSON.stringify(index, null, 2));
  return index.documents.length;
}
function createLivingDocsMiddleware(options) {
  const router = (0, import_express.Router)();
  const appDir = (0, import_path.resolve)(currentDir, "../app");
  const includeBundled = options.includeBundledDocs !== false;
  const bundledDocsPath = includeBundled ? getBundledDocsPath() : null;
  const extraPaths = bundledDocsPath ? [bundledDocsPath] : [];
  router.get("/api/docs-index.json", (_req, res) => {
    try {
      const index = buildIndex(options.docsPath, extraPaths);
      res.json(index);
    } catch (e) {
      res.status(500).json({ error: "Falha ao gerar indice", detail: String(e) });
    }
  });
  const DOC_DIRS = /^\/(adr|prd|planning|tasks|guidelines)\//;
  router.get("/api/*", (req, res, next) => {
    const subPath = req.path.replace("/api", "");
    if (!subPath.endsWith(".json") || !DOC_DIRS.test(subPath)) return next();
    let filePath = (0, import_path.join)(options.docsPath, subPath);
    if (!(0, import_fs.existsSync)(filePath) && bundledDocsPath) {
      const bundledFile = (0, import_path.join)(bundledDocsPath, subPath);
      if ((0, import_fs.existsSync)(bundledFile)) {
        filePath = bundledFile;
      }
    }
    try {
      const raw = (0, import_fs.readFileSync)(filePath, "utf-8");
      const doc = JSON.parse(raw);
      if (doc.id && doc.metadata) {
        if (!doc.$docSchema) doc.$docSchema = "energimap-doc/v1";
        if (!doc.type) doc.type = deriveType(subPath.slice(1));
        if (!Array.isArray(doc.sections)) doc.sections = [];
      }
      res.json(doc);
    } catch {
      next();
    }
  });
  router.use("/api", (0, import_express.static)(options.docsPath, { index: false }));
  router.use((0, import_express.static)(appDir, { index: false }));
  const htmlTemplate = (0, import_fs.readFileSync)((0, import_path.join)(appDir, "index.html"), "utf-8");
  router.get("*", (_req, res) => {
    const config = {
      apiUrl: `${options.basePath || ""}/api`,
      theme: options.theme || "light"
    };
    const html = htmlTemplate.replace("<!-- TITLE_PLACEHOLDER -->", escapeHtml(options.title || "Documentacao")).replace(
      "<!-- CONFIG_PLACEHOLDER -->",
      `<script>window.__LIVING_DOCS_CONFIG__ = ${JSON.stringify(config)}</script>`
    );
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
  return router;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createLivingDocsMiddleware,
  generateDocsIndex,
  getBundledDocsPath
});
