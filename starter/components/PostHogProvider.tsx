'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest',
      person_profiles: 'identified_only',
      autocapture: false,
      capture_pageview: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug()

        // Persist UTM params as super properties
        const params = new URLSearchParams(window.location.search)
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
        const utmProps: Record<string, string> = {}
        for (const key of utmKeys) {
          const val = params.get(key)
          if (val) utmProps[key] = val
        }
        if (Object.keys(utmProps).length > 0) {
          ph.register(utmProps)
        }
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
