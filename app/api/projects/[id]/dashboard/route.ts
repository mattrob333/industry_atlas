export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      industryThesis: true,
      entities: { include: { entitySegments: { include: { segment: true } } } },
      relationships: true,
      segments: true,
      opportunities: { orderBy: { opportunityScore: 'desc' } },
      threats: { orderBy: { threatScore: 'desc' } },
      researchRuns: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })
  if (!project || project.userId !== (session.user as any).id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(project)
}
