// Web research helper. Exa finds relevant pages (like a search engine built for research).
// Firecrawl is better later if we already know a URL and want to crawl a whole site.
//
// Requires EXA_API_KEY from https://dashboard.exa.ai/api-keys

export type SearchHit = {
  title: string
  url: string
  snippet: string
  publishedDate?: string | null
}

export type SearchOptions = {
  numResults?: number
  category?: 'company' | 'people' | 'publication' | 'news' | 'personal site' | 'financial report'
}

function requireExaKey(): string {
  const key = (process.env.EXA_API_KEY || '').trim()
  if (!key) {
    throw new Error('EXA_API_KEY is not set. Add it to .env so Industry Atlas can search the web.')
  }
  return key
}

function snippetFromResult(result: any): string {
  if (Array.isArray(result?.highlights) && result.highlights.length) {
    return result.highlights.filter(Boolean).join(' ').trim()
  }
  if (typeof result?.summary === 'string' && result.summary.trim()) return result.summary.trim()
  if (typeof result?.text === 'string' && result.text.trim()) return result.text.trim().slice(0, 1200)
  return ''
}

/**
 * Search the live web and return short, cited snippets the LLM can use as evidence.
 */
export async function searchWeb(query: string, opts: SearchOptions = {}): Promise<SearchHit[]> {
  const apiKey = requireExaKey()
  const numResults = opts.numResults ?? 8
  const body: Record<string, unknown> = {
    query,
    type: 'auto',
    numResults,
    contents: {
      highlights: true,
    },
  }
  if (opts.category) body.category = opts.category

  try {
    const response = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error')
      console.error('Exa search error:', response.status, errText)
      return []
    }
    const data = await response.json()
    const results = Array.isArray(data?.results) ? data.results : []
    return results
      .map((r: any) => ({
        title: String(r?.title ?? '').trim() || r?.url || 'Untitled',
        url: String(r?.url ?? '').trim(),
        snippet: snippetFromResult(r),
        publishedDate: r?.publishedDate ?? null,
      }))
      .filter((r: SearchHit) => r.url)
  } catch (err: any) {
    console.error('Exa search failed:', err?.message)
    return []
  }
}

/**
 * Fetch the main text of a known URL (for example the company's own website).
 */
export async function fetchUrlText(url: string): Promise<SearchHit | null> {
  const apiKey = requireExaKey()
  const cleaned = url.trim()
  if (!cleaned) return null
  try {
    const response = await fetch('https://api.exa.ai/contents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        urls: [cleaned],
        text: { maxCharacters: 4000 },
      }),
    })
    if (!response.ok) {
      const errText = await response.text().catch(() => 'Unknown error')
      console.error('Exa contents error:', response.status, errText)
      return null
    }
    const data = await response.json()
    const result = data?.results?.[0]
    if (!result?.url) return null
    return {
      title: String(result.title ?? '').trim() || result.url,
      url: String(result.url),
      snippet: snippetFromResult(result) || String(result.text ?? '').slice(0, 4000),
      publishedDate: result.publishedDate ?? null,
    }
  } catch (err: any) {
    console.error('Exa contents failed:', err?.message)
    return null
  }
}

/** Turn search hits into a short brief the model can read inside a prompt. */
export function formatSearchHits(hits: SearchHit[], limit = 10000): string {
  if (!hits.length) return 'No web sources were found for this query.'
  const parts = hits.map((h, i) => {
    const date = h.publishedDate ? ` (${String(h.publishedDate).slice(0, 10)})` : ''
    const snippet = h.snippet ? `\n${h.snippet}` : ''
    return `[${i + 1}] ${h.title}${date}\n${h.url}${snippet}`
  })
  let out = parts.join('\n\n')
  if (out.length > limit) out = out.slice(0, limit) + '\n…'
  return out
}

/**
 * Run a search (and optionally read a company website) and return prompt-ready evidence.
 * If Exa is missing, this throws. If a single query fails, it returns an empty-notes string.
 */
export async function webEvidence(
  query: string,
  opts: SearchOptions & { companyUrl?: string | null } = {},
): Promise<string> {
  const hits = await searchWeb(query, opts)
  if (opts.companyUrl) {
    const page = await fetchUrlText(opts.companyUrl)
    if (page && !hits.some((h) => h.url === page.url)) hits.unshift(page)
  }
  return formatSearchHits(hits)
}
