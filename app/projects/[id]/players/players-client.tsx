'use client'
import { useState, useMemo } from 'react'
import { Search, Filter, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { EntityDossier } from '../_components/entity-dossier'

const typeColors: Record<string, string> = {
  focal_company: 'bg-[#00C853] text-white',
  company: 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300',
  customer: 'bg-cyan-100 text-cyan-700',
  supplier: 'bg-amber-100 text-amber-700',
  technology: 'bg-slate-200 text-slate-700',
  platform: 'bg-blue-100 text-blue-700',
  expert: 'bg-stone-200 text-stone-700',
  institution: 'bg-stone-200 text-stone-700',
  regulator: 'bg-orange-100 text-orange-700',
  opportunity: 'bg-green-100 text-green-700',
  threat: 'bg-red-100 text-red-700',
}

export function PlayersClient({ entities, relationships }: { entities: any[]; relationships: any[] }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selected, setSelected] = useState<any>(null)

  const types = useMemo(() => {
    const s = new Set((entities ?? []).map((e: any) => e.entityType))
    return Array.from(s).sort()
  }, [entities])

  const filtered = useMemo(() => {
    return (entities ?? []).filter((e: any) => {
      if (search && !e.name?.toLowerCase()?.includes(search.toLowerCase())) return false
      if (typeFilter && e.entityType !== typeFilter) return false
      return true
    })
  }, [entities, search, typeFilter])

  return (
    <div className="p-6 max-w-[1200px] mx-auto relative">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Players</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">All entities in the industry ecosystem.</p>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search entities…"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e: any) => setTypeFilter(e.target.value)}
          className="text-sm border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 bg-white dark:bg-[#1F1F22] text-gray-700 dark:text-gray-300"
        >
          <option value="">All Types</option>
          {types.map((t: string) => (
            <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-white/5 text-left">
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">Name</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">Type</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs hidden md:table-cell">Geography</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs hidden lg:table-cell">Revenue</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs hidden lg:table-cell">Employees</th>
              <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400 text-xs">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ent: any) => (
              <tr
                key={ent.id}
                onClick={() => setSelected(ent)}
                className="border-t border-gray-100 dark:border-white/10 hover:bg-gray-50 hover:dark:bg-white/5 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900 dark:text-gray-100">{ent.name}</div>
                  {ent.strategicRole && <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-[200px]">{ent.strategicRole}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[ent.entityType] ?? 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
                    {(ent.entityType ?? '').replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden md:table-cell">{ent.geography ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">{ent.revenue ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 hidden lg:table-cell">{ent.employees ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{Math.round((ent.confidence ?? 0.7) * 100)}%</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400 dark:text-gray-500">No entities found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed right-0 top-0 h-full z-50">
          <EntityDossier
            entity={selected}
            relationships={relationships ?? []}
            entities={entities ?? []}
            onClose={() => setSelected(null)}
          />
        </div>
      )}
    </div>
  )
}
