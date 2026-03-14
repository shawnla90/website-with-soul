# Chapter 3: Chat Widget

> Add an AI chat widget that answers questions about your site using keyword RAG. No vector database required.

## The Architecture

Most chat implementations use vector databases (Pinecone, Weaviate) to find relevant context. That costs money and adds complexity. The starter uses keyword RAG instead:

1. You define a **knowledge base** as an array of objects in your API route
2. When a user asks a question, the **scoring engine** ranks items by keyword match, bigram match, and synonym expansion
3. The top results get injected into Claude's system prompt as context
4. Claude answers using only that context

This approach costs $0 in infrastructure. The only cost is Anthropic API usage, which is pennies per conversation at Sonnet-level pricing.

## Graceful Degradation

The chat widget works without an API key. If `ANTHROPIC_API_KEY` is not set in `.env.local`, the API route returns a helpful message instead of an error:

```typescript
if (!apiKey) {
  return NextResponse.json(
    {
      role: 'assistant',
      content: "Chat is not configured yet. Add your ANTHROPIC_API_KEY to .env.local to enable the chat widget. See the setup guide in the playbook.",
    },
    { status: 200 }
  )
}
```

Status 200, not 500. The widget still opens, still shows the welcome message, still accepts input. It just returns a setup instruction instead of a real answer. Your site never looks broken.

## Setting Up the API Key

Create `.env.local` in the project root:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

Get your key from [console.anthropic.com](https://console.anthropic.com). The free tier gives you enough credits to test. After that, Sonnet costs roughly $0.003 per conversation turn.

## The Knowledge Base

Open `app/api/chat/route.ts`. The knowledge base is a plain array at the top of the file:

```typescript
const KNOWLEDGE_BASE: RetrievableItem[] = [
  {
    id: 'about',
    title: 'About',
    description: 'Information about the site and its creator.',
    keywords: ['about', 'who', 'creator', 'background'],
    category: 'general',
    content: 'This is a website built with the website-with-soul starter template. Replace this with real information about yourself.',
    url: '/',
  },
  {
    id: 'blog',
    title: 'Blog',
    description: 'Blog posts and writing.',
    keywords: ['blog', 'posts', 'writing', 'articles'],
    category: 'content',
    content: 'The blog contains posts about building, learning, and sharing. Check out /blog for all posts.',
    url: '/blog',
  },
]
```

Each item has:

| Field | Purpose |
|---|---|
| `id` | Unique identifier, also used in scoring |
| `title` | Matched against queries (8 points per word match) |
| `description` | Matched against queries (3 points per word match) |
| `keywords` | Highest weight matching (10 points for exact match) |
| `category` | Matched against queries (5 points per word match) |
| `content` | Injected into Claude's prompt as context |
| `url` | Available for the bot to reference in answers |

### Adding Your Own Knowledge

Replace the placeholder items with real information about yourself. Here is an example with more depth:

```typescript
const KNOWLEDGE_BASE: RetrievableItem[] = [
  {
    id: 'about',
    title: 'About Me',
    description: 'Background, experience, and what I do.',
    keywords: ['about', 'who', 'background', 'experience', 'work'],
    category: 'general',
    content: 'I am a software engineer building tools for GTM teams. Previously at Acme Corp for 5 years. I write about building in public, AI tooling, and the solo founder journey. Based in Austin, TX.',
    url: '/',
  },
  {
    id: 'stack',
    title: 'Tech Stack',
    description: 'The technologies and tools I use.',
    keywords: ['stack', 'tech', 'tools', 'nextjs', 'react', 'typescript', 'vercel'],
    category: 'technical',
    content: 'My primary stack is TypeScript, Next.js, React, and Tailwind CSS. I deploy on Vercel. For AI work I use Claude (Anthropic API) and local models via Ollama. Database is usually SQLite or Supabase depending on the project.',
    url: '/blog/my-stack',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'How to reach me.',
    keywords: ['contact', 'email', 'twitter', 'reach', 'hire', 'connect'],
    category: 'general',
    content: 'Best way to reach me: Twitter/X @yourhandle or email hello@yoursite.com. I read every DM and email. Open to collaborations on developer tools.',
    url: '/',
  },
]
```

### Synonym Map

Below the knowledge base, define synonyms to expand query matching:

```typescript
const SYNONYM_MAP: Record<string, string[]> = {
  'website': ['site', 'page', 'web'],
  'blog': ['posts', 'articles', 'writing'],
  'about': ['who', 'background', 'info'],
}
```

When a user asks "who are you?", the synonym map expands "who" to also match "about", which hits the knowledge base item with those keywords. Add synonyms relevant to your content.

## The Scoring Engine

`lib/chat-retrieval.ts` contains the retrieval logic. Here is how scoring works:

```typescript
function scoreItem(
  query: string,
  item: RetrievableItem,
  synonymMap: Record<string, string[]>
): number {
  const queryLower = query.toLowerCase()
  const words = queryLower.split(/\s+/).filter((w) => w.length > 2)
  const expandedWords = expandWithSynonyms(words, synonymMap)

  let score = 0

  for (const word of expandedWords) {
    if (tags.includes(word)) score += 10         // Exact keyword match
    else if (tags.some((t) => t.includes(word) || word.includes(t))) score += 5  // Partial keyword
    if (titleLower.includes(word)) score += 8    // Title match
    if (idLower.includes(word)) score += 6       // ID match
    if (categoryLower.includes(word)) score += 5 // Category match
    if (descLower.includes(word)) score += 3     // Description match
  }

  // Bigram bonus: two consecutive words matching together
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`
    if (titleLower.includes(bigram) || descLower.includes(bigram) || tags.some((t) => t.includes(bigram))) {
      score += 15
    }
  }

  // Full query bonus
  if (titleLower.includes(queryLower) || descLower.includes(queryLower)) {
    score += 20
  }

  return score
}
```

### Scoring Weights Summary

| Match Type | Points | Example |
|---|---|---|
| Exact keyword match | 10 | Query "blog", keyword "blog" |
| Partial keyword match | 5 | Query "blogging", keyword "blog" |
| Title match | 8 | Query word found in title |
| ID match | 6 | Query word found in item ID |
| Category match | 5 | Query word found in category |
| Description match | 3 | Query word found in description |
| Bigram bonus | 15 | "tech stack" found as consecutive words |
| Full query bonus | 20 | Entire query string found in title/description |

### Fallback Behavior

If scoring produces fewer than 3 results, the engine adds random unmatched items to reach the minimum. This ensures Claude always has some context, even for unexpected queries:

```typescript
const minResults = Math.min(3, items.length)
if (scored.length < minResults) {
  const remaining = items
    .filter((item) => !scored.some((s) => s.item.id === item.id))
    .slice(0, minResults - scored.length)
  scored.push(...remaining.map((item) => ({ item, score: 0 })))
}
```

## The API Route

The complete flow in `app/api/chat/route.ts`:

```typescript
export async function POST(req: NextRequest) {
  // 1. Check for API key
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      role: 'assistant',
      content: "Chat is not configured yet...",
    }, { status: 200 })
  }

  // 2. Get the user's message
  const { messages } = await req.json()
  const lastMessage = messages?.[messages.length - 1]?.content || ''

  // 3. Retrieve relevant context
  const relevant = retrieveItems(lastMessage, config, 5)
  const context = relevant
    .map((item) => `[${item.title}]: ${item.content}`)
    .join('\n\n')

  // 4. Call Claude with context
  const client = new Anthropic({ apiKey })
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: `You are a helpful assistant for this website. Answer questions using the context provided. Be concise and friendly. If you don't know something, say so honestly.

Context:
${context}`,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  // 5. Return the response
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ role: 'assistant', content: text })
}
```

The system prompt tells Claude to use the context and be honest when it does not know something. This prevents hallucination about your content.

## The Chat Widget Component

`components/ChatWidget.tsx` is a self-contained client component. It renders a floating bubble that opens into a chat panel.

### Props

```typescript
export interface ChatWidgetProps {
  botName: string           // Display name in the header
  botSubtitle: string       // Subtitle below the name
  welcomeMessage: string    // First message shown when opened
  suggestedQuestions: string[]  // Quick-tap question buttons
  placeholder: string       // Input field placeholder text
  accentColor: string       // Color for buttons and highlights
}
```

### Adding the Widget to Your Layout

The widget is already imported in `app/layout.tsx` through the component tree. To add it with your own configuration, import it in your layout:

```tsx
import { ChatWidget } from '@/components/ChatWidget'

// Inside the layout JSX, after <Footer />:
<ChatWidget
  botName="Your Bot"
  botSubtitle="ask me anything"
  welcomeMessage="Hey! I can answer questions about this site. What would you like to know?"
  suggestedQuestions={[
    "What do you do?",
    "What's your tech stack?",
    "How can I reach you?",
  ]}
  placeholder="Ask a question..."
  accentColor="#58A6FF"
/>
```

### Key Implementation Details

**Inline SVG icons** instead of an icon library. Three icons (chat bubble, close, send) are embedded as components. No additional dependencies.

**Inline markdown rendering** handles bold text, links, and bullet lists in responses without pulling in a full markdown library:

```typescript
function renderMarkdown(text: string, accentColor: string) {
  return text.split('\n').map((line, i) => {
    let html = escapeHtml(line)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      html = `<li>${html.replace(/^[\s]*[-*]\s/, '')}</li>`
    }
    return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
  })
}
```

**Loading animation** uses CSS keyframes injected once into the document head. Three bouncing dots appear while waiting for Claude's response.

**All styles are inline**. No external CSS file, no Tailwind utility classes. The component is fully self-contained and portable.

## Customizing the Chat Personality

Edit the system prompt in `app/api/chat/route.ts` to change how the bot behaves:

```typescript
system: `You are a helpful assistant for this website. Answer questions using the context provided. Be concise and friendly. If you don't know something, say so honestly.

Context:
${context}`,
```

Make it match your voice. If your site is casual, make the bot casual. If you are technical, let the bot be technical. This is part of your site's soul.

## What You Have Now

After this chapter, your site has:

- A floating chat widget with your branding
- Keyword RAG that finds relevant knowledge without a vector DB
- Graceful degradation when no API key is set
- Suggested questions for quick interaction
- Markdown rendering in bot responses

Next up: [Chapter 4: PostHog Analytics](./04-posthog.md) adds privacy-friendly analytics with a proxy pattern that bypasses ad blockers.
