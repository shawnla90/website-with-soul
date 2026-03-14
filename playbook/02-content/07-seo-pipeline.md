# 07 - SEO Pipeline

Keyword research to SEO brief to published content. This chapter covers the free-tool workflow that gets your content ranking without sacrificing voice.

## The Tension

SEO and authentic writing feel like opposites. SEO says "write what people search for." Authentic writing says "write what you know and care about." The trick is finding the overlap: topics you genuinely have expertise on that people are actively searching for.

This pipeline helps you find those topics, structure content around them, and publish posts that rank while still sounding like you.

## Free Tools for Keyword Research

You don't need Ahrefs ($99/month) or SEMrush ($130/month) to do keyword research. These free tools cover 80% of what the paid tools offer.

### Google Search Console

If your site is live and getting any traffic, Search Console is your most valuable free tool.

**What it shows you:**
- Which search queries are bringing people to your site
- Your average position for each query
- Click-through rates (CTR) per query
- Which pages rank and for what

**How to use it for content ideas:**
1. Go to Performance > Search results
2. Filter by position 8-20 (queries where you rank on page 1-2 but not at the top)
3. These are topics where Google already considers you relevant but you haven't written definitive content yet
4. Write a comprehensive post targeting each of these queries

This is the highest-ROI SEO work you can do. Google already trusts you on these topics. Better content pushes you up.

### AnswerThePublic

Free tier gives you 3 searches per day. That's enough.

**What it shows you:**
- Questions people ask about a topic ("how to," "why does," "can I")
- Prepositions ("for," "with," "without")
- Comparisons ("vs," "or," "and")

**How to use it:**
1. Enter your core topic (e.g., "personal website")
2. Look at the questions. These become blog post titles or H2 sections.
3. Focus on questions you can answer from experience, not just knowledge.

### AlsoAsked

Shows the "People Also Ask" data from Google in a tree structure.

**What it shows you:**
- Related questions branching from a seed question
- How Google associates topics together
- Secondary questions that come after the first answer

**How to use it:**
1. Enter a question your audience would ask
2. Map the tree. Each branch is a potential section of your article.
3. Covering the full tree in one comprehensive post signals topical authority.

### Google Autocomplete

The simplest research tool. Start typing in Google and see what it suggests.

```
"how to build a personal website" -> sees suggestions:
  ...for free
  ...with no code
  ...with Next.js
  ...that stands out
  ...portfolio
```

Each suggestion is a real query people type. The more specific the suggestion, the less competition.

### Google "People Also Ask"

Search your target keyword and expand every "People Also Ask" question. Each one is a section you can cover in your content. Google is literally telling you what else to write about.

## The SEO Brief

Before writing a search-targeted post, create a brief. The brief prevents you from writing aimlessly and ensures you cover what matters for ranking.

A template is available at `templates/content/seo-brief-template.md`. Here's the structure:

```markdown
# SEO Brief: [Working Title]

## Target Keyword
Primary: [main keyword]
Secondary: [2-3 related keywords]
Long-tail: [specific phrase variations]

## Search Intent
What is the searcher trying to do?
- [ ] Learn something (informational)
- [ ] Find a specific page (navigational)
- [ ] Compare options (commercial)
- [ ] Buy/sign up (transactional)

## Current SERP Analysis
Top 3 results for the primary keyword:
1. [URL] - [What they cover, what's missing]
2. [URL] - [What they cover, what's missing]
3. [URL] - [What they cover, what's missing]

Gap: [What none of them cover well]

## Proposed Outline
H1: [Title]
  H2: [Section 1]
  H2: [Section 2]
    H3: [Subsection]
  H2: [Section 3]
  H2: [Conclusion/Next Steps]

## Content Requirements
- Target word count: [based on competitor analysis]
- Must include: [specific examples, code, data]
- Unique angle: [what makes yours different]
- Internal links to: [existing posts on your site]

## Success Metrics
- Target position: [page 1, top 5, etc.]
- Check after: [30 days, 60 days]
```

### How to fill in the brief

**Target keyword:** Use Google Search Console to find queries you're already close to ranking for. Or use AnswerThePublic to find questions in your space.

**Search intent:** Search the keyword yourself. Look at the top results. Are they tutorials? Comparisons? Product pages? Your content should match the format that Google is already rewarding.

**SERP analysis:** Read the top 3 results for your keyword. Note what they cover thoroughly and where they fall short. Your post needs to match their thoroughness and fill the gaps they missed.

**Proposed outline:** Based on the SERP analysis and "People Also Ask" questions, build an outline. Cover everything the top results cover, plus your unique angle.

## Writing SEO Content That Sounds Like You

This is where voice DNA meets keyword strategy. The brief tells you what to write about. Your voice file tells you how to write it.

### The rules

**Use the keyword naturally.** If your target keyword is "personal website builder," work it into the title and 2-3 headings. Don't force it into every paragraph. Google is smart enough to understand synonyms and related terms.

**Answer the question first.** If someone searches "how to build a personal website for free," your first 200 words should answer that question directly. Front-load the value. Don't make people scroll through an origin story to find the answer.

**Go deeper than competitors.** If the top result has 5 tips, don't write 10 tips. Write 5 better tips with specific examples, code snippets, and real results. Depth beats breadth.

**Include things AI can't generate.** Personal experience. Real screenshots. Actual metrics from your own site. Specific tool recommendations with reasoning. This is your moat. AI can write generic SEO content all day. It can't share what you learned building your specific site.

**Don't sacrifice voice for keywords.** If including a keyword makes a sentence awkward, restructure the sentence. Or skip the keyword in that spot. One natural-sounding post outperforms a keyword-stuffed post that reads like it was optimized by a machine.

### Example: before and after

**Keyword-stuffed:**
"If you're looking for the best personal website builder for free, this personal website builder guide will help you find the best free personal website builder for your needs."

**Natural with keyword coverage:**
"You can build a personal website for free using Next.js and markdown. No website builder needed. Here's the exact setup I use."

Both hit the keyword. One sounds like a person wrote it.

## The Content-SEO Workflow

1. **Weekly:** Check Google Search Console for new keyword opportunities (queries in positions 8-20)
2. **Bi-weekly:** Research one topic using the free tools above
3. **Write the brief:** Fill in the SEO brief template
4. **Write the post:** Use the brief as structure, voice file as style guide
5. **Review:** Anti-slop pass, then SEO checklist below
6. **Publish:** Deploy and submit URL to Search Console
7. **Track:** Check position after 30 and 60 days

### SEO checklist (pre-publish)

```
[ ] Title includes primary keyword (naturally)
[ ] H1 is the title. Only one H1 on the page.
[ ] Primary keyword appears in the first 100 words
[ ] At least 2 H2 headings include secondary keywords
[ ] Meta description (excerpt) includes the keyword and is under 160 chars
[ ] Image alt text is descriptive
[ ] At least one internal link to another page on your site
[ ] At least one external link to a credible source
[ ] URL slug includes the primary keyword
[ ] Content is longer and more detailed than the current #1 result (or offers a unique angle)
```

## Common Mistakes

**Writing for keywords you can't rank for.** A new site can't rank for "best project management tool." That query is owned by sites with millions of backlinks. Target long-tail keywords where competition is low. "Best free project management tool for solo developers" is winnable.

**Ignoring search intent.** If the top results for a keyword are all product comparison pages and you write a tutorial, Google won't rank it. Match the format.

**Over-optimizing.** Using the keyword 47 times in a 1,000-word post. Google penalizes this. Write naturally and trust that covering the topic thoroughly signals relevance.

**Never checking back.** SEO is not publish-and-forget. Check your rankings monthly. Update posts that are slipping. Add new sections when "People Also Ask" questions change.

## Tools Cost Summary

| Tool | Cost | Value |
|------|------|-------|
| Google Search Console | Free | Essential. Your most important SEO tool. |
| AnswerThePublic | Free (3/day) | Great for question-based content ideas. |
| AlsoAsked | Free (limited) | Maps related questions for topical depth. |
| Google Autocomplete | Free | Quick keyword discovery. |
| Google "People Also Ask" | Free | Section ideas for comprehensive posts. |

Total monthly cost: $0.

---

**Template:** `templates/content/seo-brief-template.md`
**Related:** Chapter 04 (Blog Workflow), Chapter 06 (Rich Content)
