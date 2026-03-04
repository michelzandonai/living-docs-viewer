import { jsx as r, jsxs as t } from "react/jsx-runtime";
import { useRef as x, useState as c, useId as b, useEffect as y } from "react";
function k({ diagram: e }) {
  const a = x(null), [l, o] = c(!0), [n, m] = c(null), i = `mermaid_${b().replace(/:/g, "_")}`;
  return y(() => {
    if (!e.mermaid || !a.current) {
      o(!1);
      return;
    }
    let d = !1;
    async function u() {
      try {
        const s = await import("./mermaid.core-y-LLx9fB.js").then((p) => p.bp);
        if (d) return;
        const f = document.documentElement.classList.contains("dark");
        s.default.initialize({
          startOnLoad: !1,
          theme: f ? "dark" : "default",
          securityLevel: "loose"
        });
        const { svg: v } = await s.default.render(i, e.mermaid);
        if (d || !a.current) return;
        a.current.innerHTML = v, o(!1);
      } catch (s) {
        d || (m(s.message ?? "Erro ao renderizar diagrama"), o(!1));
      }
    }
    return u(), () => {
      d = !0;
    };
  }, [e.mermaid, i]), e.mermaid ? /* @__PURE__ */ t("div", { className: "mb-6", children: [
    e.title && /* @__PURE__ */ r("h4", { className: "text-sm font-semibold mb-2", style: { color: "var(--ldv-text)" }, children: e.title }),
    /* @__PURE__ */ t(
      "div",
      {
        className: "p-4 rounded-lg border overflow-x-auto",
        style: { borderColor: "var(--ldv-border)", backgroundColor: "var(--ldv-bg-secondary)" },
        children: [
          l && /* @__PURE__ */ t("div", { className: "flex items-center justify-center py-8", children: [
            /* @__PURE__ */ r(
              "div",
              {
                className: "w-6 h-6 border-2 border-t-transparent rounded-full animate-spin",
                style: { borderColor: "var(--ldv-accent)", borderTopColor: "transparent" }
              }
            ),
            /* @__PURE__ */ r("span", { className: "ml-2 text-sm", style: { color: "var(--ldv-text-secondary)" }, children: "Carregando diagrama..." })
          ] }),
          n && /* @__PURE__ */ t("div", { className: "p-3 rounded border border-red-300 dark:border-red-700", style: { backgroundColor: "rgba(239, 68, 68, 0.1)" }, children: [
            /* @__PURE__ */ t("p", { className: "text-sm text-red-700 dark:text-red-400", children: [
              "Erro ao renderizar diagrama: ",
              n
            ] }),
            /* @__PURE__ */ r("pre", { className: "mt-2 text-xs overflow-x-auto", style: { color: "var(--ldv-text-secondary)" }, children: e.mermaid })
          ] }),
          /* @__PURE__ */ r("div", { ref: a, className: l || n ? "hidden" : "flex justify-center" })
        ]
      }
    )
  ] }) : /* @__PURE__ */ r("p", { className: "text-sm italic", style: { color: "var(--ldv-text-secondary)" }, children: "Nenhum conteudo Mermaid disponivel para este diagrama." });
}
export {
  k as MermaidDiagram
};
