# Claude Code Instructions

## Project Context

[FILL IN: One sentence describing what this project is]
[FILL IN: Primary tech stack]

### Key Paths

- `app/` - [FILL IN: Pages and API routes]
- `content/blog/` - Published blog posts (markdown)
- `content/drafts/` - Unpublished drafts awaiting review
- `content/briefs/` - SEO briefs for content generation
- `content/reddit/drafts/` - Reddit post drafts
- `content/linkedin/drafts/` - LinkedIn post drafts
- `content/x/drafts/` - X thread drafts
- `lib/` - [FILL IN: Utility functions]
- `components/` - [FILL IN: React components]
- `public/` - [FILL IN: Static assets]
- `skills/` - Voice guidelines, platform playbooks, content rules
- `data/seo/` - SEO keyword tracking and logs
- `tasks/` - Task tracking (todo.md, lessons.md)

## Rules

1. Run `npm run build` before marking any task complete.
2. Keep changes minimal. Only touch what is necessary.
3. Find root causes. No temporary fixes.
4. Check existing assets before using placeholders.
5. Never commit `.env`, credentials, or secret files.
6. Never force push to main.
7. Prefer editing existing files over creating new ones.

## Voice and Content Rules

All content creation MUST follow this loading order:

1. **Read** `skills/core-voice.md` - Voice foundation
2. **Read** `skills/anti-slop.md` - Patterns to avoid
3. **Read** the relevant platform playbook from `skills/playbooks/` when writing for a specific platform

### Content Validation Pass

Before publishing or finalizing any content, run these gates in order:

1. **Slop check.** Run through anti-slop rules. 3+ flags = rewrite from scratch.
2. **Specificity check.** Every claim needs a specific example, code snippet, or concrete result.
3. **Depth check.** Is this surface-level or does it go deep enough to be useful?
4. **Performance check.** Does the opening hook? Will someone read past the first paragraph?
5. **Safety check.** No confidential info, no identifiable client details, no credentials.
6. **Voice check.** Read it out loud. Does it sound like [FILL IN: you] or like a chatbot?

### Formatting Rules

- [FILL IN: e.g. "No em-dashes anywhere. Use periods, commas, or restructure."]
- [FILL IN: e.g. "Short paragraphs. 1-3 sentences max."]
- [FILL IN: e.g. "Show code, not abstractions."]

## Content Filing System

All content follows this path: Source -> Platform Drafts -> Review -> Final -> Publish

```
content/
├── blog/                    # Published blog posts (source of truth)
├── drafts/                  # Unpublished blog drafts
├── briefs/                  # SEO briefs for content generation
├── reddit/
│   ├── drafts/              # Reddit adaptations awaiting review
│   └── final/               # Approved Reddit posts
├── linkedin/
│   ├── drafts/
│   └── final/
└── x/
    ├── drafts/
    └── final/
```

### File Naming Convention

Drafts: `YYYY-MM-DD_slug-description.md`
Finals: `YYYY-MM-DD_slug-description.txt` (plain text for copy-paste)

## Distribution Matrix

When a blog post is published, generate platform drafts:

| Platform | Tone | Format | CTA Style |
|---|---|---|---|
| Reddit | Conversational, peer-to-peer | Text post, no links in body | Soft, "curious what others think" |
| LinkedIn | Builder voice, structured | Short paragraphs, whitespace | Implicit, "here is what I learned" |
| X | Punchy, standalone tweets | Thread format, 5-7 tweets | Last tweet links to full post |

## Self-Improvement Loop

After ANY correction from the user:

1. Update `tasks/lessons.md` with the date, context, and lesson learned
2. Write a rule that prevents the same mistake from recurring
3. Review lessons at the start of every session

## Context Handoff Protocol

### On Session Start
1. Read all files in `~/.claude/handoffs/` that do not end in `_done.md`
2. After reading, rename each to `filename_done.md`
3. Clean up handoffs older than 7 days

### On Session End
Write a handoff to `~/.claude/handoffs/YYYY-MM-DD_HHMMSS_slug.md` with:
- What was worked on
- What was completed
- What is left to do
- Decisions made and reasoning
- Files changed
- Open questions or blockers

## Available Scripts

```bash
npm run dev       # [FILL IN]
npm run build     # [FILL IN]
npm run start     # [FILL IN]
```

## Notes

[FILL IN: Project-specific notes, deployment process, key integrations, etc.]
