import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ChangelogClient } from './changelog-client'

export default async function ChangelogPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { researchRuns: { orderBy: { createdAt: 'desc' } } },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  return <ChangelogClient runs={JSON.parse(JSON.stringify(project.researchRuns))} />
}
