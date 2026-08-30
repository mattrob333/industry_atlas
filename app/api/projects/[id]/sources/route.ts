export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { discoverSources, SOURCE_ENTITY_TYPES } from '@/lib/sources'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { entities: true, industryThesis: true },
  })
  if (!project || project.userId !== (session.user as any).id) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const arena = (project as any).industryThesis?.actualArena ?? null
    const discovered = await discoverSources({
      companyName: project.companyName,
      companyDescription: project.companyDescription,
      geography: project.geography,
      customerScope: project.customerScope,
      arena,
    })

    // De-duplicate against existing source-type entities (case-insensitive name)
    const existingNames = new Set(
      (project.entities ?? [])
        .filter((e: any) => SOURCE_ENTITY_TYPES.includes(e.entityType))
        .map((e: any) => (e.name ?? '').trim().toLowerCase())
    )

    const toCreate = discovered.filter((d) => !existingNames.has(d.name.trim().toLowerCase()))

    let created = 0
    for (const d of toCreate) {
      await prisma.entity.create({
        data: {
          projectId: id,
          entityType: d.entityType,
          name: d.name,
          description: d.description,
          website: d.website,
          geography: d.geography,
          strategicRole: d.strategicRole,
          confidence: d.confidence,
          metadataJson: d.metadataJson,
        },
      })
      created++
    }

    return Response.json({ ok: true, created })
  } catch (err: any) {
    console.error('Sources discovery error:', err?.message)
    return Response.json({ error: err?.message ?? 'Discovery failed' }, { status: 500 })
  }
}
