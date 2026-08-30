'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Compass, Network, Search, Zap, ArrowRight, BarChart3, Shield, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Network,
    title: 'Ecosystem Map',
    description: 'Interactive visualization of every player, platform, supplier, and regulator in your competitive arena.',
  },
  {
    icon: Search,
    title: 'AI Research Pipeline',
    description: 'Seven-pass deep analysis identifies companies, technologies, talent flows, and market dynamics.',
  },
  {
    icon: Zap,
    title: 'Live Intelligence',
    description: 'Update your map anytime. Track who entered, who exited, and what shifted in your industry.',
  },
  {
    icon: BarChart3,
    title: 'Strategic Signals',
    description: 'Chokepoints, opportunities, and threats surfaced with confidence scores and evidence.',
  },
  {
    icon: Shield,
    title: 'Ten Steps Framework',
    description: 'Built on Steve Blank\'s methodology for mapping any industry systematically.',
  },
  {
    icon: Globe,
    title: 'Ask the Map',
    description: 'Natural language Q&A over your entire industry graph. Get cited answers instantly.',
  },
]

export function LandingContent() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-7 w-7 text-[#00C853]" />
            <span className="font-display text-xl font-bold tracking-tight text-gray-900">Industry Atlas</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-[#00C853] hover:bg-[#00B84D] text-white">Start Your Map</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Map your industry before you choose where to <span className="text-[#00C853]">play</span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Industry Atlas is a living intelligence model of the field around your company.
              Enter a company name and description — see every competitor, supplier, platform,
              technology, and opportunity mapped in real time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#00C853] hover:bg-[#00B84D] text-white px-8 h-12 text-base">
                  Start Your Map <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="h-12 text-base px-8">Sign In</Button>
              </Link>
            </div>
          </motion.div>

          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
              <div className="bg-gray-50 rounded-lg p-8 min-h-[320px] flex items-center justify-center relative overflow-hidden">
                {/* Static ecosystem preview */}
                <svg viewBox="0 0 800 400" className="w-full h-auto">
                  {/* Edges */}
                  <line x1="400" y1="200" x2="200" y2="100" stroke="#E0E0E0" strokeWidth="1.5" />
                  <line x1="400" y1="200" x2="600" y2="100" stroke="#E0E0E0" strokeWidth="1.5" />
                  <line x1="400" y1="200" x2="150" y2="300" stroke="#00BCD4" strokeWidth="1.5" opacity="0.6" />
                  <line x1="400" y1="200" x2="650" y2="300" stroke="#00BCD4" strokeWidth="1.5" opacity="0.6" />
                  <line x1="400" y1="200" x2="300" y2="340" stroke="#FFA726" strokeWidth="1.5" opacity="0.6" />
                  <line x1="400" y1="200" x2="500" y2="340" stroke="#FFA726" strokeWidth="1.5" opacity="0.6" />
                  <line x1="200" y1="100" x2="600" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="4" opacity="0.4" />
                  {/* Focal node */}
                  <circle cx="400" cy="200" r="28" fill="#00C853" stroke="white" strokeWidth="3" />
                  <text x="400" y="204" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Your Co.</text>
                  {/* Competitors */}
                  <rect x="165" y="78" width="70" height="36" rx="6" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
                  <text x="200" y="100" textAnchor="middle" fill="#333" fontSize="9">Competitor A</text>
                  <rect x="565" y="78" width="70" height="36" rx="6" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
                  <text x="600" y="100" textAnchor="middle" fill="#333" fontSize="9">Competitor B</text>
                  {/* Customers */}
                  <rect x="115" y="280" width="70" height="36" rx="6" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="1" />
                  <text x="150" y="302" textAnchor="middle" fill="#00838F" fontSize="9">Enterprise</text>
                  <rect x="615" y="280" width="70" height="36" rx="6" fill="#E0F7FA" stroke="#00BCD4" strokeWidth="1" />
                  <text x="650" y="302" textAnchor="middle" fill="#00838F" fontSize="9">SMB</text>
                  {/* Platforms */}
                  <rect x="265" y="324" width="70" height="30" rx="15" fill="#E3F2FD" stroke="#90CAF9" strokeWidth="1" />
                  <text x="300" y="343" textAnchor="middle" fill="#1565C0" fontSize="9">Platform</text>
                  <rect x="465" y="324" width="70" height="30" rx="15" fill="#FFF3E0" stroke="#FFCC80" strokeWidth="1" />
                  <text x="500" y="343" textAnchor="middle" fill="#E65100" fontSize="9">Supplier</text>
                </svg>
              </div>
              <p className="text-center text-sm text-gray-400 mt-4">Interactive ecosystem map generated by AI research</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">Enter a company. See the field.</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Industry Atlas runs a multi-pass AI research pipeline to build a living map of your competitive landscape.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#FAFAFA] rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-[#00C853]/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-[#00C853]" />
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-gray-900">Ready to map your industry?</h2>
          <p className="mt-3 text-gray-500">Start with your company name. The AI does the rest.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="mt-8 bg-[#00C853] hover:bg-[#00B84D] text-white px-10 h-12 text-base">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            <span>Industry Atlas</span>
          </div>
          <span suppressHydrationWarning>© 2026</span>
        </div>
      </footer>
    </div>
  )
}
