'use client'
import { FileText, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function ChangelogClient({ runs }: { runs: any[] }) {
  const completed = (runs ?? []).filter((r: any) => r.status === 'completed')
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Change Log</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">What changed in each research run.</p>
      {completed.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3" />
          <p>No completed research runs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completed.map((run: any, i: number) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-[#00C853]" />
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100 capitalize">{(run.runType ?? 'standard').replace(/_/g, ' ')} Run</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(run.completedAt ?? run.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              {run.summary && <p className="text-sm text-gray-600 dark:text-gray-300">{run.summary}</p>}
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                <span>{run.entityCount ?? 0} entities</span>
                <span>{run.sourceCount ?? 0} sources</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
