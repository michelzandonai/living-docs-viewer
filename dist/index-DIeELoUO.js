import { jsxs as d, jsx as e, Fragment as z } from "react/jsx-runtime";
import { memo as N, useMemo as R } from "react";
import { d as x, H as p, P as u, c as H, B as D, E as T, u as $, D as M, i as W, a as I, C as S } from "./index-BILtfyHN.js";
const f = 180, B = 32, C = 24, b = 80;
function E(r) {
  return r.length === 0 ? b : Math.max(b, B + r.length * C);
}
function O(r, s) {
  var c;
  const a = new x.graphlib.Graph();
  a.setDefaultEdgeLabel(() => ({})), a.setGraph({ rankdir: "LR", nodesep: 100, ranksep: 120 });
  for (const t of r) {
    const i = ((c = t.data) == null ? void 0 : c.fields) ?? [], o = E(i);
    a.setNode(t.id, { width: f, height: o });
  }
  for (const t of s)
    a.setEdge(t.source, t.target);
  x.layout(a);
  const n = r.map((t) => {
    var h;
    const i = ((h = t.data) == null ? void 0 : h.fields) ?? [], o = E(i), l = a.node(t.id);
    return {
      id: t.id,
      type: "entity",
      position: {
        x: ((l == null ? void 0 : l.x) ?? 0) - f / 2,
        y: ((l == null ? void 0 : l.y) ?? 0) - o / 2
      },
      data: {
        label: t.label,
        fields: i
      }
    };
  }), m = s.map((t, i) => ({
    id: `er-e-${i}`,
    source: t.source,
    target: t.target,
    type: "erEdge",
    data: {
      erType: t.edgeType,
      label: t.label
    }
  }));
  return { nodes: n, edges: m };
}
function A({ data: r }) {
  const s = r, a = s.fields ?? [];
  return /* @__PURE__ */ d("div", { className: "rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm min-w-[160px] max-w-[260px] overflow-hidden", children: [
    /* @__PURE__ */ e(
      p,
      {
        type: "target",
        position: u.Left,
        className: "!bg-gray-400 !w-2 !h-2"
      }
    ),
    /* @__PURE__ */ e("div", { className: "px-3 py-2 bg-blue-800 dark:bg-blue-700 text-white text-xs font-semibold text-center truncate", children: s.label }),
    a.length > 0 && /* @__PURE__ */ e("div", { className: "bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 max-h-[200px] overflow-y-auto", children: a.map((n) => /* @__PURE__ */ d(
      "div",
      {
        className: "flex items-center gap-1.5 px-2 py-1 text-[11px]",
        children: [
          n.pk && /* @__PURE__ */ e(
            "span",
            {
              className: "text-amber-500 flex-shrink-0",
              title: "Primary Key",
              children: "🔑"
            }
          ),
          /* @__PURE__ */ e(
            "span",
            {
              className: `font-mono truncate flex-1 ${n.fk ? "underline text-gray-700 dark:text-gray-300" : "text-gray-700 dark:text-gray-300"}`,
              children: n.name
            }
          ),
          n.type && /* @__PURE__ */ e("span", { className: "text-[9px] text-gray-400 dark:text-gray-500 flex-shrink-0 font-mono", children: n.type })
        ]
      },
      n.name
    )) }),
    a.length === 0 && /* @__PURE__ */ e("div", { className: "bg-white dark:bg-gray-800 px-2 py-2 text-[10px] text-gray-400 text-center italic", children: "sem campos" }),
    /* @__PURE__ */ e(
      p,
      {
        type: "source",
        position: u.Right,
        className: "!bg-gray-400 !w-2 !h-2"
      }
    )
  ] });
}
const G = N(A), g = "er-marker-one", k = "er-marker-many";
function L() {
  return /* @__PURE__ */ e("svg", { className: "absolute w-0 h-0", children: /* @__PURE__ */ d("defs", { children: [
    /* @__PURE__ */ d(
      "marker",
      {
        id: g,
        viewBox: "0 0 12 12",
        refX: 10,
        refY: 6,
        markerWidth: 12,
        markerHeight: 12,
        orient: "auto-start-reverse",
        children: [
          /* @__PURE__ */ e(
            "line",
            {
              x1: 6,
              y1: 1,
              x2: 6,
              y2: 11,
              className: "stroke-zinc-400 dark:stroke-zinc-500",
              strokeWidth: 1.5
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: 10,
              y1: 1,
              x2: 10,
              y2: 11,
              className: "stroke-zinc-400 dark:stroke-zinc-500",
              strokeWidth: 1.5
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ d(
      "marker",
      {
        id: k,
        viewBox: "0 0 14 12",
        refX: 12,
        refY: 6,
        markerWidth: 14,
        markerHeight: 12,
        orient: "auto-start-reverse",
        children: [
          /* @__PURE__ */ e(
            "line",
            {
              x1: 2,
              y1: 1,
              x2: 12,
              y2: 6,
              className: "stroke-zinc-400 dark:stroke-zinc-500",
              strokeWidth: 1.5
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: 2,
              y1: 11,
              x2: 12,
              y2: 6,
              className: "stroke-zinc-400 dark:stroke-zinc-500",
              strokeWidth: 1.5
            }
          ),
          /* @__PURE__ */ e(
            "line",
            {
              x1: 2,
              y1: 6,
              x2: 12,
              y2: 6,
              className: "stroke-zinc-400 dark:stroke-zinc-500",
              strokeWidth: 1.5
            }
          )
        ]
      }
    )
  ] }) });
}
function P(r) {
  switch (r) {
    case "one_to_one":
      return {
        markerStart: `url(#${g})`,
        markerEnd: `url(#${g})`
      };
    case "one_to_many":
      return {
        markerStart: `url(#${g})`,
        markerEnd: `url(#${k})`
      };
    case "many_to_many":
      return {
        markerStart: `url(#${k})`,
        markerEnd: `url(#${k})`
      };
    default:
      return {};
  }
}
function Y({
  id: r,
  sourceX: s,
  sourceY: a,
  targetX: n,
  targetY: m,
  sourcePosition: c,
  targetPosition: t,
  data: i
}) {
  const o = i, l = (o == null ? void 0 : o.erType) ?? "one_to_many", h = o == null ? void 0 : o.label, [w, v, _] = H({
    sourceX: s,
    sourceY: a,
    targetX: n,
    targetY: m,
    sourcePosition: c,
    targetPosition: t
  }), y = P(l);
  return /* @__PURE__ */ d(z, { children: [
    /* @__PURE__ */ e(
      D,
      {
        id: r,
        path: w,
        style: { stroke: "#6b7280", strokeWidth: 1.5 },
        className: "dark:[&>path]:!stroke-zinc-400",
        markerStart: y.markerStart,
        markerEnd: y.markerEnd
      }
    ),
    h && /* @__PURE__ */ e(T, { children: /* @__PURE__ */ e(
      "div",
      {
        className: "absolute text-[10px] text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-zinc-800/80 px-1 rounded pointer-events-none",
        style: {
          transform: `translate(-50%, -50%) translate(${v}px, ${_}px)`
        },
        children: h
      }
    ) })
  ] });
}
const K = N(Y), X = {
  entity: G
}, j = {
  erEdge: K
};
function q({
  nodes: r,
  edges: s
}) {
  const { theme: a } = $(), { nodes: n, edges: m } = R(
    () => O(r, s),
    [r, s]
  );
  return n.length === 0 ? null : /* @__PURE__ */ e(M, { title: "ER Diagram", children: ({ isExpanded: c }) => /* @__PURE__ */ d(
    W,
    {
      colorMode: a,
      nodes: n,
      edges: m,
      nodeTypes: X,
      edgeTypes: j,
      fitView: !0,
      fitViewOptions: { padding: 0.2 },
      minZoom: 0.3,
      maxZoom: 4,
      panOnScroll: !0,
      nodesDraggable: !1,
      nodesConnectable: !1,
      proOptions: { hideAttribution: !0 },
      children: [
        /* @__PURE__ */ e(L, {}),
        /* @__PURE__ */ e(I, { gap: 16, size: 1 }),
        /* @__PURE__ */ e(S, { showInteractive: !1 })
      ]
    },
    String(c)
  ) });
}
export {
  q as ERDiagram
};
