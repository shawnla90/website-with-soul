<p align="center">
  <img src="assets/banner.png" alt="website-with-soul" width="100%" />
</p>

<h3 align="center">build a website with depth, personality, and a 90% free stack.</h3>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/built%20with-Claude%20Code-blueviolet" alt="Built with Claude Code" />
  <a href="https://github.com/shawnla90/recursive-drift"><img src="https://img.shields.io/badge/companion-recursive--drift-blue" alt="companion: recursive-drift" /></a>
  <a href="https://github.com/shawnla90/context-handoff-engine"><img src="https://img.shields.io/badge/companion-context--handoff--engine-blue" alt="companion: context-handoff-engine" /></a>
</p>

**[English](README.md)** | [中文](README.zh.md)

---

## The problem

Most personal and brand websites are hollow shells. A landing page, a contact form, maybe a blog that hasn't been updated in 6 months. They exist but they don't do anything.

Meanwhile, you're building your audience on platforms you don't own. LinkedIn can throttle your reach tomorrow. Reddit can ban your account. X can change the algorithm. You're renting attention on someone else's infrastructure.

## The thesis

You can build a website with soul using mostly free tools. A site that sounds like you, ranks in search, feeds AI systems, and compounds over time. Own the content. Own the audience. Own the algorithm.

This repo gives you two things:

1. **A working starter template** you can clone and run in 15 minutes
2. **A 32-chapter playbook** that teaches the full system: build, content, promote, scale

## The stack (90% free)

| Tool | Cost | Role |
|------|------|------|
| Next.js 15 | Free | Framework (App Router, static generation) |
| Tailwind CSS v4 | Free | Styling |
| Vercel | Free | Deploy (hobby tier) |
| Cloudflare | ~$10/yr | Domain registration |
| PostHog | Free | Analytics (proxy pattern, ad-blocker resistant) |
| Claude Code | ~$200/mo | Builder tool (Max subscription) |
| Remotion | Free | Video/image rendering (optional) |
| Midjourney | ~$10/mo | Rich content images (optional) |

Total fixed cost: ~$10/year for a domain. Everything else is free or optional.

## Quick start

### Path 1: 15 minutes (starter template)

```bash
git clone https://github.com/shawnla90/website-with-soul.git
cd website-with-soul/starter
npm install
npm run dev
```

Open `http://localhost:3000`. You have a working site with:
- Dark terminal aesthetic (customize the accent color in `globals.css`)
- Markdown blog system (add `.md` files to `content/blog/`)
- AI chat widget (add your Anthropic API key to `.env.local`)
- PostHog analytics (add your key or skip it, site works without it)
- SEO fundamentals (sitemap, robots.txt, OG images, RSS feed)
- Security headers (CSP, X-Frame-Options via middleware)

### Path 2: 1 hour (build + deploy)

Follow the [playbook](playbook/) Phase 1 chapters. You'll understand every file in the starter and have it live on Vercel.

### Path 3: 1 day (full system)

Work through all 4 phases. By the end you'll have a content machine: voice system, distribution pipeline, SEO strategy, and automation.

## The four phases

### [Phase 1: Build](playbook/01-build/)
Get the website up. Next.js + Tailwind + markdown blog + chat widget + analytics + deploy. 11 chapters covering every piece of the stack.

### [Phase 2: Content](playbook/02-content/)
Give it soul. Build your voice DNA, set up anti-slop guardrails, create a content filing system, and establish your blog workflow. 8 chapters.

### [Phase 3: Promote](playbook/03-promote/)
Grow organically. Distribution matrix, Reddit strategy (with the GEO thesis on AI-indexed content), LinkedIn builder voice, X thread format. No paid ads. 7 chapters.

### [Phase 4: Scale](playbook/04-scale/)
Automate and multiply. Monorepo upgrade, autonomous blog pipeline, cron automation, Claude Code agent systems. 6 chapters.

## What's in the repo

```
website-with-soul/
├── starter/          # Working Next.js site (clone and run)
├── playbook/         # 32-chapter guide across 4 phases
├── templates/        # Copy-paste files (CLAUDE.md, voice DNA, SEO briefs)
└── examples/         # Anonymized real examples (content drops, voice files)
```

## The trilogy

This repo is the capstone of three open-source projects that work together:

1. **[recursive-drift](https://github.com/shawnla90/recursive-drift)** - The methodology. How to use AI as a thinking partner without losing your voice. The operating system for human-AI collaboration.

2. **[context-handoff-engine](https://github.com/shawnla90/context-handoff-engine)** - The plumbing. Multi-session continuity for Claude Code. Never lose context between sessions again.

3. **website-with-soul** (this repo) - The product. Everything in recursive-drift and context-handoff-engine comes together here. Build a real website that sounds like you, ranks in search, and compounds over time.

Each repo stands alone. Together they form a complete system for building in public with AI.

## Proof of work

This system runs three production sites:
- [shawnos.ai](https://shawnos.ai) - Personal brand and GTM engineering
- [thegtmos.ai](https://thegtmos.ai) - GTM operations knowledge base
- [thecontentos.ai](https://thecontentos.ai) - Content operations and anti-slop

Same stack. Same playbook. The starter template is extracted from the production code that runs these sites.

## Templates included

| Template | Path | Purpose |
|----------|------|---------|
| CLAUDE.md (starter) | `templates/claude-md/starter.md` | Minimal Claude Code instructions |
| CLAUDE.md (with voice) | `templates/claude-md/with-voice.md` | + voice system integration |
| CLAUDE.md (full ops) | `templates/claude-md/with-content-ops.md` | + content operations |
| Voice DNA | `templates/voice/core-voice-template.md` | Fill-in-the-blank voice file |
| Anti-slop | `templates/voice/anti-slop-starter.md` | Top 10 detection patterns |
| Platform playbook | `templates/voice/platform-playbook.md` | Blank platform voice guide |
| Blog post | `templates/content/blog-post-template.md` | Frontmatter + structure |
| Content drop | `templates/content/content-drop-checklist.md` | Distribution checklist |
| SEO brief | `templates/content/seo-brief-template.md` | Keyword brief format |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). PRs welcome for playbook improvements, starter enhancements, and new templates.

## License

MIT. Use it however you want.

---

<p align="center">
  <strong>own your content. own your audience. own the algorithm.</strong>
</p>
