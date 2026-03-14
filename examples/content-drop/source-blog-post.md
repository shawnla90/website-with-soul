---
title: "Building an Internal Dashboard with Next.js 15"
date: "2026-03-10"
description: "How I built a real-time internal dashboard for tracking key metrics using Next.js 15, Server Components, and a SQLite database."
tags: ["nextjs", "dashboard", "sqlite", "tutorial"]
---

Last month I needed a dashboard to track three things: daily active users, support ticket volume, and revenue by plan tier. The existing solution was a shared Google Sheet that someone updated manually every morning. It was always stale by noon.

I built the replacement in two days with Next.js 15. No complex state management. No real-time WebSocket setup. Just Server Components that query SQLite directly and refresh on page load.

## The Architecture

The dashboard is intentionally simple:

```
app/
├── dashboard/
│   ├── page.tsx          # Main dashboard (Server Component)
│   ├── layout.tsx         # Dashboard layout with nav
│   └── components/
│       ├── MetricCard.tsx # Single metric display
│       ├── Chart.tsx      # Time series chart (client)
│       └── RefreshButton.tsx # Manual refresh trigger
├── api/
│   └── metrics/route.ts   # Metrics API endpoint
└── lib/
    └── db.ts              # SQLite connection + queries
```

The key decision: the main dashboard page is a Server Component. It queries the database directly during render. No API calls from the browser. No loading spinners. The data is in the HTML when it arrives.

## Database Setup

I used `better-sqlite3` because it is synchronous (works naturally in Server Components) and requires zero infrastructure. The database file lives next to the app.

```typescript
// lib/db.ts
import Database from 'better-sqlite3'
import path from 'path'

const db = new Database(path.join(process.cwd(), 'data', 'metrics.db'))

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL')

export function getDailyActiveUsers(days: number = 30) {
  return db.prepare(`
    SELECT date, count FROM daily_active_users
    ORDER BY date DESC
    LIMIT ?
  `).all(days)
}

export function getTicketVolume(days: number = 30) {
  return db.prepare(`
    SELECT date, open, closed, pending FROM tickets
    ORDER BY date DESC
    LIMIT ?
  `).all(days)
}

export function getRevenueByTier() {
  return db.prepare(`
    SELECT tier, sum(amount) as total, count(*) as customers
    FROM subscriptions
    WHERE status = 'active'
    GROUP BY tier
    ORDER BY total DESC
  `).all()
}
```

## The Dashboard Page

The Server Component queries the database and passes data to child components:

```tsx
// app/dashboard/page.tsx
import { getDailyActiveUsers, getTicketVolume, getRevenueByTier } from '@/lib/db'
import { MetricCard } from './components/MetricCard'
import { Chart } from './components/Chart'

export default function DashboardPage() {
  const users = getDailyActiveUsers(30)
  const tickets = getTicketVolume(30)
  const revenue = getRevenueByTier()

  const todayUsers = users[0]?.count ?? 0
  const openTickets = tickets[0]?.open ?? 0
  const totalRevenue = revenue.reduce((sum, tier) => sum + tier.total, 0)

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <MetricCard label="Active Users Today" value={todayUsers} />
        <MetricCard label="Open Tickets" value={openTickets} />
        <MetricCard label="Monthly Revenue" value={`$${totalRevenue.toLocaleString()}`} />
      </div>

      <div style={{ marginTop: 32 }}>
        <Chart title="Daily Active Users" data={users} dataKey="count" />
      </div>

      <div style={{ marginTop: 32 }}>
        <Chart title="Ticket Volume" data={tickets} dataKey="open" />
      </div>
    </div>
  )
}
```

No `useEffect`. No `useState`. No loading states. The database call happens during server render. By the time the HTML reaches the browser, the numbers are already there.

## The Metric Card

A simple component that displays a single number with a label:

```tsx
// app/dashboard/components/MetricCard.tsx
export function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      padding: 20,
      background: 'var(--bg-subtle)',
      borderRadius: 8,
      border: '1px solid var(--canvas-border)',
    }}>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
    </div>
  )
}
```

## What I Would Do Differently

If I were starting over, two things:

1. **Add a cron that writes daily snapshots.** Right now the data comes from queries against the production tables. A nightly cron that writes a snapshot row to a metrics table would make historical queries faster and decouple the dashboard from production schema changes.

2. **Skip the chart library.** I used Recharts for the time series. It works but it is 40KB gzipped. For a dashboard that three people use internally, plain CSS bar charts would have been fine.

The dashboard replaced a manual process that took 15 minutes every morning. Total build time was about 12 hours across two days. It has been running for a month with zero maintenance.
