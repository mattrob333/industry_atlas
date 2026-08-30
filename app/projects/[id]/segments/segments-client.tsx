'use client'
import { Layers, TrendingUp, Users, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'

export function SegmentsClient({ segments }: { segments: any[] }) {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Market Segments</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Discovered market segments in this industry.</p>
      {(segments ?? []).length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Layers className="h-12 w-12 mx-auto mb-3" />
          <p>No segments discovered yet. Run a research pass to identify market segments.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {(segments ?? []).map((seg: any, i: number) => (
            <motion.div
              key={seg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100">{seg.name}</h3>
                  {seg.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{seg.description}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                {seg.sizeValue && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Size: {seg.sizeValue}</span>}
                {seg.growthRate && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-[#00C853]" /> Growth: {seg.growthRate}</span>}
                {seg.competitiveIntensity && <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Competition: {seg.competitiveIntensity}</span>}
                {seg.capitalIntensity && <span>Capital: {seg.capitalIntensity}</span>}
              </div>
              {seg.buyerGroups && <div className="mt-3 text-xs text-gray-500 dark:text-gray-400"><span className="text-gray-400 dark:text-gray-500">Buyers:</span> {seg.buyerGroups}</div>}
              {seg.majorTechnologies && <div className="mt-1 text-xs text-gray-500 dark:text-gray-400"><span className="text-gray-400 dark:text-gray-500">Technologies:</span> {seg.majorTechnologies}</div>}
              {seg.trends && <div className="mt-1 text-xs text-gray-500 dark:text-gray-400"><span className="text-gray-400 dark:text-gray-500">Trends:</span> {seg.trends}</div>}
              {(seg.entitySegments ?? []).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {seg.entitySegments.map((es: any, esIdx: number) => (
                    <span key={es.entity?.id ?? `es-${esIdx}`} className="text-xs bg-gray-100 dark:bg-white/10 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-300">
                      {es.entity?.name ?? 'Unknown'}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
