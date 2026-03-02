import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

const EDGE_COLORS: Record<string, string> = {
  references: '#6b7280',
  depends_on: '#3b82f6',
  supersedes: '#ef4444',
  superseded_by: '#ef4444',
  implements: '#8b5cf6',
  related: '#6b7280',
};

function DocEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const color = EDGE_COLORS[label as string] ?? '#6b7280';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: color, strokeWidth: 1.5 }}
        className="dark:[&>path]:!stroke-zinc-400"
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="absolute text-[10px] text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-zinc-800/80 px-1 rounded pointer-events-none"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label as string}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const DocEdge = memo(DocEdgeComponent);
