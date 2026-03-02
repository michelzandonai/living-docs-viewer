import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

const EDGE_COLORS: Record<string, string> = {
  flow: '#6b7280',
  conditional: '#f97316',
};

function FlowchartEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeType = (data?.edgeType as string) ?? 'flow';
  const color = EDGE_COLORS[edgeType] ?? EDGE_COLORS.flow;
  const label = data?.label as string | undefined;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: 1.5,
          strokeDasharray: edgeType === 'conditional' ? '5 3' : undefined,
        }}
        className={
          edgeType === 'conditional'
            ? 'dark:[&>path]:!stroke-orange-400'
            : 'dark:[&>path]:!stroke-zinc-400'
        }
        markerEnd="url(#arrowhead)"
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

export const FlowchartEdge = memo(FlowchartEdgeComponent);
