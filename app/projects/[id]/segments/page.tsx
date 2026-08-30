import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SegmentsClient } from './segments-client'

export default async function SegmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      segments: { include: { entitySegments: { include: { entity: true } } } },
      entities: true,
    },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  return <SegmentsClient segments={JSON.parse(JSON.stringify(project.segments))} />
}
