'use client'
import { Cpu, Link2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function TechClient({ entities, relationships }: { entities: any[]; relationships: any[] }) {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Technology Flow</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Technology and platform dependencies in the ecosystem.</p>
      {(entities ?? []).length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Cpu className="h-12 w-12 mx-auto mb-3" />
          <p>No technologies discovered yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {(entities ?? []).map((ent: any, i: number) => {
            const deps = (relationships ?? []).filter((r: any) => r.targetEntityId === ent.id || r.sourceEntityId === ent.id)
            return (
              <motion.div
                key={ent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100 text-sm">{ent.name}</h3>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">{(ent.entityType ?? '').replace(/_/g, ' ')}</span>
                </div>
                {ent.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{ent.description}</p>}
                {ent.strategicRole && <p className="text-xs text-gray-400 dark:text-gray-500"><span className="font-medium text-gray-500 dark:text-gray-400">Role:</span> {ent.strategicRole}</p>}
                {deps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-1"><Link2 className="h-3 w-3" /> Dependencies</div>
                    {deps.map((d: any) => (
                      <div key={d.id} className="text-xs text-gray-600 dark:text-gray-300 py-0.5">
                        {d.sourceEntity?.name} → {d.targetEntity?.name} <span className="text-gray-400 dark:text-gray-500">({(d.relationshipType ?? '').replace(/_/g, ' ')})</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
