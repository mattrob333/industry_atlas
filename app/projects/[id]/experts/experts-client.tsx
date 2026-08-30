'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BookOpen, User, Building2, Newspaper, CalendarDays, Users, ExternalLink,
  Sparkles, Loader2, BarChart3, MapPin, Radio,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type Group = {
  key: string
  title: string
  blurb: string
  types: string[]
  icon: any
  accent: string // tailwind text color for icon
}

const GROUPS: Group[] = [
  { key: 'people', title: 'Experts & Analysts', blurb: 'People and research firms who shape opinion in this arena.', types: ['expert', 'analyst'], icon: User, accent: 'text-[#00C853]' },
  { key: 'institutions', title: 'Institutions & Bodies', blurb: 'Associations, standards bodies and academic institutions.', types: ['institution'], icon: Building2, accent: 'text-[#00BCD4]' },
  { key: 'publications', title: 'Publications & Research', blurb: 'Newsletters, blogs, podcasts and reports worth following.', types: ['publication'], icon: Newspaper, accent: 'text-amber-500' },
  { key: 'events', title: 'Industry Events', blurb: 'Conferences and trade shows where buyers and players gather.', types: ['conference'], icon: CalendarDays, accent: 'text-violet-500' },
  { key: 'communities', title: 'Where to Find Customers', blurb: 'Online communities — subreddits, forums, Slack/Discord and groups — where your potential customers already gather.', types: ['community'], icon: Users, accent: 'text-[#00C853]' },
]

function iconFor(type: string) {
  switch (type) {
    case 'expert': return User
    case 'analyst': return BarChart3
    case 'institution': return Building2
    case 'publication': return Newspaper
    case 'conference': return CalendarDays
    case 'community': return Radio
    default: return BookOpen
  }
}

function hostname(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return 'Visit' }
}

function Card({ exp, i }: { exp: any; i: number }) {
  const Icon = iconFor(exp.entityType)
  const meta = exp.metadataJson ?? {}
  const badges: string[] = []
  if (meta.role) badges.push(meta.role)
  if (meta.coverage) badges.push(meta.coverage)
  if (meta.mediaType) badges.push(meta.mediaType)
  if (meta.platform) badges.push(meta.platform)
  if (meta.cadence) badges.push(meta.cadence)
  if (meta.location || exp.geography) badges.push(meta.location ?? exp.geography)
  if (badges.length === 0 && exp.strategicRole) badges.push(exp.strategicRole)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.03, 0.3) }}
      className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-4 flex flex-col hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-2 mb-1.5">
        <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
        <h3 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">{exp.name}</h3>
      </div>
      {exp.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">{exp.description}</p>
      )}
      {meta.audience && (
        <p className="text-xs text-[#00838F] dark:text-cyan-300 mb-2 leading-relaxed">
          <span className="font-medium">Who’s there:</span> {meta.audience}
        </p>
      )}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {badges.filter(Boolean).map((b, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 capitalize">
              {b === (meta.location ?? exp.geography) && <MapPin className="h-2.5 w-2.5" />}
              {b}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between pt-1">
        {exp.website ? (
          <a
            href={exp.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#00C853] hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> {hostname(exp.website)}
          </a>
        ) : <span />}
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{Math.round((exp.confidence ?? 0.7) * 100)}% conf.</span>
      </div>
    </motion.div>
  )
}

export function ExpertsClient({ projectId, experts }: { projectId: string; experts: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const discover = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/sources`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error ?? 'Discovery failed')
      if (data.created > 0) {
        toast.success(`Added ${data.created} new experts & sources`)
        router.refresh()
      } else {
        toast.info('No new sources found — your directory is already up to date.')
      }
    } catch (err: any) {
      toast.error(err?.message ?? 'Could not discover sources')
    } finally {
      setLoading(false)
    }
  }

  const all = experts ?? []
  const isEmpty = all.length === 0

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Experts &amp; Sources</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The people, publications, events and communities that shape this industry — and where to find your customers.
          </p>
        </div>
        <Button onClick={discover} disabled={loading} className="bg-[#00C853] hover:bg-[#00b34a] text-white">
          {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
          {loading ? 'Discovering…' : all.length ? 'Find more sources' : 'Discover experts & sources'}
        </Button>
      </div>

      {isEmpty ? (
        <div className="text-center py-16 border border-dashed border-gray-200 dark:border-white/10 rounded-xl">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">No experts or sources discovered yet.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 mb-4 max-w-md mx-auto">
            Build a directory of industry experts, publications, events and the online communities where your potential customers gather.
          </p>
          <Button onClick={discover} disabled={loading} className="bg-[#00C853] hover:bg-[#00b34a] text-white">
            {loading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1.5" />}
            {loading ? 'Discovering…' : 'Discover experts & sources'}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {GROUPS.map((group) => {
            const items = all.filter((e: any) => group.types.includes(e.entityType))
            if (items.length === 0) return null
            const GIcon = group.icon
            return (
              <section key={group.key}>
                <div className="flex items-center gap-2 mb-1">
                  <GIcon className={`h-4 w-4 ${group.accent}`} />
                  <h2 className="font-display font-semibold text-sm text-gray-900 dark:text-gray-100">{group.title}</h2>
                  <span className="text-xs text-gray-400 dark:text-gray-500">({items.length})</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{group.blurb}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((exp: any, i: number) => <Card key={exp.id} exp={exp} i={i} />)}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
