# Chapter 6: OG Images

> Generate dynamic Open Graph images at the edge so every page and blog post gets a unique social preview card.

## What OG Images Do

When you share a URL on Twitter, LinkedIn, Slack, or Discord, the platform fetches the page's Open Graph metadata to render a preview card. The `og:image` tag tells it which image to show.

Without an OG image, your links show up as plain text or a generic placeholder. With one, they get a visual card that drives more clicks.

The starter generates OG images dynamically using Next.js `next/og`. No image files to create. No design tool needed. Every page gets a unique card based on its title.

## The OG Route

`app/og/route.tsx` is an edge function that generates images on the fly:

```typescript
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'Your Site Name'
  const subtitle = searchParams.get('subtitle') ?? 'A website with soul.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: '#0D1117',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#484F58',
            marginBottom: 32,
          }}
        >
          <span style={{ color: '#58A6FF', marginRight: 8 }}>$</span>
          cat ~/post.md
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 48,
            fontWeight: 700,
            color: '#58A6FF',
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#8B949E',
            lineHeight: 1.5,
            maxWidth: '80%',
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 60,
            left: 80,
            right: 80,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              fontWeight: 600,
              color: '#58A6FF',
            }}
          >
            yoursite.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```

### How It Works

1. The route reads `title` and `subtitle` from query parameters
2. It renders a JSX layout using `ImageResponse` from `next/og`
3. The JSX gets converted to a 1200x630 PNG image at the edge
4. The image is cached and served on subsequent requests

Visit `http://localhost:3000/og?title=Hello%20World&subtitle=My%20first%20post` to see it in action.

### The Terminal Aesthetic

The image matches the site's dark theme:

- **Background**: `#0D1117` (same as `--bg`)
- **Title**: `#58A6FF` (same as `--accent`)
- **Subtitle**: `#8B949E` (same as `--text-secondary`)
- **Terminal prompt**: `$ cat ~/post.md` in gray with a blue dollar sign

This creates a cohesive visual identity. Your social cards look like they belong to your site.

### Image Dimensions

The output is 1200x630 pixels. This is the standard OG image size recommended by all major platforms:

| Platform | Recommended Size | Starter Output |
|---|---|---|
| Twitter | 1200x628 | 1200x630 (close enough) |
| LinkedIn | 1200x627 | 1200x630 (close enough) |
| Facebook | 1200x630 | 1200x630 (exact) |
| Discord | 1200x630 | 1200x630 (exact) |

## Blog Post Integration

Each blog post automatically uses the OG route in its metadata. From `app/blog/[slug]/page.tsx`:

```typescript
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
```

The key line is:

```typescript
images: [`/og?title=${encodeURIComponent(post.title)}`],
```

Every blog post gets an OG image with its title rendered in the terminal style. No manual image creation needed.

## Customizing the OG Image

### Change the Domain Text

Replace `yoursite.com` at the bottom of the image:

```typescript
<div style={{ display: 'flex', fontSize: 18, fontWeight: 600, color: '#58A6FF' }}>
  yourdomain.com
</div>
```

### Change the Terminal Command

Replace the `cat ~/post.md` line:

```typescript
<div style={{ display: 'flex', fontSize: 20, color: '#484F58', marginBottom: 32 }}>
  <span style={{ color: '#58A6FF', marginRight: 8 }}>$</span>
  cat ~/blog.md
</div>
```

### Add More Query Parameters

Extend the route to accept additional parameters:

```typescript
export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'Your Site Name'
  const subtitle = searchParams.get('subtitle') ?? 'A website with soul.'
  const category = searchParams.get('category') ?? ''

  return new ImageResponse(
    (
      <div style={{ /* ... */ }}>
        {category && (
          <div style={{ display: 'flex', fontSize: 16, color: '#4EC373', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 2 }}>
            {category}
          </div>
        )}
        {/* rest of the layout */}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

Then reference it in blog metadata:

```typescript
images: [`/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category || '')}`],
```

## Edge Runtime

The `export const runtime = 'edge'` declaration runs this function at the edge, close to the user. Benefits:

- **Fast**: sub-100ms response times globally
- **Cached**: Vercel caches the generated images at the edge
- **Cheap**: edge functions on Vercel's free tier are included

The edge runtime has some limitations (no filesystem access, limited Node.js APIs), but image generation only needs `ImageResponse`, which works perfectly at the edge.

## JSX Constraints in ImageResponse

`ImageResponse` uses Satori under the hood, which has specific CSS support:

**Supported:**
- `display: flex` (required on every element)
- `flexDirection`, `justifyContent`, `alignItems`
- `padding`, `margin`, `position`
- `fontSize`, `fontWeight`, `color`, `lineHeight`
- `background`, `borderRadius`, `border`
- `maxWidth`, `width`, `height`

**Not Supported:**
- `display: grid`
- CSS variables
- `text-decoration`
- Advanced selectors

Every element needs `display: 'flex'` explicitly. This is the most common gotcha when editing OG image layouts.

## Testing OG Images

### Local Preview

Visit `http://localhost:3000/og?title=Test%20Title&subtitle=Test%20subtitle` in your browser. You will see the generated PNG image.

### Social Media Debuggers

After deploying, verify your OG images work on each platform:

- **Twitter**: [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)
- **Facebook**: [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)

Enter your blog post URL and the debugger will show what the card looks like.

## What You Have Now

After this chapter, your site has:

- Dynamic OG image generation at the edge
- Terminal-aesthetic social preview cards
- Automatic OG images for every blog post
- Consistent visual branding across all social platforms

Next up: [Chapter 7: RSS Feed](./07-rss-feed.md) adds an RSS feed so readers can subscribe and aggregators can syndicate your content.
