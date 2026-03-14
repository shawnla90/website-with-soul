# 08 - Self-Improvement Loop

Every mistake becomes a rule. Every rule prevents the next mistake. This chapter covers the feedback loop that makes your content system smarter over time.

## The Core Idea

You will make mistakes. You'll publish a post with a slop pattern you missed. You'll adapt a blog post for LinkedIn and get the tone wrong. You'll target a keyword that's impossible to rank for. These mistakes are expected.

What separates a system that improves from one that repeats the same errors is a feedback file. In this system, that file is `tasks/lessons.md`.

Every time something goes wrong, you write it down. Not a vague note. A specific lesson with a concrete rule that prevents recurrence. Over weeks and months, this file becomes a personalized operations manual that catches problems before they happen.

## The File Format

```markdown
# Lessons Learned

## 2026-03-14
**Context:** Published a LinkedIn post adapted from blog. Got zero engagement.
**Lesson:** The hook was buried in line 3. LinkedIn cuts off after 2 lines.
**Rule:** LinkedIn hooks go in the first sentence. Always check mobile preview before posting.

## 2026-03-12
**Context:** Blog post about free SEO tools flagged by review for 4 anti-slop patterns.
**Lesson:** AI-generated first drafts need the anti-slop pass before human editing, not after. Editing first bakes in the slop.
**Rule:** Anti-slop pass is always step 1 of review. Edit for clarity second.

## 2026-03-10
**Context:** Spent 2 hours writing an SEO brief for "best website builder" keyword.
**Lesson:** DR 90+ sites dominate the first page. No chance of ranking for a new site.
**Rule:** Before writing a brief, check if any result on page 1 has a domain authority under 50. If not, pick a longer-tail keyword.
```

Three fields per entry. Date for chronology. Context for understanding. Lesson for insight. Rule for prevention.

## Why This Format Works

### Specificity forces useful rules

"Be more careful with LinkedIn posts" is useless. "LinkedIn hooks go in the first sentence" is actionable. The format forces specificity because you have to fill in what went wrong (context), what you learned (lesson), and what you'll do differently (rule).

### Rules compound

After 30 entries, you have 30 rules. These rules cover different failure modes across your entire content pipeline. A new blog post runs through anti-slop patterns you documented after publishing bad content. An SEO brief avoids keyword traps you fell into before. A Reddit adaptation avoids tone mistakes you made last month.

Each rule is small. In aggregate, they're a comprehensive quality system built from your actual experience.

### The file is scannable

When you start a new session or begin a content task, scan the rules. They're short and specific. A 50-entry file takes 3 minutes to read. That 3-minute review prevents hours of rework.

## When to Write a Lesson

Write a lesson immediately after any of these events:

- **Content underperforms.** A post gets significantly less engagement than expected.
- **Review catches a problem.** Claude Code or a human reviewer flags something you missed.
- **A mistake reaches production.** A typo, broken link, or factual error makes it to the live site.
- **Process friction.** A workflow step takes much longer than it should.
- **Repeated mistake.** You catch yourself making an error you've made before. (This means the existing rule wasn't specific enough. Rewrite it.)

Don't write lessons for things that went well. This file is specifically for failure modes. Successes are self-reinforcing. Failures need explicit correction.

## How It Works with Claude Code

The starter template's `CLAUDE.md` includes this instruction:

```markdown
## Self-Improvement Loop

After ANY correction from the user:
1. Update `tasks/lessons.md` with the date, context, and lesson
2. Write rules that prevent the same mistake from recurring
3. Review `tasks/lessons.md` at session start
```

This means Claude Code participates in the feedback loop. When you correct Claude Code's output ("that opening sounds too generic" or "don't use em-dashes"), it writes the lesson to the file. Next session, it reads the file and avoids the same mistake.

Over time, Claude Code's behavior in your project becomes personalized. It learns your specific preferences, common failure modes, and quality standards. Not through training or fine-tuning, but through a simple text file that grows with every correction.

### Example interaction

You: "That Reddit adaptation is too self-promotional. Sounds like an ad."

Claude Code writes to `tasks/lessons.md`:

```markdown
## 2026-03-14
**Context:** Reddit adaptation of blog post read as self-promotional.
**Lesson:** Reddit readers are allergic to marketing language. Even subtle promotion gets downvoted.
**Rule:** Reddit adaptations must read as peer discussion, not content marketing. Remove all calls to action except a single "wrote more here: [link]" at the end.
```

Next time Claude Code writes a Reddit adaptation, it reads this rule and adjusts.

## Reviewing the File

### At session start

Every content session begins with a scan of `tasks/lessons.md`. You're looking for rules relevant to what you're about to do:

- Writing a blog post? Scan for blog-related rules.
- Adapting for LinkedIn? Scan for LinkedIn rules.
- Running an SEO brief? Scan for keyword research rules.

### Weekly review

Once a week, read the entire file. Look for:

- **Patterns.** If 5 of your last 10 lessons are about LinkedIn, you have a LinkedIn problem. Dig deeper.
- **Redundant rules.** Two rules that say similar things should be merged into one clear rule.
- **Outdated rules.** A rule about a tool you no longer use can be archived.
- **Missing categories.** If you have 15 rules about writing but none about distribution, your distribution process might need more attention.

### Monthly cleanup

Archive old rules that no longer apply. Move them to a `## Archived` section at the bottom of the file. Don't delete them entirely. You might need to reference why a rule existed.

## Building the Habit

The hardest part of this system is writing the lesson when the mistake is fresh. You just published something that flopped. You don't want to analyze it. You want to move on.

Write it anyway. It takes 60 seconds. The compounding value of 60-second entries over 6 months is enormous. Here's what the progression looks like:

**Month 1:** 5-8 lessons. Mostly about basic content quality. "Don't publish without proofreading." "Check links before deploying."

**Month 3:** 20-30 lessons. Patterns emerge. You notice your biggest weakness (maybe it's SEO targeting, maybe it's platform adaptation). You focus improvement there.

**Month 6:** 40-60 lessons. Your content quality is noticeably better. Mistakes still happen but they're novel, not repeated. The common failure modes are covered by rules.

**Month 12:** 80+ lessons. Your system is highly personalized. New content types and platforms introduce new failure modes, but your core pipeline is solid. You're operating at a level that took other creators years to reach.

## The Flywheel

The lessons file connects to every other chapter in this phase:

- **Voice DNA** (Chapter 01): Lessons about voice drift get added to your core-voice.md anti-patterns
- **Anti-Slop** (Chapter 02): New slop patterns discovered in your own content get added to the checklist
- **Content Filing** (Chapter 03): Process improvements go into filing conventions
- **Blog Workflow** (Chapter 04): Review checklist grows from real misses
- **Content Drop** (Chapter 05): Platform-specific lessons improve adaptations
- **Rich Content** (Chapter 06): Visual mistakes become Pillow script improvements
- **SEO Pipeline** (Chapter 07): Keyword targeting mistakes refine brief quality

Each lesson strengthens the overall system. The system produces better content. Better content produces fewer lessons. The feedback loop tightens.

## Getting Started

Create the file:

```bash
touch tasks/lessons.md
```

Add the header:

```markdown
# Lessons Learned

(Add entries here using the format: Date, Context, Lesson, Rule)
```

Then go write something and publish it. The lessons will follow naturally.

The only rule that matters: when something goes wrong, write it down before you move on. Everything else in this chapter is refinement on that one habit.

---

**Related:** Chapter 01 (Voice DNA), Chapter 02 (Anti-Slop), All chapters in Phase 2
