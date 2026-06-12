// EJJAR Design System v1.0 — category chip
// Uses badge token pairs for consistency with StatusBadge

import { Users, Settings, Truck, Zap } from 'lucide-react'

interface ChipToken {
  bgClass: string
  fgClass: string
  icon:    React.ElementType
  label:   string
  labelAr: string
}

const CHIP_TOKENS: Record<string, ChipToken> = {
  manpower:   { bgClass: 'bg-badge-warning-bg', fgClass: 'text-badge-warning-fg', icon: Users,    label: 'Manpower',   labelAr: 'العمالة'  },
  machinery:  { bgClass: 'bg-badge-info-bg',    fgClass: 'text-badge-info-fg',    icon: Settings, label: 'Machinery',  labelAr: 'الآليات'  },
  shipping:   { bgClass: 'bg-badge-pending-bg', fgClass: 'text-badge-pending-fg', icon: Truck,    label: 'Shipping',   labelAr: 'الشحن'    },
  electrical: { bgClass: 'bg-badge-success-bg', fgClass: 'text-badge-success-fg', icon: Zap,      label: 'Electrical', labelAr: 'الكهرباء' },
}

interface CategoryChipProps {
  category: string
  lang?: string
}

export function CategoryChip({ category, lang = 'en' }: CategoryChipProps) {
  const key = category.toLowerCase()
  const token = CHIP_TOKENS[key] ?? {
    bgClass: 'bg-badge-pending-bg',
    fgClass: 'text-badge-pending-fg',
    icon: Settings,
    label: category,
    labelAr: category,
  }
  const Icon  = token.icon
  const label = lang === 'ar' ? token.labelAr : token.label

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-badge font-semibold whitespace-nowrap text-[10px] leading-[18px] px-[7px] ${token.bgClass} ${token.fgClass}`}
    >
      <Icon size={11} strokeWidth={1.75} />
      {label}
    </span>
  )
}
