import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// --- Process Node: rounded rectangle ---

function ProcessNodeComponent({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-950 dark:border-blue-700 text-xs text-center min-w-[120px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
      <span className="text-blue-900 dark:text-blue-100">
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

export const ProcessNode = memo(ProcessNodeComponent);

// --- Decision Node: diamond ---

function DecisionNodeComponent({ data }: NodeProps) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 100, height: 100 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
        style={{ top: -4 }}
      />
      <div
        className="absolute inset-0 rounded border border-yellow-400 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-600"
        style={{ transform: 'rotate(45deg)' }}
      />
      <span className="relative z-10 text-xs text-center text-yellow-900 dark:text-yellow-100 max-w-[70px] leading-tight">
        {data.label as string}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
        style={{ bottom: -4 }}
      />
    </div>
  );
}

export const DecisionNode = memo(DecisionNodeComponent);

// --- Terminal Node: pill shape (start/end) ---

function TerminalNodeComponent({ data }: NodeProps) {
  return (
    <div className="px-4 py-2 rounded-full border border-green-300 bg-green-50 dark:bg-green-950 dark:border-green-700 text-xs text-center min-w-[120px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
      <span className="text-green-900 dark:text-green-100">
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

export const TerminalNode = memo(TerminalNodeComponent);

// --- Subprocess Node: double-border rectangle ---

function SubprocessNodeComponent({ data }: NodeProps) {
  return (
    <div
      className="px-4 py-2 rounded border border-gray-300 bg-gray-50 dark:bg-gray-900 dark:border-gray-600 text-xs text-center min-w-[120px]"
      style={{ boxShadow: 'inset 0 0 0 3px var(--subprocess-inset, #9ca3af)' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-zinc-500 dark:!bg-zinc-400 !w-2 !h-2"
      />
      <span className="text-gray-900 dark:text-gray-100">
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

export const SubprocessNode = memo(SubprocessNodeComponent);
