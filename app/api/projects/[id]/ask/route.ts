export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

const LLM_URL = 'https://apps.abacus.ai/v1/chat/completions'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      industryThesis: true,
      entities: true,
      relationships: { include: { sourceEntity: true, targetEntity: true } },
      segments: true,
      opportunities: true,
      threats: true,
    },
  })
  if (!project || project.userId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const body = await request.json()
  const question = body?.question
  if (!question) return NextResponse.json({ error: 'Question required' }, { status: 400 })

  const context = `
Company: ${project.companyName}
Arena: ${project.industryThesis?.actualArena ?? 'Unknown'}
Battlefield: ${project.industryThesis?.strategicBattlefield ?? 'Unknown'}

Entities (${project.entities?.length ?? 0}):
${(project.entities ?? []).map((e: any) => `- ${e.name} (${e.entityType}): ${e.description ?? 'N/A'} | Role: ${e.strategicRole ?? 'N/A'} | Chokepoint: ${e.isChokepoint}`).join('\n')}

Relationships (${project.relationships?.length ?? 0}):
${(project.relationships ?? []).map((r: any) => `- ${r.sourceEntity?.name ?? '?'} --[${r.relationshipType}]--> ${r.targetEntity?.name ?? '?'} (strength: ${r.strength})`).join('\n')}

Segments:
${(project.segments ?? []).map((s: any) => `- ${s.name}: ${s.description ?? ''} | Size: ${s.sizeValue ?? '?'} | Growth: ${s.growthRate ?? '?'}`).join('\n')}

Opportunities:
${(project.opportunities ?? []).map((o: any) => `- ${o.name}: ${o.buyerPain ?? ''} | Score: ${o.opportunityScore}`).join('\n')}

Threats:
${(project.threats ?? []).map((t: any) => `- ${t.name}: ${t.trigger ?? ''} | Score: ${t.threatScore}`).join('\n')}
`

  try {
    const response = await fetch(LLM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.4-mini',
        messages: [
          { role: 'system', content: `You are an industry intelligence analyst answering questions about a company's industry map. Use only the data provided. Distinguish between facts (from the data), estimates, and inferences. Respond ONLY with a valid JSON object of the form {"answer": string, "citations": string[]}. The "answer" field should be a clear, well-structured analysis (you may use line breaks and bullet points). The "citations" array should list the specific entities, segments, opportunities, or threats from the data that support your answer, e.g. "Entity: Gartner dossier" or "Segment: Custom AI Development".` },
          { role: 'user', content: `Industry Map Data:\n${context}\n\nQuestion: ${question}\n\nReturn your response as a JSON object with "answer" and "citations" keys.` },
        ],
        max_tokens: 3000,
        response_format: { type: 'json_object' },
      }),
    })
    const data = await response.json()
    if (data?.success === false || data?.error) {
      console.error('LLM error:', data?.error)
      return NextResponse.json({ error: 'The analyst could not process this question. Please try again.' }, { status: 502 })
    }
    const content = data?.choices?.[0]?.message?.content ?? ''
    let parsed: any = {}
    try {
      parsed = JSON.parse(content)
    } catch {
      parsed = { answer: content, citations: [] }
    }
    const answer = parsed?.answer ?? content
    if (!answer || !String(answer).trim()) {
      return NextResponse.json({ error: 'No answer could be generated. Please try again.' }, { status: 502 })
    }
    return NextResponse.json({
      answer,
      citations: parsed?.citations ?? [],
    })
  } catch (err: any) {
    console.error('Ask error:', err)
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 })
  }
}
