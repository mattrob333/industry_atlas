export const dynamic = "force-dynamic";
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { completeChat, parseJson, resolveLlmProvider } from '@/lib/llm'
import { webEvidence } from '@/lib/search'
import { discoverSources } from '@/lib/sources'

/**
 * Fail before any research stages run when search/AI keys are missing.
 * Without this, each pass catches the error and the UI looks like a successful
 * empty map (0 entities) instead of an obvious configuration problem.
 */
function missingResearchConfigError(): string | null {
  const exaMissing = !(process.env.EXA_API_KEY || '').trim()
  let llmMissing = false
  try {
    resolveLlmProvider()
  } catch {
    llmMissing = true
  }

  if (!exaMissing && !llmMissing) return null

  const parts: string[] = []
  if (exaMissing) {
    parts.push('EXA_API_KEY is missing — web search cannot run.')
  }
  if (llmMissing) {
    parts.push('No AI key found — set OPENAI_API_KEY (or ANTHROPIC_API_KEY / XAI_API_KEY).')
  }
  parts.push('Add the keys as Cursor secrets, restart the app, then start research again.')
  return parts.join(' ')
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })
  if (!project || project.userId !== (session.user as any).id) {
    return new Response('Not found', { status: 404 })
  }

  // Find the latest pending run or create one
  let run = await prisma.researchRun.findFirst({
    where: { projectId: id, status: { in: ['pending', 'running'] } },
    orderBy: { createdAt: 'desc' },
  })

  if (!run) {
    // If no pending run, check if we have a completed one that actually produced data.
    // Empty "completed" runs happen when keys were missing and passes failed quietly —
    // those should not block a real retry.
    const completed = await prisma.researchRun.findFirst({
      where: { projectId: id, status: 'completed' },
      orderBy: { createdAt: 'desc' },
    })
    const entityCount = await prisma.entity.count({ where: { projectId: id } })
    if (completed && entityCount > 0) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'complete',
            entityCount,
            sourceCount: completed.sourceCount ?? entityCount,
            summary: completed.summary ?? 'Research already completed.',
          })}\n\n`))
          controller.close()
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }
    // Create a new run (first time, or retry after an empty/failed pass)
    run = await prisma.researchRun.create({
      data: { projectId: id, runType: 'standard', status: 'pending' },
    })
  }

  const runId = run.id
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch { /* controller closed */ }
      }

      try {
        // Stop immediately if Exa / LLM keys are not available.
        // Previously each pass failed quietly and the run was marked "completed"
        // with zero entities — which looks like "search never ran".
        const configError = missingResearchConfigError()
        if (configError) {
          console.error('Research aborted — missing API keys:', configError)
          await prisma.researchRun.update({
            where: { id: runId },
            data: {
              status: 'failed',
              error: configError,
              completedAt: new Date(),
            },
          })
          send({ type: 'error', message: configError })
          return
        }

        await prisma.researchRun.update({
          where: { id: runId },
          data: { status: 'running', startedAt: new Date() },
        })

        const companyContext = `Company: ${project.companyName}\nDescription: ${project.companyDescription}\nGeography: ${project.geography ?? 'Global'}\nCustomer scope: ${project.customerScope ?? 'Not specified'}\nCompetitor seeds: ${project.competitorSeeds ?? 'None specified'}\nCategories to exclude: ${project.categoriesToExclude ?? 'None'}\nStrategic question: ${project.strategicQuestion ?? 'Not specified'}`

        let allEntities: any[] = []
        let allRelationships: any[] = []
        let allSegments: any[] = []

        // PASS 1: Industry Classification
        send({ type: 'stage_start', stage: 1, label: 'Defining the field' })
        let thesis: any = {}
        try {
          const fieldNotes = await webEvidence(
            `${project.companyName} ${project.companyDescription} industry competitors market`,
            { companyUrl: project.companyUrl, numResults: 8 },
          )
          const raw = await completeChat([
            { role: 'system', content: 'You are an expert industry analyst. Use the web evidence when it is relevant. Prefer real, named markets over generic labels. Return JSON only.' },
            { role: 'user', content: `Analyze this company and determine its actual competitive arena.\n\n${companyContext}\n\nWeb evidence:\n${fieldNotes}\n\nRespond in JSON:\n{"statedCategory": "what the company calls itself", "actualArena": "the real competitive arena", "strategicBattlefield": "the specific battlefield where competition happens", "includedSegments": ["seg1", "seg2"], "excludedSegments": ["seg1"]}` },
          ])
          thesis = parseJson(raw)
          if (thesis.statedCategory) {
            await prisma.industryThesis.upsert({
              where: { projectId: id },
              create: { projectId: id, statedCategory: thesis.statedCategory ?? '', actualArena: thesis.actualArena ?? '', strategicBattlefield: thesis.strategicBattlefield ?? '', confidence: 0.75 },
              update: { statedCategory: thesis.statedCategory ?? '', actualArena: thesis.actualArena ?? '', strategicBattlefield: thesis.strategicBattlefield ?? '', confidence: 0.75 },
            })
            send({ type: 'thesis_ready', statedCategory: thesis.statedCategory, actualArena: thesis.actualArena, strategicBattlefield: thesis.strategicBattlefield })
          }
        } catch (err: any) {
          console.error('Pass 1 error:', err?.message)
        }
        send({ type: 'stage_complete', stage: 1, entitiesFound: 0 })
        send({ type: 'heartbeat' })

        // PASS 2: Segment Discovery
        send({ type: 'stage_start', stage: 2, label: 'Finding segments' })
        try {
          const segmentNotes = await webEvidence(
            `${thesis.actualArena ?? project.companyName} market segments size growth buyers`,
            { numResults: 8 },
          )
          const raw = await completeChat([
            { role: 'system', content: 'You are an industry analyst. Use the web evidence for sizing and trends when available. Return JSON only.' },
            { role: 'user', content: `Given this company and arena, identify 4-8 market segments.\n\n${companyContext}\nArena: ${thesis.actualArena ?? 'Unknown'}\n\nWeb evidence:\n${segmentNotes}\n\nRespond in JSON:\n{"segments": [{"name": "...", "description": "...", "sizeEstimate": "$X billion", "growthRate": "X%", "capitalIntensity": "Low/Medium/High", "competitiveIntensity": "Low/Medium/High", "buyerGroups": "...", "majorTechnologies": "...", "trends": "..."}]}` },
          ])
          const parsed = parseJson(raw)
          const segments = parsed?.segments ?? []
          for (const seg of segments) {
            const created = await prisma.segment.create({
              data: {
                projectId: id,
                name: seg.name ?? 'Unknown Segment',
                description: seg.description ?? null,
                sizeValue: seg.sizeEstimate ?? null,
                growthRate: seg.growthRate ?? null,
                capitalIntensity: seg.capitalIntensity ?? null,
                competitiveIntensity: seg.competitiveIntensity ?? null,
                buyerGroups: seg.buyerGroups ?? null,
                majorTechnologies: seg.majorTechnologies ?? null,
                trends: seg.trends ?? null,
              },
            })
            allSegments.push({ ...seg, dbId: created.id })
          }
        } catch (err: any) {
          console.error('Pass 2 error:', err?.message)
        }
        send({ type: 'stage_complete', stage: 2, entitiesFound: allSegments.length })
        send({ type: 'heartbeat' })

        // PASS 3: Entity Discovery
        send({ type: 'stage_start', stage: 3, label: 'Identifying companies and institutions' })
        try {
          const entityNotes = await webEvidence(
            `${thesis.actualArena ?? project.companyName} ${project.companyName} competitors platforms suppliers regulators`,
            { category: 'company', numResults: 10 },
          )
          const raw = await completeChat([
            { role: 'system', content: 'You are an industry analyst. Prefer real companies and institutions that appear in the web evidence. Invent as little as possible. Return JSON only.' },
            { role: 'user', content: `Identify 15-30 key entities in this industry ecosystem.\n\n${companyContext}\nArena: ${thesis.actualArena ?? 'Unknown'}\nSegments: ${allSegments.map((s: any) => s.name).join(', ')}\n\nInclude the focal company itself, competitors, technology platforms, customer groups, supplier groups, experts, institutions, and regulators.\n\nWeb evidence:\n${entityNotes}\n\nRespond in JSON:\n{"entities": [{"name": "...", "entityType": "focal_company|company|segment|customer|supplier|technology|platform|expert|institution|regulator|opportunity|threat", "description": "...", "geography": "...", "strategicRole": "...", "website": "...", "revenue": "...", "employees": "...", "founded": "...", "funding": "...", "products": "..."}]}` },
          ])
          const parsed = parseJson(raw)
          const entities = parsed?.entities ?? []
          for (const ent of entities) {
            const created = await prisma.entity.create({
              data: {
                projectId: id,
                entityType: ent.entityType ?? 'company',
                name: ent.name ?? 'Unknown',
                description: ent.description ?? null,
                website: ent.website ?? null,
                geography: ent.geography ?? null,
                revenue: ent.revenue ?? null,
                employees: ent.employees ?? null,
                founded: ent.founded ?? null,
                funding: ent.funding ?? null,
                products: ent.products ?? null,
                strategicRole: ent.strategicRole ?? null,
                confidence: 0.7,
              },
            })
            allEntities.push({ ...ent, dbId: created.id })
            send({ type: 'entity_discovered', name: ent.name, entityType: ent.entityType })
          }
        } catch (err: any) {
          console.error('Pass 3 error:', err?.message)
        }
        send({ type: 'stage_complete', stage: 3, entitiesFound: allEntities.length })
        send({ type: 'heartbeat' })

        // PASS 4: Technology mapping (combined with entity enrichment)
        send({ type: 'stage_start', stage: 4, label: 'Mapping technology dependencies' })
        send({ type: 'stage_complete', stage: 4, entitiesFound: 0 })
        send({ type: 'heartbeat' })

        // PASS 5: Buyers and money flows
        send({ type: 'stage_start', stage: 5, label: 'Mapping buyers and money flows' })
        send({ type: 'stage_complete', stage: 5, entitiesFound: 0 })
        send({ type: 'heartbeat' })

        // PASS 6: Talent and influence
        send({ type: 'stage_start', stage: 6, label: 'Mapping talent and influence' })
        send({ type: 'stage_complete', stage: 6, entitiesFound: 0 })
        send({ type: 'heartbeat' })

        // PASS 7 (was 5): Relationship Extraction
        send({ type: 'stage_start', stage: 7, label: 'Quantifying leaders and growth' })
        try {
          const entityNames = allEntities.map((e: any) => `${e.name} (${e.entityType})`).join(', ')
          const raw = await completeChat([
            { role: 'system', content: 'You are an industry analyst. Return JSON only.' },
            { role: 'user', content: `Map relationships between these industry entities.\n\nEntities: ${entityNames}\n\nFor each relationship, specify:\n- sourceEntityName (must match an entity name above)\n- targetEntityName (must match an entity name above)\n- relationshipType: one of competes_with, sells_to, buys_from, supplies, builds_on, depends_on, substitutes_for, integrates_with, partners_with, acquired, regulates, influences, hires_from\n- label (optional short description)\n- strength (0-1)\n- inferred (true/false)\n\nRespond in JSON:\n{"relationships": [{"sourceEntityName": "...", "targetEntityName": "...", "relationshipType": "...", "label": "...", "strength": 0.7, "inferred": false}]}` },
          ])
          const parsed = parseJson(raw)
          const rels = parsed?.relationships ?? []
          const entityMap = new Map(allEntities.map((e: any) => [e.name?.toLowerCase(), e.dbId]))
          for (const rel of rels) {
            const srcId = entityMap.get(rel.sourceEntityName?.toLowerCase())
            const tgtId = entityMap.get(rel.targetEntityName?.toLowerCase())
            if (srcId && tgtId) {
              const created = await prisma.relationship.create({
                data: {
                  projectId: id,
                  sourceEntityId: srcId,
                  targetEntityId: tgtId,
                  relationshipType: rel.relationshipType ?? 'partners_with',
                  label: rel.label ?? null,
                  strength: typeof rel.strength === 'number' ? rel.strength : 0.5,
                  inferred: rel.inferred ?? false,
                  confidence: 0.7,
                },
              })
              allRelationships.push(created)
            }
          }
        } catch (err: any) {
          console.error('Pass 7 error:', err?.message)
        }
        send({ type: 'stage_complete', stage: 7, entitiesFound: allRelationships.length })
        send({ type: 'heartbeat' })

        // PASS 8: Discover experts & sources (people, publications, events, communities)
        send({ type: 'stage_start', stage: 8, label: 'Finding experts, communities and sources' })
        try {
          const sources = await discoverSources({
            companyName: project.companyName,
            companyDescription: project.companyDescription,
            geography: project.geography,
            customerScope: project.customerScope,
            arena: thesis.actualArena ?? null,
          })
          const existingNames = new Set(allEntities.map((e: any) => (e.name ?? '').trim().toLowerCase()))
          for (const s of sources) {
            if (existingNames.has(s.name.trim().toLowerCase())) continue
            existingNames.add(s.name.trim().toLowerCase())
            const created = await prisma.entity.create({
              data: {
                projectId: id,
                entityType: s.entityType,
                name: s.name,
                description: s.description,
                website: s.website,
                geography: s.geography,
                strategicRole: s.strategicRole,
                confidence: s.confidence,
                metadataJson: s.metadataJson,
              },
            })
            allEntities.push({ ...s, dbId: created.id })
            send({ type: 'entity_discovered', name: s.name, entityType: s.entityType })
          }
        } catch (err: any) {
          console.error('Pass 8 (sources) error:', err?.message)
        }
        send({ type: 'stage_complete', stage: 8, entitiesFound: 0, sourcesFound: allEntities.length })
        send({ type: 'heartbeat' })

        // PASS 9 (was 6): Strategic Analysis
        send({ type: 'stage_start', stage: 9, label: 'Finding chokepoints and whitespace' })
        try {
          const entitySummary = allEntities.map((e: any) => `${e.name} (${e.entityType}): ${e.description ?? ''}`).join('\n')
          const newsNotes = await webEvidence(
            `${thesis.actualArena ?? project.companyName} market opportunities threats regulation`,
            { category: 'news', numResults: 8 },
          )
          const raw = await completeChat([
            { role: 'system', content: 'You are a strategic analyst. Ground opportunities and threats in the web evidence when possible. Return JSON only.' },
            { role: 'user', content: `Analyze this industry ecosystem for strategic insights.\n\nCompany: ${project.companyName}\nArena: ${thesis.actualArena ?? 'Unknown'}\n\nEntities:\n${entitySummary}\n\nRecent web evidence:\n${newsNotes}\n\nReturn JSON:\n{"chokepoints": [{"entityName": "...", "chokepointScore": 0.8, "reason": "..."}], "opportunities": [{"name": "...", "buyerPain": "...", "whyUnderserved": "...", "marketEvidence": "...", "focalFit": "...", "timeHorizon": "...", "opportunityScore": 0.7}], "threats": [{"name": "...", "trigger": "...", "probability": 0.5, "impact": 0.7, "threatScore": 0.6, "exposedAreas": "...", "indicators": "..."}]}` },
          ])
          const parsed = parseJson(raw)

          // Update chokepoints
          for (const cp of (parsed?.chokepoints ?? [])) {
            const ent = allEntities.find((e: any) => e.name?.toLowerCase() === cp.entityName?.toLowerCase())
            if (ent?.dbId) {
              await prisma.entity.update({
                where: { id: ent.dbId },
                data: { isChokepoint: true, chokepointScore: cp.chokepointScore ?? 0.5 },
              })
            }
          }

          // Create opportunities
          for (const opp of (parsed?.opportunities ?? [])) {
            await prisma.opportunity.create({
              data: {
                projectId: id,
                name: opp.name ?? 'Unnamed Opportunity',
                buyerPain: opp.buyerPain ?? null,
                whyUnderserved: opp.whyUnderserved ?? null,
                marketEvidence: opp.marketEvidence ?? null,
                focalFit: opp.focalFit ?? null,
                timeHorizon: opp.timeHorizon ?? null,
                opportunityScore: typeof opp.opportunityScore === 'number' ? opp.opportunityScore : 0.5,
              },
            })
          }

          // Create threats
          for (const thr of (parsed?.threats ?? [])) {
            await prisma.threat.create({
              data: {
                projectId: id,
                name: thr.name ?? 'Unnamed Threat',
                trigger: thr.trigger ?? null,
                probability: typeof thr.probability === 'number' ? thr.probability : 0.5,
                impact: typeof thr.impact === 'number' ? thr.impact : 0.5,
                threatScore: typeof thr.threatScore === 'number' ? thr.threatScore : 0.5,
                exposedAreas: thr.exposedAreas ?? null,
                indicators: thr.indicators ?? null,
              },
            })
          }
        } catch (err: any) {
          console.error('Pass 9 error:', err?.message)
        }
        send({ type: 'stage_complete', stage: 9, entitiesFound: 0 })
        send({ type: 'heartbeat' })

        // PASS 10 (was 7): Synthesis / Forecast
        send({ type: 'stage_start', stage: 10, label: 'Building the forecast' })
        let summaryText = ''
        try {
          const raw = await completeChat([
            { role: 'system', content: 'You are an industry analyst. Return JSON only.' },
            { role: 'user', content: `Synthesize an executive summary for this industry map.\n\nCompany: ${project.companyName}\nArena: ${thesis.actualArena ?? 'Unknown'}\nBattlefield: ${thesis.strategicBattlefield ?? 'Unknown'}\nEntities found: ${allEntities.length}\nRelationships mapped: ${allRelationships.length}\nSegments: ${allSegments.map((s: any) => s.name).join(', ')}\n\nReturn JSON:\n{"summary": "2-3 paragraph executive summary", "marketSizeEstimate": "$X billion", "growthRate": "X%", "competitiveIntensity": "Low/Medium/High", "recommendations": ["rec1", "rec2", "rec3"]}` },
          ])
          const parsed = parseJson(raw)
          summaryText = parsed?.summary ?? 'Research complete.'
        } catch (err: any) {
          console.error('Pass 10 error:', err?.message)
          summaryText = 'Research completed with partial results.'
        }
        send({ type: 'stage_complete', stage: 10, entitiesFound: 0 })

        // Finalize
        await prisma.researchRun.update({
          where: { id: runId },
          data: {
            status: 'completed',
            completedAt: new Date(),
            entityCount: allEntities.length,
            sourceCount: allEntities.length + allRelationships.length,
            summary: summaryText,
            stageNumber: 10,
          },
        })

        send({
          type: 'complete',
          entityCount: allEntities.length,
          sourceCount: allEntities.length + allRelationships.length,
          summary: summaryText,
        })
      } catch (err: any) {
        console.error('Research pipeline error:', err)
        await prisma.researchRun.update({
          where: { id: runId },
          data: { status: 'failed', error: err?.message ?? 'Unknown error' },
        }).catch(() => {})
        send({ type: 'error', message: err?.message ?? 'Research pipeline failed' })
      } finally {
        try { controller.close() } catch { /* already closed */ }
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
