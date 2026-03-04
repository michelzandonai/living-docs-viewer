// src/server/middleware.ts
import { Router, static as expressStatic } from "express";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, join, dirname, relative, extname } from "path";
import { fileURLToPath } from "url";
function getCurrentDirname() {
  try {
    if (typeof import.meta?.url === "string") {
      return dirname(fileURLToPath(import.meta.url));
    }
  } catch {
  }
  return __dirname;
}
var currentDir = getCurrentDirname();
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
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const name = String(entry.name);
    if (name.startsWith(".") || SKIP_DIRS.has(name)) continue;
    const fullPath = join(dir, name);
    if (entry.isDirectory()) {
      results.push(...walkJsonFiles(fullPath, root));
    } else if (entry.isFile() && extname(name) === ".json" && !SKIP_FILES.has(name)) {
      results.push(fullPath);
    }
  }
  return results;
}
function buildIndex(docsPath) {
  const files = walkJsonFiles(docsPath, docsPath);
  const documents = [];
  const graphNodes = [];
  const graphEdges = [];
  const byType = {};
  const byStatus = {};
  for (const filePath of files) {
    try {
      const raw = readFileSync(filePath, "utf-8");
      const doc = JSON.parse(raw);
      if (!doc.id || !doc.metadata) continue;
      const relPath = relative(docsPath, filePath);
      const type = doc.type || deriveType(relPath) || "unknown";
      const stat = statSync(filePath);
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
async function generateDocsIndex(docsPath) {
  const index = buildIndex(docsPath);
  const indexPath = join(docsPath, "docs-index.json");
  writeFileSync(indexPath, JSON.stringify(index, null, 2));
  return index.documents.length;
}
function createLivingDocsMiddleware(options) {
  const router = Router();
  const appDir = resolve(currentDir, "../app");
  router.get("/api/docs-index.json", (_req, res) => {
    try {
      const index = buildIndex(options.docsPath);
      res.json(index);
    } catch (e) {
      res.status(500).json({ error: "Falha ao gerar indice", detail: String(e) });
    }
  });
  const DOC_DIRS = /^\/(adr|prd|planning|tasks|guidelines)\//;
  router.get("/api/*", (req, res, next) => {
    const subPath = req.path.replace("/api", "");
    if (!subPath.endsWith(".json") || !DOC_DIRS.test(subPath)) return next();
    const filePath = join(options.docsPath, subPath);
    try {
      const raw = readFileSync(filePath, "utf-8");
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
  router.use("/api", expressStatic(options.docsPath, { index: false }));
  router.use(expressStatic(appDir, { index: false }));
  const htmlTemplate = readFileSync(join(appDir, "index.html"), "utf-8");
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
export {
  createLivingDocsMiddleware,
  generateDocsIndex
};
