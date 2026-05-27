'use client'

import * as React from 'react'
import { useEffect, useRef, useState, useCallback } from 'react'
import type { gsap as GsapType } from 'gsap'
import { cn } from '../../lib/utils'

interface ThumbnailCard {
  label: string
  stillUrl: string
  value?: string
}

interface CinematicSectionIntroProps {
  videoUrl?: string
  backdropUrl?: string
  sectionTitle: string
  contextLabel: string
  drScoopHeadline: string
  thumbnailStrip: ThumbnailCard[]
  onEnter: (cardIndex?: number) => void
  sessionKey?: string
  className?: string
}

const SESSION_PREFIX = 'sm_cinematic_seen_'

export function CinematicSectionIntro({
  videoUrl,
  backdropUrl,
  sectionTitle,
  contextLabel,
  drScoopHeadline,
  thumbnailStrip,
  onEnter,
  sessionKey = 'default',
  className,
}: CinematicSectionIntroProps) {
  const [visible, setVisible] = useState(false)
  const [skippable, setSkippable] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [hlsError, setHlsError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const gsapRef = useRef<typeof GsapType | null>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  const storageKey = SESSION_PREFIX + sessionKey

  // Check if already seen this session
  useEffect(() => {
    const seen = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(storageKey)
    if (seen) {
      onEnter()
      return
    }
    setVisible(true)
  }, [storageKey, onEnter])

  // Enable skip after 2s
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setSkippable(true), 2000)
    return () => clearTimeout(t)
  }, [visible])

  // HLS video init
  useEffect(() => {
    if (!visible || !videoUrl || !videoRef.current) return
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

    if (isMobile) {
      setHlsError(true)
      return
    }

    const video = videoRef.current
    const isHls = videoUrl.includes('.m3u8')

    if (!isHls) {
      video.src = videoUrl
      return
    }

    import('hls.js').then(({ default: Hls }) => {
      if (!Hls.isSupported()) {
        setHlsError(true)
        return
      }
      const hls = new Hls({ autoStartLoad: true })
      hls.loadSource(videoUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, () => setHlsError(true))
    })
  }, [visible, videoUrl])

  // GSAP entrance animations
  useEffect(() => {
    if (!visible) return
    import('gsap').then(({ gsap }) => {
      gsapRef.current = gsap

      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
        )
      }
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.8 },
        )
      }
      if (stripRef.current) {
        const cards = stripRef.current.querySelectorAll('[data-thumb]')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 1 },
        )
      }
    })
  }, [visible])

  const exitAndEnter = useCallback(
    (cardIndex?: number) => {
      if (exiting) return
      setExiting(true)
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(storageKey, '1')
      }
      const container = containerRef.current
      if (!container || !gsapRef.current) {
        setVisible(false)
        onEnter(cardIndex)
        return
      }
      gsapRef.current.to(container, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => { setVisible(false); onEnter(cardIndex) },
      })
    },
    [exiting, storageKey, onEnter],
  )

  // Key press to advance
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => {
      if (!skippable) return
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') exitAndEnter()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, skippable, exitAndEnter])

  if (!visible) return null

  const showVideo = videoUrl && !hlsError
  const showKenBurns = !showVideo && backdropUrl

  return (
    <div
      ref={containerRef}
      className={cn('fixed inset-0 z-[100] overflow-hidden', className)}
      style={{ background: 'var(--color-bg-base)' }}
    >
      {/* Video or backdrop */}
      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      {showKenBurns && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backdropUrl})`,
            animation: 'kenburns 20s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* Dark cinematic gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,15,0.3) 0%, rgba(10,10,15,0.1) 40%, rgba(10,10,15,0.7) 80%, rgba(10,10,15,0.95) 100%)',
        }}
      />

      {/* Title block — top left */}
      <div
        ref={titleRef}
        className="absolute left-8 top-8 opacity-0"
        style={{ maxWidth: 480 }}
      >
        <p
          className="mb-1 text-xs uppercase tracking-widest"
          style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-brand-teal)',
            letterSpacing: '0.16em',
          }}
        >
          {contextLabel}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 80px)',
            color: 'var(--color-text-dark-primary)',
            letterSpacing: '0.04em',
            lineHeight: 0.9,
            textTransform: 'uppercase',
          }}
        >
          {sectionTitle}
        </h1>
      </div>

      {/* Dr. Scoop headline — center */}
      <div
        ref={headlineRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 text-center"
        style={{ maxWidth: 640, padding: '0 24px' }}
      >
        <div
          className="mb-3 flex items-center justify-center gap-2"
        >
          <div
            className="h-px flex-1"
            style={{ background: 'rgba(34, 211, 238, 0.3)', maxWidth: 60 }}
          />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-brand-teal)', letterSpacing: '0.14em' }}
          >
            DR. SCOOP
          </span>
          <div
            className="h-px flex-1"
            style={{ background: 'rgba(34, 211, 238, 0.3)', maxWidth: 60 }}
          />
        </div>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 3vw, 36px)',
            color: 'var(--color-text-dark-primary)',
            lineHeight: 1.15,
            letterSpacing: '0.02em',
          }}
        >
          {drScoopHeadline}
        </p>
      </div>

      {/* Thumbnail strip — bottom */}
      <div
        ref={stripRef}
        className="absolute bottom-16 left-0 right-0 flex justify-center gap-4 px-8"
      >
        {thumbnailStrip.map((card, i) => (
          <button
            key={i}
            data-thumb=""
            onClick={() => exitAndEnter(i)}
            className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] transition-transform duration-200 hover:scale-105 focus:outline-none opacity-0"
            style={{
              width: 'clamp(120px, 18vw, 180px)',
              border: '1px solid rgba(167, 139, 250, 0.25)',
              background: 'var(--color-bg-surface)',
            }}
          >
            <div
              className="relative bg-cover bg-center"
              style={{
                paddingTop: '56.25%',
                backgroundImage: `url(${card.stillUrl})`,
              }}
            >
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ background: 'rgba(167, 139, 250, 0.2)' }}
              />
            </div>
            <div className="px-3 py-2">
              <p
                className="text-xs font-semibold uppercase tracking-wider truncate"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-dark-primary)',
                  letterSpacing: '0.08em',
                }}
              >
                {card.label}
              </p>
              {card.value && (
                <p
                  className="text-xs"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-dark-muted)' }}
                >
                  {card.value}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Skip indicator */}
      {skippable && (
        <button
          onClick={() => exitAndEnter()}
          className="absolute bottom-4 right-6 flex items-center gap-1.5 transition-opacity hover:opacity-80"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '11px',
            color: 'var(--color-text-dark-muted)',
            letterSpacing: '0.1em',
          }}
        >
          SKIP
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 7h10M8 4l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Ken Burns CSS */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1%, -1%); }
        }
      `}</style>
    </div>
  )
}

export type { CinematicSectionIntroProps, ThumbnailCard }
