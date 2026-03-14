# Chapter 5: Sitemap and Robots.txt

> Configure your sitemap with priority-based page ranking and an AI crawler allowlist so your content shows up in both search engines and AI answers.

## Why This Matters

Your sitemap tells search engines what pages exist and how important they are. Your robots.txt tells crawlers what they are allowed to index.

Most sites block AI crawlers. That is a mistake. When ChatGPT, Perplexity, or Claude answers a question and cites your site, that is free distribution. You want AI crawlers indexing every page.

## How next-sitemap Works

The starter uses `next-sitemap` to auto-generate both `sitemap.xml` and `robots.txt` after every build. The `postbuild` script in `package.json` triggers it:

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap"
  }
}
```

Run `npm run build` and two files appear in `public/`:
- `public/sitemap.xml` (or `sitemap-0.xml` for larger sites)
- `public/robots.txt`

## The Configuration

`next-sitemap.config.js` in the project root:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://yoursite.com',
  generateRobotsTxt: true,
  outDir: './public',
  transform: async (config, path) => {
    const highPriority = ['/', '/about']
    const mediumPriority = ['/blog']

    let priority = 0.5
    let changefreq = 'weekly'

    if (highPriority.includes(path)) {
      priority = 1.0
      changefreq = 'daily'
    } else if (mediumPriority.includes(path) || path.startsWith('/blog/')) {
      priority = 0.8
      changefreq = 'weekly'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
    ],
  },
}
```

### Priority-Based Transform

The `transform` function assigns different priority levels to different pages:

| Pages | Priority | Change Frequency |
|---|---|---|
| `/`, `/about` | 1.0 | daily |
| `/blog`, `/blog/*` | 0.8 | weekly |
| Everything else | 0.5 | weekly |

Priority is a hint to crawlers about relative importance within your site. A priority of 1.0 does not mean "crawl this more." It means "this page is more important than my 0.5 pages." Crawlers use this to decide what to focus on when they have limited bandwidth.

`changefreq` hints how often content changes. Your homepage might update daily (new blog posts). Individual blog posts rarely change after publishing.

### Adding New Priority Tiers

As your site grows, extend the transform function:

```javascript
transform: async (config, path) => {
  const highPriority = ['/', '/about']
  const mediumPriority = ['/blog', '/projects']
  const lowPriority = ['/privacy', '/terms']

  let priority = 0.5
  let changefreq = 'weekly'

  if (highPriority.includes(path)) {
    priority = 1.0
    changefreq = 'daily'
  } else if (mediumPriority.includes(path) || path.startsWith('/blog/') || path.startsWith('/projects/')) {
    priority = 0.8
    changefreq = 'weekly'
  } else if (lowPriority.includes(path)) {
    priority = 0.3
    changefreq = 'monthly'
  }

  return { loc: path, changefreq, priority, lastmod: config.autoLastmod ? new Date().toISOString() : undefined }
}
```

## The AI Crawler Allowlist

The `robotsTxtOptions` section generates this `robots.txt`:

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: OAI-SearchBot
Allow: /

Host: https://yoursite.com
Sitemap: https://yoursite.com/sitemap.xml
```

### What Each Crawler Is

| User Agent | Source | What It Powers |
|---|---|---|
| `GPTBot` | OpenAI | ChatGPT web browsing, training data |
| `ChatGPT-User` | OpenAI | Real-time browsing during conversations |
| `OAI-SearchBot` | OpenAI | SearchGPT results |
| `PerplexityBot` | Perplexity | Perplexity AI search answers |
| `ClaudeBot` | Anthropic | Claude web search citations |
| `Applebot-Extended` | Apple | Apple Intelligence, Siri |
| `Google-Extended` | Google | Gemini AI features |

### Why Allow Everything

The default behavior for most hosting platforms is to block these bots. That protects large publishers who do not want their content used for AI training. But for a personal site, the calculus is different.

When someone asks ChatGPT "how do I build a Next.js blog?" and your site gets cited, that is a backlink you did not earn through SEO. It is distribution in a channel you cannot buy ads on. The upside of being indexed by AI crawlers far outweighs the cost for personal and small business sites.

## Setting Your Site URL

Add your production URL to `.env.local`:

```bash
SITE_URL=https://yoursite.com
```

This ensures the sitemap and robots.txt reference your real domain. Without it, the fallback `https://yoursite.com` gets used.

For Vercel deployments, set this as an environment variable in your Vercel project settings.

## Generated Output

After running `npm run build`, check `public/sitemap-0.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.com</loc>
    <lastmod>2026-01-15T00:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yoursite.com/blog</loc>
    <lastmod>2026-01-15T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://yoursite.com/blog/hello-world</loc>
    <lastmod>2026-01-15T00:00:00.000Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

Every blog post gets included automatically. No manual sitemap management.

## Submitting to Google Search Console

After deploying, submit your sitemap to Google:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Go to Sitemaps in the left sidebar
4. Enter `https://yoursite.com/sitemap.xml`
5. Click Submit

Google will crawl your sitemap and index your pages. This usually takes a few days for new sites.

## What You Have Now

After this chapter, your site has:

- Auto-generated sitemap with priority-based ranking
- robots.txt with AI crawler allowlist
- Automatic inclusion of new blog posts
- Build-time generation (runs on every deploy)

Next up: [Chapter 6: OG Images](./06-og-images.md) generates dynamic Open Graph images at the edge so every page and blog post has a unique social card.
