import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/PostCard'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export const metadata: Metadata = {
  title: 'Blog',
  description: 'All blog posts.',
}

export default function BlogIndex() {
  const posts = getAllPosts(CONTENT_DIR)

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Blog</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 40 }}>
        Thoughts, builds, and lessons learned.
      </p>

      {posts.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>
          No posts yet. Add markdown files to <code>content/blog/</code> to get started.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
