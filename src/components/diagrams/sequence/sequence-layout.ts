import type { Node, Edge } from '@xyflow/react';
import type { DiagramNode, DiagramEdge } from '@/lib/types';

const ACTOR_GAP = 200;
const MESSAGE_Y_GAP = 60;
const ACTOR_Y = 0;
const FIRST_MESSAGE_Y = 120;
const BLOCK_PADDING = 20;
const ACTOR_NODE_HEIGHT = 80; // approximate height of actor SVG + label

export interface SequenceLayoutResult {
  nodes: Node[];
  edges: Edge[];
}

export function layoutSequence(
  diagramNodes: DiagramNode[],
  diagramEdges: DiagramEdge[]
): SequenceLayoutResult {
  const actors = diagramNodes.filter((n) => n.nodeType === 'actor');
  const messageBars = diagramNodes.filter((n) => n.nodeType === 'message_bar');
  const blocks = diagramNodes.filter((n) => n.nodeType === 'sequence_block');

  // Build actor positions: horizontal line at top
  const actorPositions = new Map<string, { x: number; y: number }>();
  actors.forEach((actor, i) => {
    actorPositions.set(actor.id, { x: i * ACTOR_GAP, y: ACTOR_Y });
  });

  // Detect mode: PRD-converted (no message_bar nodes) vs parser runtime (has message_bar nodes)
  const isPrdMode = messageBars.length === 0;

  if (isPrdMode) {
    return layoutPrdMode(actors, blocks, diagramEdges, actorPositions);
  }

  return layoutParserMode(
    actors,
    messageBars,
    blocks,
    diagramEdges,
    actorPositions
  );
}

// --- Mode A: PRD-converted diagrams (edges directly between actors, no message_bar nodes) ---

function layoutPrdMode(
  actors: DiagramNode[],
  blocks: DiagramNode[],
  diagramEdges: DiagramEdge[],
  actorPositions: Map<string, { x: number; y: number }>
): SequenceLayoutResult {
  const messageEdges = diagramEdges.filter(
    (e) => e.edgeType === 'sync_message' || e.edgeType === 'return'
  );

  const nodes: Node[] = [];

  // Calculate global max Y for lifelines
  const globalMaxY =
    messageEdges.length > 0
      ? FIRST_MESSAGE_Y + (messageEdges.length - 1) * MESSAGE_Y_GAP + 40
      : FIRST_MESSAGE_Y;

  const lifelineHeight = globalMaxY - ACTOR_Y - ACTOR_NODE_HEIGHT + 40;

  // Actor nodes with lifeline height
  for (const actor of actors) {
    const pos = actorPositions.get(actor.id)!;
    nodes.push({
      id: actor.id,
      type: 'actor',
      position: { x: pos.x - 20, y: pos.y },
      data: {
        label: actor.label,
        lifelineHeight: Math.max(lifelineHeight, 0),
        ...actor.data,
      },
    });
  }

  // Generate synthetic message_bar nodes for each edge
  messageEdges.forEach((edge, i) => {
    const srcPos = actorPositions.get(edge.source);
    const tgtPos = actorPositions.get(edge.target);
    if (!srcPos || !tgtPos) return;

    const y = FIRST_MESSAGE_Y + i * MESSAGE_Y_GAP;
    const leftX = Math.min(srcPos.x, tgtPos.x);
    const rightX = Math.max(srcPos.x, tgtPos.x);
    const barWidth = rightX - leftX;
    const x = leftX;

    nodes.push({
      id: `synth-msg-${i}`,
      type: 'message_bar',
      position: { x: x - 20, y },
      data: {
        label: edge.label ?? '',
        sourceActorId: edge.source,
        targetActorId: edge.target,
        isReturn: edge.edgeType === 'return',
        barWidth: Math.max(barWidth, 100),
      },
    });
  });

  // Sequence blocks
  layoutBlocks(blocks, messageEdges, actorPositions, nodes);

  // No ReactFlow edges needed -- lifelines are rendered by ActorNode, arrows by MessageBarNode
  return { nodes, edges: [] };
}

// --- Mode B: Parser runtime (has message_bar nodes) ---

function layoutParserMode(
  actors: DiagramNode[],
  messageBars: DiagramNode[],
  blocks: DiagramNode[],
  diagramEdges: DiagramEdge[],
  actorPositions: Map<string, { x: number; y: number }>
): SequenceLayoutResult {
  const messageEdges = diagramEdges.filter(
    (e) => e.edgeType === 'sync_message' || e.edgeType === 'return'
  );

  // Build message bar positions: chronological Y, X between source and target actors
  const messagePositions = new Map<string, { x: number; y: number }>();

  messageBars.forEach((msg, i) => {
    const y = FIRST_MESSAGE_Y + i * MESSAGE_Y_GAP;

    const edge =
      messageEdges.find(
        (e) =>
          msg.data?.sourceActor === e.source &&
          msg.data?.targetActor === e.target
      ) ?? messageEdges[i];

    if (edge) {
      const srcPos = actorPositions.get(edge.source);
      const tgtPos = actorPositions.get(edge.target);
      if (srcPos && tgtPos) {
        const leftX = Math.min(srcPos.x, tgtPos.x);
        const rightX = Math.max(srcPos.x, tgtPos.x);
        const barWidth = rightX - leftX;
        const x = leftX;
        messagePositions.set(msg.id, { x, y });

        // Store barWidth and actor info on data for rendering
        msg.data = {
          ...msg.data,
          sourceActorId: edge.source,
          targetActorId: edge.target,
          isReturn: edge.edgeType === 'return',
          barWidth: Math.max(barWidth, 100),
        };
      }
    }

    if (!messagePositions.has(msg.id)) {
      messagePositions.set(msg.id, { x: 0, y });
    }
  });

  const globalMaxY =
    messageBars.length > 0
      ? FIRST_MESSAGE_Y + (messageBars.length - 1) * MESSAGE_Y_GAP + 40
      : FIRST_MESSAGE_Y;

  const lifelineHeight = globalMaxY - ACTOR_Y - ACTOR_NODE_HEIGHT + 40;

  const nodes: Node[] = [];

  // Actor nodes with lifeline height
  for (const actor of actors) {
    const pos = actorPositions.get(actor.id)!;
    nodes.push({
      id: actor.id,
      type: 'actor',
      position: { x: pos.x - 20, y: pos.y },
      data: {
        label: actor.label,
        lifelineHeight: Math.max(lifelineHeight, 0),
        ...actor.data,
      },
    });
  }

  // Message bar nodes
  for (const msg of messageBars) {
    const pos = messagePositions.get(msg.id)!;
    nodes.push({
      id: msg.id,
      type: 'message_bar',
      position: { x: pos.x - 20, y: pos.y },
      data: { label: msg.label, ...msg.data },
    });
  }

  // Sequence blocks
  const blockMessagePositions = new Map<string, { x: number; y: number }>();
  messageBars.forEach((msg) => {
    const pos = messagePositions.get(msg.id);
    if (pos) blockMessagePositions.set(msg.id, pos);
  });

  for (const block of blocks) {
    const containedIds = (block.data?.containedMessages as string[]) ?? [];
    if (containedIds.length === 0) {
      nodes.push({
        id: block.id,
        type: 'sequence_block',
        position: { x: 0, y: FIRST_MESSAGE_Y - BLOCK_PADDING },
        data: {
          label: block.label,
          blockType: block.data?.blockType ?? 'alt',
          condition: block.data?.condition,
          width: 300,
          height: 120,
        },
        zIndex: -1,
      });
      continue;
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const msgId of containedIds) {
      const pos = blockMessagePositions.get(msgId);
      if (pos) {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x + 200);
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y + 30);
      }
    }

    const width = maxX - minX + BLOCK_PADDING * 2;
    const height = maxY - minY + BLOCK_PADDING * 2;

    nodes.push({
      id: block.id,
      type: 'sequence_block',
      position: {
        x: minX - BLOCK_PADDING,
        y: minY - BLOCK_PADDING,
      },
      data: {
        label: block.label,
        blockType: block.data?.blockType ?? 'alt',
        condition: block.data?.condition,
        width,
        height,
      },
      zIndex: -1,
    });
  }

  // No ReactFlow edges -- lifelines rendered by ActorNode, arrows by MessageBarNode
  return { nodes, edges: [] };
}

// --- Shared: layout sequence blocks for PRD mode ---

function layoutBlocks(
  blocks: DiagramNode[],
  messageEdges: DiagramEdge[],
  actorPositions: Map<string, { x: number; y: number }>,
  nodes: Node[]
) {
  for (const block of blocks) {
    const containedIds = (block.data?.containedMessages as string[]) ?? [];

    // If block has no metadata about contained messages, use generous defaults
    if (containedIds.length === 0) {
      // Find all actor X positions for width
      const allX = Array.from(actorPositions.values()).map((p) => p.x);
      const minActorX = Math.min(...allX);
      const maxActorX = Math.max(...allX);

      nodes.push({
        id: block.id,
        type: 'sequence_block',
        position: {
          x: minActorX - BLOCK_PADDING - 20,
          y: FIRST_MESSAGE_Y - BLOCK_PADDING,
        },
        data: {
          label: block.label,
          blockType: block.data?.blockType ?? 'alt',
          condition: block.data?.condition,
          width: maxActorX - minActorX + BLOCK_PADDING * 2 + 40,
          height: messageEdges.length * MESSAGE_Y_GAP + BLOCK_PADDING * 2,
        },
        zIndex: -1,
      });
      continue;
    }

    // Calculate bounds from contained message indices
    let minY = Infinity;
    let maxY = -Infinity;

    for (const msgId of containedIds) {
      const idx = parseInt(msgId, 10);
      if (!isNaN(idx) && idx < messageEdges.length) {
        const y = FIRST_MESSAGE_Y + idx * MESSAGE_Y_GAP;
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y + 30);
      }
    }

    if (minY === Infinity) continue;

    const allX = Array.from(actorPositions.values()).map((p) => p.x);
    const minActorX = Math.min(...allX);
    const maxActorX = Math.max(...allX);

    nodes.push({
      id: block.id,
      type: 'sequence_block',
      position: {
        x: minActorX - BLOCK_PADDING - 20,
        y: minY - BLOCK_PADDING,
      },
      data: {
        label: block.label,
        blockType: block.data?.blockType ?? 'alt',
        condition: block.data?.condition,
        width: maxActorX - minActorX + BLOCK_PADDING * 2 + 40,
        height: maxY - minY + BLOCK_PADDING * 2,
      },
      zIndex: -1,
    });
  }
}
