'use client'
import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'

export const MapNodeComponent = memo(function MapNode({ data }: { data: any }) {
  const { label, entityType, colors, isChokepoint, confidence, opacity, dimmed } = data ?? {}
  const effectiveOpacity = dimmed ? 0.12 : (opacity ?? 1)
  const bg = colors?.bg ?? '#fff'
  const border = colors?.border ?? '#ccc'
  const text = colors?.text ?? '#333'
  const isFocal = entityType === 'focal_company'
  const dashStyle = (confidence ?? 0.7) < 0.5 ? '3 3' : undefined

  return (
    <div
      style={{
        opacity: effectiveOpacity,
        transition: 'opacity 0.2s ease',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div
        className="px-3 py-2 rounded-lg shadow-sm text-center transition-shadow hover:shadow-md"
        style={{
          backgroundColor: bg,
          border: `${isFocal ? '2.5px' : '1.5px'} ${dashStyle ? 'dashed' : 'solid'} ${border}`,
          color: text,
          minWidth: isFocal ? 120 : 100,
          maxWidth: 180,
          boxShadow: isChokepoint ? `0 0 0 3px #F59E0B40, 0 0 0 1px #F59E0B` : undefined,
        }}
      >
        <div className="text-xs font-medium leading-tight truncate" style={{ color: text }}>
          {label ?? 'Unknown'}
        </div>
        <div className="text-[9px] mt-0.5 opacity-60 capitalize">
          {(entityType ?? 'entity').replace(/_/g, ' ')}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  )
})
