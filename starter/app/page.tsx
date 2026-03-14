import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/PostCard'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/blog')

export default function Home() {
  const posts = getAllPosts(CONTENT_DIR).slice(0, 3)

  return (
    <div className="container" style={{ paddingTop: 80, paddingBottom: 80 }}>
      {/* Hero */}
      <section style={{ marginBottom: 80 }}>
        <p style={{ color: 'var(--green)', fontSize: 14, marginBottom: 8 }}>
          <span className="terminal-prompt">cat ~/about.md</span>
        </p>
        <h1 style={{ fontSize: 40, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, margin: '0 0 16px' }}>
          Your Name
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.6 }}>
          A short description of who you are and what you do.
          Replace this with your own intro. Make it real.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <Link
            href="/blog"
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              backgroundColor: 'var(--accent)',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Read the blog
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: '1px solid var(--canvas-border)',
              color: 'var(--text-primary)',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Recent posts */}
      {posts.length > 0 && (
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>
            Recent posts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          <Link
            href="/blog"
            style={{ display: 'inline-block', marginTop: 24, color: 'var(--accent)', fontSize: 14 }}
          >
            View all posts &rarr;
          </Link>
        </section>
      )}
    </div>
  )
}
