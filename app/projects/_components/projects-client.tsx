'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Compass, Plus, Network, Clock, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

type ProjectSummary = {
  id: string
  name: string
  companyName: string
  arena: string | null
  battlefield: string | null
  entityCount: number
  confidence: number
  lastRunStatus: string | null
  updatedAt: string
}

export function ProjectsClient({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#151517]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-[#00C853]" />
            <span className="font-display text-lg font-bold text-gray-900 dark:text-gray-100">Industry Atlas</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/projects/new">
              <Button size="sm" className="bg-[#00C853] hover:bg-[#00B84D] text-white">
                <Plus className="h-4 w-4 mr-1" /> New Map
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => signOut({ redirectTo: '/' })}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Your Industry Maps</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Select a map to explore or create a new one.</p>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <Network className="h-16 w-16 text-gray-300 mx-auto" />
            <h2 className="font-display text-xl font-semibold text-gray-700 dark:text-gray-300 mt-4">No maps yet</h2>
            <p className="text-gray-400 dark:text-gray-500 mt-2">Create your first industry map to see the competitive landscape.</p>
            <Link href="/projects/new">
              <Button className="mt-6 bg-[#00C853] hover:bg-[#00B84D] text-white">
                <Plus className="h-4 w-4 mr-2" /> Create Your First Map
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 mt-8">
            {projects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={p.lastRunStatus === 'running' ? `/projects/${p.id}/research` : `/projects/${p.id}/overview`}>
                  <div className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100 truncate">{p.companyName}</h3>
                        {p.arena && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">{p.arena}</p>}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#00C853] transition-colors flex-shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <Network className="h-3.5 w-3.5" /> {p.entityCount} entities
                      </span>
                      {p.confidence > 0 && (
                        <span className="flex items-center gap-1">
                          {Math.round(p.confidence * 100)}% confidence
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {p.lastRunStatus === 'running' && (
                        <span className="text-[#00C853] font-medium animate-pulse">Researching…</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
