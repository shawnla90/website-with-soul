# LinkedIn Draft

We had a Google Sheet that someone updated every morning with our key metrics.

DAU. Support tickets. Revenue by tier.

By noon, the numbers were stale. Nobody trusted them.

So I built a replacement dashboard with Next.js 15. Took about 12 hours across two days.

The secret: Server Components query the database directly during render. No API layer. No loading spinners. The data is in the HTML when it arrives in the browser.

The stack was minimal:
- Next.js 15 with App Router
- SQLite (better-sqlite3)
- One chart library (that I probably did not need)

The dashboard page is a Server Component. It calls the database, gets the numbers, and renders them. No useEffect. No useState. No fetch calls.

Two lessons from building it:

First, SQLite is wildly underrated for internal tools. Zero infrastructure. The database is a file. No connection strings, no hosted service, no cold starts. For a tool that 3 people use, it is perfect.

Second, I over-engineered the charts. Recharts is 40KB gzipped. For an internal dashboard, plain CSS bar charts would have been fine. Lesson learned: match the complexity of your tools to the size of your audience.

The dashboard replaced 15 minutes of manual work every morning. It has been running a month with zero maintenance.

Sometimes the best architecture is the simplest one that works.
