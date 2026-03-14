import type { Metadata } from 'next'
import { PostHogProvider } from '@/components/PostHogProvider'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Your Site Name',
    template: '%s | Your Site Name',
  },
  description: 'A website with soul. Built with Next.js, Tailwind, and a 90% free stack.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Your Site Name',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <Navigation />
          <main style={{ minHeight: '100vh', paddingTop: 60 }}>
            {children}
          </main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  )
}
