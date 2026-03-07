import { jsxs as d, jsx as t, Fragment as k } from "react/jsx-runtime";
import { memo as p, useMemo as w } from "react";
import { d as u, H as h, P as g, g as x, B as N, E as z, u as v, D as T, i as E, a as S, C as D } from "./index-B3X8tJpT.js";
const c = {
  state: { width: 150, height: 50 },
  initial: { width: 24, height: 24 },
  final: { width: 28, height: 28 }
};
function C(a, o) {
  const n = new u.graphlib.Graph();
  n.setDefaultEdgeLabel(() => ({})), n.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 100 });
  for (const e of a) {
    const r = c[e.nodeType] ?? c.state;
    n.setNode(e.id, { width: r.width, height: r.height });
  }
  for (const e of o)
    n.setEdge(e.source, e.target);
  u.layout(n);
  const s = a.map((e) => {
    const r = c[e.nodeType] ?? c.state, i = n.node(e.id);
    return {
      id: e.id,
      type: e.nodeType,
      position: {
        x: ((i == null ? void 0 : i.x) ?? 0) - r.width / 2,
        y: ((i == null ? void 0 : i.y) ?? 0) - r.height / 2
      },
      data: {
        label: e.label,
        ...e.data
      }
    };
  }), l = o.map((e, r) => ({
    id: `st-e-${r}`,
    source: e.source,
    target: e.target,
    type: "transitionEdge",
    data: {
      label: e.label
    }
  }));
  return { nodes: s, edges: l };
}
function B({ data: a }) {
  return /* @__PURE__ */ d("div", { className: "px-4 py-2 rounded-lg border border-violet-300 bg-violet-50 dark:bg-violet-950 dark:border-violet-700 text-xs text-center min-w-[120px]", children: [
    /* @__PURE__ */ t(
      h,
      {
        type: "target",
        position: g.Top,
        className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      }
    ),
    /* @__PURE__ */ t("span", { className: "text-violet-900 dark:text-violet-100", children: a.label }),
    /* @__PURE__ */ t(
      h,
      {
        type: "source",
        position: g.Bottom,
        className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      }
    )
  ] });
}
const j = p(B);
function F() {
  return /* @__PURE__ */ d(
    "div",
    {
      className: "flex items-center justify-center",
      style: { width: 24, height: 24 },
      children: [
        /* @__PURE__ */ t("div", { className: "w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100" }),
        /* @__PURE__ */ t(
          h,
          {
            type: "source",
            position: g.Bottom,
            className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
          }
        )
      ]
    }
  );
}
const O = p(F);
function P() {
  return /* @__PURE__ */ d(
    "div",
    {
      className: "flex items-center justify-center",
      style: { width: 28, height: 28 },
      children: [
        /* @__PURE__ */ t(
          h,
          {
            type: "target",
            position: g.Top,
            className: "!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
          }
        ),
        /* @__PURE__ */ t("div", { className: "w-6 h-6 rounded-full border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center", children: /* @__PURE__ */ t("div", { className: "w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-zinc-100" }) })
      ]
    }
  );
}
const H = p(P);
function I({
  id: a,
  sourceX: o,
  sourceY: n,
  targetX: s,
  targetY: l,
  sourcePosition: e,
  targetPosition: r,
  data: i
}) {
  const [b, f, y] = x({
    sourceX: o,
    sourceY: n,
    targetX: s,
    targetY: l,
    sourcePosition: e,
    targetPosition: r
  }), m = i == null ? void 0 : i.label;
  return /* @__PURE__ */ d(k, { children: [
    /* @__PURE__ */ t(
      N,
      {
        id: a,
        path: b,
        style: { stroke: "#6b7280", strokeWidth: 1.5 },
        className: "dark:[&>path]:!stroke-zinc-400",
        markerEnd: "url(#arrowhead)"
      }
    ),
    m && /* @__PURE__ */ t(z, { children: /* @__PURE__ */ t(
      "div",
      {
        className: "absolute text-[10px] text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded pointer-events-none",
        style: {
          transform: `translate(-50%, -50%) translate(${f}px, ${y}px)`
        },
        children: m
      }
    ) })
  ] });
}
const L = p(I), $ = {
  state: j,
  initial: O,
  final: H
}, A = {
  transitionEdge: L
};
function W({
  nodes: a,
  edges: o
}) {
  const { theme: n } = v(), { nodes: s, edges: l } = w(
    () => C(a, o),
    [a, o]
  );
  return s.length === 0 ? null : /* @__PURE__ */ t(T, { title: "State Diagram", children: ({ isExpanded: e }) => /* @__PURE__ */ d(
    E,
    {
      colorMode: n,
      nodes: s,
      edges: l,
      nodeTypes: $,
      edgeTypes: A,
      fitView: !0,
      fitViewOptions: { padding: 0.2 },
      minZoom: 0.3,
      maxZoom: 4,
      panOnScroll: !0,
      nodesDraggable: !1,
      nodesConnectable: !1,
      proOptions: { hideAttribution: !0 },
      children: [
        /* @__PURE__ */ t("svg", { className: "absolute w-0 h-0", children: /* @__PURE__ */ t("defs", { children: /* @__PURE__ */ t(
          "marker",
          {
            id: "arrowhead",
            markerWidth: "10",
            markerHeight: "7",
            refX: "10",
            refY: "3.5",
            orient: "auto",
            children: /* @__PURE__ */ t(
              "polygon",
              {
                points: "0 0, 10 3.5, 0 7",
                className: "fill-zinc-700 dark:fill-zinc-300"
              }
            )
          }
        ) }) }),
        /* @__PURE__ */ t(S, { gap: 16, size: 1 }),
        /* @__PURE__ */ t(D, { showInteractive: !1 })
      ]
    },
    String(e)
  ) });
}
export {
  W as StateDiagram
};
