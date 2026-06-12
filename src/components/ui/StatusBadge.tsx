// EJJAR Design System v1.0 — status badge pairs (fixed, never mix)

interface StatusToken {
  bgClass:  string
  fgClass:  string
  label:    string
  labelAr:  string
}

// Uses tailwind.config.js badge.* token pairs
const STATUS_TOKENS: Record<string, StatusToken> = {
  new:          { bgClass: 'bg-badge-info-bg',     fgClass: 'text-badge-info-fg',    label: 'New',            labelAr: 'جديد'              },
  responded:    { bgClass: 'bg-badge-info-bg',     fgClass: 'text-badge-info-fg',    label: 'Responded',      labelAr: 'تم الرد'           },
  'quotes-in':  { bgClass: 'bg-badge-info-bg',     fgClass: 'text-badge-info-fg',    label: 'Quotes In',      labelAr: 'عروض واردة'        },
  broadcasted:  { bgClass: 'bg-badge-info-bg',     fgClass: 'text-badge-info-fg',    label: 'Broadcasted',    labelAr: 'مُرسَل'            },
  // Negotiation is an informational state, not a warning — spec: bg #E0F2FE text #0369A1
  negotiating:  { bgClass: 'bg-badge-info-bg',     fgClass: 'text-badge-info-fg',    label: 'In Negotiation', labelAr: 'قيد التفاوض'       },
  negotiation:  { bgClass: 'bg-badge-info-bg',     fgClass: 'text-badge-info-fg',    label: 'In Negotiation', labelAr: 'قيد التفاوض'       },
  active:       { bgClass: 'bg-badge-warning-bg',  fgClass: 'text-badge-warning-fg', label: 'Active',         labelAr: 'نشط'               },
  in_progress:  { bgClass: 'bg-badge-warning-bg',  fgClass: 'text-badge-warning-fg', label: 'In Progress',    labelAr: 'قيد التنفيذ'       },
  accepted:     { bgClass: 'bg-badge-success-bg',  fgClass: 'text-badge-success-fg', label: 'Accepted',       labelAr: 'مقبول'             },
  completed:    { bgClass: 'bg-badge-success-bg',  fgClass: 'text-badge-success-fg', label: 'Completed',      labelAr: 'مكتمل'             },
  rejected:     { bgClass: 'bg-badge-error-bg',    fgClass: 'text-badge-error-fg',   label: 'Rejected',       labelAr: 'مرفوض'             },
  declined:     { bgClass: 'bg-badge-error-bg',    fgClass: 'text-badge-error-fg',   label: 'Declined',       labelAr: 'مرفوض'             },
  cancelled:    { bgClass: 'bg-badge-error-bg',    fgClass: 'text-badge-error-fg',   label: 'Cancelled',      labelAr: 'ملغي'              },
  pending:      { bgClass: 'bg-badge-pending-bg',  fgClass: 'text-badge-pending-fg', label: 'Pending',        labelAr: 'قيد الانتظار'      },
  pending_start:{ bgClass: 'bg-badge-pending-bg',  fgClass: 'text-badge-pending-fg', label: 'Pending Start',  labelAr: 'في انتظار البدء'   },
  expired:      { bgClass: 'bg-badge-pending-bg',  fgClass: 'text-badge-pending-fg', label: 'Expired',        labelAr: 'منتهي'             },
}

interface StatusBadgeProps {
  status: string
  lang?: string
  overrideLabel?: string
}

export function StatusBadge({ status, lang = 'en', overrideLabel }: StatusBadgeProps) {
  const token = STATUS_TOKENS[status] ?? {
    bgClass: 'bg-badge-pending-bg',
    fgClass: 'text-badge-pending-fg',
    label:   status,
    labelAr: status,
  }
  const label = overrideLabel ?? (lang === 'ar' ? token.labelAr : token.label)

  return (
    <span
      className={`inline-flex items-center rounded-badge px-[10px] font-semibold whitespace-nowrap text-[11px] leading-[22px] ${token.bgClass} ${token.fgClass}`}
    >
      {label}
    </span>
  )
}
