import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-btn)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-lavender)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-brand-lavender)] text-[var(--color-bg-base)] hover:bg-[var(--color-brand-lavender)]/90',
        destructive:
          'bg-[var(--color-brand-coral)] text-white hover:bg-[var(--color-brand-coral)]/90',
        outline:
          'border border-[var(--color-border-dark-subtle)] bg-transparent hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-dark-primary)]',
        secondary:
          'bg-[var(--color-bg-elevated)] text-[var(--color-text-dark-secondary)] hover:bg-[var(--color-bg-elevated)]/80',
        ghost:
          'hover:bg-[var(--color-bg-elevated)] text-[var(--color-text-dark-secondary)]',
        link: 'text-[var(--color-brand-lavender)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-[var(--radius-chip)] px-3 text-xs',
        lg: 'h-10 rounded-[var(--radius-card-sm)] px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
