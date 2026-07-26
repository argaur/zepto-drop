import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Khelo Khao — Zepto',
  description: 'Play games. Earn rewards. Your order arrives in 10 minutes.',
  openGraph: {
    title: 'Khelo Khao — Zepto',
    description: 'Play games. Earn rewards. Your order arrives in 10 minutes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-white text-near-black antialiased">
        <div className="min-h-screen max-w-[430px] mx-auto relative overflow-hidden">
          {children}
        </div>
        <script src="/analytics.js" defer />
      </body>
    </html>
  )
}
