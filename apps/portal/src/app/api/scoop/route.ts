import type { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json() as { message?: string; context?: { section?: string }; userId?: string }

  const railwayUrl = process.env.RAILWAY_API_URL
  if (!railwayUrl) {
    return Response.json({ error: 'RAILWAY_API_URL not configured' }, { status: 503 })
  }

  let railwayRes: Response
  try {
    railwayRes = await fetch(`${railwayUrl}/api/scoop/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return Response.json({ error: `Railway unreachable: ${msg}` }, { status: 502 })
  }

  if (!railwayRes.ok || !railwayRes.body) {
    return Response.json({ error: `Railway returned ${railwayRes.status}` }, { status: 502 })
  }

  // Pass Railway SSE stream through; inject heartbeat comments every 20s to
  // prevent Cloudflare's 100s hard timeout on the api.sasmaster.dev→Railway leg.
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const heartbeatId = setInterval(() => {
    void writer.write(encoder.encode(': heartbeat\n\n')).catch(() => {})
  }, 20_000)

  void (async () => {
    try {
      const reader = railwayRes.body!.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        await writer.write(value)
      }
    } finally {
      clearInterval(heartbeatId)
      void writer.close().catch(() => {})
    }
  })()

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
