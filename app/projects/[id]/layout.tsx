import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProjectShell } from './_components/project-shell'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')
  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: { industryThesis: true },
  })
  if (!project || project.userId !== (session.user as any).id) {
    redirect('/projects')
  }
  return (
    <ProjectShell
      projectId={project.id}
      companyName={project.companyName}
      arena={project.industryThesis?.actualArena ?? null}
    >
      {children}
    </ProjectShell>
  )
}
