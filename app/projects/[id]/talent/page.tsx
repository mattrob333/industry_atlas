import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { TalentClient } from './talent-client'

export default async function TalentPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      entities: true,
      relationships: { include: { sourceEntity: true, targetEntity: true } },
    },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  const talentEntities = (project.entities ?? []).filter((e: any) => ['expert', 'institution', 'supplier'].includes(e.entityType))
  const talentRels = (project.relationships ?? []).filter((r: any) => ['hires_from', 'influences'].includes(r.relationshipType))
  return <TalentClient entities={JSON.parse(JSON.stringify(talentEntities))} relationships={JSON.parse(JSON.stringify(talentRels))} />
}
