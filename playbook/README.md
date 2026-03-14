# The Playbook

32 chapters across 4 phases. Start at Phase 1 and work through in order, or jump to whatever you need.

## Phase 1: Build the Website

Get a working site live in under an hour.

| # | Chapter | What you'll build |
|---|---------|-------------------|
| 01 | [Setup](01-build/01-setup.md) | Next.js 15 + Tailwind + App Router |
| 02 | [Markdown Blog](01-build/02-markdown-blog.md) | gray-matter + remark/rehype blog system |
| 03 | [Chat Widget](01-build/03-chat-widget.md) | Keyword RAG chat (no vector DB) |
| 04 | [PostHog](01-build/04-posthog.md) | Analytics with proxy pattern + UTM persistence |
| 05 | [Sitemap & Robots](01-build/05-sitemap-robots.md) | next-sitemap + AI crawler allowlist |
| 06 | [OG Images](01-build/06-og-images.md) | Edge OG image generation |
| 07 | [RSS Feed](01-build/07-rss-feed.md) | RSS feed route handler |
| 08 | [Security Headers](01-build/08-security-headers.md) | CSP, X-Frame-Options middleware |
| 09 | [Core Web Vitals](01-build/09-core-web-vitals.md) | Performance optimization |
| 10 | [Deploy to Vercel](01-build/10-deploy-vercel.md) | Vercel deploy (free tier) |
| 11 | [Claude Code Setup](01-build/11-claude-code-setup.md) | CLAUDE.md + handoffs + lessons |

## Phase 2: Give It Soul

Make it sound like you, not a template.

| # | Chapter | What you'll learn |
|---|---------|-------------------|
| 01 | [Voice DNA](02-content/01-voice-dna.md) | Building your core-voice.md |
| 02 | [Anti-Slop](02-content/02-anti-slop.md) | Anti-AI-slop pattern system |
| 03 | [Content Filing](02-content/03-content-filing.md) | content/{platform}/{stage}/ system |
| 04 | [Blog Workflow](02-content/04-blog-workflow.md) | Draft to review to publish pipeline |
| 05 | [Content Drop](02-content/05-content-drop.md) | One source to multi-platform distribution |
| 06 | [Rich Content](02-content/06-rich-content.md) | Midjourney + Pillow technical images |
| 07 | [SEO Pipeline](02-content/07-seo-pipeline.md) | Keyword research to brief to content |
| 08 | [Self-Improvement](02-content/08-self-improvement.md) | lessons.md feedback loop |

## Phase 3: Grow Organically

Distribution without paid ads.

| # | Chapter | What you'll learn |
|---|---------|-------------------|
| 01 | [Distribution Matrix](03-promote/01-distribution-matrix.md) | Which platform first, cross-posting cadence |
| 02 | [Reddit Strategy](03-promote/02-reddit-strategy.md) | Subreddit selection, karma, value-first posting |
| 03 | [Reddit Commenting](03-promote/03-reddit-commenting.md) | Non-NPC commenting guide |
| 04 | [LinkedIn Strategy](03-promote/04-linkedin-strategy.md) | Builder voice, hook patterns |
| 05 | [X/Twitter Strategy](03-promote/05-x-twitter-strategy.md) | Thread structure, condensed format |
| 06 | [Google + Reddit SEO](03-promote/06-google-reddit-seo.md) | Cross-indexing and GEO thesis |
| 07 | [The Authentic Paradox](03-promote/07-authentic-paradox.md) | Less AI in output, more AI in systems |

## Phase 4: Scale the Machine

Automate and multiply.

| # | Chapter | What you'll learn |
|---|---------|-------------------|
| 01 | [Monorepo Upgrade](04-scale/01-monorepo-upgrade.md) | Turborepo, shared packages, multiple sites |
| 02 | [Autonomous Blog](04-scale/02-autonomous-blog.md) | SEO brief to Claude CLI to markdown to build |
| 03 | [Cron Automation](04-scale/03-cron-automation.md) | launchd/systemd scheduled tasks |
| 04 | [Agent Systems](04-scale/04-agent-systems.md) | Claude Code subagents and teams |
| 05 | [Subreddit Creation](04-scale/05-subreddit-creation.md) | Building your own community |
| 06 | [Cloudflare Pages](04-scale/06-cloudflare-pages.md) | Migrate from Vercel to Cloudflare |

## How to use this playbook

**15-minute path**: Clone the starter template, run `npm install && npm run dev`, customize the content. Skip the playbook until you need it.

**1-hour path**: Follow Phase 1 chapters 1-2 and 10. You'll have a blog live on Vercel.

**Full build path**: Work through all 4 phases over a week. By the end you'll have a complete content machine.
