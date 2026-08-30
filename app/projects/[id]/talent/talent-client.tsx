'use client'
import { GraduationCap, Building } from 'lucide-react'
import { motion } from 'framer-motion'

export function TalentClient({ entities, relationships }: { entities: any[]; relationships: any[] }) {
  const institutions = (entities ?? []).filter((e: any) => e.entityType === 'institution')
  const experts = (entities ?? []).filter((e: any) => e.entityType === 'expert')

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Talent Flow</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Key talent sources and influential institutions.</p>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4 text-stone-500" /> Institutions
          </h3>
          {institutions.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No institutions identified.</p>
          ) : (
            <div className="space-y-2">
              {institutions.map((inst: any) => (
                <div key={inst.id} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{inst.name}</div>
                  {inst.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{inst.description}</p>}
                  {inst.strategicRole && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{inst.strategicRole}</p>}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-blue-500" /> Talent Relationships
          </h3>
          {(relationships ?? []).length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">No talent relationships mapped.</p>
          ) : (
            <div className="space-y-1">
              {(relationships ?? []).map((r: any) => (
                <div key={r.id} className="text-sm py-1.5 text-gray-700 dark:text-gray-300">
                  {r.sourceEntity?.name} → {r.targetEntity?.name}
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({(r.relationshipType ?? '').replace(/_/g, ' ')})</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
