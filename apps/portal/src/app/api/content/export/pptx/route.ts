import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { title, section } = (await req.json()) as { title: string; section: string }

  const pptxgenjs = (await import('pptxgenjs')).default
  const prs = new pptxgenjs()
  prs.layout  = 'LAYOUT_WIDE'
  prs.author  = 'SaSMaster'
  prs.title   = `${section} — ${title}`

  const slide = prs.addSlide()
  slide.background = { color: '0A0A0F' }

  slide.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.6, fill: { color: '16161F' } })
  slide.addText('SASMASTE R', { x: 0.3, y: 0.1, w: 3, h: 0.4, fontSize: 16, bold: true, color: 'FFFFFF', fontFace: 'Arial' })
  slide.addText('BLOOMBERG TERMINAL FOR MEDIA', { x: 0.3, y: 0.45, w: 4, h: 0.2, fontSize: 7, color: '6E6E82', fontFace: 'Arial' })
  slide.addText(section.toUpperCase(), { x: 0.3, y: 1.2, w: 9, h: 0.5, fontSize: 24, bold: true, color: 'A78BFA', fontFace: 'Arial' })
  slide.addText(title, { x: 0.3, y: 1.8, w: 9, h: 0.4, fontSize: 14, color: 'FFFFFF', fontFace: 'Arial' })
  slide.addText(
    `Generated ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · Confidential`,
    { x: 0.3, y: 2.3, w: 9, h: 0.25, fontSize: 8, color: '505064', fontFace: 'Arial' },
  )

  const buf = (await prs.write({ outputType: 'arraybuffer' })) as ArrayBuffer
  const filename = `SaSMaster-${title.replace(/\s+/g, '-')}.pptx`

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
