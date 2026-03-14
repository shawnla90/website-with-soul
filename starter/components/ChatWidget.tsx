'use client'

import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react'

/* ── Inline SVG Icons ── */

function IconChat({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconSend({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

/* ── Types ── */

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatWidgetProps {
  botName: string
  botSubtitle: string
  welcomeMessage: string
  suggestedQuestions: string[]
  placeholder: string
  accentColor: string
}

/* ── Helpers ── */

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderMarkdown(text: string, accentColor: string) {
  return text.split('\n').map((line, i) => {
    let html = escapeHtml(line)
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      '<strong style="color:var(--text-primary);font-weight:600">$1</strong>'
    )
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<a href="$2" style="color:${escapeHtml(accentColor)};text-decoration:underline;text-underline-offset:2px" target="_blank" rel="noopener noreferrer">$1</a>`
    )
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      html = `<li style="margin-left:16px;list-style:disc">${html.replace(/^[\s]*[-*]\s/, '')}</li>`
    }
    return (
      <span
        key={i}
        style={{ display: 'block', height: line.trim() === '' ? 8 : undefined }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  })
}

/* ── Bounce keyframes ── */

const BOUNCE_CSS = `
@keyframes chat-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
`
let injected = false
function injectKeyframes() {
  if (injected || typeof document === 'undefined') return
  const style = document.createElement('style')
  style.textContent = BOUNCE_CSS
  document.head.appendChild(style)
  injected = true
}

/* ── Component ── */

export function ChatWidget({
  botName,
  botSubtitle,
  welcomeMessage,
  suggestedQuestions,
  placeholder,
  accentColor,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { injectKeyframes() }, [])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])
  useEffect(() => { if (isOpen) inputRef.current?.focus() }, [isOpen])

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    setHasInteracted(true)
    setInput('')

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Something went wrong.',
      }
      setMessages([...newMessages, assistantMsg])
    } catch {
      setMessages([
        ...newMessages,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Connection error. Try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading])

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); send(input) }

  /* ── Styles ── */

  const s = {
    bubble: {
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 56, height: 56, borderRadius: '50%',
      backgroundColor: accentColor, color: 'white',
      border: 'none', cursor: 'pointer',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      transition: 'transform 0.15s ease',
    } as CSSProperties,
    panel: {
      position: 'fixed', bottom: 0, right: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      width: '100%', maxWidth: 380, height: 'min(520px, 100dvh)',
      fontFamily: 'var(--font-mono, monospace)',
      borderRadius: '16px 16px 0 0',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
    } as CSSProperties,
    header: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: 'var(--canvas, #0D1117)', borderBottom: '1px solid var(--canvas-border, #30363D)',
    } as CSSProperties,
    headerLeft: { display: 'flex', alignItems: 'center', gap: 8 } as CSSProperties,
    headerIcon: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: '50%',
      backgroundColor: accentColor, color: 'white',
    } as CSSProperties,
    headerTitle: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #C9D1D9)', margin: 0 } as CSSProperties,
    headerSub: { fontSize: 12, color: 'var(--text-secondary, #8B949E)', margin: 0 } as CSSProperties,
    closeBtn: {
      background: 'none', border: 'none', cursor: 'pointer',
      color: 'var(--text-secondary, #8B949E)', borderRadius: '50%', padding: 4,
    } as CSSProperties,
    messages: {
      flex: 1, overflowY: 'auto', padding: '12px 16px',
      backgroundColor: 'var(--canvas-subtle, #161B22)',
      display: 'flex', flexDirection: 'column', gap: 12,
    } as CSSProperties,
    bubbleMsg: (isUser: boolean) => ({
      maxWidth: '85%', borderRadius: 16, padding: '10px 14px', fontSize: 14,
      ...(isUser
        ? {
            borderTopRightRadius: 4, alignSelf: 'flex-end' as const,
            backgroundColor: `${accentColor}1a`, border: `1px solid ${accentColor}33`, color: 'var(--text-primary, #C9D1D9)',
          }
        : {
            borderTopLeftRadius: 4, alignSelf: 'flex-start' as const,
            backgroundColor: 'var(--canvas, #0D1117)', border: '1px solid var(--canvas-border, #30363D)', color: 'var(--text-primary, #C9D1D9)',
          }),
    }) as CSSProperties,
    sugBtn: {
      borderRadius: 20, padding: '6px 12px', fontSize: 12, cursor: 'pointer',
      border: `1px solid ${accentColor}33`, backgroundColor: 'var(--canvas, #0D1117)', color: accentColor,
      transition: 'background-color 0.15s',
    } as CSSProperties,
    form: {
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '12px 12px', backgroundColor: 'var(--canvas, #0D1117)', borderTop: '1px solid var(--canvas-border, #30363D)',
    } as CSSProperties,
    input: {
      flex: 1, borderRadius: 20, padding: '10px 16px', fontSize: 14,
      backgroundColor: 'var(--canvas-subtle, #161B22)', border: '1px solid var(--canvas-border, #30363D)', color: 'var(--text-primary, #C9D1D9)',
      outline: 'none', fontFamily: 'inherit',
    } as CSSProperties,
    sendBtn: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 40, height: 40, borderRadius: '50%', border: 'none', cursor: 'pointer',
      backgroundColor: accentColor, color: 'white', flexShrink: 0,
    } as CSSProperties,
    dot: (delay: number) => ({
      width: 8, height: 8, borderRadius: '50%', backgroundColor: accentColor,
      animation: 'chat-bounce 0.6s ease infinite', animationDelay: `${delay}ms`,
    }) as CSSProperties,
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={s.bubble}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label={`Chat with ${botName}`}
        >
          <IconChat size={24} />
        </button>
      )}

      {isOpen && (
        <div style={s.panel}>
          <div style={s.header}>
            <div style={s.headerLeft}>
              <div style={s.headerIcon}><IconChat size={16} /></div>
              <div>
                <h3 style={s.headerTitle}>{botName}</h3>
                <p style={s.headerSub}>{botSubtitle}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={s.closeBtn} aria-label="Close chat">
              <IconX />
            </button>
          </div>

          <div style={s.messages}>
            <div style={s.bubbleMsg(false)}>{welcomeMessage}</div>

            {!hasInteracted && messages.length === 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {suggestedQuestions.map((q) => (
                  <button key={q} onClick={() => send(q)} style={s.sugBtn}>{q}</button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} style={s.bubbleMsg(m.role === 'user')}>
                {m.role === 'assistant' ? renderMarkdown(m.content, accentColor) : m.content}
              </div>
            ))}

            {isLoading && (
              <div style={{ ...s.bubbleMsg(false), display: 'flex', gap: 4, padding: '12px 14px' }}>
                <span style={s.dot(0)} />
                <span style={s.dot(150)} />
                <span style={s.dot(300)} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={onSubmit} style={s.form}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              style={s.input}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{ ...s.sendBtn, opacity: (isLoading || !input.trim()) ? 0.4 : 1 }}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
