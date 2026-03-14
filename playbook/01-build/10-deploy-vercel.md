# Chapter 10: Deploy to Vercel

> Put your site live on the internet with Vercel's free hobby tier. Custom domain, environment variables, and PostHog proxy all working in production.

## Why Vercel

Vercel built Next.js. Their free hobby tier includes:

- Unlimited static sites
- Serverless functions (API routes)
- Edge functions (OG image generation)
- Automatic HTTPS
- Global CDN
- Preview deployments for every git push
- Custom domains

The starter is designed to deploy on Vercel with zero configuration changes.

## Option 1: Deploy via GitHub

This is the recommended approach. Every push to your main branch triggers a production deployment.

### Steps

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project"
4. Select your repository
5. Vercel auto-detects Next.js. Accept the defaults.
6. Click "Deploy"

Your site will be live at `your-project.vercel.app` within 60 seconds.

### Automatic Deployments

After connecting GitHub:
- Push to `main` = production deployment
- Push to any other branch = preview deployment with a unique URL
- Open a pull request = preview deployment linked in the PR

## Option 2: Deploy via CLI

For quick one-off deployments without GitHub integration:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the starter directory
cd website-with-soul/starter
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name? your-site-name
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

The first `vercel` command creates a preview deployment. The `vercel --prod` command promotes it to production.

## Environment Variables

Your site needs environment variables for PostHog and the chat widget. Set them in Vercel:

### Via Dashboard

1. Go to your project in the Vercel dashboard
2. Click "Settings" tab
3. Click "Environment Variables" in the sidebar
4. Add each variable:

| Variable | Value | Required |
|---|---|---|
| `NEXT_PUBLIC_POSTHOG_KEY` | `phc_your_key` | No (analytics disabled without it) |
| `NEXT_PUBLIC_POSTHOG_HOST` | `/ingest` | No (defaults to `/ingest`) |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | No (chat returns setup message without it) |
| `SITE_URL` | `https://yourdomain.com` | No (affects sitemap/RSS URLs) |

### Via CLI

```bash
vercel env add ANTHROPIC_API_KEY
# Paste your key when prompted
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_POSTHOG_KEY
# Paste your PostHog project key

vercel env add SITE_URL
# Enter https://yourdomain.com
```

After adding environment variables, redeploy to pick them up:

```bash
vercel --prod
```

### Security Note

`ANTHROPIC_API_KEY` is a server-side secret. It is only available in API routes (server-side). It is never exposed to the browser.

`NEXT_PUBLIC_POSTHOG_KEY` starts with `NEXT_PUBLIC_`, which means it IS exposed to the browser. This is intentional. PostHog project keys are designed to be public. They identify your project but cannot be used to access your data.

## Custom Domain

### Adding a Domain

1. Go to your Vercel project dashboard
2. Click "Settings" then "Domains"
3. Enter your domain (e.g., `yourdomain.com`)
4. Vercel gives you DNS records to add

### DNS Configuration

For a root domain (`yourdomain.com`), add an A record:

```
Type: A
Name: @
Value: 76.76.21.21
```

For a subdomain (`blog.yourdomain.com`), add a CNAME record:

```
Type: CNAME
Name: blog
Value: cname.vercel-dns.com
```

### SSL/HTTPS

Vercel automatically provisions an SSL certificate via Let's Encrypt. No configuration needed. HTTPS works within minutes of adding the domain.

### Updating SITE_URL

After adding your custom domain, update the `SITE_URL` environment variable:

```bash
vercel env add SITE_URL
# Enter: https://yourdomain.com
vercel --prod
```

This ensures your sitemap, RSS feed, and OG images reference the correct domain.

## PostHog Proxy in Production

The proxy rewrites from [Chapter 4](./04-posthog.md) work on Vercel without changes. The `rewrites` in `next.config.ts` are deployed as Vercel rewrites:

```typescript
async rewrites() {
  return [
    {
      source: '/ingest/static/:path*',
      destination: 'https://us-assets.i.posthog.com/static/:path*',
    },
    {
      source: '/ingest/:path*',
      destination: 'https://us.i.posthog.com/:path*',
    },
  ]
}
```

Vercel processes these server-side. The browser only sees requests to your domain. Ad blockers see nothing.

## Build Output

When Vercel builds your site, you will see output like:

```
Route (app)                          Size     First Load JS
┌ ○ /                                5.2 kB        92 kB
├ ○ /blog                            1.8 kB        88 kB
├ ● /blog/[slug]                     2.1 kB        89 kB
├ ○ /feed.xml                        0 B            0 B
├ ○ /og                              0 B            0 B
└ ○ /api/chat                        0 B            0 B

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
```

Key things to note:
- Blog pages are static HTML (prerendered at build time)
- The feed and OG routes ship zero JS
- API routes ship zero client-side JS
- Total JS per page is under 100KB

## Vercel Free Tier Limits

| Resource | Free Tier Limit | Typical Personal Site Usage |
|---|---|---|
| Bandwidth | 100 GB/month | Under 1 GB |
| Serverless Function Invocations | 100K/month | Under 1K |
| Edge Function Invocations | 500K/month | Under 5K |
| Build Minutes | 100 hours/month | Under 1 hour |
| Deployments | Unlimited | 10-30/month |

A personal site with moderate traffic stays well within these limits. You would need tens of thousands of daily visitors to approach any of them.

## Deployment Checklist

Before your first production deploy:

- [ ] Replace "Your Site Name" in `app/layout.tsx` metadata
- [ ] Replace "Your Name" in `app/page.tsx`
- [ ] Replace "yoursite" in `components/Navigation.tsx`
- [ ] Replace "yoursite.com" in `app/og/route.tsx`
- [ ] Replace "Your Site Name" in `app/feed.xml/route.ts`
- [ ] Update the GitHub link in `components/Navigation.tsx` and `app/page.tsx`
- [ ] Update the knowledge base in `app/api/chat/route.ts`
- [ ] Set `SITE_URL` environment variable
- [ ] (Optional) Set `ANTHROPIC_API_KEY` for chat
- [ ] (Optional) Set `NEXT_PUBLIC_POSTHOG_KEY` for analytics
- [ ] Delete `content/blog/hello-world.md` and write your first real post
- [ ] Run `npm run build` locally to verify no errors

## Troubleshooting

### Build Fails on Vercel

Check the build logs in the Vercel dashboard. Common issues:

- **TypeScript errors**: Run `npm run build` locally first to catch these
- **Missing dependencies**: Check `package.json` has all required packages
- **Environment variable issues**: Variables must be set before the build

### PostHog Not Tracking

1. Check that `NEXT_PUBLIC_POSTHOG_KEY` is set in Vercel environment variables
2. Check that you redeployed after adding the variable
3. Open DevTools console on your production site and look for PostHog debug output

### Chat Widget Returns Setup Message

The chat widget returns the setup message when `ANTHROPIC_API_KEY` is missing. Add it in Vercel environment variables and redeploy.

### OG Images Not Showing on Social Media

Social media platforms cache OG images aggressively. After deploying:
1. Use the platform's debugger tool to refresh the cache (see [Chapter 6](./06-og-images.md))
2. Verify `/og?title=Test` returns an image on your production domain

## What You Have Now

After this chapter, your site is live on the internet with:

- Production deployment on Vercel's free tier
- Automatic deployments from git pushes
- Custom domain with HTTPS
- Environment variables for all services
- PostHog proxy working in production

Next up: [Chapter 11: Claude Code Setup](./11-claude-code-setup.md) configures Claude Code as your AI development partner with context handoffs and a self-improvement loop.
