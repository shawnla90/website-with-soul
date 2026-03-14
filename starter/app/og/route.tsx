import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title') ?? 'Your Site Name'
  const subtitle = searchParams.get('subtitle') ?? 'A website with soul.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: '#0D1117',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 20,
            color: '#484F58',
            marginBottom: 32,
          }}
        >
          <span style={{ color: '#58A6FF', marginRight: 8 }}>$</span>
          cat ~/post.md
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 48,
            fontWeight: 700,
            color: '#58A6FF',
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#8B949E',
            lineHeight: 1.5,
            maxWidth: '80%',
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 60,
            left: 80,
            right: 80,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              fontWeight: 600,
              color: '#58A6FF',
            }}
          >
            yoursite.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
