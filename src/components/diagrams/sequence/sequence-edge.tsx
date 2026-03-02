import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react';

// --- Sync Message Edge: solid arrow (kept for parser mode backwards compat) ---

function SyncMessageEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: '#374151', strokeWidth: 1.5 }}
        className="dark:[&>path]:!stroke-zinc-300"
        markerEnd="url(#seq-arrowhead)"
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-1 rounded pointer-events-none"
            style={{
              transform: `translate(-50%, -100%) translate(${labelX}px, ${labelY - 4}px)`,
            }}
          >
            {label as string}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const SyncMessageEdge = memo(SyncMessageEdgeComponent);

// --- Return Edge: dashed arrow (kept for parser mode backwards compat) ---

function ReturnEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#9ca3af',
          strokeWidth: 1.5,
          strokeDasharray: '6 3',
        }}
        className="dark:[&>path]:!stroke-zinc-500"
        markerEnd="url(#seq-arrowhead-gray)"
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-1 rounded pointer-events-none"
            style={{
              transform: `translate(-50%, -100%) translate(${labelX}px, ${labelY - 4}px)`,
            }}
          >
            {label as string}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const ReturnEdge = memo(ReturnEdgeComponent);

// --- Lifeline Edge: vertical dashed line (kept for backwards compat, not used in new layout) ---

function LifelineEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: '#d1d5db',
        strokeWidth: 1,
        strokeDasharray: '4 4',
      }}
      className="dark:[&>path]:!stroke-zinc-600"
    />
  );
}

export const LifelineEdge = memo(LifelineEdgeComponent);
