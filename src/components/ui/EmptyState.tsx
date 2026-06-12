// EJJAR Design System v1.0
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon:       ReactNode
  title:      string
  subtitle?:  string
  ctaLabel?:  string
  onCta?:     () => void
}

export function EmptyState({ icon, title, subtitle, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="text-card-border" style={{ fontSize: 40 }}>
        {icon}
      </div>
      <h4 className="text-[14px] font-semibold text-ink mt-3">{title}</h4>
      {subtitle && (
        <p className="text-[12px] text-ink-dim mt-1 max-w-[240px]">{subtitle}</p>
      )}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-4 bg-brand-orange text-white text-[13px] font-semibold rounded-button px-4 py-2 shadow-cta hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
