// EJJAR Design System v1.0
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps {
  icon:      ReactNode
  variant?:  'light' | 'dark'
  size?:     'sm' | 'md'
  onClick?:  (e?: React.MouseEvent) => void
  title?:    string
  className?: string
}

export function IconButton({
  icon,
  variant = 'light',
  size = 'md',
  onClick,
  title,
  className,
}: IconButtonProps) {
  const dim = size === 'sm' ? 'w-[26px] h-[26px]' : 'w-8 h-8'

  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'flex items-center justify-center rounded-[8px] transition-colors duration-150 flex-shrink-0',
        dim,
        variant === 'light'
          ? 'bg-page text-ink-dim hover:bg-[rgba(77,168,199,0.10)] hover:text-brand-sky border border-card-border'
          : 'bg-white/[0.07] text-white/60 hover:bg-white/[0.12] hover:text-white',
        className
      )}
    >
      {icon}
    </button>
  )
}
