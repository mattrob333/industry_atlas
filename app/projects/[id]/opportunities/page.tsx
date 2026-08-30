import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { OpportunitiesClient } from './opportunities-client'

export default async function OpportunitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { opportunities: { orderBy: { opportunityScore: 'desc' } } },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  return <OpportunitiesClient opportunities={JSON.parse(JSON.stringify(project.opportunities))} projectId={id} />
}
