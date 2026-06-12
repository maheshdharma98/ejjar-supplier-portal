// EJJAR Design System v1.0
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, MessageSquare, XCircle, ExternalLink } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CategoryChip } from '@/components/ui/CategoryChip'
import { EmptyState }   from '@/components/ui/EmptyState'
import { IconButton }   from '@/components/ui/IconButton'
import { PageCard }     from '@/components/ui/PageCard'
import { toast }        from '@/hooks/use-toast'
import {
  DEMO_RFQS,
  getStatusLabel,
  getLocalField,
} from '@/data/supplierDemoData'

const TABS = [
  { key: 'all',         labelEn: 'All',        labelAr: 'الكل'    },
  { key: 'new',         labelEn: 'New',         labelAr: 'جديد'    },
  { key: 'responded',   labelEn: 'Responded',   labelAr: 'تم الرد' },
  { key: 'negotiation', labelEn: 'Negotiation', labelAr: 'تفاوض'   },
]

export default function RFQs() {
  const { t, i18n } = useTranslation()
  const navigate    = useNavigate()
  const lang        = i18n.language
  const [tab, setTab]           = useState('all')
  const [declined, setDeclined] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return DEMO_RFQS.filter((r) => {
      if (tab === 'new'         && r.status !== 'new')         return false
      if (tab === 'responded'   && r.status !== 'responded')   return false
      if (tab === 'negotiation' && r.status !== 'negotiating') return false
      return true
    })
  }, [tab])

  function handleDecline(id: string) {
    setDeclined((prev) => new Set([...prev, id]))
    toast({ title: t('rfqs.declined_success'), variant: 'default' })
  }

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">

      {/* ── Segmented filter tabs ──────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
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
          {filtered.length} {lang === 'ar' ? 'طلب' : 'requests'}
        </span>
      </div>

      {/* ── Mobile card list ────────────────────────────────────── */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <EmptyState icon={<MessageSquare size={40} />} title={t('rfqs.no_rfqs')} />
        ) : (
          filtered.map((rfq) => {
            const isDeclined = declined.has(rfq.id)
            return (
              <div
                key={rfq.id}
                className="bg-white border border-card-border rounded-card p-3.5 cursor-pointer hover:shadow-card transition-all"
                onClick={() => navigate(`/rfqs/${rfq.id}`)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] text-ink-dim">{rfq.id}</span>
                    <p className="text-[13px] font-medium text-ink mt-0.5">
                      {getLocalField(rfq as unknown as Record<string, unknown>, 'category', lang)}
                    </p>
                  </div>
                  <StatusBadge
                    status={isDeclined ? 'declined' : rfq.status}
                    lang={lang}
                    overrideLabel={isDeclined ? (lang === 'ar' ? 'مرفوض' : 'Declined') : undefined}
                  />
                </div>
                <p className="text-[11px] text-ink-dim mt-1.5">
                  {getLocalField(rfq as unknown as Record<string, unknown>, 'city', lang)},{' '}
                  🇴🇲 {lang === 'ar' ? 'عُمان' : 'Oman'} · {rfq.startDate}
                </p>
                <div
                  className="flex items-center gap-1 pt-2.5 border-t border-card-border mt-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigate(`/rfqs/${rfq.id}`)}
                    className="flex items-center gap-1 text-[12px] text-ink-sub hover:text-ink px-2 py-1 rounded-[8px] hover:bg-page transition-colors"
                  >
                    <Eye size={13} strokeWidth={1.75} />
                    {t('rfqs.view')}
                  </button>
                  <button
                    onClick={() => navigate(`/rfqs/${rfq.id}`)}
                    className="flex items-center gap-1 text-[12px] text-brand-sky hover:opacity-80 px-2 py-1 rounded-[8px] hover:bg-[rgba(77,168,199,0.08)] transition-colors"
                  >
                    <MessageSquare size={13} strokeWidth={1.75} />
                    {t('rfqs.respond')}
                  </button>
                  {!isDeclined && (
                    <button
                      onClick={() => handleDecline(rfq.id)}
                      className="flex items-center gap-1 text-[12px] text-badge-error-fg hover:opacity-80 px-2 py-1 rounded-[8px] hover:bg-badge-error-bg transition-colors"
                    >
                      <XCircle size={13} strokeWidth={1.75} />
                      {t('rfqs.decline')}
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Desktop table ──────────────────────────────────────── */}
      <div className="hidden md:block">
        <PageCard noPadding>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<MessageSquare size={40} />}
              title={t('rfqs.no_rfqs')}
              subtitle={lang === 'ar' ? 'لا توجد طلبات في هذه الفئة' : 'No requests match this filter'}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-page border-b border-card-border">
                    {[
                      t('rfqs.col_id'),
                      t('rfqs.col_category'),
                      t('rfqs.col_contractor'),
                      t('rfqs.col_location'),
                      t('rfqs.col_dates'),
                      t('rfqs.col_status'),
                      t('rfqs.col_actions'),
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3.5 py-2 text-start text-[10px] font-semibold text-ink-dim uppercase tracking-[0.8px] whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((rfq) => {
                    const isDeclined = declined.has(rfq.id)
                    return (
                      <tr
                        key={rfq.id}
                        className="border-b border-card-border hover:bg-page transition-colors cursor-pointer"
                        onClick={() => navigate(`/rfqs/${rfq.id}`)}
                      >
                        <td className="px-3.5 py-2.5">
                          <span className="font-mono text-[10px] text-ink-dim">{rfq.id}</span>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <CategoryChip category={rfq.category} lang={lang} />
                        </td>
                        <td className="px-3.5 py-2.5 text-[12px] text-ink-sub">
                          {lang === 'ar' ? 'مقاول #0001' : 'Contractor #0001'}
                        </td>
                        <td className="px-3.5 py-2.5 text-[12px] text-ink-sub whitespace-nowrap">
                          🇴🇲{' '}
                          {getLocalField(rfq as unknown as Record<string, unknown>, 'city', lang)},{' '}
                          {lang === 'ar' ? 'عُمان' : 'Oman'}
                        </td>
                        <td className="px-3.5 py-2.5 text-[12px] text-ink-sub whitespace-nowrap">
                          {rfq.startDate}
                        </td>
                        <td className="px-3.5 py-2.5">
                          <StatusBadge
                            status={isDeclined ? 'declined' : rfq.status}
                            lang={lang}
                            overrideLabel={isDeclined ? getStatusLabel('rejected', lang) : undefined}
                          />
                        </td>
                        <td className="px-3.5 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            <IconButton
                              icon={<Eye size={13} strokeWidth={1.75} />}
                              variant="light"
                              size="sm"
                              onClick={() => navigate(`/rfqs/${rfq.id}`)}
                              title={t('rfqs.view')}
                            />
                            <IconButton
                              icon={<ExternalLink size={13} strokeWidth={1.75} />}
                              variant="light"
                              size="sm"
                              onClick={() => navigate(`/rfqs/${rfq.id}`)}
                              title={t('rfqs.respond')}
                            />
                            {!isDeclined && (
                              <IconButton
                                icon={<XCircle size={13} strokeWidth={1.75} />}
                                variant="light"
                                size="sm"
                                onClick={() => handleDecline(rfq.id)}
                                title={t('rfqs.decline')}
                                className="hover:!bg-badge-error-bg hover:!text-badge-error-fg"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </PageCard>
      </div>
    </div>
  )
}
