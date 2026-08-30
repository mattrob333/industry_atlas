import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { LandingContent } from './_components/landing-content'

export default async function Home() {
  const session = await auth()
  if (session?.user) {
    redirect('/projects')
  }
  return <LandingContent />
}
