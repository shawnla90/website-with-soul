# Chapter 4: PostHog Analytics

> Add privacy-friendly analytics with a proxy pattern that bypasses ad blockers. Works without a key. Free tier is enough.

## Why PostHog

Google Analytics is blocked by every major ad blocker. That means 30-40% of your visitors are invisible. PostHog offers a generous free tier (1M events/month) and you can proxy the requests through your own domain so ad blockers never see them.

The starter includes PostHog with two design decisions:

1. **It works without a key.** No PostHog account? The provider renders children normally and tracks nothing. Your site is never broken by missing analytics.
2. **Requests proxy through your domain.** Ad blockers cannot distinguish PostHog requests from your own API calls.

## Setting Up PostHog

1. Create a free account at [posthog.com](https://posthog.com)
2. Create a project and copy your project API key
3. Add to `.env.local`:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=/ingest
```

The host is `/ingest`, not `https://us.i.posthog.com`. This is the proxy path.

## The Proxy Pattern

In `next.config.ts`, two rewrites route PostHog traffic through your own domain:

```typescript
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ]
  },
}
```

### How It Works

Without the proxy, PostHog makes requests to `us.i.posthog.com`. Ad blockers have this domain on their blocklists. With the proxy:

1. PostHog's JavaScript SDK sends requests to `yoursite.com/ingest/...`
2. Next.js rewrites catch these requests server-side
3. Next.js forwards them to `us.i.posthog.com/...`
4. PostHog receives the event data normally

The browser only sees requests to your own domain. Ad blockers see nothing suspicious.

### Static Assets

The first rewrite handles PostHog's JavaScript SDK files:

```typescript
{
  source: '/ingest/static/:path*',
  destination: 'https://us-assets.i.posthog.com/static/:path*',
}
```

The second handles all event tracking calls:

```typescript
{
  source: '/ingest/:path*',
  destination: 'https://us.i.posthog.com/:path*',
}
```

Both use the `:path*` wildcard to pass through any sub-path.

## The PostHogProvider Component

`components/PostHogProvider.tsx` wraps the entire app:

```typescript
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
```

### Configuration Choices Explained

**`person_profiles: 'identified_only'`** - PostHog only creates person profiles when you explicitly call `posthog.identify()`. Anonymous visitors track as events only. This keeps you within the free tier and respects privacy.

**`autocapture: false`** - Disables PostHog's automatic click/form tracking. You only get pageviews. This reduces noise and event volume. You can enable it later if you want click tracking.

**`capture_pageview: true`** - Tracks page views automatically, including client-side navigations in the App Router.

**Debug mode in dev** - `ph.debug()` in development logs every PostHog call to the browser console, so you can verify events are firing without checking the PostHog dashboard.

### Graceful No-Key Behavior

The key line is:

```typescript
if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return
```

If no key is set, `posthog.init()` never runs. The `PHProvider` still wraps children normally since it is just a React context provider. No errors, no console warnings, no broken rendering.

## UTM Persistence

The `loaded` callback captures UTM parameters from the URL and registers them as "super properties":

```typescript
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const utmProps: Record<string, string> = {}
for (const key of utmKeys) {
  const val = params.get(key)
  if (val) utmProps[key] = val
}
if (Object.keys(utmProps).length > 0) {
  ph.register(utmProps)
}
```

**Super properties** attach to every subsequent event in the session. If someone lands on `yoursite.com?utm_source=twitter&utm_campaign=launch`, every pageview and custom event from that session will include those UTM values.

This lets you answer questions like:
- Which Twitter post drove the most blog reads?
- What percentage of traffic from LinkedIn actually reads more than one page?
- Which campaign led to chat widget engagement?

## Layout Integration

The provider wraps the entire app in `app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
```

Because it wraps everything, PostHog tracks navigation between all pages.

## Custom Events

Once PostHog is initialized, you can track custom events anywhere in client components:

```typescript
import posthog from 'posthog-js'

// Track a custom event
posthog.capture('chat_opened')
posthog.capture('blog_post_read', { slug: 'my-post', readingTime: 5 })
posthog.capture('cta_clicked', { location: 'hero', destination: '/blog' })
```

These show up in your PostHog dashboard as custom events with properties you can filter and group by.

## Free Tier Limits

PostHog's free tier (as of 2026) includes:

- 1M events/month
- Session replay (5K recordings/month)
- Feature flags
- A/B testing
- Unlimited team members

For a personal site, 1M events/month is more than enough. A site with 10K monthly visitors generating 3 pageviews each is only 30K events. You would need 300K+ monthly visitors to approach the limit.

## Verifying It Works

1. Start your dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Open browser DevTools console
4. You should see PostHog debug output showing events being captured
5. Check your PostHog dashboard. Events should appear within a few minutes.

If you do not see debug output, verify `NEXT_PUBLIC_POSTHOG_KEY` is set in `.env.local` and restart the dev server.

## What You Have Now

After this chapter, your site has:

- PostHog analytics that works even with ad blockers
- Graceful degradation without an API key
- UTM parameter persistence across page views
- Zero impact on page load performance (async initialization)
- Free tier that handles most personal sites

Next up: [Chapter 5: Sitemap and Robots.txt](./05-sitemap-robots.md) configures your sitemap with an AI crawler allowlist so search engines and AI tools can find your content.
