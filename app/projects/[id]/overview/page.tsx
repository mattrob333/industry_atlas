import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { OverviewClient } from './overview-client'

export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      industryThesis: true,
      entities: { include: { entitySegments: { include: { segment: true } } } },
      relationships: { include: { sourceEntity: true, targetEntity: true } },
      segments: true,
      opportunities: { orderBy: { opportunityScore: 'desc' }, take: 3 },
      threats: { orderBy: { threatScore: 'desc' }, take: 3 },
      researchRuns: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')

  const data = JSON.parse(JSON.stringify(project))
  return <OverviewClient data={data} />
}
