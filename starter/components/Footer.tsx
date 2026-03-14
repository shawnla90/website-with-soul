export function Footer() {
  return (
    <footer
      style={{
        padding: '40px 24px',
        borderTop: '1px solid var(--canvas-border)',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
        built with{' '}
        <a
          href="https://github.com/shawnla90/website-with-soul"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)' }}
        >
          website-with-soul
        </a>
      </p>
    </footer>
  )
}
