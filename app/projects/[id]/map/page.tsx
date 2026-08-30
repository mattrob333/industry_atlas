import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { FullMapClient } from './full-map-client'

export default async function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      entities: true,
      relationships: true,
    },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  const data = JSON.parse(JSON.stringify(project))
  return <FullMapClient data={data} />
}
