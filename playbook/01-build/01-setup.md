# Chapter 1: Project Setup

> Clone the starter, install dependencies, and understand the file structure before writing any code.

## Prerequisites

You need three things installed:

- **Node.js 20+** (run `node --version` to check)
- **npm** (comes with Node.js)
- **A code editor** (VS Code, Cursor, or anything you prefer)

## Clone and Run

```bash
git clone https://github.com/shawnla90/website-with-soul.git
cd website-with-soul/starter
npm install
npm run dev
```

Open `http://localhost:3000`. You should see a dark terminal-themed homepage with a placeholder name and a "Read the blog" button.

That is the entire setup. No Docker. No database. No config file maze.

## File Structure

Here is what you are working with:

```
starter/
├── app/                    # Next.js App Router (pages + API routes)
│   ├── api/chat/route.ts   # Chat widget API endpoint
│   ├── blog/
│   │   ├── [slug]/page.tsx # Individual blog post page
│   │   └── page.tsx        # Blog index page
│   ├── feed.xml/route.ts   # RSS feed route handler
│   ├── og/route.tsx        # OG image generator (edge)
│   ├── globals.css         # Theme variables + prose styles
│   ├── layout.tsx          # Root layout (nav, footer, PostHog)
│   └── page.tsx            # Homepage
├── components/
│   ├── ChatWidget.tsx      # Keyword RAG chat widget
│   ├── Footer.tsx          # Site footer
│   ├── Navigation.tsx      # Fixed top nav
│   ├── PostCard.tsx        # Blog post card component
│   └── PostHogProvider.tsx # Analytics provider (toggle-able)
├── content/
│   └── blog/               # Markdown blog posts go here
│       └── hello-world.md  # Example post
├── lib/
│   ├── chat-retrieval.ts   # Keyword matching + scoring engine
│   ├── markdown.ts         # Unified pipeline (remark + rehype)
│   └── posts.ts            # Blog post reader + reading time
├── public/                 # Static files (robots.txt, sitemap)
├── tasks/                  # Claude Code task tracking
│   ├── todo.md
│   └── lessons.md
├── CLAUDE.md               # Claude Code project instructions
├── middleware.ts            # Security headers
├── next.config.ts          # Next.js config (PostHog proxy, images)
├── next-sitemap.config.js  # Sitemap + robots.txt generator
├── package.json
├── postcss.config.mjs      # PostCSS with Tailwind v4
└── tsconfig.json           # TypeScript config with path aliases
```

## How App Router Works

Next.js 15 uses the App Router. Every folder inside `app/` maps to a URL path. Every `page.tsx` inside that folder becomes a page.

| File | URL |
|---|---|
| `app/page.tsx` | `/` |
| `app/blog/page.tsx` | `/blog` |
| `app/blog/[slug]/page.tsx` | `/blog/hello-world` |
| `app/api/chat/route.ts` | `/api/chat` (POST endpoint) |
| `app/feed.xml/route.ts` | `/feed.xml` |
| `app/og/route.tsx` | `/og?title=Hello` |

Folders with brackets like `[slug]` are dynamic routes. The value gets passed as a param to the page component.

### Layout Nesting

`app/layout.tsx` wraps every page. It includes the navigation, footer, and PostHog analytics provider:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          <Navigation />
          <main style={{ minHeight: '100vh', paddingTop: 60 }}>
            {children}
          </main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  )
}
```

The `PostHogProvider` gracefully does nothing if you have not set a PostHog key yet. The `Navigation` is fixed at the top with 60px height, so `main` gets `paddingTop: 60` to avoid overlap.

### Server Components by Default

In App Router, every component is a Server Component unless you add `'use client'` at the top. The starter uses this for:

- **Server Components** (default): `page.tsx` files, `layout.tsx`, `PostCard.tsx`, `Footer.tsx`. These render on the server. No JavaScript sent to the browser.
- **Client Components** (`'use client'`): `Navigation.tsx`, `ChatWidget.tsx`, `PostHogProvider.tsx`. These need browser APIs (click handlers, window, posthog-js).

This matters for performance. Most of your site ships zero JavaScript.

## The Dark Theme

The entire theme lives in CSS variables inside `app/globals.css`:

```css
:root {
  --accent: #58A6FF;
  --accent-dim: #58a6ff33;
  --bg: #0D1117;
  --bg-subtle: #161B22;
  --canvas: #0D1117;
  --canvas-subtle: #161B22;
  --canvas-border: #30363D;
  --text-primary: #C9D1D9;
  --text-secondary: #8B949E;
  --text-link: #58A6FF;
  --green: #4EC373;
  --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
}
```

To change the accent color across the entire site, change `--accent`, `--accent-dim`, and `--text-link`. Everything references these variables.

The font stack uses system monospace fonts. No web fonts to download. No FOUT (flash of unstyled text). The first font available on the user's machine wins.

### Prose Styles

Blog content renders inside a `.prose` container. The styles handle headings, paragraphs, code blocks, blockquotes, images, and horizontal rules. All colors reference the CSS variables:

```css
.prose h1, .prose h2, .prose h3 {
  color: var(--text-primary);
  font-weight: 600;
  margin-top: 2em;
  margin-bottom: 0.5em;
}

.prose p {
  margin: 1em 0;
  color: var(--text-secondary);
}

.prose code {
  background: var(--bg-subtle);
  border: 1px solid var(--canvas-border);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.9em;
}
```

## Tailwind CSS v4

The starter uses Tailwind CSS v4, which works differently from v3. There is no `tailwind.config.js`. Configuration happens through CSS.

The PostCSS config at `postcss.config.mjs` is minimal:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}

export default config
```

And the CSS imports Tailwind at the top of `globals.css`:

```css
@import "tailwindcss";
```

That is it. Tailwind v4 auto-detects your content files and generates utility classes. You can use Tailwind utilities anywhere alongside the inline styles the starter uses.

## Path Aliases

The `tsconfig.json` sets up the `@/` alias so you can import from the project root:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This means `import { getAllPosts } from '@/lib/posts'` resolves to `./lib/posts.ts` from the project root. No `../../..` path climbing.

## Customizing the Homepage

Open `app/page.tsx` and replace the placeholder content:

```tsx
<h1 style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, margin: '0 0 16px' }}>
  Your Name
</h1>
<p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.6 }}>
  A short description of who you are and what you do.
  Replace this with your own intro. Make it real.
</p>
```

Change "Your Name" to your name. Change the description to something real. Update the GitHub link to your actual profile.

## Available Scripts

```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build (also generates sitemap)
npm run start     # Serve the production build locally
```

The `postbuild` script runs `next-sitemap` automatically after every build to regenerate `sitemap.xml` and `robots.txt`.

## What You Have So Far

After this chapter, you have a running Next.js 15 site with:

- Dark terminal theme with CSS variables
- App Router file structure
- Tailwind CSS v4 ready to use
- Path aliases configured
- Navigation and footer components

Next up: [Chapter 2: Markdown Blog](./02-markdown-blog.md) adds a full blog system with reading time calculation and syntax highlighting.
