# Chapter 2: Autonomous Blog

> Automated content pipelines generate blog post drafts from SEO briefs using AI. The human review gate is non-negotiable. Never publish something you have not read.

## The Pipeline

The autonomous blog system has five stages:

```
SEO Brief → Generate Draft → Human Review → Publish → Rebuild Site
```

Each stage has a clear input and output. Each can be run manually or automated. The key constraint: stage 3 (human review) always requires a person.

## Stage 1: SEO Brief Generation

An SEO brief tells the AI what to write about and why. Without it, you get generic content that ranks for nothing and helps nobody.

A brief contains:

- **Target keyword** (what people search for)
- **Search intent** (what they actually want)
- **Suggested title** (optimized for click-through)
- **Outline** (H2/H3 structure)
- **Competitor URLs** (what already ranks, so you can do better)
- **Notes** (angle, tone, specific points to hit)

### Brief Generation Script

```python
#!/usr/bin/env python3
"""Generate SEO briefs from a keyword list."""

import json
import subprocess
from pathlib import Path

KEYWORDS_FILE = Path("data/seo/keyword-targets.json")
BRIEFS_DIR = Path("content/briefs")

def generate_brief(keyword: str, intent: str) -> dict:
    """Use Claude CLI to generate an SEO brief from a keyword."""
    prompt = f"""Generate an SEO content brief for a blog post.

Target keyword: {keyword}
Search intent: {intent}

Return a JSON object with these fields:
- title: SEO-optimized title (under 60 characters)
- meta_description: Under 155 characters
- outline: Array of H2 headings, each with optional H3 subheadings
- key_points: 3-5 main points the post must cover
- word_count_target: Recommended word count
- internal_links: Suggested internal link opportunities

Return ONLY the JSON object, no markdown wrapping."""

    result = subprocess.run(
        ["claude", "-p", prompt, "--output-format", "json"],
        capture_output=True,
        text=True
    )

    return json.loads(result.stdout)

def main():
    BRIEFS_DIR.mkdir(parents=True, exist_ok=True)

    with open(KEYWORDS_FILE) as f:
        keywords = json.load(f)

    for entry in keywords:
        if entry.get("brief_generated"):
            continue

        brief = generate_brief(entry["keyword"], entry["intent"])
        slug = entry["keyword"].lower().replace(" ", "-")
        brief_path = BRIEFS_DIR / f"{slug}.json"

        with open(brief_path, "w") as f:
            json.dump(brief, f, indent=2)

        print(f"Brief generated: {brief_path}")

if __name__ == "__main__":
    main()
```

### Keyword Target Format

Your keyword list (`data/seo/keyword-targets.json`) tracks what to write about:

```json
[
  {
    "keyword": "next.js personal website",
    "intent": "informational",
    "priority": "high",
    "brief_generated": false,
    "draft_generated": false,
    "published": false
  },
  {
    "keyword": "developer blog seo",
    "intent": "informational",
    "priority": "medium",
    "brief_generated": false,
    "draft_generated": false,
    "published": false
  }
]
```

## Stage 2: Draft Generation

With a brief in hand, generate the actual blog post content. This is where Claude CLI or Claude Code does the heavy lifting.

### Draft Generation Script

```python
#!/usr/bin/env python3
"""Generate blog post drafts from SEO briefs."""

import json
import subprocess
from datetime import date
from pathlib import Path

BRIEFS_DIR = Path("content/briefs")
DRAFTS_DIR = Path("content/drafts")
VOICE_FILE = Path("skills/core-voice.md")

def generate_draft(brief_path: Path) -> str:
    """Generate a markdown blog post from a brief."""
    with open(brief_path) as f:
        brief = json.load(f)

    voice_context = ""
    if VOICE_FILE.exists():
        voice_context = f"\n\nVoice guidelines:\n{VOICE_FILE.read_text()}"

    prompt = f"""Write a blog post based on this SEO brief.

Brief:
{json.dumps(brief, indent=2)}
{voice_context}

Requirements:
- Write in markdown with proper frontmatter
- Use the exact H2/H3 structure from the outline
- Include the target keyword naturally (not forced)
- Write for developers who build things, not tourists
- Be specific. Show code when relevant. Name tools and versions.
- No filler paragraphs. Every section earns its place.
- Target word count: {brief.get('word_count_target', 1500)}

Frontmatter format:
---
title: "The title"
date: "YYYY-MM-DD"
description: "Meta description"
tags: ["tag1", "tag2"]
---

Return ONLY the markdown content starting with the frontmatter."""

    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True,
        text=True
    )

    return result.stdout

def main():
    DRAFTS_DIR.mkdir(parents=True, exist_ok=True)

    for brief_path in BRIEFS_DIR.glob("*.json"):
        slug = brief_path.stem
        draft_path = DRAFTS_DIR / f"{date.today()}_{slug}.md"

        if draft_path.exists():
            continue

        content = generate_draft(brief_path)

        with open(draft_path, "w") as f:
            f.write(content)

        print(f"Draft generated: {draft_path}")

if __name__ == "__main__":
    main()
```

### Using Claude Code Instead

If you prefer Claude Code over the CLI script approach, you can generate drafts interactively:

```
claude "Read the brief at content/briefs/next-js-personal-website.json
and write a blog post draft to content/drafts/. Follow the voice
guidelines in skills/core-voice.md. Use markdown with proper frontmatter."
```

The advantage of Claude Code: it reads your codebase, understands your voice files, and can reference existing posts for tone matching. The disadvantage: it requires you to be present.

## Stage 3: Human Review Gate

This is the most important stage. Read every draft before publishing.

What to check:

- **Accuracy.** AI makes confident mistakes. Verify code snippets actually work. Check that tool versions are current. Test any commands it suggests.
- **Voice.** Does it sound like you or like a chatbot? Run it through your anti-slop rules. Watch for em-dashes, narrator setups, authority signaling, and other patterns.
- **Structure.** Does the outline flow? Are there sections that repeat the same point? Is anything missing?
- **Specificity.** Generic advice is worthless. Every claim should have a specific example, a code snippet, or a concrete result.
- **Links.** Verify all URLs. Check that internal links point to real pages. Remove any links the AI hallucinated.

### Review Workflow

A practical review process:

1. Read the draft on your local dev server (not in a text editor). See it as your readers will.
2. Make edits directly in the markdown file. Add your own examples. Remove filler.
3. Run `npm run build` to catch any rendering issues.
4. Sleep on it. Read it again tomorrow. If it still holds up, publish.

The goal is not perfection. The goal is that every published post sounds like you wrote it, because by the time it publishes, you effectively did.

## Stage 4: Publish

Publishing means moving the reviewed draft to your content directory:

```bash
# Move reviewed draft to blog content
mv content/drafts/2026-03-14_next-js-personal-website.md \
   content/blog/next-js-personal-website.md
```

Update the date in the frontmatter if you edited it over multiple days.

## Stage 5: Rebuild and Deploy

After publishing, rebuild the site so the new post appears:

```bash
npm run build
git add content/blog/next-js-personal-website.md
git commit -m "publish: next.js personal website guide"
git push
```

If you are on Vercel or Cloudflare Pages, the push triggers a deploy automatically. If you self-host, trigger the build manually or via a cron job.

## Automating the Pipeline

Once the manual process works, automate stages 1, 2, and 5. Stage 3 (review) stays manual forever.

### Nightly Brief Generation

Run the brief generator on a schedule. When new keywords appear in your target list, briefs get created overnight.

### Weekly Draft Generation

Generate drafts once a week. This gives you a batch to review on a set schedule rather than a constant trickle.

### Post-Merge Deploy

Set up your hosting to auto-deploy when changes hit the main branch. Every merged pull request with a new blog post triggers a rebuild.

### The Full Automated Flow

```
Monday midnight:  Brief generator runs, creates briefs for new keywords
Tuesday midnight: Draft generator runs, creates drafts from briefs
Wednesday:        You review drafts, edit, approve
Thursday:         Push approved posts, auto-deploy
Friday:           Posts are live, start getting indexed
```

## Voice Consistency at Scale

The more you automate, the more important your voice files become. Without voice guidelines, automated drafts will drift toward generic AI writing.

Keep your voice files updated:

- `core-voice.md` defines how you sound
- `anti-slop.md` catches patterns to avoid
- Platform playbooks define per-channel tone

Feed these to every generation prompt. The AI cannot match your voice if it does not know what your voice is.

## Content Quality Metrics

Track these to know if your pipeline is working:

- **Draft acceptance rate.** What percentage of generated drafts make it to publication after review? Below 50% means your briefs or voice files need work.
- **Edit distance.** How much do you change each draft? If you rewrite 80% of every post, the automation is not saving time.
- **Time to publish.** From brief to live post. The pipeline should compress this, not expand it.
- **Search performance.** Are published posts ranking for their target keywords within 30 days?

## What You Have After This Chapter

- SEO brief generation script
- Blog post draft generation from briefs
- Human review workflow
- Publish and deploy pipeline
- Metrics to track pipeline quality

Next up: [Chapter 3: Cron Automation](./03-cron-automation.md) covers scheduling these scripts and other tasks to run automatically.
