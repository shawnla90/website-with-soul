# Chapter 9: Core Web Vitals

> Understand the performance optimizations built into the starter that make it score 90+ on Lighthouse with zero configuration.

## Why Performance Matters

Google uses Core Web Vitals as a ranking signal. A slow site gets deprioritized in search results. More importantly, visitors leave. A 1-second delay in page load increases bounce rate by 7%. A 3-second delay increases it by 32%.

The starter template is optimized for performance by default. You should not need to tweak anything for a personal site. This chapter explains what is already in place and why.

## The Three Core Web Vitals

| Metric | What It Measures | Good Score |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Time until the largest visible element loads | Under 2.5 seconds |
| **INP** (Interaction to Next Paint) | Time between user interaction and visual response | Under 200ms |
| **CLS** (Cumulative Layout Shift) | How much the page jumps around while loading | Under 0.1 |

The starter targets all three by making specific architecture decisions.

## Server Components by Default

The biggest performance win in the starter is that most pages ship zero JavaScript to the browser.

In Next.js 15 App Router, every component is a Server Component unless you add `'use client'`. The starter uses this aggressively:

| Component | Type | JavaScript to Browser |
|---|---|---|
| `app/page.tsx` | Server | 0 KB |
| `app/blog/page.tsx` | Server | 0 KB |
| `app/blog/[slug]/page.tsx` | Server | 0 KB |
| `components/PostCard.tsx` | Server | 0 KB |
| `components/Footer.tsx` | Server | 0 KB |
| `components/Navigation.tsx` | Client | Minimal (~1 KB) |
| `components/ChatWidget.tsx` | Client | ~4 KB |
| `components/PostHogProvider.tsx` | Client | ~2 KB (lazy loaded) |

Blog pages render entirely on the server. The HTML arrives ready to display. No JavaScript parsing, no hydration, no layout shifts.

## System Fonts

The starter uses system monospace fonts instead of web fonts:

```css
:root {
  --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
}

body {
  font-family: var(--font-mono);
}
```

### Why This Matters for Performance

Web fonts cause two performance problems:

1. **Extra HTTP requests**: Each font file is a separate download (typically 50-100KB per weight)
2. **FOUT/FOIT**: Flash of Unstyled Text or Flash of Invisible Text while fonts load

System fonts are already installed on the user's machine. Zero download time. Zero layout shift from font swapping.

The font stack provides a good monospace font on every platform:
- **macOS/iOS**: SF Mono
- **Linux**: Fira Code or Fira Mono
- **Windows**: Consolas
- **Fallback**: generic monospace

## Image Optimization

`next.config.ts` configures modern image formats:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

### AVIF and WebP

When you use the Next.js `<Image>` component, it automatically:

1. Converts images to AVIF (best compression, ~50% smaller than JPEG)
2. Falls back to WebP if the browser does not support AVIF
3. Falls back to the original format as a last resort
4. Generates multiple sizes for responsive loading
5. Lazy-loads images below the fold

AVIF saves significant bandwidth. A 200KB JPEG becomes roughly 80KB as AVIF with equivalent visual quality.

### No Images by Default

The starter homepage uses no images. The hero is text. Blog post cards are text. The terminal aesthetic works without any visual assets. This is a deliberate design choice that eliminates the most common cause of slow LCP.

When you do add images, use the Next.js `<Image>` component:

```tsx
import Image from 'next/image'

<Image
  src="/your-image.jpg"
  alt="Description"
  width={800}
  height={400}
  priority  // Add this for above-the-fold images
/>
```

The `priority` prop tells Next.js to preload the image, which helps LCP for hero images.

## Standalone Output

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
}
```

The `standalone` output mode creates a self-contained build that includes only the files needed to run the production server. Benefits:

- **Smaller deployment size**: Only necessary dependencies are included
- **Faster cold starts**: Less code to load when the server starts
- **Docker-friendly**: Works perfectly in containerized deployments

For Vercel deployments, this is handled automatically. For self-hosted deployments, the standalone output in `.next/standalone/` contains everything you need.

## CSS Performance

### No External Stylesheets

The starter uses:
- CSS variables in `globals.css` (inlined by Next.js)
- Inline styles on components
- Tailwind CSS v4 utilities (compiled at build time)

No external CSS files to download. No render-blocking stylesheets. The browser can paint the page immediately.

### Minimal CSS

The entire `globals.css` is under 150 lines. It defines:
- Theme variables (colors, fonts)
- Base body styles
- Link styles
- Prose styles for blog content
- A few utility classes

There is no CSS framework overhead. No unused utility classes shipped to the browser. Tailwind v4 only generates CSS for classes you actually use.

## Zero Layout Shift

The starter avoids CLS (Cumulative Layout Shift) through several decisions:

**Fixed navigation height**: The nav is always 60px tall with a matching `paddingTop: 60` on main. Content never shifts when the nav loads.

```tsx
<nav style={{ position: 'fixed', top: 0, height: 60 }}>
  {/* ... */}
</nav>
<main style={{ minHeight: '100vh', paddingTop: 60 }}>
  {children}
</main>
```

**No font loading shifts**: System fonts are available immediately. No swap from fallback to web font.

**No image layout shifts**: The blog uses text-only cards. When you add images, the Next.js `<Image>` component reserves space with `width` and `height` props, preventing shifts.

**No dynamic ad injection**: No third-party scripts that inject banners or popups after page load.

## Lighthouse Scores

Run a Lighthouse audit on the starter:

1. Open Chrome DevTools (F12)
2. Go to the Lighthouse tab
3. Select "Performance" category
4. Click "Analyze page load"

Expected scores on the starter:

| Category | Score |
|---|---|
| Performance | 95-100 |
| Accessibility | 90-95 |
| Best Practices | 95-100 |
| SEO | 90-95 |

These scores will vary slightly based on your machine and network conditions, but the starter consistently scores above 90 in all categories.

## Things That Will Hurt Performance

As you customize the site, watch out for:

**Large images without the `<Image>` component**: Raw `<img>` tags do not get optimization. Always use `next/image`.

**Third-party scripts**: Every analytics tag, widget, or embed adds JavaScript. The starter only includes PostHog, which lazy-loads. Adding Google Analytics, Intercom, Hotjar, and similar tools will impact LCP and INP.

**Web fonts**: If you switch from system fonts to Google Fonts, you add a render-blocking request. Use `next/font` if you must add web fonts, as it handles preloading and optimization.

**Client Components where Server Components work**: Every `'use client'` directive adds JavaScript to the bundle. Only use it when you need browser APIs (click handlers, window, state).

**Unoptimized CSS**: Adding large CSS frameworks or many unused utility classes increases the CSS file size. Tailwind v4 tree-shakes unused classes, but custom CSS does not.

## Monitoring in Production

PostHog (see [Chapter 4](./04-posthog.md)) tracks Core Web Vitals automatically when enabled. You can also use:

- **Google Search Console**: Shows Core Web Vitals data from real users
- **PageSpeed Insights**: [pagespeed.web.dev](https://pagespeed.web.dev) shows both lab and field data
- **Vercel Analytics**: Free tier includes Web Vitals tracking

## What You Have Now

After this chapter, you understand:

- Why the starter scores 90+ on Lighthouse
- How Server Components eliminate client-side JavaScript
- Why system fonts prevent layout shifts
- How AVIF/WebP image formats reduce file sizes
- What to avoid when customizing to maintain performance

Next up: [Chapter 10: Deploy to Vercel](./10-deploy-vercel.md) puts your site live on the internet with Vercel's free hobby tier.
