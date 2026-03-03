import { jsx as n, jsxs as f, Fragment as $ } from "react/jsx-runtime";
import { memo as _, useMemo as R } from "react";
import { H as v, P as S, B as Y, E as W, b as C, u as B, D as O, i as L, a as G, C as j } from "./index-BILtfyHN.js";
const F = 200, E = 60, q = 0, M = 120, p = 20, D = 80;
function K(o, r) {
  const l = o.filter((g) => g.nodeType === "actor"), t = o.filter((g) => g.nodeType === "message_bar"), a = o.filter((g) => g.nodeType === "sequence_block"), s = /* @__PURE__ */ new Map();
  return l.forEach((g, c) => {
    s.set(g.id, { x: c * F, y: q });
  }), t.length === 0 ? V(l, a, r, s) : Z(
    l,
    t,
    a,
    r,
    s
  );
}
function V(o, r, l, t) {
  const a = l.filter(
    (c) => c.edgeType === "sync_message" || c.edgeType === "return"
  ), s = [], g = (a.length > 0 ? M + (a.length - 1) * E + 40 : M) - q - D + 40;
  for (const c of o) {
    const d = t.get(c.id);
    s.push({
      id: c.id,
      type: "actor",
      position: { x: d.x - 20, y: d.y },
      data: {
        label: c.label,
        lifelineHeight: Math.max(g, 0),
        ...c.data
      }
    });
  }
  return a.forEach((c, d) => {
    const k = t.get(c.source), x = t.get(c.target);
    if (!k || !x) return;
    const w = M + d * E, z = Math.min(k.x, x.x), A = Math.max(k.x, x.x) - z, e = z;
    s.push({
      id: `synth-msg-${d}`,
      type: "message_bar",
      position: { x: e - 20, y: w },
      data: {
        label: c.label ?? "",
        sourceActorId: c.source,
        targetActorId: c.target,
        isReturn: c.edgeType === "return",
        barWidth: Math.max(A, 100)
      }
    });
  }), J(r, a, t, s), { nodes: s, edges: [] };
}
function Z(o, r, l, t, a) {
  var x, w, z, I, A;
  const s = t.filter(
    (e) => e.edgeType === "sync_message" || e.edgeType === "return"
  ), i = /* @__PURE__ */ new Map();
  r.forEach((e, h) => {
    const b = M + h * E, y = s.find(
      (u) => {
        var m, N;
        return ((m = e.data) == null ? void 0 : m.sourceActor) === u.source && ((N = e.data) == null ? void 0 : N.targetActor) === u.target;
      }
    ) ?? s[h];
    if (y) {
      const u = a.get(y.source), m = a.get(y.target);
      if (u && m) {
        const N = Math.min(u.x, m.x), X = Math.max(u.x, m.x) - N, T = N;
        i.set(e.id, { x: T, y: b }), e.data = {
          ...e.data,
          sourceActorId: y.source,
          targetActorId: y.target,
          isReturn: y.edgeType === "return",
          barWidth: Math.max(X, 100)
        };
      }
    }
    i.has(e.id) || i.set(e.id, { x: 0, y: b });
  });
  const c = (r.length > 0 ? M + (r.length - 1) * E + 40 : M) - q - D + 40, d = [];
  for (const e of o) {
    const h = a.get(e.id);
    d.push({
      id: e.id,
      type: "actor",
      position: { x: h.x - 20, y: h.y },
      data: {
        label: e.label,
        lifelineHeight: Math.max(c, 0),
        ...e.data
      }
    });
  }
  for (const e of r) {
    const h = i.get(e.id);
    d.push({
      id: e.id,
      type: "message_bar",
      position: { x: h.x - 20, y: h.y },
      data: { label: e.label, ...e.data }
    });
  }
  const k = /* @__PURE__ */ new Map();
  r.forEach((e) => {
    const h = i.get(e.id);
    h && k.set(e.id, h);
  });
  for (const e of l) {
    const h = ((x = e.data) == null ? void 0 : x.containedMessages) ?? [];
    if (h.length === 0) {
      d.push({
        id: e.id,
        type: "sequence_block",
        position: { x: 0, y: M - p },
        data: {
          label: e.label,
          blockType: ((w = e.data) == null ? void 0 : w.blockType) ?? "alt",
          condition: (z = e.data) == null ? void 0 : z.condition,
          width: 300,
          height: 120
        },
        zIndex: -1
      });
      continue;
    }
    let b = 1 / 0, y = -1 / 0, u = 1 / 0, m = -1 / 0;
    for (const X of h) {
      const T = k.get(X);
      T && (b = Math.min(b, T.x), y = Math.max(y, T.x + 200), u = Math.min(u, T.y), m = Math.max(m, T.y + 30));
    }
    const N = y - b + p * 2, H = m - u + p * 2;
    d.push({
      id: e.id,
      type: "sequence_block",
      position: {
        x: b - p,
        y: u - p
      },
      data: {
        label: e.label,
        blockType: ((I = e.data) == null ? void 0 : I.blockType) ?? "alt",
        condition: (A = e.data) == null ? void 0 : A.condition,
        width: N,
        height: H
      },
      zIndex: -1
    });
  }
  return { nodes: d, edges: [] };
}
function J(o, r, l, t) {
  var a, s, i, g, c;
  for (const d of o) {
    const k = ((a = d.data) == null ? void 0 : a.containedMessages) ?? [];
    if (k.length === 0) {
      const e = Array.from(l.values()).map((y) => y.x), h = Math.min(...e), b = Math.max(...e);
      t.push({
        id: d.id,
        type: "sequence_block",
        position: {
          x: h - p - 20,
          y: M - p
        },
        data: {
          label: d.label,
          blockType: ((s = d.data) == null ? void 0 : s.blockType) ?? "alt",
          condition: (i = d.data) == null ? void 0 : i.condition,
          width: b - h + p * 2 + 40,
          height: r.length * E + p * 2
        },
        zIndex: -1
      });
      continue;
    }
    let x = 1 / 0, w = -1 / 0;
    for (const e of k) {
      const h = parseInt(e, 10);
      if (!isNaN(h) && h < r.length) {
        const b = M + h * E;
        x = Math.min(x, b), w = Math.max(w, b + 30);
      }
    }
    if (x === 1 / 0) continue;
    const z = Array.from(l.values()).map((e) => e.x), I = Math.min(...z), A = Math.max(...z);
    t.push({
      id: d.id,
      type: "sequence_block",
      position: {
        x: I - p - 20,
        y: x - p
      },
      data: {
        label: d.label,
        blockType: ((g = d.data) == null ? void 0 : g.blockType) ?? "alt",
        condition: (c = d.data) == null ? void 0 : c.condition,
        width: A - I + p * 2 + 40,
        height: w - x + p * 2
      },
      zIndex: -1
    });
  }
}
function Q({ data: o }) {
  const r = o.lifelineHeight ?? 0;
  return /* @__PURE__ */ f("div", { className: "flex flex-col items-center gap-1 relative", children: [
    /* @__PURE__ */ n(
      v,
      {
        type: "target",
        position: S.Top,
        className: "!bg-transparent !border-none !w-0 !h-0"
      }
    ),
    /* @__PURE__ */ f(
      "svg",
      {
        width: "40",
        height: "50",
        viewBox: "0 0 40 50",
        className: "text-zinc-700 dark:text-zinc-300",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
          /* @__PURE__ */ n("circle", { cx: "20", cy: "10", r: "8" }),
          /* @__PURE__ */ n("line", { x1: "20", y1: "18", x2: "20", y2: "34" }),
          /* @__PURE__ */ n("line", { x1: "8", y1: "26", x2: "32", y2: "26" }),
          /* @__PURE__ */ n("line", { x1: "20", y1: "34", x2: "10", y2: "48" }),
          /* @__PURE__ */ n("line", { x1: "20", y1: "34", x2: "30", y2: "48" })
        ]
      }
    ),
    /* @__PURE__ */ n("span", { className: "text-xs font-medium text-zinc-800 dark:text-zinc-200 text-center max-w-[120px] leading-tight", children: o.label }),
    /* @__PURE__ */ n(
      v,
      {
        type: "source",
        position: S.Bottom,
        className: "!bg-transparent !border-none !w-0 !h-0"
      }
    ),
    r > 0 && /* @__PURE__ */ n(
      "div",
      {
        className: "absolute left-1/2 -translate-x-1/2 border-l-2 border-dashed border-zinc-300 dark:border-zinc-600",
        style: {
          top: "100%",
          height: r
        }
      }
    )
  ] });
}
const U = _(Q);
function ee({ data: o }) {
  const r = o.label ?? "", l = o.isReturn ?? !1, t = o.barWidth ?? 200;
  o.sourceActorId, o.targetActorId;
  const a = 8, s = 30, i = s / 2 + 6;
  return /* @__PURE__ */ f("div", { className: "relative", style: { width: t + 40 }, children: [
    /* @__PURE__ */ n("div", { className: "text-[11px] text-zinc-700 dark:text-zinc-300 text-center whitespace-nowrap mb-0.5 px-1", children: r }),
    /* @__PURE__ */ n("svg", { width: t + 40, height: s, className: "block", children: l ? /* @__PURE__ */ f($, { children: [
      /* @__PURE__ */ n(
        "line",
        {
          x1: 20,
          y1: i,
          x2: t + 20,
          y2: i,
          className: "stroke-zinc-400 dark:stroke-zinc-500",
          strokeWidth: 1.5,
          strokeDasharray: "6 3"
        }
      ),
      /* @__PURE__ */ n(
        "polygon",
        {
          points: `${20 + a},${i - a / 2} 20,${i} ${20 + a},${i + a / 2}`,
          className: "fill-zinc-400 dark:fill-zinc-500"
        }
      )
    ] }) : /* @__PURE__ */ f($, { children: [
      /* @__PURE__ */ n(
        "line",
        {
          x1: 20,
          y1: i,
          x2: t + 20,
          y2: i,
          className: "stroke-zinc-700 dark:stroke-zinc-300",
          strokeWidth: 1.5
        }
      ),
      /* @__PURE__ */ n(
        "polygon",
        {
          points: `${t + 20 - a},${i - a / 2} ${t + 20},${i} ${t + 20 - a},${i + a / 2}`,
          className: "fill-zinc-700 dark:fill-zinc-300"
        }
      )
    ] }) }),
    /* @__PURE__ */ n(
      v,
      {
        type: "target",
        position: S.Left,
        className: "!bg-transparent !border-none !w-0 !h-0"
      }
    ),
    /* @__PURE__ */ n(
      v,
      {
        type: "source",
        position: S.Right,
        className: "!bg-transparent !border-none !w-0 !h-0"
      }
    )
  ] });
}
const te = _(ee), P = {
  alt: {
    bg: "bg-blue-50/50 dark:bg-blue-950/30",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300"
  },
  loop: {
    bg: "bg-green-50/50 dark:bg-green-950/30",
    border: "border-green-300 dark:border-green-700",
    text: "text-green-700 dark:text-green-300"
  },
  opt: {
    bg: "bg-yellow-50/50 dark:bg-yellow-950/30",
    border: "border-yellow-300 dark:border-yellow-700",
    text: "text-yellow-700 dark:text-yellow-300"
  }
};
function ne({ data: o }) {
  const r = o.blockType ?? "alt", l = o.condition, t = P[r] ?? P.alt;
  return /* @__PURE__ */ n(
    "div",
    {
      className: `rounded border-2 border-dashed ${t.bg} ${t.border} p-2`,
      style: {
        width: o.width ?? 300,
        height: o.height ?? 120
      },
      children: /* @__PURE__ */ f("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ n("span", { className: `text-[10px] font-bold uppercase ${t.text}`, children: r }),
        l && /* @__PURE__ */ f("span", { className: `text-[10px] ${t.text}`, children: [
          "[",
          l,
          "]"
        ] })
      ] })
    }
  );
}
const oe = _(ne);
function ae({
  id: o,
  sourceX: r,
  sourceY: l,
  targetX: t,
  targetY: a,
  label: s
}) {
  const [i, g, c] = C({
    sourceX: r,
    sourceY: l,
    targetX: t,
    targetY: a
  });
  return /* @__PURE__ */ f($, { children: [
    /* @__PURE__ */ n(
      Y,
      {
        id: o,
        path: i,
        style: { stroke: "#374151", strokeWidth: 1.5 },
        className: "dark:[&>path]:!stroke-zinc-300",
        markerEnd: "url(#seq-arrowhead)"
      }
    ),
    s && /* @__PURE__ */ n(W, { children: /* @__PURE__ */ n(
      "div",
      {
        className: "absolute text-[10px] text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-1 rounded pointer-events-none",
        style: {
          transform: `translate(-50%, -100%) translate(${g}px, ${c - 4}px)`
        },
        children: s
      }
    ) })
  ] });
}
const re = _(ae);
function se({
  id: o,
  sourceX: r,
  sourceY: l,
  targetX: t,
  targetY: a,
  label: s
}) {
  const [i, g, c] = C({
    sourceX: r,
    sourceY: l,
    targetX: t,
    targetY: a
  });
  return /* @__PURE__ */ f($, { children: [
    /* @__PURE__ */ n(
      Y,
      {
        id: o,
        path: i,
        style: {
          stroke: "#9ca3af",
          strokeWidth: 1.5,
          strokeDasharray: "6 3"
        },
        className: "dark:[&>path]:!stroke-zinc-500",
        markerEnd: "url(#seq-arrowhead-gray)"
      }
    ),
    s && /* @__PURE__ */ n(W, { children: /* @__PURE__ */ n(
      "div",
      {
        className: "absolute text-[10px] text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-1 rounded pointer-events-none",
        style: {
          transform: `translate(-50%, -100%) translate(${g}px, ${c - 4}px)`
        },
        children: s
      }
    ) })
  ] });
}
const ie = _(se);
function ce({
  id: o,
  sourceX: r,
  sourceY: l,
  targetX: t,
  targetY: a
}) {
  const [s] = C({
    sourceX: r,
    sourceY: l,
    targetX: t,
    targetY: a
  });
  return /* @__PURE__ */ n(
    Y,
    {
      id: o,
      path: s,
      style: {
        stroke: "#d1d5db",
        strokeWidth: 1,
        strokeDasharray: "4 4"
      },
      className: "dark:[&>path]:!stroke-zinc-600"
    }
  );
}
const le = _(ce), de = {
  actor: U,
  message_bar: te,
  sequence_block: oe
}, he = {
  syncMessageEdge: re,
  returnEdge: ie,
  lifelineEdge: le
};
function be({
  nodes: o,
  edges: r
}) {
  const { theme: l } = B(), { nodes: t, edges: a } = R(
    () => K(o, r),
    [o, r]
  );
  return t.length === 0 ? null : /* @__PURE__ */ n(O, { title: "Sequence Diagram", children: ({ isExpanded: s }) => /* @__PURE__ */ f(
    L,
    {
      colorMode: l,
      nodes: t,
      edges: a,
      nodeTypes: de,
      edgeTypes: he,
      fitView: !0,
      fitViewOptions: { padding: 0.2 },
      minZoom: 0.3,
      maxZoom: 4,
      panOnScroll: !0,
      nodesDraggable: !1,
      nodesConnectable: !1,
      proOptions: { hideAttribution: !0 },
      children: [
        /* @__PURE__ */ n(G, { gap: 16, size: 1 }),
        /* @__PURE__ */ n(j, { showInteractive: !1 }),
        /* @__PURE__ */ n("svg", { children: /* @__PURE__ */ f("defs", { children: [
          /* @__PURE__ */ n(
            "marker",
            {
              id: "seq-arrowhead",
              markerWidth: "10",
              markerHeight: "7",
              refX: "10",
              refY: "3.5",
              orient: "auto",
              children: /* @__PURE__ */ n(
                "polygon",
                {
                  points: "0 0, 10 3.5, 0 7",
                  className: "fill-zinc-700 dark:fill-zinc-300"
                }
              )
            }
          ),
          /* @__PURE__ */ n(
            "marker",
            {
              id: "seq-arrowhead-gray",
              markerWidth: "10",
              markerHeight: "7",
              refX: "10",
              refY: "3.5",
              orient: "auto",
              children: /* @__PURE__ */ n(
                "polygon",
                {
                  points: "0 0, 10 3.5, 0 7",
                  className: "fill-zinc-400 dark:fill-zinc-500"
                }
              )
            }
          )
        ] }) })
      ]
    },
    String(s)
  ) });
}
export {
  be as SequenceDiagram
};
