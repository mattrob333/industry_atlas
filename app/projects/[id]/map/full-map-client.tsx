'use client'
import dynamic from 'next/dynamic'

const EcosystemMap = dynamic(
  () => import('../_components/ecosystem-map').then(m => ({ default: m.EcosystemMap })),
  { ssr: false, loading: () => <div className="h-full bg-gray-50 dark:bg-white/5 animate-pulse" /> }
)

export function FullMapClient({ data }: { data: any }) {
  return (
    <div className="h-[calc(100vh-56px)]">
      <EcosystemMap
        entities={data?.entities ?? []}
        relationships={data?.relationships ?? []}
        fullScreen
      />
    </div>
  )
}
