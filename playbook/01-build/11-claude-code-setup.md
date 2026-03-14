# Chapter 11: Claude Code Setup

> Configure Claude Code as your AI development partner with project context, handoff documents, and a self-improvement loop.

## What Claude Code Is

Claude Code is Anthropic's CLI tool for working with codebases. It reads your files, understands your project structure, and helps you build, debug, and ship code. Think of it as a senior developer pair-programming with you in the terminal.

What makes it different from copy-pasting into a chat window: Claude Code reads your entire project. It knows your file structure, your dependencies, your patterns. When you say "add a new blog post," it knows where the posts live, how frontmatter works, and what the content directory is called.

## The CLAUDE.md File

The starter includes a `CLAUDE.md` at the project root. This file loads automatically when Claude Code starts a session in your project directory:

```markdown
# Claude Code Instructions

## Project Context

This is a Next.js 15 site with App Router, Tailwind CSS v4, and markdown blog.

## Session Workflow

1. Read `tasks/todo.md` for current priorities
2. Read `tasks/lessons.md` for self-improvement rules
3. Run `git status` and `git log -1 --oneline` to know where you are

## Task Management

1. Write plan to `tasks/todo.md` with checkable items before starting
2. Mark items complete as you go
3. Document results and lessons learned

## Self-Improvement Loop

After ANY correction from the user:
1. Update `tasks/lessons.md` with the date, context, and lesson
2. Write rules that prevent the same mistake from recurring
3. Review `tasks/lessons.md` at session start

## Context Handoff

At the end of each session, write a handoff document to `.claude/context-handoff.md` with:
- What was accomplished
- What's in progress
- What's blocked
- Key decisions made
- Next steps

## Key Paths

- Blog content: `content/blog/`
- Components: `components/`
- API routes: `app/api/`
- Chat knowledge base: `app/api/chat/route.ts` (edit KNOWLEDGE_BASE array)

## Rules

- Run `npm run build` before marking work as done
- Keep it simple. Minimal code impact.
- Find root causes. No temporary fixes.
```

### Why This File Matters

Without `CLAUDE.md`, Claude Code is a generic assistant. With it, Claude Code becomes an assistant that knows:

- What your project is
- Where things live
- What your workflow looks like
- What mistakes to avoid
- What you are currently working on

The file is read at the start of every session. Every instruction in it applies to every conversation.

## Customizing CLAUDE.md

### Add Your Stack Details

Replace the generic project context with specifics:

```markdown
## Project Context

This is my personal website at yourdomain.com.
Next.js 15 + App Router + Tailwind CSS v4 + Vercel.
Blog posts in `content/blog/` as markdown with gray-matter frontmatter.
Chat widget uses keyword RAG with Anthropic API.
PostHog analytics with proxy pattern.
```

### Add Your Preferences

Tell Claude Code how you like to work:

```markdown
## Preferences

- I use Tailwind utilities for layout. Inline styles for one-off styling.
- Keep components small. Extract when a component exceeds 100 lines.
- No external UI libraries. Build from scratch.
- Commit after each feature, not at the end of a session.
- Ask before deleting files or making destructive changes.
```

### Add Domain Knowledge

If your site covers a specific topic, add context:

```markdown
## Domain

This site covers developer tooling and AI-assisted development.
Target audience: developers and technical founders.
Tone: practical, specific, lowercase energy. No marketing language.
```

## The Handoff System

Context handoffs solve a fundamental problem: Claude Code sessions are stateless. Every new session starts fresh. The handoff document carries context from one session to the next.

### How It Works

At the end of a session, Claude Code writes `.claude/context-handoff.md`:

```markdown
# Context Handoff

## Date
2026-01-15

## What Was Accomplished
- Added three new blog posts about the tech stack
- Fixed a bug in the chat widget where suggested questions disappeared after first interaction
- Updated the knowledge base with new content about deployment

## What's In Progress
- RSS feed needs the channel title updated to match the new site name
- OG image route needs the domain text changed from yoursite.com

## What's Blocked
Nothing currently blocked.

## Key Decisions
- Decided to keep inline styles instead of migrating to Tailwind utilities
- Chat widget max_tokens set to 500 to keep responses concise

## Next Steps
1. Write a blog post about the deployment process
2. Add a /projects page
3. Update the homepage hero text
```

At the start of the next session, Claude Code reads this file and picks up where you left off. No re-explaining. No "here is what we did last time."

### Creating the Handoff Directory

```bash
mkdir -p .claude
```

Add `.claude/` to your `.gitignore` if you do not want handoff documents tracked in version control. Or keep them tracked if you want a history of your development sessions.

## The Self-Improvement Loop

`tasks/lessons.md` is where Claude Code records mistakes and learns from them:

```markdown
# Lessons Learned

## 2026-01-15
- **Context**: Tried to use `display: grid` in the OG image route
- **Lesson**: `next/og` uses Satori which only supports flexbox. Always use `display: flex`.
- **Rule**: Before editing OG routes, review Satori CSS support constraints.

## 2026-01-14
- **Context**: Forgot to run `npm run build` before committing
- **Lesson**: The TypeScript compiler caught a type error that would have broken production.
- **Rule**: Always run `npm run build` before marking any task complete.
```

### How It Works

1. You correct Claude Code about something
2. Claude Code adds the correction to `tasks/lessons.md` with date and context
3. On the next session start, Claude Code reads the lessons file
4. The same mistake does not happen twice

This creates a persistent learning loop. Over time, Claude Code gets better at working with your specific project because it accumulates knowledge about what works and what does not.

## Task Tracking

`tasks/todo.md` is a simple checklist for tracking work:

```markdown
# Current Tasks

## In Progress
- [x] Set up blog with markdown pipeline
- [x] Add chat widget with keyword RAG
- [ ] Write 5 blog posts
- [ ] Add a /projects page
- [ ] Set up custom domain

## Backlog
- [ ] Add dark/light mode toggle
- [ ] Add search functionality
- [ ] Create email newsletter signup
- [ ] Add reading progress bar to blog posts
```

When you tell Claude Code "what should I work on next?", it reads this file and suggests the next unchecked item.

## Working With Claude Code Effectively

### Be Specific

Instead of: "Make the site better"

Say: "Add a reading progress bar to the blog post page that shows how far down the article the user has scrolled. Use the accent color. Position it fixed at the top of the viewport."

### Reference Files

Instead of: "Fix the chat"

Say: "The chat widget in components/ChatWidget.tsx is not scrolling to the bottom when new messages arrive. The messagesEndRef scroll effect on line 121 might not be triggering."

### Let It Read First

When starting a new session, let Claude Code orient itself:

```
Read the context handoff and tasks/todo.md, then tell me where we are.
```

This takes 10 seconds and prevents Claude Code from working on the wrong thing.

### Use It for Refactoring

Claude Code is excellent at refactoring because it can read your entire codebase. Ask things like:

- "The PostCard component has inline styles. Extract them into Tailwind utilities."
- "The blog post page and blog index page both define CONTENT_DIR. Extract it to a shared constant."
- "Find all hardcoded color values and replace them with CSS variables."

### Use It for Debugging

Give Claude Code the error and the context:

```
npm run build fails with:
Type error: Property 'slug' does not exist on type 'Promise<{ slug: string }>'.

This is in app/blog/[slug]/page.tsx. The params type changed in Next.js 15.
```

Claude Code will read the file, understand the Next.js 15 params change (params is now a Promise), and fix the destructuring.

## Project Structure for Claude Code

The starter's file structure is intentionally Claude Code-friendly:

- **`CLAUDE.md`** at the root loads automatically
- **`tasks/todo.md`** tracks what needs doing
- **`tasks/lessons.md`** prevents repeated mistakes
- **`.claude/context-handoff.md`** carries session context
- **Flat component structure** so Claude Code can find things easily
- **Path aliases** (`@/`) so imports are consistent

## Installing Claude Code

If you do not have Claude Code installed yet:

```bash
npm install -g @anthropic-ai/claude-code
```

Then start a session in your project directory:

```bash
cd website-with-soul/starter
claude
```

Claude Code reads your `CLAUDE.md`, orients itself, and is ready to work.

## What You Have Now

After this chapter, you have:

- `CLAUDE.md` with project context, workflow, and rules
- A handoff system for session continuity
- A self-improvement loop that prevents repeated mistakes
- Task tracking for what needs doing next
- Practical patterns for working with Claude Code effectively

## Phase 1 Complete

You have built a complete website with:

1. [Next.js 15 + Tailwind + dark theme](./01-setup.md)
2. [Markdown blog with syntax highlighting](./02-markdown-blog.md)
3. [AI chat widget with keyword RAG](./03-chat-widget.md)
4. [PostHog analytics with ad-blocker bypass](./04-posthog.md)
5. [Sitemap with AI crawler allowlist](./05-sitemap-robots.md)
6. [Dynamic OG images at the edge](./06-og-images.md)
7. [RSS feed for distribution](./07-rss-feed.md)
8. [Security headers via middleware](./08-security-headers.md)
9. [90+ Lighthouse scores by default](./09-core-web-vitals.md)
10. [Live on Vercel's free tier](./10-deploy-vercel.md)
11. [Claude Code as your dev partner](./11-claude-code-setup.md)

Total cost so far: $0/month (before Anthropic API usage for the chat widget).

Phase 2 covers content strategy, SEO, and making your site discoverable.
