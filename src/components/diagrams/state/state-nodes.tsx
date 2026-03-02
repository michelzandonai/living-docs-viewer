import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// --- State Node: rounded rectangle, violet/purple ---

function StateNodeComponent({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 rounded-lg border border-violet-300 bg-violet-50 dark:bg-violet-950 dark:border-violet-700 text-xs text-center min-w-[120px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
      <span className="text-violet-900 dark:text-violet-100">
        {data.label as string}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
    </div>
  );
}

export const StateNode = memo(StateNodeComponent);

// --- Initial Node: filled circle, no label ---

function InitialNodeComponent() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: 24, height: 24 }}
    >
      <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
    </div>
  );
}

export const InitialNode = memo(InitialNodeComponent);

// --- Final Node: double circle, no label ---

function FinalNodeComponent() {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: 28, height: 28 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
      <div className="w-6 h-6 rounded-full border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
      </div>
    </div>
  );
}

export const FinalNode = memo(FinalNodeComponent);
