import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import type { EREdgeType } from '@/lib/types';

export interface EREdgeData extends Record<string, unknown> {
  erType: EREdgeType;
  label?: string;
}

/** SVG marker IDs */
const MARKER_ONE = 'er-marker-one';
const MARKER_MANY = 'er-marker-many';

/**
 * SVG defs for crow's foot notation markers.
 * Must be rendered once inside the ReactFlow container.
 */
export function ERMarkerDefs() {
  return (
    <svg className="absolute w-0 h-0">
      <defs>
        {/* "One" marker: two parallel lines (||) */}
        <marker
          id={MARKER_ONE}
          viewBox="0 0 12 12"
          refX={10}
          refY={6}
          markerWidth={12}
          markerHeight={12}
          orient="auto-start-reverse"
        >
          <line
            x1={6}
            y1={1}
            x2={6}
            y2={11}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1.5}
          />
          <line
            x1={10}
            y1={1}
            x2={10}
            y2={11}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1.5}
          />
        </marker>

        {/* "Many" marker: crow's foot (three lines fanning out) */}
        <marker
          id={MARKER_MANY}
          viewBox="0 0 14 12"
          refX={12}
          refY={6}
          markerWidth={14}
          markerHeight={12}
          orient="auto-start-reverse"
        >
          <line
            x1={2}
            y1={1}
            x2={12}
            y2={6}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1.5}
          />
          <line
            x1={2}
            y1={11}
            x2={12}
            y2={6}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1.5}
          />
          <line
            x1={2}
            y1={6}
            x2={12}
            y2={6}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1.5}
          />
        </marker>
      </defs>
    </svg>
  );
}

function getMarkers(erType: EREdgeType): {
  markerStart?: string;
  markerEnd?: string;
} {
  switch (erType) {
    case 'one_to_one':
      return {
        markerStart: `url(#${MARKER_ONE})`,
        markerEnd: `url(#${MARKER_ONE})`,
      };
    case 'one_to_many':
      return {
        markerStart: `url(#${MARKER_ONE})`,
        markerEnd: `url(#${MARKER_MANY})`,
      };
    case 'many_to_many':
      return {
        markerStart: `url(#${MARKER_MANY})`,
        markerEnd: `url(#${MARKER_MANY})`,
      };
    default:
      return {};
  }
}

function EREdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data as unknown as EREdgeData;
  const erType = edgeData?.erType ?? 'one_to_many';
  const label = edgeData?.label;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const markers = getMarkers(erType);

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: '#6b7280', strokeWidth: 1.5 }}
        className="dark:[&>path]:!stroke-zinc-400"
        markerStart={markers.markerStart}
        markerEnd={markers.markerEnd}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-zinc-800/80 px-1 rounded pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const EREdge = memo(EREdgeComponent);
