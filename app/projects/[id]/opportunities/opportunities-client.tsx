'use client'
import { useState } from 'react'
import { Lightbulb, Eye, CheckCircle, X, Search } from 'lucide-react'
import { motion } from 'framer-motion'

const columns = [
  { key: 'identified', label: 'Watching', color: 'bg-blue-50' },
  { key: 'validating', label: 'Validating', color: 'bg-amber-50' },
  { key: 'prioritized', label: 'Prioritized', color: 'bg-green-50' },
  { key: 'rejected', label: 'Rejected', color: 'bg-gray-50 dark:bg-white/5' },
]

export function OpportunitiesClient({ opportunities, projectId }: { opportunities: any[]; projectId: string }) {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Opportunities</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Identified market opportunities and whitespace.</p>

      {(opportunities ?? []).length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Lightbulb className="h-12 w-12 mx-auto mb-3" />
          <p>No opportunities identified yet. Run a research pass to discover them.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          {columns.map((col) => {
            const items = (opportunities ?? []).filter((o: any) => o.status === col.key)
            return (
              <div key={col.key} className={`${col.color} rounded-xl p-3 min-h-[200px]`}>
                <h3 className="font-display font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">{col.label} ({items.length})</h3>
                <div className="space-y-2">
                  {items.map((opp: any) => (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-[#1F1F22] rounded-lg p-3 shadow-sm"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">{opp.name}</div>
                      {opp.buyerPain && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{opp.buyerPain}</p>}
                      <div className="flex items-center justify-between">
                        <div className="h-1.5 flex-1 bg-gray-100 dark:bg-white/10 rounded-full mr-2">
                          <div className="h-full bg-[#00C853] rounded-full" style={{ width: `${(opp.opportunityScore ?? 0) * 100}%` }} />
                        </div>
                        <span className="text-xs text-[#00C853] font-mono">{((opp.opportunityScore ?? 0) * 100).toFixed(0)}%</span>
                      </div>
                      {opp.focalFit && <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Fit: {opp.focalFit}</p>}
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
