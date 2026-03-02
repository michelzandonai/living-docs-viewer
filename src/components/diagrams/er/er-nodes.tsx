import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

export interface ERField {
  name: string;
  type?: string;
  pk?: boolean;
  fk?: boolean;
}

export interface EREntityNodeData extends Record<string, unknown> {
  label: string;
  fields?: ERField[];
}

function EntityNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as EREntityNodeData;
  const fields = nodeData.fields ?? [];

  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm min-w-[160px] max-w-[260px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-gray-400 !w-2 !h-2"
      />

      {/* Header */}
      <div className="px-3 py-2 bg-blue-800 dark:bg-blue-700 text-white text-xs font-semibold text-center truncate">
        {nodeData.label}
      </div>

      {/* Fields */}
      {fields.length > 0 && (
        <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 max-h-[200px] overflow-y-auto">
          {fields.map((field) => (
            <div
              key={field.name}
              className="flex items-center gap-1.5 px-2 py-1 text-[11px]"
            >
              {field.pk && (
                <span
                  className="text-amber-500 flex-shrink-0"
                  title="Primary Key"
                >
                  &#x1f511;
                </span>
              )}
              <span
                className={`font-mono truncate flex-1 ${
                  field.fk
                    ? 'underline text-gray-700 dark:text-gray-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {field.name}
              </span>
              {field.type && (
                <span className="text-[9px] text-gray-400 dark:text-gray-500 flex-shrink-0 font-mono">
                  {field.type}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty state (entity without fields) */}
      {fields.length === 0 && (
        <div className="bg-white dark:bg-gray-800 px-2 py-2 text-[10px] text-gray-400 text-center italic">
          sem campos
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400 !w-2 !h-2"
      />
    </div>
  );
}

export const EntityNode = memo(EntityNodeComponent);
