# 01 - Voice DNA

Your voice is the one thing competitors cannot replicate. This chapter shows you how to capture it in a file that every piece of content flows through.

## What is Voice DNA?

Voice DNA is a structured document that defines how you write. Not how you wish you wrote. Not how your favorite author writes. How _you_ actually sound when you're explaining something you care about to someone you respect.

It lives in a single file: `core-voice.md`. Every blog post, social post, and landing page runs through it. When you use AI to help write content, this file becomes the guardrail that keeps output sounding like you instead of sounding like a language model.

A core-voice file has five sections:

1. **Origin story** - Who you are and why anyone should listen
2. **Voice characteristics** - The specific traits that make your writing yours
3. **Formatting rules** - How you structure sentences, paragraphs, and posts
4. **Audience definition** - Who you're writing for and what they need
5. **Anti-patterns** - What your writing never does

## Why You Need This

Without a voice file, you get one of two outcomes:

**Option A:** You write everything yourself from scratch every time. It's authentic but slow. You burn out after six posts.

**Option B:** You use AI tools and get generic output. It reads fine but sounds like every other AI-assisted blog on the internet. Your audience can tell. Engagement drops.

The voice file gives you a third option. You write with AI assistance, but the output passes through your documented voice. The result sounds like you wrote it on a good day, at scale, without the burnout.

## How to Extract Your Natural Voice

You already have a voice. You just haven't documented it. Here's the extraction process.

### Step 1: Gather raw samples

Find 5-10 pieces of writing where you sounded most like yourself. These are usually:

- Slack messages where you explained something clearly
- Emails to friends or close colleagues (not formal business emails)
- Social media posts that got engagement
- Any writing you did that someone said "that sounds just like you" about
- Voice-to-text transcriptions of you explaining your work

Avoid samples where you were trying to sound professional. You want the unfiltered version.

### Step 2: Identify patterns

Read your samples back-to-back and look for:

- **Sentence length.** Do you write short punchy sentences? Long flowing ones? A mix?
- **Vocabulary level.** Do you use jargon freely or explain everything? Do you curse? Use slang?
- **Paragraph structure.** Short paragraphs (1-2 sentences) or longer blocks?
- **Tone.** Serious? Sarcastic? Warm? Direct? Some combination?
- **How you open.** Do you start with context, a question, a bold statement?
- **How you close.** Do you summarize, leave it open, give a call to action?

### Step 3: Write it down

Take what you found and fill in the template at `templates/voice/core-voice-template.md`. Be specific. "Conversational tone" tells you nothing. "Writes like a senior engineer explaining something at a whiteboard after two coffees" tells you everything.

### Step 4: Test it

Give your voice file to Claude Code (or any AI tool) along with a topic, and ask it to write a paragraph. Read the output. Does it sound like you? If not, figure out what's off and tighten the voice file.

Repeat this until the output consistently passes the "would I actually say this?" test.

## The Core Voice Template

The template lives at `templates/voice/core-voice-template.md`. Here's what each section contains.

### Origin Story

```markdown
## Origin Story

[2-3 paragraphs about who you are, what you've built, and why you're writing.
This isn't a bio. It's the context that shapes your perspective.
What experience do you bring that makes your take worth reading?]
```

The origin story grounds every piece of content. When AI generates output, it uses this to understand what kind of person is "speaking." Without it, you get generic advice from a generic persona.

### Voice Characteristics

```markdown
## Voice Characteristics

- Tone: [e.g., "Direct and warm. Explains complex things simply. Never talks down."]
- Energy: [e.g., "High signal, low noise. Every sentence earns its place."]
- Perspective: [e.g., "Practitioner, not pundit. Writes from build experience, not theory."]
- Quirks: [e.g., "Uses 'ship' as a verb constantly. Starts paragraphs with 'Look,'"]
```

Be honest here. If you write in sentence fragments, say so. If you use profanity when making a point, document it. This isn't about who you want to be. It's about who you are on the page.

### Formatting Rules

```markdown
## Formatting Rules

- Paragraph length: [e.g., "2-4 sentences max. One-sentence paragraphs for emphasis."]
- Headers: [e.g., "H2 for major sections, H3 for subsections. No H4 or deeper."]
- Lists: [e.g., "Numbered for sequences, bullets for options. Never more than 7 items."]
- Code blocks: [e.g., "Always include a comment explaining what the code does."]
- Emphasis: [e.g., "Bold for key terms on first use. Italics sparingly."]
```

### Audience Definition

```markdown
## Audience

- Primary: [e.g., "Technical founders who can code but don't have a marketing team"]
- Secondary: [e.g., "Developers building side projects who want an audience"]
- Assumed knowledge: [e.g., "Comfortable with CLI, git, and basic web development"]
- Not writing for: [e.g., "Enterprise marketing teams, non-technical readers"]
```

The "not writing for" line matters. It prevents your voice from getting diluted trying to please everyone.

### Anti-patterns

```markdown
## Never Do This

- [e.g., "Never use em-dashes. Period."]
- [e.g., "Never open with 'In today's fast-paced world'"]
- [e.g., "Never use 'leverage' when 'use' works"]
- [e.g., "Never write a three-sentence parallel structure"]
```

This section grows over time. Every time you catch AI output that sounds wrong, add the pattern here.

## Using Voice DNA with AI Tools

When you prompt Claude Code (or any AI) to write content, include your voice file in the context. The simplest approach:

1. Put `core-voice.md` in your project root or a `voice/` directory
2. Reference it in your `CLAUDE.md` so it loads automatically
3. When asking for content, say "write this following the voice in core-voice.md"

The voice file doesn't make AI-generated content perfect. It makes it 80% of the way there. You still edit. But editing from 80% is much faster than editing from 20%.

## Common Mistakes

**Too vague.** "Professional but approachable" describes half the internet. Get specific about what makes your writing different from other professional-but-approachable writers.

**Too aspirational.** Don't describe the writer you want to become. Describe the writer you are right now. You can update the file as your voice evolves.

**Too many rules.** Start with 10-15 characteristics. You can always add more. A 50-rule voice file overwhelms the AI and produces worse output.

**Never updating it.** Your voice changes. Review the file quarterly. Cut rules that no longer apply. Add new patterns you've noticed.

## What's Next

Voice DNA is the foundation. The next chapter covers anti-slop patterns, the specific checklist that catches AI-generated writing before it reaches your audience.

---

**Template:** `templates/voice/core-voice-template.md`
**Related:** Chapter 02 (Anti-Slop), Chapter 08 (Self-Improvement Loop)
