export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      industryThesis: true,
      _count: { select: { entities: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  try {
    const body = await request.json()
    const { companyName, companyUrl, companyDescription, geography, customerScope, strategicQuestion, forecastHorizon, competitorSeeds, categoriesToExclude } = body ?? {}
    if (!companyName || !companyDescription) {
      return NextResponse.json({ error: 'Company name and description are required' }, { status: 400 })
    }
    const project = await prisma.project.create({
      data: {
        userId,
        name: companyName,
        companyName,
        companyUrl: companyUrl ?? null,
        companyDescription,
        geography: geography ?? null,
        customerScope: customerScope ?? null,
        strategicQuestion: strategicQuestion ?? null,
        forecastHorizon: forecastHorizon ?? null,
        competitorSeeds: competitorSeeds ?? null,
        categoriesToExclude: categoriesToExclude ?? null,
      },
    })
    const run = await prisma.researchRun.create({
      data: {
        projectId: project.id,
        runType: 'standard',
        status: 'pending',
      },
    })
    return NextResponse.json({ projectId: project.id, runId: run.id }, { status: 201 })
  } catch (err: any) {
    console.error('Create project error:', err)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
