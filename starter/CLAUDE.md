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
