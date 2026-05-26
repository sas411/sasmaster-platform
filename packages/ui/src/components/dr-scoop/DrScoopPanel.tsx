'use client'

import { useState } from 'react'
import {
  ThreadPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  useMessage,
} from '@assistant-ui/react'
import { cn } from '../../lib/utils'

interface DrScoopPanelProps {
  section?: string | undefined
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end px-4 py-1">
      <div
        className="max-w-[80%] rounded-2xl rounded-br-sm px-3 py-2 text-sm"
        style={{
          background: 'var(--color-brand-lavender)',
          color: 'var(--color-bg-base)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <MessagePrimitive.Parts
          components={{
            Text: ({ text }) => <span>{text}</span>,
          }}
        />
      </div>
    </MessagePrimitive.Root>
  )
}

function AssistantMessage() {
  const message = useMessage()
  const isStreaming = message.status?.type === 'running'

  return (
    <MessagePrimitive.Root className="flex justify-start px-4 py-1">
      <div
        className="max-w-[88%] rounded-2xl rounded-bl-sm px-3 py-2 text-sm"
        style={{
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-text-dark-primary)',
          lineHeight: '1.6',
        }}
      >
        <MessagePrimitive.Parts
          components={{
            Text: ({ text }) => (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{text}</span>
            ),
          }}
        />
        {isStreaming && (
          <span
            className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full"
            style={{ background: 'var(--color-brand-lavender)' }}
          />
        )}
      </div>
    </MessagePrimitive.Root>
  )
}

function SendButton() {
  return (
    <ComposerPrimitive.Send asChild>
      <button
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{ background: 'var(--color-brand-lavender)' }}
        aria-label="Send message"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M13 1L6 8M13 1L9 13L6 8M13 1L1 5L6 8"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </ComposerPrimitive.Send>
  )
}

export function DrScoopPanel({ section }: DrScoopPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex flex-col overflow-hidden rounded-xl shadow-2xl"
          style={{
            width: '380px',
            height: '520px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-dark)',
            boxShadow: '0 0 40px rgba(167, 139, 250, 0.15)',
          }}
        >
          {/* Header */}
          <div
            className="flex flex-shrink-0 items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid var(--color-border-dark)' }}
          >
            <div className="flex flex-col gap-0.5">
              <span
                className="text-lg leading-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-dark-primary)',
                  letterSpacing: '0.08em',
                }}
              >
                DR. SCOOP
              </span>
              {section !== undefined && (
                <span
                  className="text-xs"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-brand-teal)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  {section} context
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-text-dark-muted)' }}
              aria-label="Close Dr. Scoop"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <ThreadPrimitive.Viewport
            className="flex-1 overflow-y-auto py-2"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border-dark) transparent' }}
          >
            <ThreadPrimitive.Empty>
              <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-8">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: 'rgba(167, 139, 250, 0.15)' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-brand-lavender)',
                      fontSize: '22px',
                    }}
                  >
                    S
                  </span>
                </div>
                <p
                  className="text-center text-sm leading-relaxed"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--color-text-dark-secondary)',
                  }}
                >
                  Ask me anything about your{section !== undefined ? ` ${section}` : ''} performance
                  data.
                </p>
              </div>
            </ThreadPrimitive.Empty>

            <ThreadPrimitive.Messages
              components={{
                UserMessage,
                AssistantMessage,
              }}
            />
          </ThreadPrimitive.Viewport>

          {/* Composer */}
          <ComposerPrimitive.Root className="flex-shrink-0">
            <div
              className="flex items-end gap-2 p-3"
              style={{ borderTop: '1px solid var(--color-border-dark)' }}
            >
              <ComposerPrimitive.Input
                className="flex-1 resize-none rounded-lg px-3 py-2 text-sm outline-none placeholder:opacity-50"
                style={{
                  background: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-dark)',
                  color: 'var(--color-text-dark-primary)',
                  fontFamily: 'var(--font-body)',
                }}
                placeholder="Ask Dr. Scoop..."
                minRows={1}
                maxRows={5}
              />
              <SendButton />
            </div>
          </ComposerPrimitive.Root>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-[60px] w-[60px] items-center justify-center rounded-full shadow-lg transition-all duration-200',
          open && 'scale-95',
        )}
        style={{
          background: 'var(--color-brand-lavender)',
          boxShadow: open
            ? '0 0 0 4px rgba(167, 139, 250, 0.3), 0 8px 24px rgba(167, 139, 250, 0.4)'
            : '0 4px 20px rgba(167, 139, 250, 0.35)',
        }}
        aria-label={open ? 'Close Dr. Scoop' : 'Open Dr. Scoop'}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            color: 'white',
            fontSize: '26px',
            letterSpacing: '0.05em',
          }}
        >
          {open ? '×' : 'S'}
        </span>
      </button>
    </div>
  )
}

export type { DrScoopPanelProps }
