# Chapter 1: Monorepo Upgrade

> When you are running two or more sites from the same codebase, a monorepo stops being optional. This chapter covers upgrading from a single Next.js project to a Turborepo monorepo with shared packages.

## When to Make the Move

One site? Stay with the starter. Do not complicate things.

Two sites? You will start copy-pasting components between repos. Shared styles will drift. Bug fixes will need to be applied in multiple places. That is the signal.

The threshold is simple: the moment you catch yourself syncing code between two separate repos, it is time to consolidate.

## What a Monorepo Gives You

- **Shared components.** One `ChatWidget.tsx` used by every site.
- **Shared libraries.** One markdown processor, one blog post reader, one analytics provider.
- **Coordinated builds.** Change a shared component, every site that uses it rebuilds.
- **Single dependency tree.** One `node_modules` at the root. No version drift between projects.
- **Atomic changes.** Update the chat widget and every site that consumes it in one commit.

## The Target Structure

```
your-monorepo/
├── apps/
│   ├── main-site/          # Your primary website
│   │   ├── app/
│   │   ├── content/
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── second-site/        # Your second website
│   │   ├── app/
│   │   ├── content/
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── docs/               # Documentation site (optional)
├── packages/
│   └── shared/
│       ├── components/     # ChatWidget, PostCard, Navigation, Footer
│       ├── lib/            # posts.ts, markdown.ts, chat-retrieval.ts
│       ├── styles/         # Shared CSS variables
│       ├── package.json
│       └── tsconfig.json
├── turbo.json
├── package.json            # Root workspace config
└── CLAUDE.md
```

Each app is a full Next.js project with its own `app/` directory, content folder, and config. The difference: shared code lives in `packages/shared/` and gets imported instead of duplicated.

## Step-by-Step Migration

### 1. Install Turborepo

```bash
npm install turbo --save-dev
```

Or install globally:

```bash
npm install -g turbo
```

### 2. Set Up Workspaces

Your root `package.json` declares the workspace structure:

```json
{
  "name": "your-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint"
  }
}
```

### 3. Create turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

The `dependsOn: ["^build"]` line means: before building an app, build its dependencies (the shared package) first. This is the key to correct build ordering.

### 4. Move Your Starter into apps/

```bash
mkdir -p apps/main-site
# Move everything except node_modules and .git
mv app/ components/ content/ lib/ public/ tasks/ \
   CLAUDE.md middleware.ts next.config.ts \
   next-sitemap.config.js package.json \
   postcss.config.mjs tsconfig.json \
   apps/main-site/
```

### 5. Create the Shared Package

```bash
mkdir -p packages/shared/{components,lib,styles}
```

The shared `package.json`:

```json
{
  "name": "@your-org/shared",
  "version": "0.0.1",
  "main": "./index.ts",
  "types": "./index.ts",
  "exports": {
    "./components/*": "./components/*.tsx",
    "./lib/*": "./lib/*.ts",
    "./styles/*": "./styles/*.css"
  }
}
```

### 6. Extract Shared Components

Move components that every site uses:

```bash
mv apps/main-site/components/ChatWidget.tsx packages/shared/components/
mv apps/main-site/components/PostCard.tsx packages/shared/components/
mv apps/main-site/components/Footer.tsx packages/shared/components/
mv apps/main-site/lib/chat-retrieval.ts packages/shared/lib/
mv apps/main-site/lib/markdown.ts packages/shared/lib/
mv apps/main-site/lib/posts.ts packages/shared/lib/
```

### 7. Update Imports

In your app files, change imports from local paths to the shared package:

```tsx
// Before
import { ChatWidget } from '@/components/ChatWidget'
import { getAllPosts } from '@/lib/posts'

// After
import { ChatWidget } from '@your-org/shared/components/ChatWidget'
import { getAllPosts } from '@your-org/shared/lib/posts'
```

### 8. Add Shared as a Dependency

In each app's `package.json`:

```json
{
  "dependencies": {
    "@your-org/shared": "workspace:*"
  }
}
```

The `workspace:*` tells npm to resolve this from the local workspace, not from the npm registry.

### 9. Configure TypeScript

Each app's `tsconfig.json` needs to reference the shared package:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@your-org/shared/*": ["../../packages/shared/*"]
    }
  }
}
```

### 10. Configure Next.js for Shared Packages

Each app's `next.config.ts` needs `transpilePackages`:

```ts
const nextConfig = {
  transpilePackages: ['@your-org/shared'],
}

export default nextConfig
```

This tells Next.js to compile the shared package through its own build pipeline instead of expecting pre-built JavaScript.

## What to Share vs. What to Keep Per-Site

**Share these:**
- UI components (ChatWidget, PostCard, Footer, Navigation)
- Utility libraries (markdown processing, blog post reading, chat retrieval)
- Analytics providers (PostHog wrapper)
- CSS variables and base styles
- Type definitions

**Keep per-site:**
- `app/` directory (pages, layouts, API routes)
- `content/` (each site has its own blog posts)
- `next.config.ts` (different domains, different redirects)
- `next-sitemap.config.js` (different sitemaps per domain)
- Site-specific components (homepage hero, custom pages)
- Knowledge base files (each site's chat widget knows different things)

## Running the Monorepo

```bash
# Dev server for all apps
turbo dev

# Dev server for one app
turbo dev --filter=main-site

# Build everything
turbo build

# Build one app
turbo build --filter=main-site
```

Turbo caches builds. If the shared package has not changed, apps that depend on it skip the shared build step. On a two-site monorepo, this saves 30-60 seconds per build.

## Port Management

When running multiple dev servers, assign explicit ports in each app's `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --port 3001"
  }
}
```

Convention that works well:
- App 1: port 3001
- App 2: port 3002
- App 3: port 3003

Avoid port 3000 in a monorepo. Let it be free for ad-hoc testing.

## Common Pitfalls

**"Module not found" after migration.** Usually a missing `transpilePackages` entry in `next.config.ts`. Add the shared package name there.

**Styles not applying from shared components.** Make sure the shared styles CSS file is imported somewhere in the consuming app's layout or globals.

**TypeScript path resolution failing.** Check that both `tsconfig.json` paths and `package.json` workspace references are correct. They need to agree.

**Build order wrong.** If shared package changes are not reflected in app builds, check that `turbo.json` has `"dependsOn": ["^build"]` for the build task.

## When Monorepo is Overkill

If you have one site and zero plans for a second one, do not do this. The starter template is the right size. You can always migrate later.

The monorepo adds legitimate complexity: workspace configuration, build ordering, import path changes, port management. That complexity pays off at two sites. At one site, it just slows you down.

Build the second site first. Feel the pain of duplicated code. Then migrate with clear motivation.

## What You Have After This Chapter

- Turborepo workspace with apps/ and packages/ directories
- Shared component library consumed by multiple sites
- Coordinated builds with dependency-aware caching
- Each site maintains its own content, config, and routes

Next up: [Chapter 2: Autonomous Blog](./02-autonomous-blog.md) covers automating your content pipeline with AI-generated drafts and human review gates.
