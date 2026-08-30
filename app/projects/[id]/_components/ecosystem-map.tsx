'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ReactFlow, Background, MiniMap, Controls, Panel,
  useNodesState, useEdgesState, MarkerType, type Node, type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'
import { useTheme } from 'next-themes'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { EntityDossier } from './entity-dossier'
import { MapNodeComponent } from './map-node'
import { SOURCE_ENTITY_TYPES } from '@/lib/sources'

// Sources (experts, publications, events, communities) live on the Experts &
// Sources page; keep them off the map to avoid clutter.
const SOURCE_TYPE_SET = new Set(SOURCE_ENTITY_TYPES)

const nodeWidth = 180
const nodeHeight = 60

const entityColors: Record<string, { bg: string; border: string; text: string }> = {
  focal_company: { bg: '#00C853', border: '#00C853', text: '#ffffff' },
  company: { bg: '#ffffff', border: '#374151', text: '#111827' },
  segment: { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151' },
  customer: { bg: '#E0F7FA', border: '#00BCD4', text: '#00695C' },
  supplier: { bg: '#FFF8E1', border: '#FFA726', text: '#E65100' },
  technology: { bg: '#F1F5F9', border: '#64748B', text: '#334155' },
  platform: { bg: '#EFF6FF', border: '#60A5FA', text: '#1E40AF' },
  expert: { bg: '#F5F5F4', border: '#A8A29E', text: '#57534E' },
  institution: { bg: '#F5F5F4', border: '#78716C', text: '#44403C' },
  regulator: { bg: '#FFF7ED', border: '#FB923C', text: '#C2410C' },
  opportunity: { bg: '#F0FDF4', border: '#00C853', text: '#166534' },
  threat: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' },
}

const edgeColors: Record<string, string> = {
  competes_with: '#EF4444',
  sells_to: '#00BCD4',
  buys_from: '#00BCD4',
  supplies: '#FFA726',
  depends_on: '#FFA726',
  builds_on: '#64748B',
  substitutes_for: '#8B5CF6',
  integrates_with: '#3B82F6',
  partners_with: '#00C853',
  acquired: '#EC4899',
  regulates: '#FB923C',
  influences: '#A3A3A3',
  hires_from: '#78716C',
}

function getLayout(nodes: Node[], edges: Edge[], direction: string = 'LR') {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: direction, nodesep: 90, ranksep: 260, ranker: 'network-simplex', edgesep: 40, marginx: 40, marginy: 40 })
  nodes.forEach((node: Node) => {
    g.setNode(node.id, { width: nodeWidth, height: nodeHeight })
  })
  edges.forEach((edge: Edge) => {
    g.setEdge(edge.source, edge.target)
  })
  dagre.layout(g)
  return nodes.map((node: Node) => {
    const pos = g.node(node.id)
    return { ...node, position: { x: (pos?.x ?? 0) - nodeWidth / 2, y: (pos?.y ?? 0) - nodeHeight / 2 } }
  })
}

const nodeTypes = { mapNode: MapNodeComponent }

export function EcosystemMap({
  entities,
  relationships,
  fullScreen = false,
  onNodeClick,
}: {
  entities: any[]
  relationships: any[]
  fullScreen?: boolean
  onNodeClick?: (entity: any) => void
}) {
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set([
    'focal_company', 'company', 'segment', 'customer', 'supplier',
    'technology', 'platform', 'expert', 'institution', 'regulator',
    'opportunity', 'threat',
  ]))
  const [searchQuery, setSearchQuery] = useState('')

  const visibleEntities = useMemo(
    () => (entities ?? []).filter((e: any) => !SOURCE_TYPE_SET.has(e.entityType)),
    [entities]
  )
  const visibleIds = useMemo(
    () => new Set(visibleEntities.map((e: any) => e.id)),
    [visibleEntities]
  )

  const initialNodes: Node[] = useMemo(() => {
    return visibleEntities.map((ent: any) => {
      const colors = entityColors[ent.entityType] ?? entityColors.company
      const isActive = activeLayers.has(ent.entityType)
      const matchesSearch = !searchQuery || ent.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
      return {
        id: ent.id,
        type: 'mapNode',
        data: {
          label: ent.name ?? 'Unknown',
          entityType: ent.entityType ?? 'company',
          colors,
          isChokepoint: ent.isChokepoint ?? false,
          confidence: ent.confidence ?? 0.7,
          opacity: isActive && matchesSearch ? 1 : 0.15,
          entity: ent,
        },
        position: { x: 0, y: 0 },
      }
    })
  }, [visibleEntities, activeLayers, searchQuery])

  const initialEdges: Edge[] = useMemo(() => {
    return (relationships ?? []).filter((rel: any) => visibleIds.has(rel.sourceEntityId) && visibleIds.has(rel.targetEntityId)).map((rel: any) => {
      const color = edgeColors[rel.relationshipType] ?? '#A3A3A3'
      const width = Math.max(1, (rel.strength ?? 0.5) * 2.5)
      return {
        id: rel.id,
        source: rel.sourceEntityId,
        target: rel.targetEntityId,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: color,
          strokeWidth: width,
          strokeDasharray: rel.inferred ? '5 5' : undefined,
          opacity: 0.22,
        },
        data: { color, width, relType: rel.relationshipType, label: rel.label },
        markerEnd: { type: MarkerType.ArrowClosed, color, width: 12, height: 12 },
      } as Edge
    })
  }, [relationships, visibleIds])

  const laidOutNodes = useMemo(() => getLayout(initialNodes, initialEdges), [initialNodes, initialEdges])
  const [nodes, setNodes, onNodesChange] = useNodesState(laidOutNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(getLayout(initialNodes, initialEdges))
    setEdges(initialEdges)
  }, [initialNodes, initialEdges])

  const handleNodeClick = useCallback((_: any, node: Node) => {
    const entity = node?.data?.entity
    if (entity) {
      setSelectedEntity(entity)
      onNodeClick?.(entity)
    }
  }, [onNodeClick])

  // Map of nodeId -> set of connected nodeIds, for hover highlighting
  const neighborMap = useMemo(() => {
    const m: Record<string, Set<string>> = {}
    ;(relationships ?? []).forEach((rel: any) => {
      const s = rel.sourceEntityId, t = rel.targetEntityId
      if (!m[s]) m[s] = new Set()
      if (!m[t]) m[t] = new Set()
      m[s].add(t)
      m[t].add(s)
    })
    return m
  }, [relationships])

  const handleNodeMouseEnter = useCallback((_: any, node: Node) => {
    const id = node.id
    const neighbors = neighborMap[id] ?? new Set<string>()
    setNodes((nds) => nds.map((n) => ({
      ...n,
      data: { ...n.data, dimmed: n.id !== id && !neighbors.has(n.id) },
    })))
    setEdges((eds) => eds.map((e) => {
      const connected = e.source === id || e.target === id
      const c = (e.data as any)?.color ?? '#A3A3A3'
      const w = (e.data as any)?.width ?? 1.5
      return {
        ...e,
        zIndex: connected ? 1000 : 0,
        style: { ...e.style, opacity: connected ? 0.95 : 0.04, strokeWidth: connected ? w + 1 : w },
      }
    }))
  }, [neighborMap, setNodes, setEdges])

  const handleNodeMouseLeave = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, dimmed: false } })))
    setEdges((eds) => eds.map((e) => {
      const w = (e.data as any)?.width ?? 1.5
      return { ...e, zIndex: 0, style: { ...e.style, opacity: 0.22, strokeWidth: w } }
    }))
  }, [setNodes, setEdges])

  const toggleLayer = (layer: string) => {
    setActiveLayers(prev => {
      const next = new Set(prev)
      if (next.has(layer)) next.delete(layer)
      else next.add(layer)
      return next
    })
  }

  return (
    <div className={`relative ${fullScreen ? 'h-full' : 'h-[500px]'} w-full bg-[#FAFAFA] dark:bg-[#151517] rounded-lg overflow-hidden border border-gray-200 dark:border-white/10`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable
        elevateEdgesOnSelect
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        {/* Flow-direction axis overlay: value flows left (upstream) to right (downstream) */}
        <Panel position="top-center">
          <div className="pointer-events-none flex items-center gap-2 select-none">
            <div className="flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/85 dark:bg-[#1F1F22]/85 backdrop-blur px-2.5 py-1 shadow-sm">
              <ArrowLeft className="h-3 w-3 text-[#E65100] dark:text-amber-400" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#E65100] dark:text-amber-400">Upstream</span>
              <span className="hidden sm:inline text-[10px] text-gray-500 dark:text-gray-400">suppliers &amp; inputs</span>
            </div>
            <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-[#FFA726] to-[#00BCD4]" />
            <div className="flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-white/10 bg-white/85 dark:bg-[#1F1F22]/85 backdrop-blur px-2.5 py-1 shadow-sm">
              <span className="hidden sm:inline text-[10px] text-gray-500 dark:text-gray-400">customers &amp; buyers</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#00838F] dark:text-cyan-300">Downstream</span>
              <ArrowRight className="h-3 w-3 text-[#00838F] dark:text-cyan-300" />
            </div>
          </div>
        </Panel>
        <Background color={isDark ? '#2A2A2E' : '#E5E7EB'} gap={20} />
        <MiniMap
          nodeColor={(n: any) => n?.data?.colors?.bg ?? '#ccc'}
          maskColor={isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.08)'}
          className={isDark ? '!bg-[#1F1F22]' : '!bg-white'}
        />
        <Controls />

        {fullScreen && (
          <Panel position="top-left">
            <div className="bg-white dark:bg-[#1F1F22] rounded-lg shadow-md p-3 space-y-1 max-h-[60vh] overflow-y-auto">
              <input
                type="text"
                placeholder="Search nodes…"
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-2 py-1.5 border border-gray-200 dark:border-white/10 rounded mb-2"
              />
              {Object.keys(entityColors).filter((type) => !SOURCE_TYPE_SET.has(type)).map((type) => (
                <label key={type} className="flex items-center gap-2 text-xs cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={activeLayers.has(type)}
                    onChange={() => toggleLayer(type)}
                    className="rounded border-gray-300 dark:border-white/15"
                  />
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: entityColors[type]?.bg, border: `1px solid ${entityColors[type]?.border}` }}
                  />
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{type.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </Panel>
        )}
      </ReactFlow>

      {selectedEntity && (
        <EntityDossier
          entity={selectedEntity}
          relationships={relationships}
          entities={entities}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </div>
  )
}
