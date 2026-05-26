'use client'

import { useMemo, useRef } from 'react'
import type { ChatModelAdapter, ChatModelRunOptions } from '@assistant-ui/react'
import { useLocalRuntime } from '@assistant-ui/react'
import type { NavSection } from '@sasmaster/types'

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') return 'ssr'
  const stored = window.localStorage.getItem('sasmasterUserId')
  if (stored) return stored
  const id = crypto.randomUUID()
  window.localStorage.setItem('sasmasterUserId', id)
  return id
}

export function useDrScoopRuntime(section: NavSection) {
  const userId = useMemo(getOrCreateUserId, [])
  const sectionRef = useRef<NavSection>(section)
  sectionRef.current = section

  const adapter = useMemo<ChatModelAdapter>(
    () => ({
      async *run({ messages, abortSignal }: ChatModelRunOptions) {
        const currentSection = sectionRef.current

        const lastUser = [...messages].reverse().find((m) => m.role === 'user')
        // content parts are a discriminated union; cast to extract text safely
        const parts = (
          lastUser?.content as ReadonlyArray<{ type: string; text?: string }> | undefined
        ) ?? []
        const message = parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text ?? '')
          .join('')

        const res = await fetch('/api/scoop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, context: { section: currentSection }, userId }),
          signal: abortSignal,
        })

        if (!res.ok || !res.body) {
          throw new Error(`Dr. Scoop connection failed (${res.status})`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''
          for (const event of events) {
            if (!event.startsWith('data: ')) continue
            try {
              const data = JSON.parse(event.slice(6)) as {
                token?: string
                done?: boolean
                error?: string
              }
              if (data.error) throw new Error(data.error)
              if (data.token) {
                yield { content: [{ type: 'text' as const, text: data.token }] }
              }
            } catch (parseErr) {
              // Re-throw Dr. Scoop errors, skip malformed SSE events
              if ((parseErr as { message?: string }).message?.startsWith('Dr. Scoop')) {
                throw parseErr
              }
            }
          }
        }
      },
    }),
    // Stable adapter — reads latest section via sectionRef on each run; userId is stable
    [userId],
  )

  return useLocalRuntime(adapter)
}
