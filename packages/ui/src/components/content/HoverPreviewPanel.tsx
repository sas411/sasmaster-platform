'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

interface HoverPreviewPanelProps {
  posterUrl?: string
  title: string
  network: string
  drScoopLine?: string
  children: React.ReactNode
  className?: string
}

export function HoverPreviewPanel({
  posterUrl, title, network, drScoopLine, children, className,
}: HoverPreviewPanelProps) {
  const [visible, setVisible]     = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), 300)
  }, [])

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }, [])

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-1/2 z-50 -translate-x-1/2"
            style={{ top: 'calc(100% + 8px)', width: 200, pointerEvents: 'none' }}
          >
            <div
              className="overflow-hidden rounded-[var(--radius-card)]"
              style={{
                background: 'var(--color-bg-surface)',
                border:     '1px solid rgba(167,139,250,0.25)',
                boxShadow:  '0 12px 32px rgba(0,0,0,0.5)',
              }}
            >
              {posterUrl && (
                <div
                  className="bg-cover bg-center"
                  style={{ paddingTop: '56.25%', backgroundImage: `url(${posterUrl})` }}
                />
              )}
              <div className="p-3">
                <p
                  className="truncate text-xs font-bold uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-dark-primary)' }}
                >
                  {title}
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'var(--color-brand-teal)', fontFamily: 'var(--font-heading)', letterSpacing: '0.06em' }}
                >
                  {network}
                </p>
                {drScoopLine && (
                  <p
                    className="mt-1.5 text-xs leading-snug"
                    style={{ color: 'var(--color-text-dark-muted)', fontFamily: 'var(--font-body)' }}
                  >
                    {drScoopLine}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
