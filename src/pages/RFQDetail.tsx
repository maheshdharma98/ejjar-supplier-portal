// EJJAR Design System v1.0 — RFQ Detail
// FIX 1: single column, max-w-3xl
// FIX 2: breadcrumb + title row
// FIX 3: RFQ details card (field labels, budget bold, description divider)
// FIX 4: horizontal status stepper (replaces right-panel vertical timeline)
// FIX 5: contractor card (navy avatar, star rating, italic identity note)
// FIX 6: negotiation thread (full-width cards, top accent bar, no chat offset)
// FIX 7: send quote form (page bg inputs, orange focus, bold submit)

import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft, Send, MapPin, Calendar, Clock,
  DollarSign, Check, Star,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CategoryChip } from '@/components/ui/CategoryChip'
import { toast }        from '@/hooks/use-toast'
import {
  DEMO_RFQS,
  type DemoQuote,
  getLocalField,
  formatOMR,
} from '@/data/supplierDemoData'

// ── Token-mapped constants ────────────────────────────────────────────
// chart-muted (#94A3B8) used for all field labels per spec
const FIELD_LABEL_CLS = 'text-[11px] font-semibold text-chart-muted uppercase tracking-[0.7px] mb-1'

const STATUS_STEPS = [
  { key: 'new',         labelEn: 'New',            labelAr: 'جديد'        },
  { key: 'responded',   labelEn: 'Responded',      labelAr: 'تم الرد'     },
  { key: 'negotiating', labelEn: 'In Negotiation', labelAr: 'قيد التفاوض' },
  { key: 'accepted',    labelEn: 'Accepted',       labelAr: 'مقبول'       },
] as const

// ── Horizontal status stepper (FIX 4) ────────────────────────────────
function StatusStepper({
  currentStep,
  lang,
  activeTimestamp,
}: {
  currentStep:     number
  lang:            string
  activeTimestamp: string
}) {
  const n = STATUS_STEPS.length
  // Each step column = 1/n of container width.
  // Center of first column = 1/(2n)*100 = 12.5%
  // Center of last column  = (1 - 1/(2n))*100 = 87.5%
  // Full connector: left 12.5%, right 12.5% (width = 75%)
  const offsetPct   = (1 / (2 * n)) * 100           // 12.5
  const connPct     = 100 - 2 * offsetPct            // 75
  const greenWidth  = currentStep > 0
    ? (currentStep / (n - 1)) * connPct
    : 0

  return (
    <div className="bg-white border border-card-border rounded-[14px] px-5 py-4">
      <div className="relative flex">
        {/* Full gray connector */}
        <div
          className="absolute top-[10px] h-[2px] bg-card-border z-0"
          style={{ left: `${offsetPct}%`, right: `${offsetPct}%` }}
        />
        {/* Green completed portion */}
        {greenWidth > 0 && (
          <div
            className="absolute top-[10px] h-[2px] bg-sem-success z-0 transition-all duration-500"
            style={{ left: `${offsetPct}%`, width: `${greenWidth}%` }}
          />
        )}

        {STATUS_STEPS.map((step, i) => {
          const done   = i < currentStep
          const active = i === currentStep
          const label  = lang === 'ar' ? step.labelAr : step.labelEn

          return (
            <div
              key={step.key}
              className="flex-1 flex flex-col items-center gap-[4px] z-10"
            >
              {/* Circle */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  done
                    ? 'bg-sem-success border-sem-success'
                    : active
                    ? 'bg-brand-orange border-brand-orange'
                    : 'bg-white border-card-border'
                }`}
              >
                {done   && <Check size={11} strokeWidth={2.5} className="text-white" />}
                {active && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] text-center leading-tight px-1 ${
                  done || active
                    ? 'font-semibold text-ink'
                    : 'font-normal text-chart-muted'
                }`}
              >
                {label}
              </span>

              {/* Timestamp — active step only */}
              {active && (
                <span className="text-[10px] text-ink-dim text-center leading-tight">
                  {activeTimestamp}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── RFQDetail ─────────────────────────────────────────────────────────
export default function RFQDetail() {
  const { id }   = useParams<{ id: string }>()
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const lang     = i18n.language

  const rfq = DEMO_RFQS.find((r) => r.id === id)
  const [quotes, setQuotes]             = useState<DemoQuote[]>(rfq?.quotes ?? [])
  const [quoteAmount, setQuoteAmount]   = useState('')
  const [quoteMessage, setQuoteMessage] = useState('')

  if (!rfq) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-ink-dim">
        <p className="text-[14px] font-medium">
          {lang === 'ar' ? 'الطلب غير موجود' : 'RFQ not found'}
        </p>
        <button
          onClick={() => navigate('/rfqs')}
          className="text-[13px] font-medium text-brand-sky border border-brand-sky rounded-button px-4 py-2 hover:bg-badge-info-bg transition-colors"
        >
          {lang === 'ar' ? 'رجوع' : 'Back to RFQs'}
        </button>
      </div>
    )
  }

  const stepKeys    = STATUS_STEPS.map((s) => s.key as string)
  const currentStep = Math.max(0, stepKeys.indexOf(rfq.status))
  const activeTs    = rfq.receivedAt.replace('T', ' ').slice(0, 16)

  function handleSendQuote() {
    if (!quoteAmount) {
      toast({
        title:   lang === 'ar' ? 'الرجاء إدخال المبلغ' : 'Please enter an amount',
        variant: 'destructive',
      })
      return
    }
    const newQuote: DemoQuote = {
      id:        'Q_' + Date.now(),
      rfqId:     rfq!.id,
      fromRole:  'supplier',
      amount:    Number(quoteAmount),
      message:   quoteMessage || (lang === 'ar' ? 'عرضنا للمشروع.' : 'Our quote for the project.'),
      messageAr: quoteMessage || 'عرضنا للمشروع.',
      timestamp: new Date().toISOString(),
      status:    'pending',
    }
    setQuotes((prev) => [...prev, newQuote])
    setQuoteAmount('')
    setQuoteMessage('')
    toast({
      title:   lang === 'ar' ? '✅ تم إرسال العرض!' : '✅ Quote sent to contractor!',
      variant: 'default',
    })
  }

  return (
    <div className="w-full flex flex-col gap-4 pb-8">

      {/* ── Breadcrumb + Title row — full width ─────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-[4px] min-w-0 flex-1">
          <div className="flex items-center gap-[6px]">
            <button
              onClick={() => navigate('/rfqs')}
              aria-label={lang === 'ar' ? 'رجوع' : 'Back to RFQs'}
              className="w-[26px] h-[26px] rounded-[7px] bg-badge-pending-bg flex items-center justify-center flex-shrink-0 hover:bg-card-border transition-colors"
            >
              <ChevronLeft size={14} className="text-brand-orange" />
            </button>
            <span className="font-mono text-[11px] text-ink-dim tracking-[0.3px]">
              {rfq.id}
            </span>
          </div>
          <h1 className="text-[18px] font-bold text-ink leading-snug">
            {getLocalField(rfq as unknown as Record<string, unknown>, 'title', lang)}
          </h1>
        </div>
        <div className="flex-shrink-0 pt-[3px]">
          <StatusBadge status={rfq.status} lang={lang} />
        </div>
      </div>

      {/* ── Two-column body ─────────────────────────────────────── */}
      {/* Left: RFQ Details  |  Right: Stepper + Contractor + Thread + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        {/* ── LEFT: RFQ Details card ──────────────────────────── */}
        <div className="bg-white border border-card-border rounded-card shadow-card overflow-hidden">
          <div className="px-5 pt-4 pb-3 border-b border-card-border">
            <h2 className="text-[13px] font-semibold text-ink">
              {lang === 'ar' ? 'تفاصيل طلب العرض' : 'RFQ Details'}
            </h2>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'الفئة' : 'Category'}</p>
                <CategoryChip category={rfq.category} lang={lang} />
              </div>

              <div>
                <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'التخصص' : 'Subcategory'}</p>
                <p className="text-[13px] text-ink-sub">
                  {getLocalField(rfq as unknown as Record<string, unknown>, 'subcategory', lang)}
                </p>
              </div>

              <div>
                <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'المقاول' : 'Contractor'}</p>
                <p className="text-[13px] font-medium text-brand-sky">
                  {lang === 'ar' ? 'مقاول #0001' : 'Contractor #0001'}
                </p>
              </div>

              <div>
                <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'الميزانية' : 'Budget'}</p>
                <p className="text-[13px] font-semibold text-ink">
                  {formatOMR(rfq.budgetMin, lang)} – {formatOMR(rfq.budgetMax, lang)}
                </p>
              </div>

              <div>
                <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'الموقع' : 'Location'}</p>
                <div className="flex items-center gap-1 text-[13px] text-ink-sub">
                  <MapPin size={12} strokeWidth={1.75} className="text-ink-dim flex-shrink-0" />
                  🇴🇲 {getLocalField(rfq as unknown as Record<string, unknown>, 'city', lang)},{' '}
                  {lang === 'ar' ? 'عُمان' : 'Oman'}
                </div>
              </div>

              <div>
                <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'تاريخ البدء' : 'Start Date'}</p>
                <div className="flex items-center gap-1 text-[13px] text-ink-sub">
                  <Calendar size={12} strokeWidth={1.75} className="text-ink-dim flex-shrink-0" />
                  {rfq.startDate}
                </div>
              </div>

              <div className="col-span-2">
                <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'المدة' : 'Duration'}</p>
                <div className="flex items-center gap-1 text-[13px] text-ink-sub">
                  <Clock size={12} strokeWidth={1.75} className="text-ink-dim flex-shrink-0" />
                  {getLocalField(rfq as unknown as Record<string, unknown>, 'duration', lang)}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-badge-pending-bg">
              <p className={FIELD_LABEL_CLS}>{lang === 'ar' ? 'الوصف' : 'Description'}</p>
              <p className="text-[13px] text-ink-sub leading-[1.6]">
                {getLocalField(rfq as unknown as Record<string, unknown>, 'description', lang)}
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Stepper + Contractor + Thread + Form ─────── */}
        <div className="flex flex-col gap-3">

          {/* Status stepper */}
          <StatusStepper
            currentStep={currentStep}
            lang={lang}
            activeTimestamp={activeTs}
          />

          {/* Contractor card */}
          <div className="bg-page border border-card-border rounded-[12px] px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[13px] font-bold leading-none select-none">C</span>
            </div>
            <div className="flex flex-col gap-[2px] min-w-0">
              <p className="text-[13px] font-semibold text-brand-sky leading-tight">
                {lang === 'ar' ? 'مقاول #0001' : 'Contractor #0001'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px]">
                <Star size={12} strokeWidth={1.75} className="text-brand-orange flex-shrink-0" />
                <span className="font-semibold text-ink">{rfq.contractorRating}</span>
                <span className="text-ink-dim">·</span>
                <MapPin size={11} strokeWidth={1.75} className="text-ink-dim flex-shrink-0" />
                <span className="text-ink-dim">
                  {lang === 'ar' ? 'مسقط، عُمان' : 'Muscat, Oman'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-chart-muted italic ms-auto">
              {lang === 'ar' ? 'الهوية تُكشف بعد القبول' : 'Identity revealed after acceptance'}
            </p>
          </div>

          {/* Negotiation Thread */}
          <div className="bg-white border border-card-border rounded-card shadow-card overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-card-border flex items-center gap-2">
              <h2 className="text-[14px] font-semibold text-ink">
                {lang === 'ar' ? 'خيط التفاوض' : 'Negotiation Thread'}
              </h2>
              {quotes.length > 0 && (
                <span className="bg-badge-pending-bg text-badge-pending-fg text-[10px] font-semibold rounded-badge px-[7px] py-[2px]">
                  {quotes.length}
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col gap-2 max-h-[320px] overflow-y-auto">
              {quotes.length === 0 ? (
                <div className="flex flex-col items-center py-8 gap-2">
                  <DollarSign size={32} strokeWidth={1.5} className="text-card-border" />
                  <p className="text-[12px] text-ink-dim text-center">
                    {lang === 'ar' ? 'لا توجد عروض بعد. أرسل أول عرض!' : 'No quotes yet. Send your first quote!'}
                  </p>
                </div>
              ) : (
                quotes.map((quote) => {
                  const isMine = quote.fromRole === 'supplier'
                  return (
                    <div
                      key={quote.id}
                      className="bg-white border border-card-border rounded-[14px] shadow-card overflow-hidden"
                    >
                      <div className={`h-[3px] w-full ${isMine ? 'bg-brand-orange' : 'bg-brand-sky'}`} />
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-ink-dim uppercase tracking-[0.5px]">
                            {isMine
                              ? (lang === 'ar' ? 'أنت' : 'You')
                              : (lang === 'ar' ? 'المقاول' : 'Contractor')}
                          </span>
                          <span className="text-[10px] text-chart-muted">
                            {quote.timestamp.replace('T', ' ').slice(0, 16)}
                          </span>
                        </div>
                        <p className="text-[22px] font-bold text-ink mt-[6px] leading-none">
                          {formatOMR(quote.amount, lang)}
                        </p>
                        <p className="text-[13px] text-ink-sub leading-[1.6] mt-[4px]">
                          {getLocalField(quote as unknown as Record<string, unknown>, 'message', lang)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Send Your Quote form */}
          {rfq.status !== 'accepted' && rfq.status !== 'rejected' && (
            <div className="bg-white border border-card-border rounded-[14px] px-5 py-4">
              <h3 className="text-[13px] font-semibold text-ink mb-3">
                {lang === 'ar' ? 'أرسل عرضك' : 'Send Your Quote'}
              </h3>

              <div className="flex flex-col gap-3">
                <div>
                  <p className={FIELD_LABEL_CLS}>
                    {lang === 'ar' ? 'السعر (ر.ع.)' : 'Price (OMR)'}
                  </p>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      strokeWidth={1.75}
                      className="absolute start-3.5 top-1/2 -translate-y-1/2 text-brand-orange pointer-events-none"
                    />
                    <input
                      type="number"
                      value={quoteAmount}
                      onChange={(e) => setQuoteAmount(e.target.value)}
                      placeholder={lang === 'ar' ? 'أدخل المبلغ' : 'Enter amount'}
                      className="w-full ps-10 pe-3.5 py-[10px] bg-page border-[1.5px] border-card-border rounded-[12px] text-[13px] text-ink placeholder:text-ink-dim/50 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <p className={FIELD_LABEL_CLS}>
                    {lang === 'ar' ? 'الرسالة' : 'Message'}
                  </p>
                  <textarea
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    rows={3}
                    className="w-full bg-page border-[1.5px] border-card-border rounded-[12px] px-[14px] py-[10px] text-[13px] text-ink-sub placeholder:text-ink-dim/50 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none transition-colors min-h-[80px]"
                  />
                </div>

                <button
                  onClick={handleSendQuote}
                  className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-bold text-[13px] rounded-[12px] py-3 shadow-cta hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {lang === 'ar' ? 'إرسال العرض' : 'Send Quote'}
                  <Send size={14} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          )}
        </div>
        {/* end RIGHT column */}

      </div>
      {/* end two-column grid */}

    </div>
  )
}
