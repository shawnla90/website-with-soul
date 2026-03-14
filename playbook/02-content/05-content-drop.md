# 05 - Content Drop

One blog post becomes four platform posts. This chapter covers the distribution workflow that maximizes reach without copy-pasting the same text everywhere.

## Why Not Just Cross-Post?

Cross-posting the same content to every platform fails for three reasons:

**Platform algorithms penalize it.** LinkedIn deprioritizes posts with external links. Reddit downvotes anything that reads like self-promotion. X threads need a different structure than blog posts.

**Audiences expect different formats.** A 2,000-word blog post doesn't work as a LinkedIn update. A Reddit discussion post doesn't work as a tweet thread. Each platform has its own norms, and violating them gets you ignored.

**Duplicate content hurts SEO.** If the same text appears on your blog, Medium, and LinkedIn, search engines pick one version and suppress the rest. Usually not yours.

The solution: one source post adapted into platform-native content. Same core ideas. Different angle, tone, length, and format for each platform.

## The Distribution Matrix

For each blog post, plan your distribution before writing any adaptations.

| Platform | Format | Length | Tone | Goal |
|----------|--------|--------|------|------|
| Blog | Long-form article | 1,000-2,500 words | Your full voice | SEO, authority, backlinks |
| Reddit | Discussion post | 200-500 words | Casual, peer-to-peer | Community engagement, traffic |
| LinkedIn | Professional update | 150-300 words | Practitioner insight | Network visibility, credibility |
| X | Thread (3-7 tweets) | 140-280 chars per tweet | Punchy, high signal | Reach, followers |
| Newsletter | Personal letter | 300-600 words | Conversational, direct | Retention, deepening trust |

Not every post needs every platform. A highly technical tutorial might work on Reddit and your blog but not LinkedIn. A career reflection might work on LinkedIn and your newsletter but not Reddit. Choose platforms that fit the content.

## The Adaptation Process

### Start with the blog post

The blog post is always the source. It has the full context, the detailed examples, and the complete argument. Platform adaptations extract from it. They don't add new ideas.

### Reddit adaptation

Reddit rewards discussion, not promotion. Your Reddit version should:

- Open with a question or a bold opinion (not "I wrote a blog post about...")
- Share the core insight without linking to your blog
- Include enough detail that the post is valuable standalone
- Add the blog link as a "wrote more about this here" at the end, not the beginning
- Match the subreddit's tone and norms

**Example transformation:**

Blog title: "Why Markdown Beats a CMS for Personal Sites"

Reddit title: "Switched from WordPress to markdown files. Here's what surprised me."

Reddit body:
```
I ran WordPress for 3 years. Spent more time updating plugins
and fixing security issues than writing. Last month I moved everything
to markdown files in a git repo.

What surprised me:

1. Writing speed doubled. No login, no editor lag, no formatting toolbar.
   Just open a text file and write.

2. Zero maintenance. No database to back up. No plugins to update.
   No security patches. It's just files.

3. I actually write more. Removing friction removed my excuses.

The tradeoff: you need basic dev skills. If you can use git and a
terminal, you can do this. If not, WordPress is still fine.

Wrote more about the full setup here: [link]

Anyone else made this switch? Curious what your experience was.
```

### LinkedIn adaptation

LinkedIn rewards professional insight. Short, scannable, with a hook in the first two lines.

```
Most personal sites are over-engineered.

WordPress with 37 plugins. A CMS with a monthly fee.
A design system for a site with 12 pages.

I switched to markdown files in a git repo. Write in a text editor.
Commit with git. The site rebuilds automatically.

3 months in:
- Publishing speed: 2x faster
- Maintenance time: zero
- Cost: $0/month

The constraint that made it work: no database. When your content is
just files, there's nothing to break, nothing to patch, nothing to pay for.

If you can use a terminal, you can do this. If you can't,
that's a skill worth learning anyway.
```

Notice: no external link in the body (LinkedIn suppresses reach on link posts). Put the link in a comment instead.

### X thread adaptation

X threads need a strong opening tweet that works standalone, followed by tweets that each carry one idea.

```
Tweet 1:
Switched from WordPress to markdown files for my personal site.
3 months in, here's what I'd tell my past self:

Tweet 2:
Writing speed doubled overnight.
No login. No editor. No formatting toolbar.
Open a text file. Write. Commit. Done.

Tweet 3:
Maintenance went to zero.
No database backups. No plugin updates. No security patches.
It's files in a folder. There's nothing to break.

Tweet 4:
The real win: I actually write now.
WordPress was a 15-minute ceremony before I could type a single word.
Markdown is instant. That matters more than any feature.

Tweet 5:
The tradeoff: you need to be comfortable with git and a terminal.
If you're not, this isn't for you yet.
But learning those tools pays dividends beyond blogging.

Full setup walkthrough: [link]
```

### Newsletter adaptation

Newsletters are personal. Write like you're emailing a friend.

```
Subject: I deleted WordPress

Hey,

Quick update on something I tried last month that stuck.

I moved my entire site from WordPress to markdown files. Just .md files
in a folder, committed to git, rendered by Next.js.

The pitch is "it's simpler" but the actual result surprised me.
I write more. A lot more. Turns out most of my writer's block was
actually tool friction. Remove the friction, remove the block.

The setup takes about an hour if you follow the template I linked below.
Zero ongoing cost. Zero maintenance.

Not for everyone. You need to be comfortable with a terminal.
But if you're reading this newsletter, you probably are.

Here's the walkthrough: [link]

Talk soon,
[Your name]
```

## The Content Drop Workflow

### Step 1: Publish the blog post

The blog post goes live first. It's the canonical source.

### Step 2: Adapt for each platform

Using the blog post as source material, write the platform-specific versions. Save each in the filing system:

```
content/reddit/drafts/2026-03-14_markdown-vs-cms.md
content/linkedin/drafts/2026-03-14_markdown-vs-cms.md
content/x/drafts/2026-03-14_markdown-vs-cms-thread.md
```

### Step 3: Review each adaptation

Run each through the anti-slop pass. Make sure each version:

- Sounds native to the platform
- Stands alone without requiring the blog post
- Maintains your voice while adjusting for platform norms
- Has a clear call to action (even if it's just "what do you think?")

### Step 4: Post within 48 hours

Platform algorithms favor recent, relevant content. If your blog post is about something timely, post all adaptations within 24-48 hours of the blog going live.

### Step 5: Move to final

After posting, move each file to its `final/` directory. Add the posted date and any tracking info to frontmatter.

```yaml
---
platform: reddit
subreddit: "r/webdev"
status: posted
posted: "2026-03-14"
source_post: "content/blog/why-markdown-beats-cms.md"
---
```

## The Content Drop Checklist

Use this for every content drop. A template is available at `templates/content/content-drop-checklist.md`.

```
## Content Drop: [Post Title]

Source: content/blog/[slug].md
Published: [date]

### Adaptations
- [ ] Reddit: drafted → reviewed → posted
- [ ] LinkedIn: drafted → reviewed → posted
- [ ] X: drafted → reviewed → posted
- [ ] Newsletter: drafted → reviewed → sent

### Post-Distribution
- [ ] Blog URL submitted to Google Search Console
- [ ] Responded to early comments on each platform
- [ ] Tracked which platform drove the most traffic (check analytics next week)
```

## Timing Strategy

Not every platform needs to be hit on the same day.

- **Day 1:** Blog post goes live. Post to Reddit (peak: Tuesday-Thursday mornings).
- **Day 1-2:** LinkedIn post (peak: Tuesday-Thursday, 8-10am).
- **Day 2-3:** X thread (peak: weekday mornings).
- **Day 3-5:** Newsletter to subscribers.

Spreading it out over a few days also gives you time to iterate. If the Reddit post gets feedback that improves the argument, incorporate that into the LinkedIn and X versions.

## Common Mistakes

**Writing adaptations that are too similar.** If someone follows you on both LinkedIn and X and sees nearly the same text, it feels lazy. Each platform version should feel like it was written for that platform.

**Leading with the link.** On Reddit especially, opening with "I wrote a blog post" gets downvoted. Lead with value. Link at the end.

**Skipping the review pass.** Platform adaptations are shorter, so it's tempting to skip quality checks. Don't. A bad Reddit post with your name on it does more damage than no post at all.

**Trying to cover every platform.** Start with two platforms you actually use. Add more once the workflow feels sustainable.

---

**Template:** `templates/content/content-drop-checklist.md`
**Related:** Chapter 03 (Content Filing), Chapter 04 (Blog Workflow)
