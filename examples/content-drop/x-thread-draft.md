# X Thread Draft

**Tweet 1 (Hook):**
Built an internal dashboard with Next.js 15 in 2 days.

Server Components + SQLite. No API layer. No loading spinners.

The data is in the HTML before the browser even renders it.

Here is the full breakdown:

---

**Tweet 2:**
The problem: a shared Google Sheet that someone updated manually every morning.

Three metrics. DAU, tickets, revenue.

By noon the numbers were stale. Nobody trusted them.

---

**Tweet 3:**
The fix: a Server Component that queries SQLite directly during render.

No useEffect. No useState. No fetch calls.

The database query runs on the server. The response arrives with data already in the HTML.

---

**Tweet 4:**
Why SQLite for a dashboard?

- Synchronous reads (perfect for Server Components)
- Zero infrastructure (it is a file)
- WAL mode handles concurrent reads
- No connection strings or hosted databases

For 3 internal users, it is the right tool.

---

**Tweet 5:**
Two mistakes I would fix:

1. Should have added a nightly cron to snapshot metrics into a dedicated table instead of querying production tables directly

2. Used Recharts (40KB gzipped) when CSS bar charts would have been fine for 3 people

Match your tool complexity to your audience size.

---

**Tweet 6:**
Results after one month:

- Zero maintenance
- Replaced 15 min of manual work every morning
- Total build time: ~12 hours
- Nobody asks "are these numbers current?" anymore

Sometimes the best architecture is just a Server Component and a SQLite file.
