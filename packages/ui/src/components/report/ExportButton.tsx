'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'

interface ExportButtonProps {
  title: string
  section: string
  className?: string
}

export function ExportButton({ title, section, className }: ExportButtonProps) {
  const [open, setOpen]       = useState(false)
  const [loading, setLoading] = useState<'pdf' | 'pptx' | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const exportPdf = useCallback(async () => {
    setLoading('pdf')
    setOpen(false)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })

      doc.setFillColor(10, 10, 15)
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(24)
      doc.setTextColor(255, 255, 255)
      doc.text('SASMASTE R', 40, 50)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(110, 110, 130)
      doc.text('BLOOMBERG TERMINAL FOR MEDIA', 40, 66)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(167, 139, 250)
      doc.text(section.toUpperCase(), 40, 110)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      doc.text(title, 40, 135)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(80, 80, 100)
      doc.text(
        `Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Confidential`,
        40, 155,
      )

      doc.setDrawColor(40, 40, 60)
      doc.line(40, 170, doc.internal.pageSize.getWidth() - 40, 170)

      doc.save(`SaSMaster-${title.replace(/\s+/g, '-')}.pdf`)
    } finally {
      setLoading(null)
    }
  }, [title, section])

  const exportPptx = useCallback(async () => {
    setLoading('pptx')
    setOpen(false)
    try {
      const pptxgenjs = (await import('pptxgenjs')).default
      const prs = new pptxgenjs()
      prs.layout  = 'LAYOUT_WIDE'
      prs.author  = 'SaSMaster'
      prs.title   = `${section} — ${title}`

      const slide = prs.addSlide()
      slide.background = { color: '0A0A0F' }

      slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: '16161F' } })

      slide.addText('SASMASTE R', {
        x: 0.3, y: 0.1, w: 3, h: 0.4,
        fontSize: 16, bold: true, color: 'FFFFFF', fontFace: 'Arial',
      })
      slide.addText('BLOOMBERG TERMINAL FOR MEDIA', {
        x: 0.3, y: 0.45, w: 4, h: 0.2,
        fontSize: 7, color: '6E6E82', fontFace: 'Arial',
      })
      slide.addText(section.toUpperCase(), {
        x: 0.3, y: 1.2, w: 9, h: 0.5,
        fontSize: 24, bold: true, color: 'A78BFA', fontFace: 'Arial',
      })
      slide.addText(title, {
        x: 0.3, y: 1.8, w: 9, h: 0.4,
        fontSize: 14, color: 'FFFFFF', fontFace: 'Arial',
      })
      slide.addText(
        `Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Confidential`,
        { x: 0.3, y: 2.3, w: 9, h: 0.25, fontSize: 8, color: '505064', fontFace: 'Arial' },
      )

      await prs.writeFile({ fileName: `SaSMaster-${title.replace(/\s+/g, '-')}.pptx` })
    } finally {
      setLoading(null)
    }
  }, [title, section])

  const copyShareUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => setOpen(false))
  }, [])

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        disabled={loading !== null}
        className={cn(
          'flex items-center gap-1.5 rounded-[var(--radius-btn)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-opacity hover:opacity-80 disabled:opacity-40',
          className,
        )}
        style={{
          background:    'var(--color-bg-surface)',
          border:        '1px solid var(--color-border-dark)',
          color:         'var(--color-brand-gold)',
          fontFamily:    'var(--font-heading)',
          letterSpacing: '0.1em',
        }}
      >
        {loading ? (
          <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 10" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v6M3 5l3 3 3-3M1 9v1a1 1 0 001 1h8a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        EXPORT
      </button>

      {open && (
        <div
          className="absolute right-0 top-9 z-50 flex flex-col overflow-hidden rounded-[var(--radius-card)]"
          style={{
            background: 'var(--color-bg-surface)',
            border:     '1px solid var(--color-border-dark)',
            minWidth:   140,
            boxShadow:  '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {[
            { label: 'PDF Report', action: exportPdf,    icon: '📄' },
            { label: 'PPTX Deck',  action: exportPptx,   icon: '📊' },
            { label: 'Copy URL',   action: copyShareUrl, icon: '🔗' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-2 px-4 py-2.5 text-left text-xs transition-colors hover:bg-[var(--color-bg-elevated)]"
              style={{
                fontFamily:    'var(--font-heading)',
                color:         'var(--color-text-dark-primary)',
                letterSpacing: '0.06em',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
