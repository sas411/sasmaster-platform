'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { NavBar, HighchartsProvider, DrScoop, useDrScoopRuntime } from '@sasmaster/ui'
import type { NavSection } from '@sasmaster/types'

const SECTION_PATHS: Record<NavSection, string> = {
  content: '/content',
  advertising: '/advertising',
  marketing: '/marketing',
  cpg: '/cpg',
  exchange: '/exchange',
}

function activeFromPath(path: string): NavSection {
  const segment = path.split('/')[1] as NavSection
  const valid: NavSection[] = ['content', 'advertising', 'marketing', 'cpg', 'exchange']
  return valid.includes(segment) ? segment : 'content'
}

export default function PortalLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<NavSection>(activeFromPath(pathname))

  const drScoopRuntime = useDrScoopRuntime(activeSection)

  function handleSectionChange(section: NavSection) {
    setActiveSection(section)
    router.push(SECTION_PATHS[section])
  }

  return (
    <HighchartsProvider>
      <div className="flex min-h-screen flex-col" style={{ background: 'var(--color-bg-base)' }}>
        <NavBar activeSection={activeSection} onSectionChange={handleSectionChange} />
        <main className="flex-1 px-6 py-8">{children}</main>
        <DrScoop runtime={drScoopRuntime} section={activeSection} />
      </div>
    </HighchartsProvider>
  )
}
