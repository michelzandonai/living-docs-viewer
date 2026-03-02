import type { DiagramNode, DiagramEdge } from '@/lib/types';

interface ParseResult {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

interface ActorInfo {
  id: string;
  label: string;
}

interface BlockContext {
  type: string;
  condition: string;
  startMessageIndex: number;
}

export function parseSequenceDiagram(mermaidCode: string): ParseResult | null {
  try {
    const lines = mermaidCode
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return null;

    // Skip the 'sequenceDiagram' directive line
    const startIdx = lines[0].match(/^\s*sequenceDiagram\s*$/) ? 1 : 0;

    const actors: ActorInfo[] = [];
    const actorSet = new Set<string>();
    const edges: DiagramEdge[] = [];
    const messageNodes: DiagramNode[] = [];
    const blockStack: BlockContext[] = [];
    const blocks: DiagramNode[] = [];
    let messageIndex = 0;

    function ensureActor(id: string) {
      if (!actorSet.has(id)) {
        actorSet.add(id);
        actors.push({ id, label: id });
      }
    }

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];

      // Skip comments and rect
      if (line.startsWith('%%') || line.startsWith('rect ') || line === 'end') {
        if (line === 'end' && blockStack.length > 0) {
          const block = blockStack.pop()!;
          const containedIds: string[] = [];
          for (let m = block.startMessageIndex; m < messageIndex; m++) {
            containedIds.push(`msg-${m}`);
          }
          blocks.push({
            id: `block-${blocks.length}`,
            label: `${block.type} [${block.condition}]`,
            nodeType: 'sequence_block',
            data: {
              blockType: block.type,
              condition: block.condition,
              containedMessages: containedIds,
            },
          });
        }
        continue;
      }

      // participant X as Label  |  participant X
      const participantMatch = line.match(
        /^(?:participant|actor)\s+(\S+?)(?:\s+as\s+(.+))?$/
      );
      if (participantMatch) {
        const id = participantMatch[1];
        const label = participantMatch[2] ?? id;
        if (!actorSet.has(id)) {
          actorSet.add(id);
          actors.push({ id, label });
        } else {
          // Update label if defined later
          const existing = actors.find((a) => a.id === id);
          if (existing && participantMatch[2]) {
            existing.label = label;
          }
        }
        continue;
      }

      // Block start: alt/loop/opt condition
      const blockMatch = line.match(/^(alt|loop|opt)\s+(.*)$/);
      if (blockMatch) {
        blockStack.push({
          type: blockMatch[1],
          condition: blockMatch[2],
          startMessageIndex: messageIndex,
        });
        continue;
      }

      // Else in alt block
      if (line.startsWith('else')) {
        // Close current block and start new one
        if (blockStack.length > 0) {
          const block = blockStack.pop()!;
          const containedIds: string[] = [];
          for (let m = block.startMessageIndex; m < messageIndex; m++) {
            containedIds.push(`msg-${m}`);
          }
          blocks.push({
            id: `block-${blocks.length}`,
            label: `${block.type} [${block.condition}]`,
            nodeType: 'sequence_block',
            data: {
              blockType: block.type,
              condition: block.condition,
              containedMessages: containedIds,
            },
          });

          const elseCondition = line.replace(/^else\s*/, '') || 'else';
          blockStack.push({
            type: 'alt',
            condition: elseCondition,
            startMessageIndex: messageIndex,
          });
        }
        continue;
      }

      // Message: X->>Y: message  |  X-->>Y: message  |  X->>+Y  |  X-->>-Y
      const msgMatch = line.match(
        /^(\S+?)\s*(--?>?>)\s*([+-]?)(\S+?)\s*:\s*(.+)$/
      );
      if (msgMatch) {
        const sourceId = msgMatch[1];
        const arrow = msgMatch[2];
        const targetId = msgMatch[4];
        const message = msgMatch[5].trim();

        ensureActor(sourceId);
        ensureActor(targetId);

        const isReturn = arrow.startsWith('--');

        edges.push({
          source: sourceId,
          target: targetId,
          label: message,
          edgeType: isReturn ? 'return' : 'sync_message',
        });

        messageNodes.push({
          id: `msg-${messageIndex}`,
          label: message,
          nodeType: 'message_bar',
          data: {
            sourceActor: sourceId,
            targetActor: targetId,
          },
        });

        messageIndex++;
        continue;
      }

      // Note: skip
      if (line.startsWith('Note ')) continue;

      // Activate/deactivate: skip
      if (line.startsWith('activate ') || line.startsWith('deactivate '))
        continue;
    }

    // Close any unclosed blocks
    while (blockStack.length > 0) {
      const block = blockStack.pop()!;
      const containedIds: string[] = [];
      for (let m = block.startMessageIndex; m < messageIndex; m++) {
        containedIds.push(`msg-${m}`);
      }
      blocks.push({
        id: `block-${blocks.length}`,
        label: `${block.type} [${block.condition}]`,
        nodeType: 'sequence_block',
        data: {
          blockType: block.type,
          condition: block.condition,
          containedMessages: containedIds,
        },
      });
    }

    if (actors.length === 0) return null;

    const actorNodes: DiagramNode[] = actors.map((a) => ({
      id: a.id,
      label: a.label,
      nodeType: 'actor' as const,
    }));

    return {
      nodes: [...actorNodes, ...messageNodes, ...blocks],
      edges,
    };
  } catch {
    return null;
  }
}
