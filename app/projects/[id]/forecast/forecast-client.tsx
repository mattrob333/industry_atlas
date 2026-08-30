'use client'
import { TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function ForecastClient({ data }: { data: any }) {
  const thesis = data?.industryThesis
  const opportunities = data?.opportunities ?? []
  const threats = data?.threats ?? []
  const segments = data?.segments ?? []

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Forecast</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Scenario analysis and leading indicators for the {thesis?.actualArena ?? 'industry'}.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-5 w-5 text-[#00C853]" />
            <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100">Base Scenario</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {segments.length > 0
              ? `The ${thesis?.actualArena ?? 'market'} continues on current trajectory. Key segments (${segments.slice(0, 2).map((s: any) => s.name).join(', ')}) maintain growth patterns. ${opportunities.length} opportunities remain actionable within the forecast horizon.`
              : 'Run a research pass to generate forecast scenarios.'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-amber-500" />
            <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100">Upside Scenario</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {opportunities.length > 0
              ? `Key opportunities materialize: ${opportunities.slice(0, 2).map((o: any) => o.name).join(', ')}. Market acceleration driven by underserved buyer segments and technology convergence.`
              : 'No upside scenarios available yet.'}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100">Disruption Scenario</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {threats.length > 0
              ? `Major threat vectors: ${threats.slice(0, 2).map((t: any) => t.name).join(', ')}. Industry structure undergoes fundamental change if triggers materialize simultaneously.`
              : 'No disruption scenarios available yet.'}
          </p>
        </motion.div>
      </div>

      {(threats.length > 0 || opportunities.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Leading Indicators to Watch</h3>
          <div className="space-y-2">
            {threats.slice(0, 3).map((t: any) => (
              <div key={t.id} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <span className="text-red-400 text-xs mt-0.5">●</span>
                <span>{t.indicators ?? t.trigger ?? t.name}</span>
              </div>
            ))}
            {opportunities.slice(0, 3).map((o: any) => (
              <div key={o.id} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <span className="text-[#00C853] text-xs mt-0.5">●</span>
                <span>{o.marketEvidence ?? o.buyerPain ?? o.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
