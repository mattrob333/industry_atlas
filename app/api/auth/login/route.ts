export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ message: 'Use NextAuth signIn' }, { status: 200 })
}
