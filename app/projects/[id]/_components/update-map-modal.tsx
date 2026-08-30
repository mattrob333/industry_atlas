'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw, Zap, Layers, RotateCcw, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const options = [
  { type: 'quick', label: 'Quick Update', desc: 'Refresh stale data, recent funding, market numbers, major signals', icon: Zap },
  { type: 'layer', label: 'Update Selected Layer', desc: 'Choose: Technology / Economics / Players / Opportunities / Sources', icon: Layers },
  { type: 'full_rebuild', label: 'Full Rebuild', desc: 'Reconsider everything from scratch', icon: RotateCcw },
]

export function UpdateMapModal({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const startUpdate = async (runType: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runType }),
      })
      if (res.ok) {
        onClose()
        router.push(`/projects/${projectId}/research`)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1F1F22] rounded-xl w-full max-w-md shadow-xl" onClick={(e: any) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-[#00C853]" />
            <span className="font-display font-semibold">Update Map</span>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-400 dark:text-gray-500" /></button>
        </div>
        <div className="p-4 space-y-3">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => startUpdate(opt.type)}
              disabled={loading}
              className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:border-[#00C853] hover:bg-green-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <opt.icon className="h-5 w-5 text-[#00C853]" />
                <div>
                  <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{opt.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</div>
                </div>
              </div>
            </button>
          ))}
          {loading && (
            <div className="flex items-center justify-center py-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Starting research…
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
