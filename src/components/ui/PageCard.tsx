// EJJAR Design System v1.0
import { ReactNode } from 'react'

interface PageCardProps {
  title?:    string
  subtitle?: string
  rightSlot?: ReactNode
  children:  ReactNode
  noPadding?: boolean
}

export function PageCard({ title, subtitle, rightSlot, children, noPadding = false }: PageCardProps) {
  const hasHeader = title || subtitle || rightSlot

  return (
    <div className="bg-white border border-card-border rounded-card shadow-card overflow-hidden">
      {hasHeader && (
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5 border-b border-card-border">
          <div className="min-w-0">
            {title    && <h3 className="text-[13px] font-semibold text-ink truncate">{title}</h3>}
            {subtitle && <p className="text-[11px] text-ink-dim mt-0.5">{subtitle}</p>}
          </div>
          {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-4'}>{children}</div>
    </div>
  )
}
