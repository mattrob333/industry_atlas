import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ForecastClient } from './forecast-client'

export default async function ForecastPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      industryThesis: true,
      segments: true,
      opportunities: { orderBy: { opportunityScore: 'desc' } },
      threats: { orderBy: { threatScore: 'desc' } },
    },
  })
  if (!project || project.userId !== (session.user as any).id) redirect('/projects')
  return <ForecastClient data={JSON.parse(JSON.stringify(project))} />
}
