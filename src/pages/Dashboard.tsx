// EJJAR Design System v1.0
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  FileText, Briefcase, Boxes, Star, ExternalLink,
  MapPin, Zap, Users, Truck,
} from 'lucide-react'
import { StatCard }         from '@/components/ui/StatCard'
import { StatusBadge }      from '@/components/ui/StatusBadge'
import { CategoryChip }     from '@/components/ui/CategoryChip'
import { CategoryBarChart } from '@/components/ui/CategoryBarChart'
import { EmptyState }       from '@/components/ui/EmptyState'
import {
  DEMO_RFQS,
  DEMO_JOBS,
  SUPPLIER_PROFILE,
  getLocalField,
} from '@/data/supplierDemoData'

// ── Job icon lookup by category ───────────────────────────────────────
const JOB_ICON_MAP: Record<string, { bg: string; iconCls: string; icon: React.ElementType }> = {
  manpower:   { bg: 'bg-[rgba(230,126,58,0.10)]',  iconCls: 'text-brand-orange', icon: Users  },
  machinery:  { bg: 'bg-[rgba(77,168,199,0.12)]',  iconCls: 'text-brand-sky',    icon: Boxes  },
  shipping:   { bg: 'bg-[rgba(148,163,184,0.15)]', iconCls: 'text-ink-sub',      icon: Truck  },
  electrical: { bg: 'bg-[rgba(77,168,199,0.12)]',  iconCls: 'text-brand-sky',    icon: Zap    },
  default:    { bg: 'bg-[rgba(77,168,199,0.12)]',  iconCls: 'text-brand-sky',    icon: Zap    },
}

function getJobIcon(category: string, title: string) {
  const lower = (title + ' ' + category).toLowerCase()
  if (lower.includes('wiring') || lower.includes('electrical')) return JOB_ICON_MAP.electrical
  return JOB_ICON_MAP[category.toLowerCase()] ?? JOB_ICON_MAP.default
}

// ── Compact job row — horizontal inside grid-cols-3 ───────────────────
function JobRow({ job, borderRight, lang }: {
  job:         typeof DEMO_JOBS[number]
  borderRight: boolean
  lang:        string
}) {
  const navigate = useNavigate()
  const { bg, iconCls, icon: Icon } = getJobIcon(
    getLocalField(job as unknown as Record<string, unknown>, 'category', 'en'),
    getLocalField(job as unknown as Record<string, unknown>, 'title', 'en')
  )

  return (
    <div
      onClick={() => navigate('/jobs')}
      className={`flex items-center gap-[10px] px-[14px] py-[9px] hover:bg-page cursor-pointer transition-colors${borderRight ? ' border-e border-card-border' : ''}`}
    >
      <div className={`w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={15} strokeWidth={1.75} className={iconCls} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-mono text-[9px] text-ink-dim leading-tight">{job.id}</div>
        <div className="text-[11px] font-semibold text-ink mt-[1px] truncate leading-tight">
          {getLocalField(job as unknown as Record<string, unknown>, 'title', lang)}
        </div>
        <div className="text-[10px] text-ink-sub mt-[1px] flex items-center gap-[2px] leading-tight">
          <MapPin size={9} strokeWidth={1.75} className="shrink-0" />
          🇴🇲 {getLocalField(job as unknown as Record<string, unknown>, 'city', lang)},{' '}
          {lang === 'ar' ? 'عُمان' : 'Oman'}
        </div>
      </div>

      <div className="flex flex-col items-end gap-[3px] shrink-0">
        <StatusBadge status={job.status} lang={lang} />
        <span className="text-[10px] text-ink-dim leading-tight">{job.startDate}</span>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const navigate    = useNavigate()
  const lang        = i18n.language

  const activeRfqs     = DEMO_RFQS.length
  const activeJobs     = DEMO_JOBS.filter((j) => j.status === 'in_progress').length
  const totalResources = SUPPLIER_PROFILE.totalResources
  const avgRating      = SUPPLIER_PROFILE.rating.toFixed(1)

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {}
    DEMO_RFQS.forEach((r) => {
      const key = r.category.toLowerCase()
      counts[key] = (counts[key] || 0) + 1
    })
    return [
      { category: 'Manpower',  value: counts['manpower']  ?? 0, trend: '+12%' },
      { category: 'Machinery', value: counts['machinery'] ?? 0, trend: '+5%'  },
      { category: 'Shipping',  value: counts['shipping']  ?? 0, trend: '+8%'  },
    ]
  }, [])

  return (
    <div className="flex flex-col gap-[12px] w-full min-w-0">

      {/* ── ZONE 1: Stats strip ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[8px]">
        <StatCard
          label={t('dashboard.active_rfqs')}
          value={activeRfqs}
          icon={FileText}
          trend="up"
          trendValue="+2"
          colorVariant="sky"
        />
        <StatCard
          label={t('dashboard.active_jobs')}
          value={activeJobs}
          icon={Briefcase}
          trend="flat"
          trendValue="—"
          colorVariant="green"
        />
        <StatCard
          label={t('dashboard.total_resources')}
          value={totalResources}
          icon={Boxes}
          colorVariant="navy"
        />
        <StatCard
          label={t('dashboard.avg_rating')}
          value={avgRating}
          icon={Star}
          trend="up"
          trendValue="+0.1"
          colorVariant="orange"
        />
      </div>

      {/* ── ZONE 2: Chart (340px fixed) + RFQ table (1fr) ─────────── */}
      <div
        className="grid gap-[10px]"
        style={{ gridTemplateColumns: 'min(340px, 100%) 1fr' }}
      >
        {/* Chart card */}
        <div className="bg-white border border-card-border rounded-[13px] shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-card-border">
            <div>
              <h3 className="text-[12px] font-semibold text-ink leading-tight">
                {lang === 'ar' ? 'الطلبات حسب الفئة' : 'RFQs by Category'}
              </h3>
              <p className="text-[10px] text-ink-dim mt-[1px]">
                {lang === 'ar' ? 'آخر 30 يوماً' : 'Last 30 days'}
              </p>
            </div>
            <span className="text-[10px] text-ink-dim bg-page px-[7px] py-[2px] rounded-[5px] border border-card-border">
              {lang === 'ar' ? 'هذا الشهر' : 'This Month'}
            </span>
          </div>
          <div className="px-[14px] py-[12px]">
            <CategoryBarChart data={categoryData} lang={lang} />
          </div>
        </div>

        {/* Recent RFQs table */}
        <div className="bg-white border border-card-border rounded-[13px] shadow-card overflow-hidden min-w-0">
          <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-card-border">
            <h3 className="text-[12px] font-semibold text-ink">
              {t('dashboard.recent_rfqs')}
            </h3>
            <button
              onClick={() => navigate('/rfqs')}
              className="text-[11px] font-medium text-brand-sky hover:underline"
            >
              {t('dashboard.view_all')}
            </button>
          </div>

          {DEMO_RFQS.length === 0 ? (
            <EmptyState icon={<FileText size={32} />} title={t('dashboard.no_recent_rfqs')} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px]">
                <thead>
                  <tr className="bg-page">
                    {['ID', 'Category', 'Country', 'Date', 'Status', ''].map((h, i) => (
                      <th
                        key={i}
                        className="text-start text-[9px] font-semibold text-ink-dim uppercase tracking-[0.8px] whitespace-nowrap"
                        style={{ padding: '7px 12px' }}
                      >
                        {h === 'ID'        ? (lang === 'ar' ? 'رقم'     : 'ID')
                        : h === 'Category' ? (lang === 'ar' ? 'الفئة'   : 'Category')
                        : h === 'Country'  ? (lang === 'ar' ? 'الدولة'  : 'Country')
                        : h === 'Date'     ? (lang === 'ar' ? 'التاريخ' : 'Date')
                        : h === 'Status'   ? (lang === 'ar' ? 'الحالة'  : 'Status')
                        : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DEMO_RFQS.map((rfq) => (
                    <tr
                      key={rfq.id}
                      className="border-b border-card-border hover:bg-page transition-colors cursor-pointer"
                      onClick={() => navigate(`/rfqs/${rfq.id}`)}
                    >
                      <td style={{ padding: '9px 12px' }}>
                        <span className="font-mono text-[10px] text-ink-dim">{rfq.id}</span>
                      </td>
                      <td style={{ padding: '9px 12px' }}>
                        <CategoryChip category={rfq.category} lang={lang} />
                      </td>
                      <td className="text-[11px] text-ink" style={{ padding: '9px 12px' }}>
                        🇴🇲 {lang === 'ar' ? 'عُمان' : 'Oman'}
                      </td>
                      <td style={{ padding: '9px 12px' }}>
                        <span className="text-[10px] text-ink-dim whitespace-nowrap">
                          {rfq.receivedAt.split('T')[0]}
                        </span>
                      </td>
                      <td style={{ padding: '9px 12px' }}>
                        <StatusBadge status={rfq.status} lang={lang} />
                      </td>
                      <td style={{ padding: '9px 12px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/rfqs/${rfq.id}`)}
                          className="w-[24px] h-[24px] rounded-[6px] flex items-center justify-center bg-page text-ink-dim hover:bg-[rgba(77,168,199,0.10)] hover:text-brand-sky border border-card-border transition-colors"
                        >
                          <ExternalLink size={12} strokeWidth={1.75} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── ZONE 3: Upcoming jobs — grid-cols-3 ──────────────────── */}
      <div className="bg-white border border-card-border rounded-[13px] shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-[14px] py-[10px] border-b border-card-border">
          <div>
            <h3 className="text-[12px] font-semibold text-ink">
              {t('dashboard.upcoming_jobs')}
            </h3>
            <p className="text-[10px] text-ink-dim mt-[1px]">
              {lang === 'ar' ? 'مجدولة وجارية' : 'Scheduled & in progress'}
            </p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="text-[11px] font-medium text-brand-sky hover:underline"
          >
            {t('dashboard.view_all')}
          </button>
        </div>

        {DEMO_JOBS.length === 0 ? (
          <EmptyState icon={<Briefcase size={32} />} title={t('dashboard.no_upcoming_jobs')} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_JOBS.slice(0, 3).map((job, i, arr) => (
              <JobRow
                key={job.id}
                job={job}
                borderRight={i < arr.length - 1}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
