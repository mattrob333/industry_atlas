'use client'
import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Network, TrendingUp, Shield, Users, Activity, BarChart3,
  Lightbulb, AlertTriangle, Layers, Target
} from 'lucide-react'

const EcosystemMap = dynamic(
  () => import('../_components/ecosystem-map').then(m => ({ default: m.EcosystemMap })),
  { ssr: false, loading: () => <div className="h-[500px] bg-gray-50 dark:bg-white/5 rounded-lg animate-pulse" /> }
)

export function OverviewClient({ data }: { data: any }) {
  const thesis = data?.industryThesis
  const entities = data?.entities ?? []
  const relationships = data?.relationships ?? []
  const segments = data?.segments ?? []
  const opportunities = data?.opportunities ?? []
  const threats = data?.threats ?? []
  const lastRun = data?.researchRuns?.[0]

  const focalCompany = entities.find((e: any) => e.entityType === 'focal_company')
  const competitors = relationships
    .filter((r: any) => r.relationshipType === 'competes_with')
    .map((r: any) => r.sourceEntityId === focalCompany?.id ? r.targetEntity : r.sourceEntity)
    .filter(Boolean)
    .map((c: any, idx: number) => ({ ...c, _idx: idx }))
  const avgConfidence = entities.length > 0
    ? entities.reduce((acc: number, e: any) => acc + (e.confidence ?? 0.7), 0) / entities.length
    : 0

  const segmentForFocal = entities.find((e: any) => e.entityType === 'focal_company')?.entitySegments?.[0]?.segment?.name

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <MetricCard label="Industry" value={thesis?.actualArena ?? 'Unknown'} icon={Target} small />
        <MetricCard label="Battlefield" value={thesis?.strategicBattlefield ?? 'Unknown'} icon={Layers} small />
        <MetricCard label="Segments" value={String(segments.length)} icon={BarChart3} />
        <MetricCard label="Entities" value={String(entities.length)} icon={Network} />
        <MetricCard label="Relationships" value={String(relationships.length)} icon={Activity} />
        <MetricCard label="Opportunities" value={String(opportunities.length)} icon={Lightbulb} accent />
        <MetricCard label="Threats" value={String(threats.length)} icon={AlertTriangle} destructive />
        <MetricCard label="Confidence" value={`${Math.round(avgConfidence * 100)}%`} icon={Shield} />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Company Position */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-4"
        >
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Company Position</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="text-gray-400 dark:text-gray-500 mb-0.5">Current Segment</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">{segmentForFocal ?? segments?.[0]?.name ?? 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400 dark:text-gray-500 mb-0.5">Primary Competitors</div>
              {competitors.slice(0, 4).map((c: any) => (
                <div key={c?.id ?? `comp-${c._idx}`} className="text-gray-700 dark:text-gray-300">{c?.name ?? 'Unknown'}</div>
              ))}
              {competitors.length === 0 && <div className="text-gray-400 dark:text-gray-500">None mapped</div>}
            </div>
            <div>
              <div className="text-gray-400 dark:text-gray-500 mb-0.5">Chokepoint Exposure</div>
              <div className="text-gray-700 dark:text-gray-300">
                {entities.filter((e: any) => e.isChokepoint).length} chokepoints identified
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ecosystem Map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EcosystemMap entities={entities} relationships={relationships} />
        </motion.div>
      </div>

      {/* Opportunities & Threats */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5"
        >
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-[#00C853]" /> Top Opportunities
          </h3>
          {opportunities.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No opportunities identified yet.</p>
          ) : (
            <div className="space-y-3">
              {opportunities.map((opp: any) => (
                <div key={opp.id} className="p-3 bg-green-50/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{opp.name}</div>
                    <span className="text-xs text-[#00C853] font-mono">{((opp.opportunityScore ?? 0) * 100).toFixed(0)}%</span>
                  </div>
                  {opp.buyerPain && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{opp.buyerPain}</p>}
                  <div className="mt-2 h-1 bg-gray-100 dark:bg-white/10 rounded-full">
                    <div className="h-full bg-[#00C853] rounded-full" style={{ width: `${(opp.opportunityScore ?? 0) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5"
        >
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" /> Top Threats
          </h3>
          {threats.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No threats identified yet.</p>
          ) : (
            <div className="space-y-3">
              {threats.map((thr: any) => (
                <div key={thr.id} className="p-3 bg-red-50/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{thr.name}</div>
                    <span className="text-xs text-red-500 font-mono">{((thr.threatScore ?? 0) * 100).toFixed(0)}%</span>
                  </div>
                  {thr.trigger && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{thr.trigger}</p>}
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>P: {((thr.probability ?? 0) * 100).toFixed(0)}%</span>
                    <span>Impact: {((thr.impact ?? 0) * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
  destructive,
  small,
}: {
  label: string
  value: string
  icon: any
  accent?: boolean
  destructive?: boolean
  small?: boolean
}) {
  return (
    <div className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`h-3.5 w-3.5 ${
          accent ? 'text-[#00C853]' : destructive ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
        }`} />
        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className={`font-semibold ${small ? 'text-xs' : 'text-lg'} text-gray-900 dark:text-gray-100 truncate`}>{value}</div>
    </div>
  )
}
