'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Compass, Check, Loader2, AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const stages = [
  'Defining the field',
  'Finding segments',
  'Identifying companies and institutions',
  'Mapping technology dependencies',
  'Mapping buyers and money flows',
  'Mapping talent and influence',
  'Quantifying leaders and growth',
  'Verifying evidence',
  'Finding chokepoints and whitespace',
  'Building the forecast',
]

type ThesisData = { statedCategory?: string; actualArena?: string; strategicBattlefield?: string }
type FeedItem = { name: string; type: string; timestamp: number }

export default function ResearchPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string
  const [currentStage, setCurrentStage] = useState(0)
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set())
  const [thesis, setThesis] = useState<ThesisData | null>(null)
  const [entityCount, setEntityCount] = useState(0)
  const [sourceCount, setSourceCount] = useState(0)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)
  const [summary, setSummary] = useState('')
  const feedRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!projectId) return

    const es = new EventSource(`/api/projects/${projectId}/research-stream`)
    eventSourceRef.current = es

    es.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        switch (data?.type) {
          case 'stage_start':
            setCurrentStage(data.stage ?? 0)
            break
          case 'stage_complete':
            setCompletedStages(prev => new Set([...prev, data.stage]))
            if (data.entitiesFound) setEntityCount(prev => prev + (data.entitiesFound ?? 0))
            if (data.sourcesFound) setSourceCount(prev => prev + (data.sourcesFound ?? 0))
            break
          case 'entity_discovered':
            setEntityCount(prev => prev + 1)
            setFeed(prev => [{ name: data.name ?? 'Unknown', type: data.entityType ?? 'entity', timestamp: Date.now() }, ...prev].slice(0, 50))
            break
          case 'thesis_ready':
            setThesis({
              statedCategory: data.statedCategory,
              actualArena: data.actualArena,
              strategicBattlefield: data.strategicBattlefield,
            })
            break
          case 'complete':
            setComplete(true)
            setEntityCount(data.entityCount ?? 0)
            setSourceCount(data.sourceCount ?? 0)
            setSummary(data.summary ?? '')
            es.close()
            setTimeout(() => router.push(`/projects/${projectId}/overview`), 2000)
            break
          case 'error':
            setError(data.message ?? 'Research failed')
            es.close()
            break
          case 'heartbeat':
            break
        }
      } catch {
        // skip
      }
    }

    es.onerror = () => {
      if (!complete) {
        // Check if research already completed
        fetch(`/api/projects/${projectId}`)
          .then(r => r.json())
          .then(data => {
            const lastRun = data?.researchRuns?.[0]
            if (lastRun?.status === 'completed') {
              setComplete(true)
              router.push(`/projects/${projectId}/overview`)
            }
          })
          .catch(() => {})
      }
      es.close()
    }

    return () => {
      es.close()
    }
  }, [projectId])

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0
    }
  }, [feed])

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#151517] flex flex-col">
      <header className="bg-white dark:bg-[#1F1F22] border-b border-gray-100 dark:border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Compass className="h-6 w-6 text-[#00C853]" />
          <span className="font-display text-lg font-bold text-gray-900 dark:text-gray-100">Industry Atlas</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100">
            {complete ? 'Research Complete' : 'Building your industry map…'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {complete ? 'Redirecting to your dashboard…' : 'AI is researching the ecosystem around your company.'}
          </p>
        </motion.div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Research failed</p>
              <p className="text-sm mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setError('')
                  window.location.reload()
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Thesis Panel */}
        <AnimatePresence>
          {thesis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5 overflow-hidden"
            >
              <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Industry Thesis</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Stated category</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{thesis.statedCategory}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00BCD4] mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Actual competitive arena</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{thesis.actualArena}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00C853] mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">Strategic battlefield</div>
                    <div className="text-sm font-medium text-[#00C853]">{thesis.strategicBattlefield}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage Progress */}
        <div className="mt-8 bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100">Research Pipeline</h3>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>{entityCount} entities discovered</span>
              <span>{sourceCount} sources reviewed</span>
            </div>
          </div>
          <div className="space-y-1">
            {stages.map((label, i) => {
              const stageNum = i + 1
              const isDone = completedStages.has(stageNum)
              const isCurrent = currentStage === stageNum && !isDone
              return (
                <div key={i} className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                  isDone ? 'bg-green-50/50' : isCurrent ? 'bg-blue-50/50' : ''
                }`}>
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    {isDone ? (
                      <div className="w-5 h-5 rounded-full bg-[#00C853] flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-[#00BCD4] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#00BCD4] animate-pulse-dot" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-white/10" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    isDone ? 'text-gray-700 dark:text-gray-300' : isCurrent ? 'text-[#00BCD4] font-medium' : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {stageNum}. {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Activity Feed */}
        {feed.length > 0 && (
          <div className="mt-6 bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-5">
            <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">Live Activity</h3>
            <div ref={feedRef} className="max-h-48 overflow-y-auto space-y-1">
              {feed.map((item, i) => (
                <motion.div
                  key={`${item.name}-${item.timestamp}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 py-1 text-sm"
                >
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-mono w-20 flex-shrink-0">{item.type}</span>
                  <span className="text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <Button
              onClick={() => router.push(`/projects/${projectId}/overview`)}
              className="bg-[#00C853] hover:bg-[#00B84D] text-white"
            >
              View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
