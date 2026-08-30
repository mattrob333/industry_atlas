import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { TechClient } from './tech-client'

export default async function TechnologyPage({ params }: { params: Promise<{ id: string }> }) {
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
  const techEntities = (project.entities ?? []).filter((e: any) => ['technology', 'platform'].includes(e.entityType))
  const techRels = (project.relationships ?? []).filter((r: any) => ['depends_on', 'builds_on', 'integrates_with'].includes(r.relationshipType))
  return <TechClient entities={JSON.parse(JSON.stringify(techEntities))} relationships={JSON.parse(JSON.stringify(techRels))} />
}
