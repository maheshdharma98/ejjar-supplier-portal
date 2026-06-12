// EJJAR Design System v1.0 — horizontal bar chart
// chart-primary (sky blue) = primary fill, chart-secondary (orange) = secondary

import { Users, Settings, Truck, Zap } from 'lucide-react'

interface CategoryDataItem {
  category: string
  value:    number
  trend?:   string
}

interface BarConfig {
  icon:      React.ElementType
  labelEn:   string
  labelAr:   string
  fillClass: string
  iconClass: string
}

const BAR_CONFIGS: Record<string, BarConfig> = {
  manpower:   { icon: Users,    labelEn: 'Manpower',   labelAr: 'العمالة',  fillClass: 'bg-chart-primary',   iconClass: 'text-brand-sky'    },
  machinery:  { icon: Settings, labelEn: 'Machinery',  labelAr: 'الآليات',  fillClass: 'bg-chart-secondary', iconClass: 'text-brand-orange'  },
  shipping:   { icon: Truck,    labelEn: 'Shipping',   labelAr: 'الشحن',    fillClass: 'bg-chart-muted',     iconClass: 'text-ink-dim'       },
  electrical: { icon: Zap,      labelEn: 'Electrical', labelAr: 'الكهرباء', fillClass: 'bg-chart-primary',   iconClass: 'text-brand-sky'     },
}

interface CategoryBarChartProps {
  data:  CategoryDataItem[]
  lang?: string
}

export function CategoryBarChart({ data, lang = 'en' }: CategoryBarChartProps) {
  const maxVal = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="flex flex-col gap-[10px]">
      {data.map((item) => {
        const key   = item.category.toLowerCase()
        const cfg   = BAR_CONFIGS[key] ?? {
          icon: Settings, labelEn: item.category, labelAr: item.category,
          fillClass: 'bg-chart-primary', iconClass: 'text-brand-sky',
        }
        const Icon  = cfg.icon
        const label = lang === 'ar' ? cfg.labelAr : cfg.labelEn
        const pct   = (item.value / maxVal) * 100

        return (
          <div key={item.category} className="flex items-center gap-[8px]">
            {/* Label — fixed 64px */}
            <div className="w-[64px] shrink-0 flex items-center gap-[4px]">
              <Icon size={11} strokeWidth={1.75} className={cfg.iconClass} />
              <span className="text-[10px] font-semibold text-ink-sub truncate">{label}</span>
            </div>

            {/* Track — bar height exactly 5px */}
            <div className="flex-1 h-[5px] bg-card-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${cfg.fillClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Value */}
            <span className="text-[11px] font-bold text-ink w-[12px] text-right flex-shrink-0">
              {item.value}
            </span>

            {/* Trend pill */}
            {item.trend && (
              <span className="text-[9px] font-semibold rounded-badge flex-shrink-0 bg-badge-success-bg text-badge-success-fg px-[5px] py-[1px]">
                {item.trend}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
