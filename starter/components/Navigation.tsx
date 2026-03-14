'use client'

import Link from 'next/link'

export function Navigation() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--canvas-border)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: 'var(--accent)',
          textDecoration: 'none',
        }}
      >
        yoursite
      </Link>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <Link
          href="/blog"
          style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}
        >
          blog
        </Link>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 14, color: 'var(--text-secondary)', textDecoration: 'none' }}
        >
          github
        </a>
      </div>
    </nav>
  )
}
