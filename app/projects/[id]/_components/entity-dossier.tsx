'use client'
import { X, ExternalLink, Shield, AlertTriangle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function EntityDossier({
  entity,
  relationships,
  entities,
  onClose,
}: {
  entity: any
  relationships: any[]
  entities: any[]
  onClose: () => void
}) {
  if (!entity) return null

  const entityRels = (relationships ?? []).filter(
    (r: any) => r.sourceEntityId === entity.id || r.targetEntityId === entity.id
  )

  const getEntityName = (id: string) => {
    return (entities ?? []).find((e: any) => e.id === id)?.name ?? 'Unknown'
  }

  const typeBadgeColor: Record<string, string> = {
    focal_company: 'bg-[#00C853] text-white',
    company: 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300',
    customer: 'bg-cyan-100 text-cyan-800',
    supplier: 'bg-amber-100 text-amber-800',
    technology: 'bg-slate-200 text-slate-700',
    platform: 'bg-blue-100 text-blue-800',
    expert: 'bg-stone-200 text-stone-700',
    institution: 'bg-stone-200 text-stone-700',
    regulator: 'bg-orange-100 text-orange-800',
    opportunity: 'bg-green-100 text-green-800',
    threat: 'bg-red-100 text-red-800',
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 250 }}
      className="absolute right-0 top-0 h-full w-[340px] bg-white dark:bg-[#1F1F22] border-l border-gray-200 dark:border-white/10 shadow-lg z-20 overflow-y-auto"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight">{entity.name ?? 'Unknown'}</h3>
            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${typeBadgeColor[entity.entityType] ?? 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
              {(entity.entityType ?? 'entity').replace(/_/g, ' ')}
            </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 hover:dark:bg-white/10 rounded">
            <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        {entity.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{entity.description}</p>
        )}

        {entity.website && (
          <a href={entity.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mb-4">
            <ExternalLink className="h-3 w-3" /> {entity.website}
          </a>
        )}

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {entity.geography && <MetricChip label="Geography" value={entity.geography} />}
          {entity.revenue && <MetricChip label="Revenue" value={entity.revenue} est />}
          {entity.employees && <MetricChip label="Employees" value={entity.employees} est />}
          {entity.founded && <MetricChip label="Founded" value={entity.founded} />}
          {entity.funding && <MetricChip label="Funding" value={entity.funding} />}
        </div>

        {entity.strategicRole && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Strategic Role</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{entity.strategicRole}</p>
          </div>
        )}

        {entity.products && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-1">Products / Services</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{entity.products}</p>
          </div>
        )}

        {entity.isChokepoint && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" /> Chokepoint
            </div>
            <div className="text-xs text-amber-700 mt-1">Score: {((entity.chokepointScore ?? 0) * 100).toFixed(0)}%</div>
          </div>
        )}

        {/* Relationships */}
        {entityRels.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">Relationships</div>
            <div className="space-y-1">
              {entityRels.map((rel: any) => {
                const isSource = rel.sourceEntityId === entity.id
                const otherName = isSource ? getEntityName(rel.targetEntityId) : getEntityName(rel.sourceEntityId)
                return (
                  <div key={rel.id} className="flex items-center gap-2 text-xs py-1">
                    <span className="text-gray-400 dark:text-gray-500 capitalize min-w-0 flex-shrink-0">
                      {(rel.relationshipType ?? '').replace(/_/g, ' ')}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 truncate">{otherName}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Confidence */}
        <div className="pt-3 border-t border-gray-100 dark:border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Shield className="h-3 w-3" /> Confidence
            </span>
            <span className="text-gray-700 dark:text-gray-300 font-medium">{Math.round((entity.confidence ?? 0.7) * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00C853] rounded-full"
              style={{ width: `${Math.round((entity.confidence ?? 0.7) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MetricChip({ label, value, est }: { label: string; value: string; est?: boolean }) {
  return (
    <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-2">
      <div className="text-[10px] text-gray-400 dark:text-gray-500">{label} {est && <span className="text-[9px]">(Est.)</span>}</div>
      <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5 truncate">{value}</div>
    </div>
  )
}
