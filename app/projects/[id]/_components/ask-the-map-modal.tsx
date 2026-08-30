'use client'
import { useState } from 'react'
import { MessageSquare, Send, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const exampleQuestions = [
  'Who controls distribution in this industry?',
  'Which suppliers have the most leverage over us?',
  'What are the three most attractive underserved segments?',
  'Which companies could acquire us?',
  'What would have to be true for this market to collapse?',
]

export function AskTheMapModal({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId: string }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [citations, setCitations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const ask = async (q: string) => {
    setQuestion(q)
    setAnswer('')
    setCitations([])
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      if (!res.ok || data?.error) {
        setAnswer(data?.error ?? 'Failed to get an answer. Please try again.')
        setCitations([])
      } else {
        setAnswer(data?.answer ?? 'No answer available.')
        setCitations(data?.citations ?? [])
      }
    } catch {
      setAnswer('Failed to get an answer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1F1F22] rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl" onClick={(e: any) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#00C853]" />
            <span className="font-display font-semibold">Ask the Map</span>
          </div>
          <button onClick={onClose}><X className="h-5 w-5 text-gray-400 dark:text-gray-500" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {!answer && !loading && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Ask a question about your industry map:</p>
              {exampleQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="block w-full text-left text-sm p-3 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 hover:dark:bg-white/10 transition-colors text-gray-700 dark:text-gray-300"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-8 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your map data…
            </div>
          )}
          {answer && !loading && (
            <div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-2 font-medium">Q: {question}</div>
              <div className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">{answer}</div>
              {citations?.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">Sources:</div>
                  {citations.map((c: string, i: number) => (
                    <div key={i} className="text-xs text-gray-500 dark:text-gray-400">• {c}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <form
            onSubmit={(e: any) => { e.preventDefault(); if (question?.trim()) ask(question) }}
            className="flex gap-2"
          >
            <Input
              value={question}
              onChange={(e: any) => setQuestion(e.target.value)}
              placeholder="Ask anything about your industry…"
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !question?.trim()} className="bg-[#00C853] hover:bg-[#00B84D] text-white">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
