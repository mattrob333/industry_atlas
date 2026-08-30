'use client'
import { DollarSign, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export function EconomicsClient({ buyers, relationships, segments }: { buyers: any[]; relationships: any[]; segments: any[] }) {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Economic Flow</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Buyer groups, revenue flows, and demand drivers.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-cyan-500" /> Buyer Groups
          </h3>
          {(buyers ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No buyer groups identified.</p>
          ) : (
            <div className="space-y-2">
              {(buyers ?? []).map((b: any) => (
                <div key={b.id} className="p-3 bg-cyan-50/50 rounded-lg">
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{b.name}</div>
                  {b.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{b.description}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-amber-500" /> Revenue Flows
          </h3>
          {(relationships ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No economic relationships mapped.</p>
          ) : (
            <div className="space-y-1">
              {(relationships ?? []).map((r: any) => (
                <div key={r.id} className="flex items-center gap-2 text-sm py-1.5">
                  <span className="text-gray-700 dark:text-gray-300">{r.sourceEntity?.name}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{r.targetEntity?.name}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">({(r.relationshipType ?? '').replace(/_/g, ' ')})</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {(segments ?? []).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Market Size by Segment</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {(segments ?? []).map((s: any) => (
              <div key={s.id} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{s.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {s.sizeValue ? `Size: ${s.sizeValue}` : 'Size unknown'}
                  {s.growthRate ? ` • Growth: ${s.growthRate}` : ''}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
