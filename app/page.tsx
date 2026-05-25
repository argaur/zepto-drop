import Link from 'next/link'

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 flex items-center gap-3 border-b border-surface">
        <div className="flex items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M13.5 2L4 14h7.5L10 22l10-12h-7.5L13.5 2z"
              fill="#FF2D55"
            />
          </svg>
          <span className="text-near-black font-extrabold text-xl tracking-tight">zepto</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-2 h-2 bg-success rounded-full" />
          <span className="text-xs text-muted font-semibold">10 min delivery</span>
        </div>
      </header>

      {/* Product */}
      <div className="flex-1 px-4 pt-6 pb-36">
        {/* Product image */}
        <div className="w-full aspect-square bg-surface rounded-2xl mb-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-[96px] leading-none mb-2">🍫</div>
            <p className="text-muted text-sm font-semibold">Magnum Almond</p>
          </div>
        </div>

        {/* Brand + name */}
        <div className="mb-4">
          <p className="text-muted text-xs font-semibold uppercase tracking-widest mb-1">
            Magnum · 80ml
          </p>
          <h1 className="text-near-black font-extrabold text-2xl leading-tight mb-3">
            Magnum Almond Ice Cream Bar
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-near-black text-white text-sm font-bold px-3 py-1 rounded-full">
              ₹115
            </span>
            <span className="text-muted text-sm line-through">₹130</span>
            <span className="bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-full">
              11% off
            </span>
          </div>
        </div>

        {/* Delivery promise */}
        <div className="bg-purple/5 border border-purple/20 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <p className="text-purple font-bold text-sm">10 minute delivery</p>
            <p className="text-muted text-xs">Order now · arrives before it melts</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="font-bold text-near-black mb-2 text-sm">About this product</h2>
          <p className="text-muted text-sm leading-relaxed">
            Premium vanilla ice cream on a stick, smothered in Belgian chocolate and
            covered in roasted almonds. The bar that needs no introduction.
          </p>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['80g net weight', 'Stored at −18°C', 'No artificial flavours'].map((tag) => (
            <span key={tag} className="bg-surface text-muted text-xs px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Arcade teaser */}
        <div className="bg-dark rounded-2xl px-4 py-4 flex items-center gap-3">
          <div>
            <p className="text-pink font-extrabold text-sm">🎮 Khelo Khao unlocks after order</p>
            <p className="text-muted text-xs mt-0.5">
              Play 3 games during your wait. Earn up to 20% off your next order.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto px-4 py-4 bg-white border-t border-surface">
        <Link
          href="/arcade"
          className="block w-full bg-pink text-white font-extrabold text-lg py-4 rounded-2xl text-center"
          style={{ boxShadow: '0 0 24px rgba(255,45,85,0.35)' }}
        >
          Order Now — ₹115
        </Link>
        <p className="text-center text-muted text-xs mt-2">
          Unlocks <span className="text-pink font-bold">Khelo Khao</span> · earn up to 20% off
        </p>
      </div>
    </div>
  )
}
