# Chapter 2: Markdown Blog

> Build a blog powered by local markdown files with frontmatter parsing, reading time calculation, and syntax-highlighted code blocks.

## How It Works

The blog system has three layers:

1. **Markdown files** in `content/blog/` with YAML frontmatter
2. **`lib/posts.ts`** reads those files, parses frontmatter, calculates reading time
3. **`lib/markdown.ts`** converts markdown to HTML via a unified/remark/rehype pipeline

No database. No CMS. No API. You write markdown files and the site picks them up.

## Writing a Post

Create a new file at `content/blog/my-first-real-post.md`:

```markdown
---
title: "Why I Built This Site"
date: "2026-01-15"
excerpt: "I got tired of renting my audience on social platforms. Here is what I built instead."
category: "builds"
---

## The problem with renting your audience

Every follower on Twitter, every connection on LinkedIn, every subscriber
on YouTube lives on someone else's platform. You do not own that list.

## What I did about it

I built a website. Not a Linktree. Not a Notion page. A real website
with a blog, RSS feed, and a chat widget that knows about my work.

Here is the stack:

- **Next.js 15** with App Router
- **Tailwind CSS v4** for styling
- **Vercel** free tier for hosting
- **PostHog** free tier for analytics

Total monthly cost: $0.
```

The filename becomes the URL slug. `my-first-real-post.md` becomes `/blog/my-first-real-post`.

### Frontmatter Options

Every post needs a YAML frontmatter block at the top:

```yaml
---
title: "Your Post Title"        # Required. Shows in cards and page header.
date: "2026-01-15"              # Required. Used for sorting (newest first).
excerpt: "A short description." # Optional. Falls back to first 160 chars of content.
category: "builds"              # Optional. Shows as an accent-colored tag.
featured: true                  # Optional. For future use (featured post sections).
---
```

## The Posts Library

`lib/posts.ts` is the engine. Here is the full implementation:

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  readingTime: number
  category?: string
  featured?: boolean
}

function calcReadingTime(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, '')   // Remove code blocks
    .replace(/`[^`]+`/g, '')          // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')  // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '')   // Remove links (keep text)
    .replace(/[#*_~>|]/g, '')         // Remove markdown chars
    .replace(/\s+/g, ' ')            // Collapse whitespace
    .trim()
  const wordCount = stripped.split(' ').filter(Boolean).length
  return Math.max(1, Math.round(wordCount / 200))
}

export function getPostSlugs(contentDir: string): string[] {
  const exists = fs.existsSync(contentDir)
  if (!exists) return []
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
}

export function getPostBySlug(slug: string, contentDir: string): Post {
  const fullPath = path.join(contentDir, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? '',
    excerpt: (data.excerpt as string) ?? content.slice(0, 160).replace(/\n/g, ' '),
    content,
    readingTime: calcReadingTime(content),
    category: (data.category as string) ?? undefined,
    featured: (data.featured as boolean) ?? undefined,
  }
}

export function getAllPosts(contentDir: string): Post[] {
  const slugs = getPostSlugs(contentDir)
  return slugs
    .map((slug) => getPostBySlug(slug, contentDir))
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}
```

### Key Details

**`gray-matter`** splits the YAML frontmatter from the markdown content. Given this file:

```markdown
---
title: "Hello"
---
Body content here.
```

`matter(fileContents)` returns `{ data: { title: "Hello" }, content: "Body content here." }`.

**Reading time** strips markdown formatting before counting words. Code blocks, images, and link URLs are removed because they inflate word count without representing reading time. The formula: words / 200, minimum 1 minute.

**`getAllPosts`** returns posts sorted by date, newest first. The sort comparison `a.date > b.date ? -1 : 1` works because dates are in `YYYY-MM-DD` format, which sorts lexicographically.

**`getPostSlugs`** handles the case where `content/blog/` does not exist yet by checking `fs.existsSync` first. The blog index page renders gracefully with an empty array.

## The Markdown Pipeline

`lib/markdown.ts` converts raw markdown into sanitized, syntax-highlighted HTML:

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
    span: [...(defaultSchema.attributes?.span ?? []), 'className'],
  },
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)        // Parse markdown to AST
    .use(remarkGfm)          // GitHub Flavored Markdown (tables, strikethrough)
    .use(remarkRehype)       // Convert markdown AST to HTML AST
    .use(rehypeHighlight)    // Syntax highlighting for code blocks
    .use(rehypeSanitize, sanitizeSchema)  // Strip dangerous HTML
    .use(rehypeSlug)         // Add IDs to headings for anchor links
    .use(rehypeStringify)    // Convert HTML AST to string

    .process(markdown)

  return result.toString()
}
```

### Pipeline Stages

The pipeline processes markdown through seven stages in order:

1. **remarkParse** turns raw markdown text into an abstract syntax tree (AST)
2. **remarkGfm** adds support for GitHub-flavored markdown: tables, task lists, strikethrough
3. **remarkRehype** bridges the remark (markdown) world to the rehype (HTML) world
4. **rehypeHighlight** applies syntax highlighting using highlight.js. Fenced code blocks with language tags (` ```typescript `) get CSS classes for coloring
5. **rehypeSanitize** strips any dangerous HTML (script tags, event handlers) while preserving className attributes needed for syntax highlighting
6. **rehypeSlug** adds `id` attributes to headings so you can link directly to `#sections`
7. **rehypeStringify** converts the final HTML AST to a string

The custom `sanitizeSchema` extends the default safe schema to allow `className` on `<code>` and `<span>` elements. Without this, syntax highlighting CSS classes get stripped and all code blocks render as plain text.

## Blog Pages

### Blog Index (`app/blog/page.tsx`)

```typescript
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/PostCard'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All blog posts.',
}

export default function BlogIndex() {
  const posts = getAllPosts(CONTENT_DIR)

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Blog</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 40 }}>
        Thoughts, builds, and lessons learned.
      </p>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>
          No posts yet. Add markdown files to <code>content/blog/</code> to get started.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
```

This is a Server Component. It reads from the filesystem at build time (or on each request in dev). Zero JavaScript ships to the browser for this page.

### Blog Post Page (`app/blog/[slug]/page.tsx`)

```typescript
import type { Metadata } from 'next'
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { markdownToHtml } from '@/lib/markdown'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export async function generateStaticParams() {
  return getPostSlugs(CONTENT_DIR).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug, CONTENT_DIR)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: [`/og?title=${encodeURIComponent(post.title)}`],
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug, CONTENT_DIR)
  const html = await markdownToHtml(post.content)

  return (
    <article className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <header style={{ marginBottom: 40 }}>
        <time style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {post.date}
        </time>
        {post.category && (
          <span style={{ color: 'var(--accent)', fontSize: 13, marginLeft: 12 }}>
            {post.category}
          </span>
        )}
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 12px', lineHeight: 1.2 }}>
          {post.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {post.readingTime} min read
        </p>
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
```

### Key Details

**`generateStaticParams`** tells Next.js which slugs exist at build time. This enables static generation. Every blog post becomes a pre-rendered HTML file.

**`generateMetadata`** creates per-page SEO metadata. Each post gets its own `<title>`, `<meta description>`, and OpenGraph tags. The OG image auto-generates using the `/og` route (see [Chapter 6](./06-og-images.md)).

**`dangerouslySetInnerHTML`** renders the processed HTML from the markdown pipeline. The `rehypeSanitize` step in the pipeline makes this safe.

**`params` is a Promise** in Next.js 15 App Router. You must `await params` before accessing `.slug`. This is a change from earlier Next.js versions.

## The PostCard Component

Each post renders as a card with title, date, excerpt, category tag, and reading time:

```typescript
import Link from 'next/link'
import type { Post } from '@/lib/posts'

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: 'block',
        padding: 20,
        borderRadius: 8,
        border: '1px solid var(--canvas-border)',
        backgroundColor: 'var(--bg-subtle)',
        textDecoration: 'none',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {post.title}
        </h3>
        <time style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0, marginLeft: 16 }}>
          {post.date}
        </time>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
        {post.excerpt}
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
        {post.category && <span style={{ color: 'var(--accent)' }}>{post.category}</span>}
        <span>{post.readingTime} min read</span>
      </div>
    </Link>
  )
}
```

The entire card is wrapped in a `<Link>`, making the whole area clickable. No `'use client'` directive needed since this is a Server Component with no interactivity.

## Adding a New Post

The workflow:

1. Create `content/blog/your-slug.md`
2. Add frontmatter block at the top
3. Write content in markdown
4. Save. The dev server picks it up immediately.

In production, run `npm run build` and the post gets statically generated.

## Homepage Integration

The homepage shows the 3 most recent posts:

```typescript
const posts = getAllPosts(CONTENT_DIR).slice(0, 3)
```

As you publish more posts, the homepage automatically shows the latest ones.

## Dependencies

The blog system uses these packages from `package.json`:

| Package | Purpose |
|---|---|
| `gray-matter` | Parse YAML frontmatter from markdown files |
| `unified` | Core processing pipeline |
| `remark-parse` | Markdown parser |
| `remark-gfm` | GitHub Flavored Markdown support |
| `remark-rehype` | Bridge markdown AST to HTML AST |
| `rehype-highlight` | Syntax highlighting (highlight.js) |
| `rehype-sanitize` | Strip dangerous HTML |
| `rehype-slug` | Add IDs to headings |
| `rehype-stringify` | Convert HTML AST to string |

All installed with `npm install`. No additional setup required.

## What You Have Now

After this chapter, your site has:

- File-based blog with automatic slug routing
- Frontmatter parsing for metadata
- Reading time calculation that ignores code blocks
- Syntax-highlighted code blocks
- Sanitized HTML output
- Static generation for all posts

Next up: [Chapter 3: Chat Widget](./03-chat-widget.md) adds an AI chat widget with keyword RAG that knows about your content.
