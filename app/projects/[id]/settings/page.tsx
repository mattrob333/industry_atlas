'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Settings, Trash2, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params?.id as string
  const [form, setForm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/projects/${projectId}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          companyName: data?.companyName ?? '',
          companyUrl: data?.companyUrl ?? '',
          companyDescription: data?.companyDescription ?? '',
          geography: data?.geography ?? '',
          customerScope: data?.customerScope ?? '',
          strategicQuestion: data?.strategicQuestion ?? '',
          forecastHorizon: data?.forecastHorizon ?? '',
          competitorSeeds: data?.competitorSeeds ?? '',
          categoriesToExclude: data?.categoriesToExclude ?? '',
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [projectId])

  const update = (key: string, value: string) => setForm((prev: any) => ({ ...(prev ?? {}), [key]: value }))

  const save = async () => {
    setSaving(true)
    await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
  }

  const deleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return
    setDeleting(true)
    await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
    router.push('/projects')
  }

  if (loading || !form) return <div className="p-6 text-gray-400 dark:text-gray-500">Loading…</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Settings</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Edit project details and configuration.</p>

      <div className="bg-white dark:bg-[#1F1F22] rounded-xl border border-gray-200 dark:border-white/10 p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label>Company Name</Label>
            <Input value={form.companyName ?? ''} onChange={(e: any) => update('companyName', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Website</Label>
            <Input value={form.companyUrl ?? ''} onChange={(e: any) => update('companyUrl', e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={form.companyDescription ?? ''} onChange={(e: any) => update('companyDescription', e.target.value)} rows={4} />
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label>Geography</Label>
            <Input value={form.geography ?? ''} onChange={(e: any) => update('geography', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Customer Scope</Label>
            <Input value={form.customerScope ?? ''} onChange={(e: any) => update('customerScope', e.target.value)} />
          </div>
        </div>
        <Button onClick={save} disabled={saving} className="bg-[#00C853] hover:bg-[#00B84D] text-white">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="mt-8 bg-white dark:bg-[#1F1F22] rounded-xl border border-red-200 p-6">
        <h3 className="font-display font-semibold text-sm text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Permanently delete this project and all its data.</p>
        <Button variant="destructive" onClick={deleteProject} disabled={deleting}>
          {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
          Delete Project
        </Button>
      </div>
    </div>
  )
}
