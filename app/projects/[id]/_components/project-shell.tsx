'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Compass, LayoutDashboard, Network, Layers, Users, Cpu, DollarSign,
  GraduationCap, BookOpen, History, TrendingUp, Lightbulb, FileText,
  Settings, MessageSquare, RefreshCw, Menu, X, ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AskTheMapModal } from './ask-the-map-modal'
import { UpdateMapModal } from './update-map-modal'
import { ThemeToggle } from '@/components/theme-toggle'

const navItems = [
  { href: 'overview', label: 'Overview', icon: LayoutDashboard },
  { href: 'map', label: 'Ecosystem Map', icon: Network },
  { href: 'segments', label: 'Segments', icon: Layers },
  { href: 'players', label: 'Players', icon: Users },
  { href: 'technology', label: 'Technology Flow', icon: Cpu },
  { href: 'economics', label: 'Economic Flow', icon: DollarSign },
  { href: 'talent', label: 'Talent Flow', icon: GraduationCap },
  { href: 'experts', label: 'Experts & Sources', icon: BookOpen },
  { href: 'history', label: 'History', icon: History },
  { href: 'forecast', label: 'Forecast', icon: TrendingUp },
  { href: 'opportunities', label: 'Opportunities', icon: Lightbulb },
  { href: 'changelog', label: 'Change Log', icon: FileText },
  { href: 'settings', label: 'Settings', icon: Settings },
]

export function ProjectShell({
  projectId,
  companyName,
  arena,
  children,
}: {
  projectId: string
  companyName: string
  arena: string | null
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [askOpen, setAskOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)

  // Check if we're on the research page - if so, render children without shell
  if (pathname?.includes('/research')) {
    return <>{children}</>
  }

  const basePath = `/projects/${projectId}`
  const initials = companyName?.slice(0, 2)?.toUpperCase() ?? 'IA'

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA] dark:bg-[#151517]">
      {/* Sidebar */}
      <aside className={`sidebar-gradient w-[220px] flex-shrink-0 flex flex-col text-white ${
        mobileOpen ? 'fixed inset-0 z-50 w-full md:relative md:w-[220px]' : 'hidden md:flex'
      }`}>
        <div className="p-4 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00C853] flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{companyName}</div>
              {arena && <div className="text-[10px] text-gray-400 truncate">{arena}</div>}
            </div>
          </Link>
          <button className="md:hidden text-gray-400" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === `${basePath}/${item.href}` || (item.href === 'overview' && pathname === basePath)
            return (
              <Link
                key={item.href}
                href={`${basePath}/${item.href}`}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-[#00C853] font-medium'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link href="/projects" className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300">
            <ChevronLeft className="h-3 w-3" /> All Projects
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C1C1E] flex items-center px-4 gap-3 flex-shrink-0">
          <button className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
          <div className="flex-1" />
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={() => setAskOpen(true)} className="text-xs">
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Ask the Map
          </Button>
          <Button variant="outline" size="sm" onClick={() => setUpdateOpen(true)} className="text-xs">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Update Map
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      <AskTheMapModal open={askOpen} onClose={() => setAskOpen(false)} projectId={projectId} />
      <UpdateMapModal open={updateOpen} onClose={() => setUpdateOpen(false)} projectId={projectId} />
    </div>
  )
}
