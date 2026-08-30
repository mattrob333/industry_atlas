// Shared helper to discover industry experts & sources (experts, analysts,
// institutions, publications, events, online communities) for a project.
// Used both by the on-demand /sources API route and the research pipeline.

const LLM_URL = 'https://apps.abacus.ai/v1/chat/completions'

async function callLLM(messages: any[]): Promise<string> {
  const response = await fetch(LLM_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-5.4-mini',
      messages,
      max_tokens: 4000,
      temperature: 0.4,
      response_format: { type: 'json_object' },
    }),
  })
  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error')
    throw new Error(`LLM API error: ${response.status} - ${errText}`)
  }
  const data = await response.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

function parseSafe(text: string, fallback: any = {}): any {
  try {
    let cleaned = text?.trim() ?? ''
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim()
    }
    return JSON.parse(cleaned)
  } catch {
    return fallback
  }
}

export type SourceEntityInput = {
  entityType: string
  name: string
  description: string | null
  website: string | null
  strategicRole: string | null
  geography: string | null
  confidence: number
  metadataJson: any
}

function str(v: any): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim()
  return s.length ? s : null
}

function normalizeUrl(v: any): string | null {
  const s = str(v)
  if (!s) return null
  if (/^https?:\/\//i.test(s)) return s
  if (/^[\w-]+\.[\w.-]+/.test(s)) return `https://${s}`
  return null
}

// Returns a flat list of entity-shaped objects ready to persist.
export async function discoverSources(opts: {
  companyName: string
  companyDescription?: string | null
  geography?: string | null
  customerScope?: string | null
  arena?: string | null
}): Promise<SourceEntityInput[]> {
  const context = `Company: ${opts.companyName}\nDescription: ${opts.companyDescription ?? ''}\nGeography: ${opts.geography ?? 'Global'}\nWho they sell to: ${opts.customerScope ?? 'Not specified'}\nCompetitive arena: ${opts.arena ?? 'Not specified'}`

  const raw = await callLLM([
    {
      role: 'system',
      content:
        'You are an industry research librarian. You help founders and strategists find the real people, organizations, media, events and online communities that shape an industry — and, crucially, the specific places where their potential customers actually gather. Be concrete and specific: use real named people, real publications, real conferences, and real subreddits/forums/Slack or Discord communities/LinkedIn groups whenever possible. Return JSON only.',
    },
    {
      role: 'user',
      content: `For the industry below, produce a rich, practical "Experts & Sources" directory. Prefer real, nameable entities relevant to this exact arena. Aim for the counts requested.\n\n${context}\n\nReturn JSON with these arrays:\n{\n  "experts": [ 5-7 named individual thought leaders, practitioners or influential consultants — {"name":"person name","description":"who they are & why they matter","role":"e.g. Analyst, Founder, Author","website":"profile/LinkedIn/site URL or null"} ],\n  "analysts": [ 3-5 research/advisory firms or industry analysts (e.g. Gartner-style) — {"name":"","description":"what they cover","coverage":"focus area","website":""} ],\n  "institutions": [ 3-5 associations, standards bodies, or academic/industry institutions — {"name":"","description":"","role":"e.g. Trade association, Standards body","website":""} ],\n  "publications": [ 4-6 publications, newsletters, blogs, podcasts or reports worth following — {"name":"","description":"","mediaType":"Newsletter|Blog|Podcast|Magazine|Report","website":""} ],\n  "events": [ 4-6 conferences, trade shows or industry events where buyers and players gather — {"name":"","description":"","cadence":"e.g. Annual","location":"city/region or Virtual","website":""} ],\n  "communities": [ 5-7 online communities where potential CUSTOMERS gather — subreddits, forums, Slack/Discord groups, LinkedIn groups — {"name":"","description":"","platform":"Reddit|Forum|Slack|Discord|LinkedIn|Facebook","audience":"who is there / why relevant to finding customers","website":"URL if known or null"} ]\n}` },
  ])

  const parsed = parseSafe(raw, {})
  const out: SourceEntityInput[] = []

  for (const e of parsed?.experts ?? []) {
    if (!str(e?.name)) continue
    out.push({
      entityType: 'expert',
      name: str(e.name)!,
      description: str(e.description),
      website: normalizeUrl(e.website),
      strategicRole: str(e.role),
      geography: null,
      confidence: 0.7,
      metadataJson: { sourceCategory: 'expert', role: str(e.role) },
    })
  }
  for (const a of parsed?.analysts ?? []) {
    if (!str(a?.name)) continue
    out.push({
      entityType: 'analyst',
      name: str(a.name)!,
      description: str(a.description),
      website: normalizeUrl(a.website),
      strategicRole: str(a.coverage),
      geography: null,
      confidence: 0.7,
      metadataJson: { sourceCategory: 'analyst', coverage: str(a.coverage) },
    })
  }
  for (const i of parsed?.institutions ?? []) {
    if (!str(i?.name)) continue
    out.push({
      entityType: 'institution',
      name: str(i.name)!,
      description: str(i.description),
      website: normalizeUrl(i.website),
      strategicRole: str(i.role),
      geography: null,
      confidence: 0.7,
      metadataJson: { sourceCategory: 'institution', role: str(i.role) },
    })
  }
  for (const p of parsed?.publications ?? []) {
    if (!str(p?.name)) continue
    out.push({
      entityType: 'publication',
      name: str(p.name)!,
      description: str(p.description),
      website: normalizeUrl(p.website),
      strategicRole: str(p.mediaType),
      geography: null,
      confidence: 0.7,
      metadataJson: { sourceCategory: 'publication', mediaType: str(p.mediaType) },
    })
  }
  for (const ev of parsed?.events ?? []) {
    if (!str(ev?.name)) continue
    out.push({
      entityType: 'conference',
      name: str(ev.name)!,
      description: str(ev.description),
      website: normalizeUrl(ev.website),
      strategicRole: str(ev.cadence),
      geography: str(ev.location),
      confidence: 0.7,
      metadataJson: { sourceCategory: 'event', cadence: str(ev.cadence), location: str(ev.location) },
    })
  }
  for (const c of parsed?.communities ?? []) {
    if (!str(c?.name)) continue
    out.push({
      entityType: 'community',
      name: str(c.name)!,
      description: str(c.description),
      website: normalizeUrl(c.website),
      strategicRole: str(c.platform),
      geography: null,
      confidence: 0.7,
      metadataJson: { sourceCategory: 'community', platform: str(c.platform), audience: str(c.audience) },
    })
  }

  return out
}

// Entity types that are 'sources' — shown on the Experts & Sources page but
// hidden from the ecosystem map to avoid clutter.
export const SOURCE_ENTITY_TYPES = ['expert', 'analyst', 'institution', 'publication', 'conference', 'community']
