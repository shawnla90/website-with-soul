# Claude Code Instructions

## Project Context

[FILL IN: One sentence describing what this project is]
[FILL IN: Primary tech stack, e.g. "Next.js 15, TypeScript, Tailwind CSS v4"]

### Key Paths

- `app/` - [FILL IN: What lives here]
- `content/` - [FILL IN: e.g. "Markdown blog posts"]
- `lib/` - [FILL IN: e.g. "Utility functions"]
- `components/` - [FILL IN: e.g. "React components"]
- `public/` - [FILL IN: e.g. "Static assets"]
- `skills/` - Voice guidelines and content rules

## Rules

1. Run `npm run build` before marking any task complete. If the build fails, fix it before moving on.
2. Keep changes minimal. Only touch files that are necessary for the task.
3. Find root causes. No temporary fixes or band-aids.
4. Check `public/` and `assets/` for existing files before using placeholder images or assets.
5. Never commit `.env`, credentials, or secret files.
6. Never force push to main.
7. Prefer editing existing files over creating new ones.

## Voice and Content Rules

All content creation MUST follow this loading order:

1. **Read** `skills/core-voice.md` first. This is the voice foundation.
2. **Read** `skills/anti-slop.md` second. These are the patterns to avoid.
3. **Read** the relevant platform playbook from `skills/playbooks/` if writing for a specific platform.

### Content Validation

Before publishing or finalizing any content:

- Run through the anti-slop checklist. If 3+ patterns are flagged, rewrite from scratch instead of patching.
- Check that every substantive claim has at least one of: a specific example, a technical detail, shown reasoning, a concrete result, or a lesson learned.
- Read the content out loud. If it sounds like a press release or a LinkedIn influencer, rewrite it.

### Formatting Rules

[FILL IN: Your formatting preferences. Examples:]
- [FILL IN: e.g. "No em-dashes. Use periods, commas, or restructure."]
- [FILL IN: e.g. "Sentences under 25 words when possible."]
- [FILL IN: e.g. "Code snippets over abstract descriptions."]

## Available Scripts

```bash
npm run dev       # [FILL IN]
npm run build     # [FILL IN]
npm run start     # [FILL IN]
```

## Notes

[FILL IN: Project-specific notes, gotchas, naming conventions, etc.]
