import TrackingStrip from '@/components/TrackingStrip'

export default function ArcadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark flex flex-col pb-20">
      {children}
      <TrackingStrip />
    </div>
  )
}
