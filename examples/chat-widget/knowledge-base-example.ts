/**
 * Example knowledge base for the RAG chat widget.
 *
 * This file shows how to structure knowledge items, synonym maps,
 * and the config export for a fictional developer portfolio site.
 *
 * The chat widget uses keyword matching to find relevant knowledge
 * items and includes them as context when generating responses.
 */

export interface KnowledgeItem {
  id: string
  keywords: string[]
  content: string
  priority?: number // Higher = more likely to be selected when multiple items match
}

export interface SynonymMap {
  [key: string]: string[]
}

export interface ChatConfig {
  siteName: string
  ownerName: string
  personality: string
  knowledge: KnowledgeItem[]
  synonyms: SynonymMap
  fallbackResponse: string
}

// ─── Knowledge Items ─────────────────────────────────────────

const knowledge: KnowledgeItem[] = [
  {
    id: 'about',
    keywords: ['who', 'about', 'background', 'bio', 'introduction', 'yourself'],
    content: `Alex is a software engineer who builds SaaS tools for small teams.
Previously spent 8 years doing backend engineering at a mid-size company.
Now works independently, building and selling software products.
Based in Portland, OR. Has been independent for about two years.`,
    priority: 10,
  },
  {
    id: 'products',
    keywords: ['products', 'tools', 'build', 'built', 'saas', 'software', 'apps', 'projects'],
    content: `Alex currently maintains two products:
1. InvoiceTrack - A simple invoice tracker for freelancers and small agencies. Built with Next.js and SQLite. About 340 paying customers.
2. QueuePilot - A job queue dashboard that connects to Redis and BullMQ. Launched 3 months ago. Early traction with about 80 users.
Both are bootstrapped with no outside funding.`,
    priority: 8,
  },
  {
    id: 'tech-stack',
    keywords: ['stack', 'technology', 'tech', 'framework', 'language', 'tools', 'nextjs', 'typescript', 'react'],
    content: `Alex's primary stack:
- TypeScript and React for frontends
- Next.js 15 with App Router for full-stack apps
- SQLite (via better-sqlite3) for most databases
- Postgres when SQLite does not fit (multi-region, heavy writes)
- Tailwind CSS for styling
- Cloudflare Pages for hosting
- Stripe for payments
- Resend for transactional email`,
    priority: 7,
  },
  {
    id: 'blog',
    keywords: ['blog', 'writing', 'posts', 'articles', 'content', 'read'],
    content: `Alex writes a blog at alexchen.dev/blog. Topics include:
- Building and shipping SaaS products as a solo founder
- Technical deep-dives on Next.js, SQLite, and TypeScript
- Revenue and growth updates (transparent about numbers)
- Lessons from mistakes and failed experiments
Posts go out roughly once a week. No newsletter yet.`,
    priority: 6,
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'hire', 'work', 'consulting', 'freelance', 'available'],
    content: `Best way to reach Alex is email: hello@alexchen.dev
Also active on X/Twitter: @alexchendev
Not currently available for freelance or consulting work.
Open to collaborations on open source projects.`,
    priority: 9,
  },
  {
    id: 'open-source',
    keywords: ['open', 'source', 'github', 'repo', 'repository', 'contribute', 'oss'],
    content: `Alex maintains a few open source projects on GitHub (github.com/alexchendev):
- sqlite-health: A CLI tool that runs diagnostics on SQLite databases
- next-og-edge: A lightweight OG image generator for Next.js edge runtime
- markdown-pipeline: Unified remark/rehype pipeline with sensible defaults
All MIT licensed. PRs welcome.`,
    priority: 5,
  },
  {
    id: 'pricing-philosophy',
    keywords: ['pricing', 'price', 'cost', 'free', 'plan', 'tier', 'money', 'revenue', 'charge'],
    content: `Alex's pricing approach for SaaS:
- Simple pricing. One or two tiers max. No enterprise tier unless someone asks.
- Free tier is limited but genuinely useful (not crippled).
- Prices are public. No "contact sales" gates.
- InvoiceTrack: Free for up to 5 clients, $12/month for unlimited.
- QueuePilot: Free for 1 queue, $19/month for unlimited queues.`,
    priority: 4,
  },
  {
    id: 'indie-journey',
    keywords: ['indie', 'independent', 'solo', 'founder', 'bootstrap', 'journey', 'quit', 'job', 'corporate'],
    content: `Alex left a full-time engineering job two years ago to build products independently.
First year was rough. One product launched (InvoiceTrack), slow growth, lived off savings.
Second year hit a stride. InvoiceTrack reached profitability. QueuePilot launched.
Total MRR across both products is around $8,200 as of early 2026.
Writes openly about the financial and emotional reality of going independent.`,
    priority: 6,
  },
  {
    id: 'site-info',
    keywords: ['site', 'website', 'how', 'made', 'built', 'design', 'theme', 'dark'],
    content: `This website (alexchen.dev) is built with:
- Next.js 15 and the App Router
- Markdown blog with frontmatter metadata
- Dark terminal theme with CSS custom properties
- Hosted on Cloudflare Pages
- No analytics tracking (respects privacy)
- Chat widget powered by Claude with keyword-based RAG retrieval
The source code is not public, but Alex has written about the architecture on the blog.`,
    priority: 3,
  },
  {
    id: 'values',
    keywords: ['values', 'believe', 'philosophy', 'approach', 'principles', 'care'],
    content: `What Alex cares about:
- Simplicity over cleverness. The best code is the least code.
- Ship early, fix fast. Perfection is procrastination with a better reputation.
- Transparency. Revenue numbers, mistakes, and trade-offs are shared openly.
- Respect for users. No dark patterns, no manipulative pricing, no data selling.
- Sustainability over growth. Profitable and calm beats fast and fragile.`,
    priority: 5,
  },
]

// ─── Synonym Map ─────────────────────────────────────────────
// Maps common variations to canonical keywords so the matching
// engine finds relevant items even when the user phrases things
// differently.

const synonyms: SynonymMap = {
  'tech': ['technology', 'stack', 'tools', 'framework'],
  'hire': ['work', 'consulting', 'freelance', 'available', 'contract'],
  'app': ['product', 'tool', 'software', 'saas'],
  'money': ['revenue', 'pricing', 'income', 'mrr', 'cost'],
  'job': ['work', 'career', 'employment', 'corporate'],
  'code': ['programming', 'development', 'engineering', 'coding'],
  'help': ['support', 'assist', 'question'],
  'social': ['twitter', 'x', 'github', 'contact'],
}

// ─── Config Export ────────────────────────────────────────────

const chatConfig: ChatConfig = {
  siteName: 'alexchen.dev',
  ownerName: 'Alex Chen',
  personality: `You are a helpful chat assistant for Alex Chen's personal website.
You are friendly, concise, and direct. You answer questions about Alex,
the products, the blog, and the tech stack. If you do not know something,
say so honestly instead of guessing. Keep responses under 3 sentences
unless the question requires more detail. Do not use em-dashes.`,
  knowledge,
  synonyms,
  fallbackResponse: `I am not sure about that. You can reach Alex directly at hello@alexchen.dev for questions I cannot answer.`,
}

export default chatConfig
