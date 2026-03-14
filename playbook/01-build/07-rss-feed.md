# Chapter 7: RSS Feed

> Add an RSS feed as a Next.js route handler so readers can subscribe and aggregators can find your content.

## Why RSS Still Matters

RSS is not dead. It is the backbone of content distribution infrastructure that most people never see:

- **Podcast apps** use RSS to distribute episodes
- **Newsletter tools** like Substack and Buttondown can pull from RSS
- **News aggregators** (Feedly, Inoreader, NetNewsWire) surface your content
- **AI training pipelines** often discover content through RSS feeds
- **IFTTT/Zapier automations** can trigger workflows when you publish

An RSS feed costs nothing to maintain and gives your content distribution channels you would not otherwise have.

## The Route Handler

`app/feed.xml/route.ts` generates XML from your blog posts:

```typescript
import { getAllPosts } from '@/lib/posts'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')
const SITE_URL = process.env.SITE_URL || 'https://yoursite.com'

export async function GET() {
  const posts = getAllPosts(CONTENT_DIR)

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
    </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Site Name</title>
    <link>${SITE_URL}</link>
    <description>A website with soul.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
```

Visit `http://localhost:3000/feed.xml` to see the generated XML.

## How It Works

### Route Handler Pattern

The file lives at `app/feed.xml/route.ts`. In App Router, this means:

- The folder name `feed.xml` becomes the URL path `/feed.xml`
- The `route.ts` file exports a `GET` function that handles requests
- Next.js calls this function and returns the `Response` object

This is a regular server-side route handler, not a page. No React rendering. Just a function that returns XML.

### XML Generation

The feed uses RSS 2.0 format with an Atom namespace for the self-referencing link:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Site Name</title>
    <link>https://yoursite.com</link>
    <description>A website with soul.</description>
    <language>en</language>
    <atom:link href="https://yoursite.com/feed.xml" rel="self" type="application/rss+xml" />
    <item>
      <title><![CDATA[Hello World]]></title>
      <link>https://yoursite.com/blog/hello-world</link>
      <guid>https://yoursite.com/blog/hello-world</guid>
      <pubDate>Thu, 01 Jan 2026 00:00:00 GMT</pubDate>
      <description><![CDATA[Your first post. Replace this with something real.]]></description>
    </item>
  </channel>
</rss>
```

### CDATA Sections

Title and description use `<![CDATA[...]]>` wrappers:

```xml
<title><![CDATA[Hello World]]></title>
```

CDATA tells XML parsers to treat the content as raw text. Without it, special characters like `&`, `<`, `>` in your post titles would break the XML. CDATA handles all edge cases without needing manual escaping.

### Cache Headers

```typescript
headers: {
  'Content-Type': 'application/xml',
  'Cache-Control': 'public, max-age=3600',
}
```

`Content-Type: application/xml` tells browsers and feed readers this is XML, not HTML.

`Cache-Control: public, max-age=3600` caches the response for 1 hour (3600 seconds). Feed readers typically poll every 1-4 hours, so this is a good balance between freshness and server load.

### The atom:link Element

```xml
<atom:link href="https://yoursite.com/feed.xml" rel="self" type="application/rss+xml" />
```

This self-referencing link is required by the RSS 2.0 spec when using the Atom namespace. Feed validators will flag its absence. It tells readers where to find the canonical feed URL.

## Customizing the Feed

### Update Channel Metadata

Replace the placeholder values:

```typescript
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Your Name - Blog</title>
    <link>${SITE_URL}</link>
    <description>Writing about building, learning, and shipping.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`
```

### Add Full Content

The starter includes only the excerpt in `<description>`. To include full post content, add a `<content:encoded>` field:

```typescript
const items = posts
  .map(
    (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
    </item>`
  )
  .join('')
```

And add the content namespace to the RSS tag:

```xml
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
```

### Add Category Tags

If your posts have categories:

```typescript
const items = posts
  .map(
    (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      ${post.category ? `<category>${post.category}</category>` : ''}
    </item>`
  )
  .join('')
```

## Adding a Feed Link to Your HTML

Add a `<link>` tag in your layout so browsers and feed readers can auto-discover the feed. In `app/layout.tsx`, update the metadata:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Your Site Name',
    template: '%s | Your Site Name',
  },
  description: 'A website with soul.',
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}
```

This adds `<link rel="alternate" type="application/rss+xml" href="/feed.xml">` to every page's `<head>`. RSS-aware browsers (Firefox, Safari) will show a feed icon.

## Validating Your Feed

After deploying, validate your feed at [validator.w3.org/feed](https://validator.w3.org/feed/). Enter `https://yoursite.com/feed.xml` and it will check for errors.

Common issues:
- Missing `atom:link` self-reference (already included)
- Date format errors (using `toUTCString()` outputs the correct format)
- Special characters in titles (handled by CDATA)

## Testing Locally

```bash
npm run dev
# Open http://localhost:3000/feed.xml in your browser
```

You should see formatted XML with your blog posts listed as items.

## What You Have Now

After this chapter, your site has:

- RSS 2.0 feed at `/feed.xml`
- Auto-discovery link tag in HTML
- Cached responses for performance
- Automatic inclusion of all blog posts
- Valid XML with proper escaping

Next up: [Chapter 8: Security Headers](./08-security-headers.md) locks down your site with Content Security Policy, frame protection, and referrer controls via middleware.
