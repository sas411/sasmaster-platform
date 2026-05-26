'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({ value: '', onValueChange: () => {} })

interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

function Tabs({ value, defaultValue = '', onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const activeValue = value ?? internalValue
  const handleChange = (v: string) => {
    setInternalValue(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-[var(--radius-card-sm)] bg-[var(--color-bg-surface)] p-1 text-[var(--color-text-dark-muted)]',
        className,
      )}
      {...props}
    />
  ),
)
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsContext)
    const isActive = ctx.value === value
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        onClick={() => ctx.onValueChange(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-lavender)] disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-dark-primary)] shadow'
            : 'text-[var(--color-text-dark-muted)] hover:text-[var(--color-text-dark-primary)]',
          className,
        )}
        {...props}
      />
    )
  },
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsContext)
    if (ctx.value !== value) return null
    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-lavender)]',
          className,
        )}
        {...props}
      />
    )
  },
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
