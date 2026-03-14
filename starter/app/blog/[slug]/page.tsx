import type { Metadata } from 'next'
import { getPostBySlug, getPostSlugs } from '@/lib/posts'
import { markdownToHtml } from '@/lib/markdown'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export async function generateStaticParams() {
  return getPostSlugs(CONTENT_DIR).map((slug) => ({ slug }))
}

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

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug, CONTENT_DIR)
  const html = await markdownToHtml(post.content)

  return (
    <article className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <header style={{ marginBottom: 40 }}>
        <time style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {post.date}
        </time>
        {post.category && (
          <span style={{ color: 'var(--accent)', fontSize: 13, marginLeft: 12 }}>
            {post.category}
          </span>
        )}
        <h1 style={{ fontSize: 32, fontWeight: 700, margin: '8px 0 12px', lineHeight: 1.2 }}>
          {post.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          {post.readingTime} min read
        </p>
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
