import { jsxs as d, jsx as e, Fragment as N } from "react/jsx-runtime";
import { memo as p, useMemo as z } from "react";
import { d as u, H as a, P as i, g as T, B as v, E as D, u as E, D as C, i as S, a as B, C as F } from "./index-BILtfyHN.js";
const h = {
  process: { width: 150, height: 40 },
  decision: { width: 100, height: 100 },
  terminal: { width: 140, height: 40 },
  subprocess: { width: 150, height: 40 }
};
function O(r, l) {
  const n = new u.graphlib.Graph();
  n.setDefaultEdgeLabel(() => ({})), n.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 });
  for (const t of r) {
    const s = h[t.nodeType] ?? h.process;
    n.setNode(t.id, { width: s.width, height: s.height });
  }
  for (const t of l)
    n.setEdge(t.source, t.target);
  u.layout(n);
  const c = r.map((t) => {
    const s = h[t.nodeType] ?? h.process, o = n.node(t.id);
    return {
      id: t.id,
      type: t.nodeType,
      position: {
        x: ((o == null ? void 0 : o.x) ?? 0) - s.width / 2,
        y: ((o == null ? void 0 : o.y) ?? 0) - s.height / 2
      },
      data: {
        label: t.label,
        ...t.data
      }
    };
  }), g = l.map((t, s) => ({
    id: `fc-e-${s}`,
    source: t.source,
    target: t.target,
    type: "flowchartEdge",
    data: {
      edgeType: t.edgeType,
      label: t.label
    }
  }));
  return { nodes: c, edges: g };
}
function P({ data: r }) {
  return /* @__PURE__ */ d("div", { className: "px-4 py-2 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700 text-xs text-center min-w-[120px]", children: [
    /* @__PURE__ */ e(
      a,
      {
        type: "target",
        position: i.Top,
        className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      }
    ),
    /* @__PURE__ */ e("span", { className: "text-blue-900 dark:text-blue-100", children: r.label }),
    /* @__PURE__ */ e(
      a,
      {
        type: "source",
        position: i.Bottom,
        className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      }
    )
  ] });
}
const L = p(P);
function j({ data: r }) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: "relative flex items-center justify-center",
      style: { width: 100, height: 100 },
      children: [
        /* @__PURE__ */ e(
          a,
          {
            type: "target",
            position: i.Top,
            className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2",
            style: { top: -4 }
          }
        ),
        /* @__PURE__ */ e(
          "div",
          {
            className: "absolute inset-0 rounded border border-yellow-400 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-600",
            style: { transform: "rotate(45deg)" }
          }
        ),
        /* @__PURE__ */ e("span", { className: "relative z-10 text-xs text-center text-yellow-900 dark:text-yellow-100 max-w-[70px] leading-tight", children: r.label }),
        /* @__PURE__ */ e(
          a,
          {
            type: "source",
            position: i.Bottom,
            className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2",
            style: { bottom: -4 }
          }
        )
      ]
    }
  );
}
const G = p(j);
function H({ data: r }) {
  return /* @__PURE__ */ d("div", { className: "px-4 py-2 rounded-full border border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-700 text-xs text-center min-w-[120px]", children: [
    /* @__PURE__ */ e(
      a,
      {
        type: "target",
        position: i.Top,
        className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      }
    ),
    /* @__PURE__ */ e("span", { className: "text-green-900 dark:text-green-100", children: r.label }),
    /* @__PURE__ */ e(
      a,
      {
        type: "source",
        position: i.Bottom,
        className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      }
    )
  ] });
}
const $ = p(H);
function A({ data: r }) {
  return /* @__PURE__ */ d(
    "div",
    {
      className: "px-4 py-2 rounded border border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-xs text-center min-w-[120px]",
      style: { boxShadow: "inset 0 0 0 3px var(--subprocess-inset, #9ca3af)" },
      children: [
        /* @__PURE__ */ e(
          a,
          {
            type: "target",
            position: i.Top,
            className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
          }
        ),
        /* @__PURE__ */ e("span", { className: "text-gray-900 dark:text-gray-100", children: r.label }),
        /* @__PURE__ */ e(
          a,
          {
            type: "source",
            position: i.Bottom,
            className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
          }
        )
      ]
    }
  );
}
const M = p(A), y = {
  flow: "#6b7280",
  conditional: "#f97316"
};
function R({
  id: r,
  sourceX: l,
  sourceY: n,
  targetX: c,
  targetY: g,
  sourcePosition: t,
  targetPosition: s,
  data: o
}) {
  const [w, x, f] = T({
    sourceX: l,
    sourceY: n,
    targetX: c,
    targetY: g,
    sourcePosition: t,
    targetPosition: s
  }), b = (o == null ? void 0 : o.edgeType) ?? "flow", k = y[b] ?? y.flow, m = o == null ? void 0 : o.label;
  return /* @__PURE__ */ d(N, { children: [
    /* @__PURE__ */ e(
      v,
      {
        id: r,
        path: w,
        style: {
          stroke: k,
          strokeWidth: 1.5,
          strokeDasharray: b === "conditional" ? "5 3" : void 0
        },
        className: b === "conditional" ? "dark:[&>path]:!stroke-orange-400" : "dark:[&>path]:!stroke-zinc-400",
        markerEnd: "url(#arrowhead)"
      }
    ),
    m && /* @__PURE__ */ e(D, { children: /* @__PURE__ */ e(
      "div",
      {
        className: "absolute text-[10px] text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-zinc-800/80 px-1 rounded pointer-events-none",
        style: {
          transform: `translate(-50%, -50%) translate(${x}px, ${f}px)`
        },
        children: m
      }
    ) })
  ] });
}
const V = p(R), W = {
  process: L,
  decision: G,
  terminal: $,
  subprocess: M
}, X = {
  flowchartEdge: V
};
function I({
  nodes: r,
  edges: l
}) {
  const { theme: n } = E(), { nodes: c, edges: g } = z(
    () => O(r, l),
    [r, l]
  );
  return c.length === 0 ? null : /* @__PURE__ */ e(C, { title: "Flowchart", children: ({ isExpanded: t }) => /* @__PURE__ */ d(
    S,
    {
      colorMode: n,
      nodes: c,
      edges: g,
      nodeTypes: W,
      edgeTypes: X,
      fitView: !0,
      fitViewOptions: { padding: 0.2 },
      minZoom: 0.3,
      maxZoom: 4,
      panOnScroll: !0,
      nodesDraggable: !1,
      nodesConnectable: !1,
      proOptions: { hideAttribution: !0 },
      children: [
        /* @__PURE__ */ e("svg", { className: "absolute w-0 h-0", children: /* @__PURE__ */ e("defs", { children: /* @__PURE__ */ e(
          "marker",
          {
            id: "arrowhead",
            markerWidth: "10",
            markerHeight: "7",
            refX: "10",
            refY: "3.5",
            orient: "auto",
            children: /* @__PURE__ */ e(
              "polygon",
              {
                points: "0 0, 10 3.5, 0 7",
                className: "fill-zinc-700 dark:fill-zinc-300"
              }
            )
          }
        ) }) }),
        /* @__PURE__ */ e(B, { gap: 16, size: 1 }),
        /* @__PURE__ */ e(F, { showInteractive: !1 })
      ]
    },
    String(t)
  ) });
}
export {
  I as FlowchartDiagram
};
