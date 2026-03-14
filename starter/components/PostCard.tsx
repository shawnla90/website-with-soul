import Link from 'next/link'
import type { Post } from '@/lib/posts'

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: 'block',
        padding: 20,
        borderRadius: 8,
        border: '1px solid var(--canvas-border)',
        backgroundColor: 'var(--bg-subtle)',
        textDecoration: 'none',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          {post.title}
        </h3>
        <time style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0, marginLeft: 16 }}>
          {post.date}
        </time>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
        {post.excerpt}
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
        {post.category && <span style={{ color: 'var(--accent)' }}>{post.category}</span>}
        <span>{post.readingTime} min read</span>
      </div>
    </Link>
  )
}
