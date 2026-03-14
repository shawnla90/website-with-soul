# Chapter 6: Cloudflare Pages

> Vercel's free tier is generous. Cloudflare Pages offers more control, edge computing, and flat pricing at scale. This chapter covers when and how to migrate.

## Why Consider Cloudflare

Vercel is the default for Next.js hosting. It works well. You might never need to leave. But as your sites grow, Cloudflare Pages offers advantages worth considering.

**Control.** Cloudflare gives you Workers (serverless functions at the edge), KV (key-value storage), R2 (object storage), and D1 (SQLite at the edge). Your infrastructure lives in one place, not spread across Vercel for hosting and three other providers for storage and compute.

**Pricing.** Vercel's free tier has bandwidth limits (100GB), function execution limits, and analytics is paid. Cloudflare Pages free tier includes unlimited bandwidth, 500 builds/month, and 100,000 function invocations/day. The paid plan ($5/month) removes most limits.

**Edge functions.** Cloudflare Workers run at 300+ locations globally. Response times are consistently fast because the code runs close to the user. This matters for API routes, chat endpoints, and dynamic content.

**No cold starts.** Workers do not have cold start latency like traditional serverless functions. Your API routes respond instantly.

## When Vercel Free Tier Stops Being Enough

Signs you are outgrowing Vercel free:

- **Bandwidth warnings.** You are approaching 100GB/month.
- **Function timeouts.** Your API routes need more than 10 seconds on the free plan.
- **Multiple sites.** Vercel free gives you limited projects. Cloudflare Pages has no project limit.
- **Need for storage.** You want KV storage, a database, or object storage without adding another provider.
- **Cost at scale.** Vercel Pro is $20/month per team member. Cloudflare Workers Paid is $5/month flat.

If none of these apply to you, stay on Vercel. It works and the Next.js integration is seamless. Only migrate when you have a reason.

## What Changes

### The Adapter

Next.js does not run natively on Cloudflare. You need the `@cloudflare/next-on-pages` adapter, which converts your Next.js build output into a format Cloudflare Pages can serve.

```bash
npm install @cloudflare/next-on-pages --save-dev
```

### Build Command

Your build command changes from `next build` to:

```bash
npx @cloudflare/next-on-pages
```

This runs `next build` internally, then transforms the output.

### next.config.ts Changes

```ts
const nextConfig = {
  // Required for Cloudflare Pages
  output: 'standalone',

  // Your existing config stays the same
  images: {
    remotePatterns: [
      // your image patterns
    ],
  },
}

export default nextConfig
```

The `output: 'standalone'` setting is required. It tells Next.js to produce a self-contained build.

### Runtime Differences

Some Next.js features work differently on Cloudflare:

| Feature | Vercel | Cloudflare |
|---|---|---|
| API Routes | Node.js runtime | Edge runtime (Workers) |
| Image Optimization | Built-in | Use Cloudflare Images or skip |
| ISR (Incremental Static Regeneration) | Built-in | Use KV for caching |
| Middleware | Edge runtime | Edge runtime (same) |
| Server Components | Supported | Supported |
| Static pages | CDN cached | CDN cached |

The biggest change: API routes run on the edge runtime, not Node.js. This means some Node.js APIs are not available (filesystem access, native modules). For a personal website with a chat widget and blog, this rarely matters.

## Migration Steps

### 1. Install the Adapter and CLI

```bash
npm install @cloudflare/next-on-pages wrangler --save-dev
```

### 2. Create wrangler.toml

```toml
name = "your-site-name"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

The `nodejs_compat` flag enables Node.js compatible APIs in Workers. This prevents most compatibility issues.

### 3. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npx @cloudflare/next-on-pages",
    "preview": "npx wrangler pages dev",
    "deploy": "npx wrangler pages deploy"
  }
}
```

### 4. Test Locally

```bash
npm run build
npm run preview
```

This runs your site locally using the Cloudflare Pages runtime. Test everything: blog pages, the chat widget API route, RSS feed, OG images, sitemap.

### 5. Create the Cloudflare Pages Project

```bash
npx wrangler pages project create your-site-name
```

Or create it through the Cloudflare dashboard: Pages > Create a project > Connect to Git.

### 6. Configure Build Settings

In the Cloudflare dashboard:

- **Build command:** `npx @cloudflare/next-on-pages`
- **Build output directory:** `.vercel/output/static`
- **Root directory:** `/` (or `/apps/main-site` in a monorepo)
- **Node.js version:** 20

### 7. Set Environment Variables

Any environment variables from Vercel need to be added to Cloudflare:

```bash
npx wrangler pages secret put ANTHROPIC_API_KEY
npx wrangler pages secret put POSTHOG_KEY
```

Or set them in the Cloudflare dashboard under your project's Settings > Environment Variables.

### 8. Deploy

```bash
npm run deploy
```

Or push to your connected Git repository. Cloudflare builds automatically on push, just like Vercel.

## Domain Configuration

### If Your Domain is Already on Cloudflare

If you are using Cloudflare for DNS (common), adding a custom domain to Pages is simple:

1. Go to your Pages project > Custom domains
2. Add your domain
3. Cloudflare automatically creates the DNS records

### If Your Domain is Elsewhere

You need to either:

1. **Transfer DNS to Cloudflare.** Update your domain's nameservers to Cloudflare's. This gives you the full Cloudflare stack (CDN, DDoS protection, analytics).
2. **Use a CNAME.** Point a CNAME record at `your-project.pages.dev`. This works but you miss some Cloudflare features.

Transferring DNS is recommended. Cloudflare DNS is free, fast, and gives you the full platform.

### Domain Transfer Checklist

Before transferring:

- [ ] Export your current DNS records
- [ ] Note all subdomains and where they point
- [ ] Check for email DNS records (MX, SPF, DKIM, DMARC)
- [ ] Lower TTL on records 24 hours before transfer
- [ ] Plan the transfer during low-traffic hours

After transferring:

- [ ] Verify all DNS records are recreated in Cloudflare
- [ ] Test the main domain resolves correctly
- [ ] Test all subdomains
- [ ] Verify email still works
- [ ] Check SSL certificate is active

## Chat Widget API Route on Cloudflare

Your chat widget's API route (`app/api/chat/route.ts`) needs minor adjustments for the edge runtime:

```ts
// Add this to force edge runtime
export const runtime = 'edge'

export async function POST(request: Request) {
  const { message } = await request.json()

  // The Anthropic SDK works on edge runtime
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages: [{ role: 'user', content: message }],
    }),
  })

  const data = await response.json()
  return Response.json({ reply: data.content[0].text })
}
```

If you were using the Anthropic Node SDK, switch to raw `fetch` calls. The SDK works on edge but raw fetch is lighter and avoids any compatibility edge cases.

## Using Cloudflare KV

Once you are on Cloudflare, you get access to KV (key-value storage at the edge). Useful for:

- **Caching API responses.** Cache search results, analytics data, or external API responses.
- **Rate limiting.** Track request counts per IP.
- **Feature flags.** Toggle features without redeploying.

```ts
// In a Cloudflare Worker / API route
export async function GET(request: Request) {
  const env = (request as any).cf?.env

  // Read from KV
  const cached = await env.MY_KV.get('latest-posts')
  if (cached) {
    return Response.json(JSON.parse(cached))
  }

  // Compute and cache
  const posts = await fetchPosts()
  await env.MY_KV.put('latest-posts', JSON.stringify(posts), {
    expirationTtl: 3600, // 1 hour
  })

  return Response.json(posts)
}
```

## Rollback Plan

If the migration goes wrong, rolling back is straightforward:

1. Point your domain's DNS back to Vercel (or re-add the domain in Vercel dashboard)
2. Your Vercel project still exists with the last successful deployment
3. DNS propagation takes 5-30 minutes

Keep your Vercel project active for at least a week after migrating. Do not delete it until you are confident everything works on Cloudflare.

## Cost Comparison at Scale

| Monthly usage | Vercel (Pro) | Cloudflare (Paid) |
|---|---|---|
| Base cost | $20/member | $5 flat |
| Bandwidth (500GB) | Included | Included (unlimited) |
| Function invocations (1M) | Included | Included |
| KV storage | Not included | Included |
| Image optimization | Included | Separate ($) |
| Analytics | $10+/month | Free (basic) |

For a solo builder running 2-3 sites, Cloudflare is significantly cheaper. The main trade-off: Vercel's Next.js integration is smoother because they make Next.js.

## What You Have After This Chapter

- Understanding of when to migrate from Vercel to Cloudflare
- Step-by-step migration process
- Domain transfer checklist
- Edge runtime adaptations for API routes
- KV storage patterns for caching
- Rollback plan if things go wrong

This completes Phase 4: Scale. You now have the tools to go from one site to many, automate your content pipeline, schedule everything, build agent systems, grow a community, and choose the right hosting as you scale.
