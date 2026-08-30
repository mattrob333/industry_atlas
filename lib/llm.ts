// Talks to the AI "brain" used for industry research and Ask the Map.
//
// Pick a provider with LLM_PROVIDER (openai | anthropic | xai).
// If you leave LLM_PROVIDER blank, we use the first API key that is set.
// You only need ONE of: OPENAI_API_KEY, ANTHROPIC_API_KEY, XAI_API_KEY.

export type LlmMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type LlmProvider = 'openai' | 'anthropic' | 'xai'

const DEFAULT_MODELS: Record<LlmProvider, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-4-5',
  xai: 'grok-3',
}

export function resolveLlmProvider(): LlmProvider {
  const explicit = (process.env.LLM_PROVIDER || '').trim().toLowerCase()
  if (explicit === 'openai' || explicit === 'anthropic' || explicit === 'xai') return explicit
  if (explicit === 'grok') return 'xai'
  if (process.env.OPENAI_API_KEY) return 'openai'
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic'
  if (process.env.XAI_API_KEY) return 'xai'
  throw new Error(
    'No LLM API key found. Set OPENAI_API_KEY (recommended), or ANTHROPIC_API_KEY, or XAI_API_KEY.',
  )
}

function modelFor(provider: LlmProvider): string {
  return (process.env.LLM_MODEL || '').trim() || DEFAULT_MODELS[provider]
}

function splitSystem(messages: LlmMessage[]): { system?: string; messages: LlmMessage[] } {
  const systemParts = messages.filter((m) => m.role === 'system').map((m) => m.content)
  const rest = messages.filter((m) => m.role !== 'system')
  return { system: systemParts.length ? systemParts.join('\n\n') : undefined, messages: rest }
}

async function completeOpenAICompatible(opts: {
  url: string
  apiKey: string
  model: string
  messages: LlmMessage[]
  jsonMode: boolean
  maxTokens: number
  temperature: number
}): Promise<string> {
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
  }
  if (opts.jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const response = await fetch(opts.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error')
    throw new Error(`LLM API error: ${response.status} - ${errText}`)
  }
  const data = await response.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

async function completeAnthropic(opts: {
  apiKey: string
  model: string
  messages: LlmMessage[]
  maxTokens: number
  temperature: number
}): Promise<string> {
  const { system, messages } = splitSystem(opts.messages)
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: opts.maxTokens,
      temperature: opts.temperature,
      system: system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })
  if (!response.ok) {
    const errText = await response.text().catch(() => 'Unknown error')
    throw new Error(`LLM API error: ${response.status} - ${errText}`)
  }
  const data = await response.json()
  const blocks = data?.content ?? []
  return blocks
    .filter((b: any) => b?.type === 'text')
    .map((b: any) => b.text)
    .join('\n')
}

/**
 * Send a chat prompt and return the model's text reply.
 * jsonMode asks the model to reply with a JSON object (used by the research pipeline).
 */
export async function completeChat(
  messages: LlmMessage[],
  opts?: { jsonMode?: boolean; maxTokens?: number; temperature?: number },
): Promise<string> {
  const jsonMode = opts?.jsonMode ?? true
  const maxTokens = opts?.maxTokens ?? 4000
  const temperature = opts?.temperature ?? 0.3
  const provider = resolveLlmProvider()
  const model = modelFor(provider)

  if (provider === 'openai') {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set.')
    return completeOpenAICompatible({
      url: 'https://api.openai.com/v1/chat/completions',
      apiKey,
      model,
      messages,
      jsonMode,
      maxTokens,
      temperature,
    })
  }

  if (provider === 'xai') {
    const apiKey = process.env.XAI_API_KEY
    if (!apiKey) throw new Error('XAI_API_KEY is not set.')
    return completeOpenAICompatible({
      url: 'https://api.x.ai/v1/chat/completions',
      apiKey,
      model,
      messages,
      jsonMode,
      maxTokens,
      temperature,
    })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set.')
  return completeAnthropic({ apiKey, model, messages, maxTokens, temperature })
}

/** Turn messy model text into a JavaScript object. Returns fallback if parsing fails. */
export function parseJson(text: string, fallback: any = {}): any {
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
