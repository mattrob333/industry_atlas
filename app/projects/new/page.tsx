'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Compass, ArrowLeft, Loader2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    companyUrl: '',
    companyDescription: '',
    geography: '',
    customerScope: '',
    strategicQuestion: '',
    forecastHorizon: '',
    competitorSeeds: '',
    categoriesToExclude: '',
  })

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.companyName?.trim() || !form.companyDescription?.trim()) {
      setError('Company name and description are required.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Failed to create project')
        setLoading(false)
        return
      }
      router.push(`/projects/${data.projectId}/research`)
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#151517]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
          </Link>
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#00C853]" />
            <span className="font-display font-bold text-gray-900 dark:text-gray-100">New Industry Map</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Describe your company</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">The AI research pipeline will map the industry around your company.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}

          <div className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Company Name *</Label>
                <Input value={form.companyName} onChange={(e: any) => update('companyName', e.target.value)} placeholder="Acme Corp" required />
              </div>
              <div className="space-y-1.5">
                <Label>Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input value={form.companyUrl} onChange={(e: any) => update('companyUrl', e.target.value)} placeholder="https://acme.com" className="pl-10" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Company Description *</Label>
              <Textarea
                value={form.companyDescription}
                onChange={(e: any) => update('companyDescription', e.target.value)}
                placeholder="Describe what your company does, who it serves, and what problem it solves..."
                rows={5}
                required
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-5">
            <h3 className="font-display font-semibold text-gray-900 dark:text-gray-100 text-sm">Optional Context</h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Primary Geography</Label>
                <Input value={form.geography} onChange={(e: any) => update('geography', e.target.value)} placeholder="North America" />
              </div>
              <div className="space-y-1.5">
                <Label>Target Customer Size</Label>
                <Input value={form.customerScope} onChange={(e: any) => update('customerScope', e.target.value)} placeholder="Mid-market, 100-5000 employees" />
              </div>
              <div className="space-y-1.5">
                <Label>Strategic Question</Label>
                <Input value={form.strategicQuestion} onChange={(e: any) => update('strategicQuestion', e.target.value)} placeholder="Where should we expand next?" />
              </div>
              <div className="space-y-1.5">
                <Label>Forecast Horizon</Label>
                <Input value={form.forecastHorizon} onChange={(e: any) => update('forecastHorizon', e.target.value)} placeholder="2-3 years" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Known Competitors to Include</Label>
              <Input value={form.competitorSeeds} onChange={(e: any) => update('competitorSeeds', e.target.value)} placeholder="Company A, Company B, Company C" />
            </div>
            <div className="space-y-1.5">
              <Label>Categories to Exclude</Label>
              <Input value={form.categoriesToExclude} onChange={(e: any) => update('categoriesToExclude', e.target.value)} placeholder="Hardware, Consumer" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-[#00C853] hover:bg-[#00B84D] text-white text-base font-semibold">
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Build Industry Map
          </Button>
        </form>
      </main>
    </div>
  )
}
