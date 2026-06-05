import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ArrowLeft, Paperclip, CheckSquare, Square, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { rfqs, resources, maskContractor, CURRENT_SUPPLIER_ID } from '@/utils/mockData'

const STATUS_STEPS = ['new', 'supplier_responded', 'negotiation', 'awarded']

export default function RFQDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const rfq = rfqs.find((r) => r.id === id)
  const myResources = resources.filter((r) => r.supplier_id === CURRENT_SUPPLIER_ID)

  const [quote, setQuote] = useState('')
  const [notes, setNotes] = useState('')
  const [checkedResources, setCheckedResources] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState(false)

  if (!rfq) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
        <p className="text-lg">RFQ not found</p>
        <Button variant="outline" onClick={() => navigate('/rfqs')}>{t('rfq_detail.back')}</Button>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(rfq.status)

  function toggleResource(id: string) {
    setCheckedResources((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSubmit() {
    if (!quote) { toast({ title: 'Please enter a quote amount', variant: 'destructive' }); return }
    setSubmitted(true)
    toast({ title: t('rfq_detail.submitted_success'), variant: 'default' })
  }

  function handleDecline() {
    toast({ title: t('rfq_detail.declined_success'), variant: 'destructive' })
    navigate('/rfqs')
  }

  const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
    new: 'info',
    supplier_responded: 'warning',
    negotiation: 'default',
    awarded: 'success',
    declined: 'danger',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/rfqs')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{rfq.id}</h1>
          <p className="text-sm text-slate-500">{t('rfq_detail.rfq_details')}</p>
        </div>
        <Badge variant={STATUS_VARIANT[rfq.status] || 'outline'} className="ml-auto">
          {rfq.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: Details */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('rfq_detail.rfq_details')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('rfq_detail.category')}</p>
                  <p className="font-medium capitalize">{rfq.category}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('rfq_detail.subcategory')}</p>
                  <p className="font-medium capitalize">{rfq.subcategory}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('rfq_detail.contractor')}</p>
                  <p className="font-medium text-slate-600">{maskContractor(rfq.contractor_id)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('rfq_detail.quantity')}</p>
                  <p className="font-medium">{rfq.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('rfq_detail.location')}</p>
                  <p className="font-medium">{rfq.city}, {rfq.country}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">{t('rfq_detail.dates')}</p>
                  <p className="font-medium text-sm">
                    {format(new Date(rfq.start_date), 'dd MMM yyyy')} – {format(new Date(rfq.end_date), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-slate-500 mb-2">{t('rfq_detail.description')}</p>
                <p className="text-sm text-slate-700 leading-relaxed">{rfq.description}</p>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-slate-500 mb-2">{t('rfq_detail.attachments')}</p>
                <div className="flex items-center gap-2 text-sm text-[#1A4FBA] hover:underline cursor-pointer">
                  <Paperclip className="h-4 w-4" />
                  {t('rfq_detail.sample_doc')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('rfq_detail.status_timeline')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6">
                {STATUS_STEPS.map((step, i) => {
                  const done = i <= currentStep
                  const active = i === currentStep
                  return (
                    <div key={step} className="relative pb-6 last:pb-0">
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`absolute left-[-14px] top-5 h-full w-0.5 ${done ? 'bg-[#1A4FBA]' : 'bg-slate-200'}`} />
                      )}
                      <div className={`absolute left-[-20px] top-1 h-4 w-4 rounded-full border-2 ${
                        active ? 'bg-[#1A4FBA] border-[#1A4FBA]' : done ? 'bg-[#1A4FBA] border-[#1A4FBA]' : 'bg-white border-slate-300'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium capitalize ${done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.replace('_', ' ')}
                        </p>
                        {active && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {format(new Date(rfq.created_at), 'dd MMM yyyy, HH:mm')}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Response Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('rfq_detail.response_form')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submitted ? (
                <div className="text-center py-8 space-y-2">
                  <div className="text-green-600 text-4xl">✓</div>
                  <p className="font-medium text-green-700">{t('rfq_detail.submitted_success')}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="quote">{t('rfq_detail.quote_omr')}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">OMR</span>
                      <Input
                        id="quote"
                        type="number"
                        className="pl-12"
                        placeholder={t('rfq_detail.quote_placeholder')}
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t('rfq_detail.notes')}</Label>
                    <textarea
                      id="notes"
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      placeholder={t('rfq_detail.notes_placeholder')}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('rfq_detail.upload_pdf')}</Label>
                    <label className="flex items-center gap-2 cursor-pointer border border-dashed rounded-md px-4 py-3 hover:bg-slate-50 transition-colors">
                      <Upload className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500">Click to upload PDF</span>
                      <input type="file" accept=".pdf" className="hidden" />
                    </label>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>{t('rfq_detail.resource_checklist')}</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {myResources.slice(0, 6).map((res) => (
                        <label key={res.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 rounded p-1">
                          <button type="button" onClick={() => toggleResource(res.id)}>
                            {checkedResources.has(res.id)
                              ? <CheckSquare className="h-4 w-4 text-[#1A4FBA]" />
                              : <Square className="h-4 w-4 text-slate-400" />}
                          </button>
                          <span className="text-sm capitalize">{res.subcategory} — {res.id}</span>
                          <Badge variant={res.status === 'available' ? 'success' : 'warning'} className="ml-auto text-xs">
                            {res.status}
                          </Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handleSubmit}>{t('rfq_detail.submit')}</Button>
                    <Button variant="outline" className="w-full" onClick={handleSubmit}>{t('rfq_detail.counter')}</Button>
                    <Button variant="destructive" className="w-full" onClick={handleDecline}>{t('rfq_detail.decline')}</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
