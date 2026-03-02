import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { DocNodeData } from '@/lib/build-graph';

const STATUS_BG: Record<string, string> = {
  accepted: 'bg-green-100 dark:bg-green-900/30 border-green-400',
  proposed: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400',
  deprecated: 'bg-red-100 dark:bg-red-900/30 border-red-400',
  superseded: 'bg-gray-100 dark:bg-gray-800/30 border-gray-400',
  planned: 'bg-blue-100 dark:bg-blue-900/30 border-blue-400',
  in_development: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400',
  implemented: 'bg-green-100 dark:bg-green-900/30 border-green-400',
};

const SCOPE_RING: Record<string, string> = {
  shared: 'ring-blue-400',
  api: 'ring-purple-400',
  frontend: 'ring-green-400',
  mobile: 'ring-orange-400',
};

function DocNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as DocNodeData;
  const statusClass =
    STATUS_BG[nodeData.status] ??
    'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600';
  const scopeRing = SCOPE_RING[nodeData.scope] ?? '';
  const ghostClass = nodeData.isGhost ? 'opacity-50 border-dashed' : '';
  const currentClass = nodeData.isCurrent
    ? 'ring-2 ring-offset-2 ' + scopeRing
    : '';

  return (
    <div
      className={`px-3 py-2 rounded-md border text-xs font-mono text-center min-w-[120px] ${statusClass} ${ghostClass} ${currentClass}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
      <span className="text-zinc-900 dark:text-zinc-100">{nodeData.label}</span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
    </div>
  );
}

export const DocNode = memo(DocNodeComponent);
