import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PlayersClient } from './players-client'

export default async function PlayersPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      entities: { include: { entitySegments: { include: { segment: true } } } },
      relationships: true,
    },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  return <PlayersClient entities={JSON.parse(JSON.stringify(project.entities))} relationships={JSON.parse(JSON.stringify(project.relationships))} />
}
