import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * shadcn/ui Button, new-york style.
 *
 * Authored here rather than pulled with `shadcn add`: the registry host is
 * blocked by the network policy in this environment. The public API is the
 * shadcn one — same variant and size names, same `asChild` behaviour — so a
 * later `shadcn add button` is a diff, not a migration.
 *
 * Visual values read the existing token contract in styles.css. No shadows and
 * no radius of its own: the theme caps radii, which is what keeps the geometry
 * sharp. Heights follow the 36 / 44 / 48 scale so primary controls clear the
 * 44px touch target.
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background',
        outline: 'border border-border bg-background text-foreground hover:border-foreground',
        ghost: 'text-foreground hover:bg-muted',
        link: 'text-primary underline underline-offset-4 hover:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-foreground',
      },
      size: {
        sm: 'h-9 px-4',
        default: 'h-11 px-6',
        lg: 'h-12 px-8',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
