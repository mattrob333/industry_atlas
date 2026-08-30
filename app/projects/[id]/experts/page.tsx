export const dynamic = 'force-dynamic'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ExpertsClient } from './experts-client'
import { SOURCE_ENTITY_TYPES } from '@/lib/sources'

export default async function ExpertsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { entities: true },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  const experts = (project.entities ?? []).filter((e: any) => SOURCE_ENTITY_TYPES.includes(e.entityType))
  return <ExpertsClient projectId={id} experts={JSON.parse(JSON.stringify(experts))} />
}
