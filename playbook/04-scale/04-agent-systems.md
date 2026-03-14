# Chapter 4: Agent Systems

> Claude Code is not just a coding assistant. It is a system that can run subagents in parallel, follow complex instruction files, and execute multi-step workflows. This chapter covers how to build agent infrastructure that compounds your output.

## The CLAUDE.md as Agent Instructions

Every Claude Code session starts by reading `CLAUDE.md` from your project root. This file is not documentation. It is the instruction set for your AI collaborator.

A well-structured CLAUDE.md turns Claude Code from a general-purpose assistant into a specialized agent that knows your project, follows your rules, and matches your standards.

### What Belongs in CLAUDE.md

- **Project context.** Stack, architecture, key paths. What is this project and how is it structured.
- **Workflow rules.** "Run build before marking anything done." "Never push without tests passing." "Check existing assets before using placeholders."
- **Quality standards.** "Find root causes, not temporary fixes." "Keep changes minimal." "Senior developer standards."
- **Safety rules.** "Never commit .env files." "Never bypass pre-push hooks." "Never force push to main."
- **Voice/content rules.** If the project involves content, point to voice files and anti-slop rules.
- **Key references.** Links to architecture docs, machine setup, other instruction files.

### What Does Not Belong

- **Tutorials.** Claude already knows how React, Next.js, and TypeScript work.
- **API documentation.** Do not paste library docs. Reference them by name.
- **Verbose explanations.** Keep rules concise. One line per rule when possible.

### Example Starter CLAUDE.md

```markdown
# Claude Code Instructions

## Project Context
Next.js 15 personal website with App Router. TypeScript. Tailwind v4.
Key paths: app/ (pages), content/blog/ (markdown posts), lib/ (utilities).

## Rules
- Run `npm run build` before marking any task complete.
- Keep changes minimal. Only touch what is necessary.
- Find root causes. No temporary fixes.
- Check public/ and assets/ before using placeholder images.
- Never commit .env or credentials files.

## Content Rules
- Load voice guidelines from skills/core-voice.md before writing content.
- Run anti-slop check (skills/anti-slop.md) on all content before publishing.
- No em-dashes. Use periods, commas, or restructure.
```

That is 15 lines. It covers project context, development rules, and content guidelines. Claude Code reads this at the start of every session and follows it throughout.

## Subagents

Subagents are Claude Code sessions that run inside your main session. They execute in parallel, have their own context windows, and report back when done.

### When to Use Subagents

- **Parallel research.** "Search three different directories for how this function is used."
- **Independent tasks.** "Update the CSS in one file while I refactor the logic in another."
- **Exploration.** "Read through these 10 files and summarize the architecture."
- **Batch operations.** "Generate SEO briefs for these 5 keywords."

### When Not to Use Subagents

- **Sequential work.** If step 2 depends on step 1's output, run them in sequence.
- **Simple tasks.** If it takes one command, just run it directly.
- **Shared state.** If two tasks modify the same file, they will conflict.

### How Subagents Work

When Claude Code spawns a subagent, it:

1. Creates a new Claude session with a specific task
2. The subagent has access to the same filesystem
3. The subagent runs independently (can read files, run commands, write code)
4. Results come back to the main session when the subagent finishes

The main session stays clean. Complex research that would eat up your context window happens in the subagent's context instead.

### Practical Example

You want to understand how a codebase handles authentication before making changes:

```
Main session: "I need to add a new auth provider. Before I start, use
subagents to research:
1. How the current auth flow works (check app/api/auth/)
2. What middleware is in place (check middleware.ts)
3. What environment variables auth uses (check .env.example)

Then summarize the findings so I can plan the implementation."
```

Three subagents run in parallel. Each explores one aspect. Results come back in seconds instead of minutes of sequential exploration.

## Agent Routing

Not every task needs the same approach. Here is a decision framework:

### Solo (Default)

Use for: straightforward tasks, bug fixes, single-file changes, quick questions.

Most work falls here. One Claude Code session, direct interaction, immediate feedback.

### Subagents

Use for: research across multiple files, parallel independent tasks, batch operations.

Spawn 2-4 subagents for parallel work. Keep the main session as the coordinator.

### Teams

Use for: large initiatives that span multiple systems, multi-day projects with distinct workstreams.

Teams are multiple Claude Code sessions working on different parts of a larger project. Each session has its own branch or working area. Coordination happens through shared files (like a tasks/todo.md).

Team constraints to follow:

- One branch per agent. Never have two agents working on the same branch.
- Clear boundaries. Each agent owns specific files or directories.
- Shared state through files, not memory. Write decisions to disk so other agents can read them.
- Merge frequently. Small, focused PRs beat one massive PR.

## The Skills System

Skills are slash commands that expand into full prompts. They turn complex, multi-step workflows into single commands.

### How Skills Work

A skill is a markdown file in `.claude/skills/` that contains:

1. A description of what the skill does
2. Step-by-step instructions Claude Code follows
3. Templates, checklists, or prompts to use

When you type `/skill-name`, Claude Code reads the skill file and executes the instructions.

### Example Skill: Content Drop

File: `.claude/skills/content-drop/SKILL.md`

```markdown
# Content Drop Skill

## What This Does
Takes a source blog post and generates platform-specific drafts for
Reddit, LinkedIn, and X (Twitter).

## Steps
1. Read the source blog post provided by the user
2. Load voice guidelines from skills/core-voice.md
3. Load anti-slop rules from skills/anti-slop.md
4. For each platform:
   a. Load the platform playbook from skills/platform-playbooks/
   b. Adapt the content for that platform's format and tone
   c. Write the draft to content/{platform}/drafts/
5. Create a distribution checklist at content/checklists/

## Platform Rules
- Reddit: conversational, no hard CTA, fits the subreddit culture
- LinkedIn: builder voice, whitespace-heavy, structured paragraphs
- X: punchy standalone tweets, thread format, hook in tweet 1
```

Now instead of explaining all of this every time, you type `/content-drop` and point it at a blog post. The skill handles the rest.

### Building Your Own Skills

Start with workflows you repeat. If you do the same multi-step process more than twice, it is a skill.

Common skills for a personal website:

- `/blog-post` - Generate a blog post from a brief
- `/content-drop` - Distribute a blog post to all platforms
- `/seo-check` - Analyze a page for SEO issues
- `/deploy` - Build, commit, push, verify
- `/handoff` - Write context handoff for the next session

### Skill File Structure

```
.claude/
└── skills/
    ├── content-drop/
    │   └── SKILL.md
    ├── blog-post/
    │   └── SKILL.md
    ├── seo-check/
    │   └── SKILL.md
    └── deploy/
        └── SKILL.md
```

Each skill gets its own directory. The `SKILL.md` file is the instruction set. You can add supporting files (templates, examples, reference data) in the same directory.

## How Agents Compound Output

The real power is not any single feature. It is how they combine.

### Day 1: Manual Everything

You write a blog post. You manually adapt it for Reddit. You manually adapt it for LinkedIn. You manually create an X thread. You manually check SEO. You manually deploy. Four hours of work for one piece of content.

### Day 30: Skills + Subagents

You write a blog post. You type `/content-drop`. Subagents generate platform drafts in parallel. You review and approve. You type `/deploy`. Thirty minutes of work for the same output.

### Day 90: Autonomous Pipeline + Human Review

Your cron generates SEO briefs overnight. Draft generation runs weekly. You review a batch of drafts on Wednesday morning. Approved posts auto-deploy. Distribution happens via skills. The same output now costs you one focused review session per week.

The compound effect: each layer of automation frees time to build the next layer. Skills make subagents more effective. Subagents make crons more effective. Crons make the whole system run while you sleep.

## CLAUDE.md Inheritance

In a monorepo, you can have multiple CLAUDE.md files:

```
your-repo/
├── CLAUDE.md                    # Root-level rules (apply everywhere)
├── apps/
│   ├── main-site/
│   │   └── CLAUDE.md            # Site-specific rules
│   └── docs/
│       └── CLAUDE.md            # Docs-specific rules
└── packages/
    └── shared/
        └── CLAUDE.md            # Shared package rules
```

Claude Code reads the root CLAUDE.md first, then any CLAUDE.md in the directory you are working in. Specific rules override general ones.

This is useful for:

- Root: "Never force push. Always run tests."
- App-specific: "This app uses port 3001. Content lives in content/blog/."
- Package-specific: "This package is consumed by 3 apps. Run all app builds after changes."

## Context Handoffs

When a session ends, write a context handoff so the next session (or a different agent) can pick up where you left off.

A handoff contains:

- What you were working on
- What you completed
- What is left to do
- Any decisions made and why
- Files that were changed
- Blockers or open questions

Store handoffs in a predictable location:

```
~/.claude/handoffs/
├── 2026-03-14_143022_blog-pipeline.md
├── 2026-03-14_160045_seo-update.md
└── 2026-03-13_091500_monorepo-migration_done.md
```

The next session reads unconsumed handoffs at startup, marks them as consumed (rename to `_done.md`), and continues the work.

This makes agent work durable across sessions. No context is lost. No work is repeated.

## What You Have After This Chapter

- CLAUDE.md structure for effective agent instructions
- Subagent patterns for parallel work
- Agent routing framework (solo vs. subagents vs. teams)
- Skills system for reusable workflows
- Context handoff protocol for session continuity

Next up: [Chapter 5: Subreddit Creation](./05-subreddit-creation.md) covers building your own community on Reddit.
