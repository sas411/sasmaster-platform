import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--radius-badge)] border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-brand-lavender)] text-[var(--color-bg-base)]',
        secondary:
          'border-transparent bg-[var(--color-bg-elevated)] text-[var(--color-text-dark-secondary)]',
        teal:
          'border-transparent bg-[var(--color-brand-teal-dim)] text-[var(--color-brand-teal)]',
        gold:
          'border-transparent bg-[var(--color-brand-gold-dim)] text-[var(--color-brand-gold)]',
        destructive:
          'border-transparent bg-[var(--color-brand-coral)]/20 text-[var(--color-brand-coral)]',
        outline:
          'border-[var(--color-border-dark-subtle)] text-[var(--color-text-dark-secondary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
