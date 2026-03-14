# Chapter 8: Security Headers

> Lock down your site with Content Security Policy, frame protection, and referrer controls using Next.js middleware.

## Why Security Headers Matter

Without security headers, your site is vulnerable to:

- **Clickjacking**: someone embeds your site in an iframe and tricks users into clicking
- **XSS injection**: malicious scripts execute in your visitors' browsers
- **MIME sniffing**: browsers interpret files as a different content type than intended
- **Referrer leakage**: your URLs get exposed to third-party sites

The starter ships with production-grade security headers out of the box. You do not need to configure anything. But you should understand what each header does.

## The Middleware

`middleware.ts` in the project root:

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://us.i.posthog.com; frame-ancestors 'none'"
  )
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|ingest|api|og|feed|sitemap|robots\\.txt|.*\\..*).*)',
  ],
}
```

## What Each Header Does

### Content-Security-Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self' https://us.i.posthog.com;
frame-ancestors 'none'
```

CSP tells the browser exactly where resources can come from. Breaking it down:

| Directive | Value | Meaning |
|---|---|---|
| `default-src` | `'self'` | By default, only load resources from your own domain |
| `script-src` | `'self' 'unsafe-inline' 'unsafe-eval'` | Allow scripts from your domain, inline scripts, and eval() |
| `style-src` | `'self' 'unsafe-inline'` | Allow styles from your domain and inline styles |
| `img-src` | `'self' data: blob:` | Allow images from your domain, data URIs, and blob URLs |
| `font-src` | `'self'` | Only allow fonts from your domain |
| `connect-src` | `'self' https://us.i.posthog.com` | Allow fetch/XHR to your domain and PostHog |
| `frame-ancestors` | `'none'` | Prevent anyone from embedding your site in an iframe |

**Why `'unsafe-inline'` and `'unsafe-eval'`?** Next.js uses inline scripts and eval for hot module replacement in development and some production optimizations. Removing these breaks Next.js. A stricter CSP with nonce-based scripts is possible but adds significant complexity. This configuration is a practical balance.

**The `connect-src` entry for PostHog**: Even with the proxy pattern from [Chapter 4](./04-posthog.md), PostHog's SDK may make direct connections during initialization. The CSP allows this explicitly. If you remove PostHog, remove `https://us.i.posthog.com` from `connect-src`.

### X-Content-Type-Options

```
X-Content-Type-Options: nosniff
```

Prevents browsers from MIME-sniffing responses. Without this, a browser might interpret a `.txt` file as JavaScript and execute it if an attacker can control the content. With `nosniff`, the browser only executes files with correct MIME types.

### X-Frame-Options

```
X-Frame-Options: DENY
```

Prevents your site from being embedded in `<iframe>`, `<frame>`, or `<object>` elements on any domain. This blocks clickjacking attacks where an attacker overlays invisible iframes to hijack clicks.

This is redundant with `frame-ancestors 'none'` in CSP, but older browsers support `X-Frame-Options` and not CSP. Both headers together give you full coverage.

### Referrer-Policy

```
Referrer-Policy: strict-origin-when-cross-origin
```

Controls what URL information gets sent in the `Referer` header when navigating away from your site:

- **Same-origin requests**: Full URL sent (path + query string)
- **Cross-origin HTTPS to HTTPS**: Only the origin (`https://yoursite.com`)
- **HTTPS to HTTP**: No referrer sent at all

This prevents your blog post URLs and query strings from leaking to third-party sites while still giving your own analytics full URL data.

### Permissions-Policy

```
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Explicitly disables browser APIs your site does not need:

- `camera=()` - No camera access
- `microphone=()` - No microphone access
- `geolocation=()` - No location tracking

The empty parentheses `()` mean "allowed for no origins, not even self." This prevents any script (including injected ones) from requesting these permissions.

## The Matcher Pattern

The `config.matcher` controls which routes the middleware runs on:

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|ingest|api|og|feed|sitemap|robots\\.txt|.*\\..*).*)',
  ],
}
```

This regex excludes:

| Pattern | Why Excluded |
|---|---|
| `_next/static` | Next.js static assets (JS, CSS bundles) |
| `_next/image` | Next.js image optimization API |
| `favicon.ico` | Browser favicon requests |
| `ingest` | PostHog proxy requests (see [Chapter 4](./04-posthog.md)) |
| `api` | API routes (chat endpoint needs different headers) |
| `og` | OG image generator (returns images, not pages) |
| `feed` | RSS feed (returns XML) |
| `sitemap` | Sitemap files |
| `robots.txt` | Robots file |
| `.*\\..*` | Any file with an extension (static files in `/public`) |

The middleware only runs on page routes. Static files, API endpoints, and special routes skip it.

### Why API Routes Are Excluded

API routes like `/api/chat` return JSON, not HTML pages. The CSP header would interfere with CORS requests from the chat widget. By excluding `api` from the matcher, API routes respond without security headers that would block legitimate requests.

### Why PostHog Proxy Is Excluded

The `/ingest` path proxies to PostHog (see [Chapter 4](./04-posthog.md)). Adding security headers to proxied requests can cause issues with PostHog's servers. The rewrite handles these requests before middleware runs.

## Adding External Resources

If you add third-party services, update the CSP accordingly.

### Adding Google Fonts

```typescript
response.headers.set(
  'Content-Security-Policy',
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://us.i.posthog.com; frame-ancestors 'none'"
)
```

### Adding an External Image CDN

```typescript
"img-src 'self' data: blob: https://images.unsplash.com;"
```

### Adding YouTube Embeds

```typescript
"frame-src https://www.youtube.com; frame-ancestors 'none'"
```

Note: `frame-src` (what frames *you* can embed) is different from `frame-ancestors` (who can embed *you*).

## Testing Security Headers

### Browser DevTools

1. Open your site
2. Open DevTools (F12)
3. Go to the Network tab
4. Click on the page request
5. Check the Response Headers section

You should see all five security headers listed.

### Online Scanner

Use [securityheaders.com](https://securityheaders.com) to scan your deployed site. Enter your URL and it grades your headers from A+ to F. The starter configuration typically scores A.

## What You Have Now

After this chapter, your site has:

- Content Security Policy blocking unauthorized resources
- Clickjacking protection via X-Frame-Options and frame-ancestors
- MIME sniffing prevention
- Controlled referrer information
- Disabled unnecessary browser APIs
- Smart route matching that excludes static files and API routes

Next up: [Chapter 9: Core Web Vitals](./09-core-web-vitals.md) covers the performance optimizations baked into the starter that make it score 90+ on Lighthouse.
