// EJJAR Design System v1.0
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Briefcase, MapPin, CheckCircle, Circle } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CategoryChip } from '@/components/ui/CategoryChip'
import { EmptyState }   from '@/components/ui/EmptyState'
import { toast }        from '@/hooks/use-toast'
import {
  DEMO_JOBS,
  type DemoJob,
  getLocalField,
  formatOMR,
} from '@/data/supplierDemoData'

const TABS = [
  { key: 'active',    labelEn: 'Active',    labelAr: 'جارية'   },
  { key: 'completed', labelEn: 'Completed', labelAr: 'مكتملة'  },
]

export default function Jobs() {
  const { t, i18n } = useTranslation()
  const lang  = i18n.language
  const [jobs, setJobs] = useState<DemoJob[]>(DEMO_JOBS)
  const [tab, setTab]   = useState('active')

  const filtered = jobs.filter((j) =>
    tab === 'active' ? j.status === 'in_progress' : j.status === 'completed'
  )

  function markCompleted(id: string) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'completed' as const } : j))
    )
    toast({ title: t('jobs.completed_success'), variant: 'default' })
  }

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">

      {/* ── Segmented tab filter ──────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-page border border-card-border rounded-[10px] p-1 gap-0.5">
          {TABS.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={
                tab === tb.key
                  ? 'px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold text-brand-sky bg-white shadow-card transition-all'
                  : 'px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium text-ink-sub hover:text-ink transition-colors'
              }
            >
              {lang === 'ar' ? tb.labelAr : tb.labelEn}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-ink-dim ms-auto">
          {filtered.length} {lang === 'ar' ? 'مهمة' : 'jobs'}
        </span>
      </div>

      {/* ── Job cards ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-card-border rounded-card">
          <EmptyState
            icon={<Briefcase size={40} />}
            title={t('jobs.no_jobs')}
            subtitle={lang === 'ar' ? 'لا توجد مهام في هذه الفئة حالياً' : 'No jobs in this category right now'}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-card-border rounded-card p-4 shadow-card hover:shadow-cta/10 transition-shadow"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] text-ink-dim">{job.id}</span>
                    <CategoryChip category={job.category} lang={lang} />
                  </div>
                  <h3 className="text-[14px] font-semibold text-ink mt-1">
                    {getLocalField(job as unknown as Record<string, unknown>, 'title', lang)}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-[12px] text-ink-dim">
                    <MapPin size={12} strokeWidth={1.75} />
                    🇴🇲{' '}
                    {getLocalField(job as unknown as Record<string, unknown>, 'city', lang)},{' '}
                    {lang === 'ar' ? 'عُمان' : 'Oman'}
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end items-center gap-3 sm:gap-1.5 flex-shrink-0">
                  <span className="text-[18px] font-bold text-ink">
                    {formatOMR(job.amount, lang)}
                  </span>
                  <StatusBadge status={job.status} lang={lang} />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-[11px] text-ink-dim mb-1.5">
                  <span className="font-medium">{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
                  <span className="font-semibold text-ink">{job.progress}%</span>
                </div>
                <div className="h-2 bg-card-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${job.progress}%`,
                      background: job.status === 'completed' ? '#22C55E' : '#4DA8C7',
                    }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="mt-3 flex flex-wrap gap-2">
                {job.milestones.map((m, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-1 text-[11px] font-medium rounded-full px-2.5 py-1 ${
                      m.completed
                        ? 'bg-badge-success-bg text-badge-success-fg'
                        : 'bg-page text-ink-dim border border-card-border'
                    }`}
                  >
                    {m.completed
                      ? <CheckCircle size={11} strokeWidth={2} />
                      : <Circle     size={11} strokeWidth={1.75} />
                    }
                    {getLocalField(m as unknown as Record<string, unknown>, 'name', lang)}
                  </span>
                ))}
              </div>

              {/* Mark complete CTA — one orange button max per screen */}
              {job.status === 'in_progress' && (
                <div className="mt-4 pt-3 border-t border-card-border">
                  <button
                    onClick={() => markCompleted(job.id)}
                    className="bg-brand-orange text-white text-[13px] font-semibold rounded-button px-4 py-2 shadow-cta hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    {t('jobs.mark_completed')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
