import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { retrieveItems, type RetrievalConfig, type RetrievableItem } from '@/lib/chat-retrieval'

// Define your knowledge base here
// Each item represents a topic your chat widget knows about
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

const SYNONYM_MAP: Record<string, string[]> = {
  'website': ['site', 'page', 'web'],
  'blog': ['posts', 'articles', 'writing'],
  'about': ['who', 'background', 'info'],
}

const config: RetrievalConfig = {
  items: KNOWLEDGE_BASE,
  synonymMap: SYNONYM_MAP,
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      {
        role: 'assistant',
        content: "Chat is not configured yet. Add your ANTHROPIC_API_KEY to .env.local to enable the chat widget. See the setup guide in the playbook.",
      },
      { status: 200 }
    )
  }

  try {
    const { messages } = await req.json()
    const lastMessage = messages?.[messages.length - 1]?.content || ''

    // Retrieve relevant context using keyword RAG
    const relevant = retrieveItems(lastMessage, config, 5)
    const context = relevant
      .map((item) => `[${item.title}]: ${item.content}`)
      .join('\n\n')

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: `You are a helpful assistant for this website. Answer questions using the context provided. Be concise and friendly. If you don't know something, say so honestly.

Context:
${context}`,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({
      role: 'assistant',
      content: text,
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { role: 'assistant', content: 'Something went wrong. Try again in a moment.' },
      { status: 500 }
    )
  }
}
