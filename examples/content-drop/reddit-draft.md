# Reddit Draft - r/nextjs

**Title:** Replaced a shared Google Sheet with a Next.js 15 dashboard in 2 days. Server Components made it stupidly simple.

**Body:**

We had a Google Sheet that someone updated manually every morning with three metrics: DAU, support tickets, and revenue by tier. By noon it was always stale. Nobody trusted the numbers.

I built a replacement with Next.js 15. The entire thing took about 12 hours across two days. The key insight that made it fast: the dashboard page is a Server Component that queries SQLite directly. No API layer for the dashboard itself. No loading spinners. The data is in the HTML when it arrives.

The stack:

- Next.js 15 (App Router)
- better-sqlite3 for the database
- Recharts for time series charts (though in hindsight, plain CSS charts would have been fine for 3 users)

The architecture is dead simple. The dashboard page.tsx is a Server Component that calls database functions directly:

```tsx
export default function DashboardPage() {
  const users = getDailyActiveUsers(30)
  const tickets = getTicketVolume(30)
  const revenue = getRevenueByTier()

  return (
    // render metric cards and charts with this data
  )
}
```

No useEffect. No useState. No fetch calls. The database query runs during server render. By the time the browser gets the response, the numbers are already baked into the HTML.

SQLite was the right call for this. better-sqlite3 is synchronous, which is perfect for Server Components. WAL mode handles concurrent reads. And the database is just a file sitting next to the app. No connection strings, no hosted database, no cold starts.

Two things I would change if I started over:

1. Add a nightly cron that snapshots metrics into a dedicated table. Right now it queries production tables directly. Works fine, but coupling the dashboard to the production schema is asking for trouble long-term.

2. Ditch Recharts. 40KB gzipped for charts that 3 people look at. CSS bar charts would have been plenty.

It has been running a month with zero maintenance. Replaced 15 minutes of manual work every morning.

Curious if anyone else has built internal tools with Server Components. The direct database access pattern felt almost too simple. Am I missing a footgun?
