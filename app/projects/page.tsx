import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProjectsClient } from './_components/projects-client'

export default async function ProjectsPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const userId = (session.user as any).id
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      industryThesis: true,
      _count: { select: { entities: true } },
      researchRuns: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  })
  const serialized = projects.map((p: any) => ({
    id: p.id,
    name: p.name,
    companyName: p.companyName,
    arena: p.industryThesis?.actualArena ?? null,
    battlefield: p.industryThesis?.strategicBattlefield ?? null,
    entityCount: p._count?.entities ?? 0,
    confidence: p.industryThesis?.confidence ?? 0,
    lastRunStatus: p.researchRuns?.[0]?.status ?? null,
    updatedAt: p.updatedAt.toISOString(),
  }))
  return <ProjectsClient projects={serialized} />
}
