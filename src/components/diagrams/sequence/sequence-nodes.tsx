import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

// --- Actor Node: person icon + name below + lifeline ---

function ActorNodeComponent({ data }: NodeProps) {
  const lifelineHeight = (data.lifelineHeight as number) ?? 0;

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-none !w-0 !h-0"
      />
      <svg
        width="40"
        height="50"
        viewBox="0 0 40 50"
        className="text-zinc-700 dark:text-zinc-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Head */}
        <circle cx="20" cy="10" r="8" />
        {/* Body */}
        <line x1="20" y1="18" x2="20" y2="34" />
        {/* Arms */}
        <line x1="8" y1="26" x2="32" y2="26" />
        {/* Left leg */}
        <line x1="20" y1="34" x2="10" y2="48" />
        {/* Right leg */}
        <line x1="20" y1="34" x2="30" y2="48" />
      </svg>
      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 text-center max-w-[120px] leading-tight">
        {data.label as string}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-none !w-0 !h-0"
      />
      {/* Lifeline: vertical dashed line below actor */}
      {lifelineHeight > 0 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 border-l-2 border-dashed border-zinc-300 dark:border-zinc-600"
          style={{
            top: '100%',
            height: lifelineHeight,
          }}
        />
      )}
    </div>
  );
}

export const ActorNode = memo(ActorNodeComponent);

// --- Message Bar Node: horizontal arrow with label (no box) ---

function MessageBarNodeComponent({ data }: NodeProps) {
  const label = (data.label as string) ?? '';
  const isReturn = (data.isReturn as boolean) ?? false;
  const barWidth = (data.barWidth as number) ?? 200;

  // Determine arrow direction:
  // sourceActorId and targetActorId indicate left-to-right or right-to-left
  // In our layout, actors are positioned left-to-right by index
  // The node is positioned at the leftmost actor X, so arrow always goes left->right
  // unless source is to the right of target (self-message or reversed)
  const sourceActorId = data.sourceActorId as string | undefined;
  const targetActorId = data.targetActorId as string | undefined;

  // Default: arrow points right (source -> target, left to right)
  // If source === target, it's a self-message (render right-pointing for simplicity)
  // Both cases resolve to right-pointing, kept for clarity
  void sourceActorId;
  void targetActorId;

  const arrowHeadSize = 8;
  const svgHeight = 30;
  const lineY = svgHeight / 2 + 6;

  return (
    <div className="relative" style={{ width: barWidth + 40 }}>
      {/* Label above the arrow */}
      <div className="text-[11px] text-zinc-700 dark:text-zinc-300 text-center whitespace-nowrap mb-0.5 px-1">
        {label}
      </div>
      {/* Arrow SVG */}
      <svg width={barWidth + 40} height={svgHeight} className="block">
        {isReturn ? (
          <>
            {/* Dashed return arrow */}
            <line
              x1={20}
              y1={lineY}
              x2={barWidth + 20}
              y2={lineY}
              className="stroke-zinc-400 dark:stroke-zinc-500"
              strokeWidth={1.5}
              strokeDasharray="6 3"
            />
            {/* Arrowhead pointing left (return) */}
            <polygon
              points={`${20 + arrowHeadSize},${lineY - arrowHeadSize / 2} ${20},${lineY} ${20 + arrowHeadSize},${lineY + arrowHeadSize / 2}`}
              className="fill-zinc-400 dark:fill-zinc-500"
            />
          </>
        ) : (
          <>
            {/* Solid sync message arrow */}
            <line
              x1={20}
              y1={lineY}
              x2={barWidth + 20}
              y2={lineY}
              className="stroke-zinc-700 dark:stroke-zinc-300"
              strokeWidth={1.5}
            />
            {/* Arrowhead pointing right (sync) */}
            <polygon
              points={`${barWidth + 20 - arrowHeadSize},${lineY - arrowHeadSize / 2} ${barWidth + 20},${lineY} ${barWidth + 20 - arrowHeadSize},${lineY + arrowHeadSize / 2}`}
              className="fill-zinc-700 dark:fill-zinc-300"
            />
          </>
        )}
      </svg>
      {/* Hidden handles for ReactFlow (not used in PRD mode but needed for registration) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-transparent !border-none !w-0 !h-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-transparent !border-none !w-0 !h-0"
      />
    </div>
  );
}

export const MessageBarNode = memo(MessageBarNodeComponent);

// --- Sequence Block Node: semi-transparent container for alt/loop/opt ---

const BLOCK_STYLES: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  alt: {
    bg: 'bg-blue-50/50 dark:bg-blue-950/30',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
  },
  loop: {
    bg: 'bg-green-50/50 dark:bg-green-950/30',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-700 dark:text-green-300',
  },
  opt: {
    bg: 'bg-yellow-50/50 dark:bg-yellow-950/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
};

function SequenceBlockNodeComponent({ data }: NodeProps) {
  const blockType = (data.blockType as string) ?? 'alt';
  const condition = data.condition as string | undefined;
  const style = BLOCK_STYLES[blockType] ?? BLOCK_STYLES.alt;

  return (
    <div
      className={`rounded border-2 border-dashed ${style.bg} ${style.border} p-2`}
      style={{
        width: (data.width as number) ?? 300,
        height: (data.height as number) ?? 120,
      }}
    >
      <div className="flex items-center gap-1">
        <span className={`text-[10px] font-bold uppercase ${style.text}`}>
          {blockType}
        </span>
        {condition && (
          <span className={`text-[10px] ${style.text}`}>[{condition}]</span>
        )}
      </div>
    </div>
  );
}

export const SequenceBlockNode = memo(SequenceBlockNodeComponent);
