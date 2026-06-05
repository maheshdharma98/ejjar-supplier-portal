import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Eye, MessageSquare, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { rfqs as allRfqs, maskContractor, CATEGORIES, COUNTRIES } from '@/utils/mockData'
import type { RFQ } from '@/types'

const PAGE_SIZE = 10

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'> = {
  new: 'info',
  supplier_responded: 'warning',
  negotiation: 'default',
  awarded: 'success',
  declined: 'danger',
}

export default function RFQs() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('all')
  const [category, setCategory] = useState('all')
  const [country, setCountry] = useState('all')
  const [page, setPage] = useState(1)
  const [loading] = useState(false)
  const [declined, setDeclined] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return allRfqs.filter((r) => {
      if (tab === 'new' && r.status !== 'new') return false
      if (tab === 'responded' && r.status !== 'supplier_responded') return false
      if (tab === 'negotiation' && r.status !== 'negotiation') return false
      if (category !== 'all' && r.category !== category) return false
      if (country !== 'all' && r.country !== country) return false
      return true
    })
  }, [tab, category, country])

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleDecline(id: string) {
    setDeclined((prev) => new Set([...prev, id]))
    toast({ title: t('rfqs.declined_success'), variant: 'default' })
  }

  function statusLabel(status: string) {
    const map: Record<string, string> = {
      new: t('rfqs.status_new'),
      supplier_responded: t('rfqs.status_responded'),
      negotiation: t('rfqs.status_negotiation'),
      awarded: t('rfqs.status_awarded'),
      declined: t('rfqs.status_declined'),
    }
    return map[status] || status
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('rfqs.title')}</h1>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1) }}>
        <TabsList>
          <TabsTrigger value="all">{t('rfqs.all')}</TabsTrigger>
          <TabsTrigger value="new">{t('rfqs.new')}</TabsTrigger>
          <TabsTrigger value="responded">{t('rfqs.responded')}</TabsTrigger>
          <TabsTrigger value="negotiation">{t('rfqs.negotiation')}</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('rfqs.filter_category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('rfqs.all_categories')}</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={(v) => { setCountry(v); setPage(1) }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder={t('rfqs.filter_country')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('rfqs.all_countries')}</SelectItem>
            {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : paged.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
              <MessageSquare className="h-10 w-10" />
              <p className="text-sm">{t('rfqs.no_rfqs')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    {[t('rfqs.col_id'), t('rfqs.col_category'), t('rfqs.col_contractor'), t('rfqs.col_location'), t('rfqs.col_dates'), t('rfqs.col_status'), t('rfqs.col_actions')].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((rfq: RFQ) => (
                    <tr
                      key={rfq.id}
                      className="border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/rfqs/${rfq.id}`)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">{rfq.id}</td>
                      <td className="px-4 py-3 capitalize">{rfq.category}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{maskContractor(rfq.contractor_id)}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs whitespace-nowrap">{rfq.city}, {rfq.country}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {format(new Date(rfq.start_date), 'dd MMM')} – {format(new Date(rfq.end_date), 'dd MMM yy')}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={declined.has(rfq.id) ? 'danger' : STATUS_VARIANT[rfq.status] || 'outline'}>
                          {declined.has(rfq.id) ? t('rfqs.status_declined') : statusLabel(rfq.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/rfqs/${rfq.id}`)} title={t('rfqs.view')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/rfqs/${rfq.id}`)} title={t('rfqs.respond')}>
                            <MessageSquare className="h-4 w-4 text-green-600" />
                          </Button>
                          {!declined.has(rfq.id) && (
                            <Button variant="ghost" size="icon" onClick={() => handleDecline(rfq.id)} title={t('rfqs.decline')}>
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            {t('rfqs.page_of')} {page} / {pageCount}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
              {t('common.previous')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
              {t('common.next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
