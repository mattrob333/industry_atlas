'use client'
import { History, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

const statusIcons: Record<string, any> = {
  completed: CheckCircle,
  failed: XCircle,
  running: Loader2,
  pending: Clock,
}
const statusColors: Record<string, string> = {
  completed: 'text-[#00C853]',
  failed: 'text-red-500',
  running: 'text-blue-500',
  pending: 'text-gray-400 dark:text-gray-500',
}

export function HistoryClient({ runs, companyName }: { runs: any[]; companyName: string }) {
  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">History</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Research run history for {companyName}.</p>
      {(runs ?? []).length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <History className="h-12 w-12 mx-auto mb-3" />
          <p>No research runs yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(runs ?? []).map((run: any, i: number) => {
            const Icon = statusIcons[run.status] ?? Clock
            return (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-4 flex items-start gap-4"
              >
                <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${statusColors[run.status] ?? 'text-gray-400 dark:text-gray-500'} ${run.status === 'running' ? 'animate-spin' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100 capitalize">{(run.runType ?? 'standard').replace(/_/g, ' ')}</span>
                    <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full capitalize">{run.status}</span>
                  </div>
                  {run.summary && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{run.summary}</p>}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>{new Date(run.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {run.entityCount > 0 && <span>{run.entityCount} entities</span>}
                    {run.sourceCount > 0 && <span>{run.sourceCount} sources</span>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
