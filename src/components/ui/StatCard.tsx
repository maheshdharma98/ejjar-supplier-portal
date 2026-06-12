// EJJAR Design System v1.0
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type TrendDirection = 'up' | 'down' | 'flat'
type ColorVariant   = 'navy' | 'sky' | 'orange' | 'green'

const ICON_BOX: Record<ColorVariant, { bg: string; icon: string }> = {
  navy:   { bg: 'bg-[rgba(16,24,40,0.08)]',    icon: 'text-navy'         },
  sky:    { bg: 'bg-[rgba(77,168,199,0.12)]',  icon: 'text-brand-sky'    },
  orange: { bg: 'bg-[rgba(230,126,58,0.10)]',  icon: 'text-brand-orange' },
  green:  { bg: 'bg-[rgba(34,197,94,0.10)]',   icon: 'text-sem-success'  },
}

const TREND_COLOR: Record<TrendDirection, string> = {
  up:   'text-sem-success',
  down: 'text-sem-error',
  flat: 'text-ink-dim',
}

const TREND_ICON = {
  up:   TrendingUp,
  down: TrendingDown,
  flat: Minus,
}

interface StatCardProps {
  label:         string
  value:         string | number
  icon:          React.ElementType
  trend?:        TrendDirection
  trendValue?:   string
  colorVariant?: ColorVariant
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  colorVariant = 'sky',
}: StatCardProps) {
  const box       = ICON_BOX[colorVariant]
  const TrendIcon = trend ? TREND_ICON[trend] : null
  const trendColor = trend ? TREND_COLOR[trend] : ''

  return (
    <div className="flex items-center gap-[10px] bg-white border border-card-border rounded-[11px] shadow-card px-[14px] py-[12px]">
      <div className={cn('w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0', box.bg, box.icon)}>
        <Icon size={16} strokeWidth={1.75} />
      </div>

      <div className="flex flex-col gap-[1px] min-w-0">
        <span className="text-[10px] font-medium text-ink-dim whitespace-nowrap leading-tight">
          {label}
        </span>
        <span className="text-[20px] font-bold text-ink leading-[1.1]">
          {value}
        </span>
        {trend && trendValue && TrendIcon && (
          <span className={cn('text-[10px] font-semibold flex items-center gap-[2px] leading-tight', trendColor)}>
            <TrendIcon size={9} strokeWidth={2} />
            {trendValue}
          </span>
        )}
      </div>
    </div>
  )
}
