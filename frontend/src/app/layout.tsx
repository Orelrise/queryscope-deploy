import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QueryScope - Brand vs Non-Brand SEO Analysis',
  description: 'Analyze your brand vs non-brand SEO clicks using Google Search Console data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 