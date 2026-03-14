# 04 - Blog Workflow

Draft, review, publish. All in markdown. No CMS, no admin panel, no database. This chapter covers the end-to-end pipeline.

## The Stack

Your blog runs on four pieces:

1. **Markdown files** in `content/blog/` - You write here
2. **gray-matter** - Parses YAML frontmatter from markdown files
3. **remark/rehype** - Converts markdown to HTML with syntax highlighting
4. **Next.js App Router** - Serves the rendered pages

You write a `.md` file. The build system reads it, parses the frontmatter for metadata, renders the markdown to HTML, and serves it as a page. No CMS login. No WYSIWYG editor. No database queries. Just files.

## Writing a Blog Post

### Step 1: Create the file

```bash
touch content/blog/your-post-slug.md
```

The filename becomes the URL. `content/blog/free-tools-for-seo.md` serves at `/blog/free-tools-for-seo`.

### Step 2: Add frontmatter

```yaml
---
title: "Free Tools for SEO That Actually Work"
date: "2026-03-14"
excerpt: "Google Search Console, AnswerThePublic, and a spreadsheet. That's the stack."
category: "growth"
---
```

Required fields:

| Field | Purpose |
|-------|---------|
| `title` | Page title and H1. Shows in cards and search results. |
| `date` | Publication date. Used for sorting and display. |
| `excerpt` | Shows on blog listing page and in meta description for SEO. |
| `category` | Groups posts. Used for filtering on the blog index. |

Optional fields:

| Field | Purpose |
|-------|---------|
| `featured` | Set to `true` to pin on the homepage. |
| `tags` | Array of tags for finer categorization. |
| `image` | Path to hero image. Relative to `/public`. |
| `canonical_url` | If cross-posting, points to the original. |

### Step 3: Write the content

Write in standard markdown. The renderer supports:

- Headings (H2 and H3 recommended. Avoid H1 since the title handles that.)
- Code blocks with language-specific syntax highlighting
- Images with alt text
- Links (external open in new tab automatically)
- Bold, italic, and inline code
- Ordered and unordered lists
- Blockquotes
- Tables

```markdown
## Why Markdown

You write in your editor. You commit with git. The site picks it up.

No database means no database to break. No admin panel means no admin
panel to secure. No WYSIWYG means no formatting surprises.

### Code Example

Here's the function that loads blog posts:

\```typescript
import fs from 'fs'
import matter from 'gray-matter'

export function getBlogPosts() {
  const files = fs.readdirSync('content/blog')
  return files
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(`content/blog/${f}`, 'utf-8')
      const { data, content } = matter(raw)
      return { slug: f.replace('.md', ''), ...data, content }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}
\```
```

### Step 4: Preview locally

```bash
npm run dev
```

Open `http://localhost:3000/blog/your-post-slug` and check that everything renders correctly. Verify:

- Title displays properly
- Code blocks have syntax highlighting
- Images load
- Links work
- The excerpt shows on the blog listing page

## The Review Process

Before publishing, every post goes through a review pass. You can do this manually or with Claude Code.

### Manual review checklist

```
[ ] Read the post out loud. Fix anything that sounds unnatural.
[ ] Run the anti-slop pass (Chapter 02). Fix any flagged patterns.
[ ] Check that every claim has a specific example or evidence.
[ ] Verify all code examples actually work.
[ ] Check links. Dead links kill credibility.
[ ] Read the excerpt. Does it make you want to read the post?
[ ] Check the title. Is it specific? Does it promise something the post delivers?
```

### Claude Code review

You can ask Claude Code to review your draft against your voice file:

```
Review content/blog/free-tools-for-seo.md against my voice DNA.
Flag any anti-slop patterns.
Check for clarity and specificity.
```

Claude Code will read the post, compare it to your `core-voice.md`, and flag issues. It catches things like generic openings, missing examples, and slop patterns you might miss after staring at the same text for an hour.

### Iteration workflow

The typical cycle:

1. Write a first draft (or generate one with AI + voice file)
2. Read it yourself. Make obvious fixes.
3. Ask Claude Code for a review pass.
4. Address the feedback. Usually 2-3 rounds.
5. Read the final version out loud one more time.
6. Publish.

Two to three review rounds is normal. If you're going past five rounds, the draft probably needs a full rewrite rather than incremental patches.

## Publishing

Publishing is deploying your site.

### If you're on Vercel or Cloudflare Pages

```bash
git add content/blog/your-post-slug.md
git commit -m "publish: free tools for seo"
git push
```

Your hosting platform detects the push, runs the build, and deploys. The post is live in 1-2 minutes.

### If you're running a manual build

```bash
npm run build
# Deploy to your hosting provider
```

### Post-publish checklist

```
[ ] Visit the live URL. Confirm the post renders correctly.
[ ] Check the blog listing page. Confirm the new post appears.
[ ] Check the sitemap. Confirm the new URL is included.
[ ] Share the URL on at least one platform (see Chapter 05).
[ ] Submit the URL to Google Search Console for indexing.
```

## How the Build System Works

Understanding the pipeline helps you debug issues.

### gray-matter

The `gray-matter` package reads your markdown file and splits it into two parts: the frontmatter (YAML between the `---` markers) and the content (everything after).

```typescript
import matter from 'gray-matter'

const raw = fs.readFileSync('content/blog/my-post.md', 'utf-8')
const { data, content } = matter(raw)
// data = { title: "...", date: "...", excerpt: "...", category: "..." }
// content = the markdown body as a string
```

### remark/rehype

The `remark` ecosystem converts markdown to HTML. The pipeline:

1. `remark` parses markdown into an AST (abstract syntax tree)
2. Plugins transform the AST (add syntax highlighting, auto-link headers, etc.)
3. `remark-rehype` converts the markdown AST to an HTML AST
4. `rehype-stringify` outputs the final HTML string

You don't need to touch this pipeline unless you want to add features like table of contents generation or custom components.

### Next.js dynamic routes

The `[slug]` route in `app/blog/[slug]/page.tsx` reads the slug from the URL, finds the matching markdown file, processes it through gray-matter and remark, and renders the page.

```typescript
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}
```

## Common Issues

**Post doesn't appear on the listing page.** Check that the frontmatter is valid YAML. Missing colons, unquoted strings with special characters, and incorrect indentation cause silent parsing failures.

**Code blocks aren't highlighted.** Make sure you specify the language after the triple backticks. \`\`\`typescript not just \`\`\`.

**Date sorting is wrong.** The date field must be in `YYYY-MM-DD` format. "March 14, 2026" won't sort correctly.

**Build fails after adding a post.** Run `npm run build` locally before pushing. The error output will point you to the problem.

## Writing Cadence

Consistency beats volume. One post per week is better than four posts in one week followed by three months of silence. Pick a cadence you can sustain and stick to it.

If you're publishing weekly, batch-write when inspiration hits and schedule the releases. Having two or three posts ready to publish reduces pressure on any given week.

---

**Related:** Chapter 03 (Content Filing), Chapter 05 (Content Drop), Chapter 07 (SEO Pipeline)
