# 03 - Content Filing System

A clear folder structure prevents content chaos. This chapter covers the filing system that scales from one blog post to multi-platform distribution.

## The Problem Content Filing Solves

You start with a blog. Then you post on LinkedIn. Then Reddit. Then X. Within a month you have drafts scattered across Google Docs, Apple Notes, random text files on your desktop, and Slack DMs to yourself.

The filing system puts everything in one place, organized by platform and stage. Every piece of content has a home. Every stage in the pipeline is visible in the file system. You can look at your `content/` directory and immediately see what's in progress, what's ready, and what's been published.

## Directory Structure

```
content/
├── blog/                          # Website blog posts
│   ├── hello-world.md
│   ├── why-markdown-beats-cms.md
│   └── building-in-public.md
├── reddit/
│   ├── drafts/                    # Work in progress
│   │   └── 2026-03-13_cli-tools-for-builders.md
│   └── final/                     # Ready to post or already posted
│       └── 2026-03-13_cli-tools-for-builders.md
├── linkedin/
│   ├── drafts/
│   │   └── 2026-03-14_shipping-vs-planning.md
│   └── final/
│       └── 2026-03-12_free-website-stack.txt
├── x/
│   ├── drafts/
│   │   └── 2026-03-14_thread-on-seo.md
│   └── final/
│       └── 2026-03-13_seo-thread.txt
├── newsletter/
│   ├── drafts/
│   └── final/
└── midjourney/                    # Image prompts and outputs
    └── hero-images/
```

## Naming Conventions

### Blog posts

Blog posts use slug-style names without dates. The date lives in frontmatter.

```
content/blog/why-markdown-beats-cms.md
content/blog/building-in-public.md
content/blog/free-tools-for-seo.md
```

The slug becomes the URL path. `content/blog/why-markdown-beats-cms.md` serves at `/blog/why-markdown-beats-cms`. Keep slugs lowercase, hyphenated, and descriptive.

### Platform content

Platform content uses date-prefixed names. This makes chronological sorting automatic in the file system.

```
content/reddit/drafts/2026-03-13_cli-tools-for-builders.md
content/linkedin/drafts/2026-03-14_shipping-vs-planning.md
content/x/drafts/2026-03-14_seo-thread.md
```

Format: `YYYY-MM-DD_short-description.md`

When a piece moves from draft to final, copy it (don't move it) so you keep the draft history. Or move it if you prefer a clean workspace. Either approach works as long as you're consistent.

### Final files

Final files can be `.md` or `.txt`. Use `.txt` for platforms where you're copy-pasting raw text (X, LinkedIn). Use `.md` for platforms that support formatting or where you want to preserve structure.

## Frontmatter by Platform

### Blog posts

Blog posts use YAML frontmatter that the site's build system reads.

```yaml
---
title: "Why Markdown Beats a CMS"
date: "2026-03-14"
excerpt: "You don't need WordPress. You need a text editor and git."
category: "builds"
featured: false
---
```

Required fields: `title`, `date`, `excerpt`, `category`
Optional fields: `featured`, `tags`, `image`, `canonical_url`

### Reddit drafts

```yaml
---
platform: reddit
subreddit: "r/webdev"
title: "CLI tools that actually make content creation faster"
status: draft
source_post: "content/blog/cli-tools-for-builders.md"
date: "2026-03-13"
---
```

The `source_post` field links back to the original blog post this was adapted from. This creates traceability across your content pipeline.

### LinkedIn drafts

```yaml
---
platform: linkedin
status: draft
source_post: "content/blog/shipping-vs-planning.md"
date: "2026-03-14"
hook: "Most founders spend 3 months planning a website they could ship in a weekend."
---
```

The `hook` field captures the opening line. LinkedIn posts live or die on the first two lines (before the "see more" fold).

### X thread drafts

```yaml
---
platform: x
format: thread
tweet_count: 5
status: draft
source_post: "content/blog/seo-pipeline.md"
date: "2026-03-14"
---
```

For threads, separate each tweet with `---` in the body:

```markdown
Tweet 1 text here (under 280 chars).

---

Tweet 2 continues the thought.

---

Tweet 3 with the punchline.
```

## The Drafts/Final Pipeline

The two-folder system (drafts and final) gives you a lightweight content pipeline without any tooling.

### Draft stage

A file in `drafts/` means it's being worked on. It might be a rough idea, a first pass from AI, or a polished piece awaiting review. The `status` field in frontmatter can track sub-stages:

- `status: idea` - Just a concept or outline
- `status: draft` - First pass written
- `status: review` - Ready for editing
- `status: approved` - Reviewed and ready to post

### Final stage

A file in `final/` means it's been published or is ready to copy-paste and post. Once a file is in `final/`, it shouldn't change unless you're correcting an error.

### Workflow

1. Write the blog post in `content/blog/`
2. Adapt for each platform, saving drafts in `content/{platform}/drafts/`
3. Review each draft (run the anti-slop pass from Chapter 02)
4. Move approved content to `content/{platform}/final/`
5. Post it
6. Optionally add a `posted: "2026-03-14"` field to frontmatter for tracking

## Why This Structure Works

### Everything is in git

Your content history is in version control. You can see every edit, revert mistakes, and track what changed between draft and final. This is free and better than any CMS revision system.

### No database required

The file system is the database. `ls content/reddit/drafts/` shows you what's pending. `ls content/linkedin/final/ | wc -l` tells you how many LinkedIn posts you've published. Simple tools, no overhead.

### Claude Code can navigate it

When you ask Claude Code to "write a Reddit adaptation of my latest blog post," it can find the post in `content/blog/`, check existing Reddit drafts in `content/reddit/drafts/`, and put the output in the right place. The structure is predictable.

### Scales without breaking

Whether you have 5 pieces of content or 500, the structure stays flat within each folder. No nested hierarchies. No complex taxonomies. Date prefixes handle chronological ordering.

## Setting It Up

If you cloned the starter template, `content/blog/` already exists. Create the rest:

```bash
mkdir -p content/{reddit,linkedin,x,newsletter}/{drafts,final}
mkdir -p content/midjourney/hero-images
```

That's it. No config files. No database migrations. Folders and markdown files.

## Tips

**Don't over-organize.** If you only post on two platforms, only create two platform folders. Add more when you need them.

**Keep image prompts with content.** If you use Midjourney or Pillow to create images for a post, note the prompt or script in the content file's frontmatter or a comment at the bottom.

**Archive old content.** After a few months, you can move old finals to an `archive/` subfolder if the directory gets long. But don't do this prematurely. A flat folder with 50 files is still easy to navigate.

---

**Related:** Chapter 04 (Blog Workflow), Chapter 05 (Content Drop)
