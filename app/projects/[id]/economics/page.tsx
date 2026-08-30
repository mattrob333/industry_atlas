import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { EconomicsClient } from './economics-client'

export default async function EconomicsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      entities: true,
      relationships: { include: { sourceEntity: true, targetEntity: true } },
      segments: true,
    },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  const buyers = (project.entities ?? []).filter((e: any) => e.entityType === 'customer')
  const moneyRels = (project.relationships ?? []).filter((r: any) => ['sells_to', 'buys_from', 'supplies'].includes(r.relationshipType))
  return <EconomicsClient buyers={JSON.parse(JSON.stringify(buyers))} relationships={JSON.parse(JSON.stringify(moneyRels))} segments={JSON.parse(JSON.stringify(project.segments))} />
}
