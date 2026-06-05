import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FileText, Briefcase, Boxes, Star, ExternalLink, Play } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoTour } from '@/components/DemoTour'
import { rfqs, jobs, resources, reviews, CURRENT_SUPPLIER_ID, maskContractor } from '@/utils/mockData'

const JOB_STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'> = {
  in_progress: 'success',
  completed: 'default',
  pending: 'warning',
}
const JOB_STATUS_LABEL: Record<string, string> = {
  in_progress: 'In Progress',
  completed: 'Completed',
  pending: 'Pending',
}

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'> = {
  new: 'info',
  supplier_responded: 'warning',
  negotiation: 'default',
  awarded: 'success',
  declined: 'danger',
}

const STATUS_LABEL: Record<string, string> = {
  new: 'New',
  supplier_responded: 'Responded',
  negotiation: 'Negotiation',
  awarded: 'Awarded',
  declined: 'Declined',
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [tourRunning, setTourRunning] = useState(false)

  const myReviews = useMemo(() => reviews.filter((r) => r.supplier_id === CURRENT_SUPPLIER_ID), [])
  const avgRating = myReviews.length
    ? (myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length).toFixed(1)
    : '—'

  const activeRfqs = rfqs.filter((r) => r.status === 'new' || r.status === 'negotiation').length
  const activeJobs = jobs.filter((j) => j.supplier_id === CURRENT_SUPPLIER_ID && j.status === 'in_progress').length
  const totalResources = resources.filter((r) => r.supplier_id === CURRENT_SUPPLIER_ID).length

  const recentRfqs = [...rfqs].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5)
  const inProgressJobs = jobs.filter((j) => j.status === 'in_progress')
  const upcomingJobs = (inProgressJobs.length > 0 ? inProgressJobs : jobs).slice(0, 3)

  const categoryKpis = useMemo(() => {
    const counts: Record<string, number> = {}
    rfqs.forEach((r) => {
      const key = r.category.charAt(0).toUpperCase() + r.category.slice(1)
      counts[key] = (counts[key] || 0) + 1
    })
    return counts
  }, [])

  const kpis = [
    { label: t('dashboard.active_rfqs'), value: activeRfqs, icon: FileText, color: 'bg-blue-50 text-[#1A4FBA]' },
    { label: t('dashboard.active_jobs'), value: activeJobs, icon: Briefcase, color: 'bg-green-50 text-green-700' },
    { label: t('dashboard.total_resources'), value: totalResources, icon: Boxes, color: 'bg-purple-50 text-purple-700' },
    { label: t('dashboard.avg_rating'), value: avgRating, icon: Star, color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="w-full min-w-0 space-y-6">
      <DemoTour run={tourRunning} onEnd={() => setTourRunning(false)} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('dashboard.title')}</h1>
        <Button
          id="tour-start-btn"
          variant="outline"
          size="sm"
          className="gap-2 border-[#1A4FBA] text-[#1A4FBA] hover:bg-[#1A4FBA] hover:text-white transition-colors"
          onClick={() => setTourRunning(true)}
        >
          <Play className="h-3.5 w-3.5" />
          Start Tour
        </Button>
      </div>

      {/* KPI Cards */}
      <div id="tour-kpi-cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RFQs by Category — KPI Grid + Sparklines */}
      {(() => {
        const sparkData = {
          Manpower: [18, 22, 19, 28, 24, 30, 27],
          Machinery: [10, 12, 11, 15, 13, 17, 16],
          Vehicles: [8, 10, 9, 14, 12, 16, 15],
          Shipping: [14, 13, 15, 11, 12, 10, 9],
        }
        const getPoints = (data: number[]) => {
          const max = Math.max(...data)
          return data.map((v, i) => `${(i / 6) * 100},${30 - (v / max) * 26}`).join(' ')
        }
        const cards = [
          {
            key: 'Manpower',
            label: 'MANPOWER',
            bg: '#F8FAFF',
            dot: '#1A4FBA',
            stroke: '#1A4FBA',
            trend: '+12%',
            trendClass: 'bg-green-50 text-green-700',
          },
          {
            key: 'Machinery',
            label: 'MACHINERY',
            bg: '#FFFBEB',
            dot: '#F59E0B',
            stroke: '#F59E0B',
            trend: '+5%',
            trendClass: 'bg-green-50 text-green-700',
          },
          {
            key: 'Vehicles',
            label: 'VEHICLES',
            bg: '#F0FDF4',
            dot: '#22C55E',
            stroke: '#22C55E',
            trend: '+8%',
            trendClass: 'bg-green-50 text-green-700',
          },
          {
            key: 'Shipping',
            label: 'SHIPPING',
            bg: '#FAF5FF',
            dot: '#8B5CF6',
            stroke: '#8B5CF6',
            trend: '-2%',
            trendClass: 'bg-red-50 text-red-700',
          },
        ]
        return (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-lg">RFQs by Category</span>
              <span className="text-sm text-gray-500">This Month</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Last 30 days performance</p>
            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4">
              {cards.map((c) => (
                <div key={c.key} style={{ background: c.bg, borderRadius: 12, padding: 14 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, display: 'inline-block', flexShrink: 0 }} />
                    <span className="uppercase text-xs tracking-wider text-gray-500 font-medium">{c.label}</span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="text-3xl font-bold text-gray-900">{categoryKpis[c.key] ?? 0}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.trendClass}`}>{c.trend}</span>
                  </div>
                  <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-8 mt-2">
                    <polyline
                      points={getPoints(sparkData[c.key as keyof typeof sparkData])}
                      fill="none"
                      stroke={c.stroke}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Recent RFQs */}
      <div id="tour-recent-rfqs">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{t('dashboard.recent_rfqs')}</CardTitle>
              <Button variant="link" size="sm" onClick={() => navigate('/rfqs')} className="text-xs">
                {t('dashboard.view_all')}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {recentRfqs.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">{t('dashboard.no_recent_rfqs')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="border-b bg-slate-50">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">ID</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Country</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRfqs.map((rfq) => (
                        <tr key={rfq.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">{rfq.id}</td>
                          <td className="px-4 py-3 capitalize">{rfq.category}</td>
                          <td className="px-4 py-3 text-slate-600">{rfq.country}</td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{format(new Date(rfq.created_at), 'dd MMM yyyy')}</td>
                          <td className="px-4 py-3">
                            <Badge variant={STATUS_VARIANT[rfq.status] || 'outline'}>
                              {STATUS_LABEL[rfq.status] || rfq.status}
                            </Badge>
                          </td>
                          <td id="tour-rfq-actions" className="px-4 py-3">
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/rfqs/${rfq.id}`)}>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
      </div>

      {/* Upcoming Jobs */}
      <div id="tour-upcoming-jobs">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{t('dashboard.upcoming_jobs')}</CardTitle>
              <Button variant="link" size="sm" onClick={() => navigate('/jobs')} className="text-xs">
                {t('dashboard.view_all')}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {upcomingJobs.length === 0 ? (
                <p className="text-center text-slate-500 py-4 text-sm">{t('dashboard.no_upcoming_jobs')}</p>
              ) : (
                upcomingJobs.map((job) => {
                  const rfq = rfqs.find((r) => r.id === job.rfq_id)
                  return (
                    <div key={job.id} className="rounded-lg border p-3 space-y-2 hover:border-[#1A4FBA]/30 transition-colors cursor-pointer" onClick={() => navigate('/jobs')}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-500">{job.id}</span>
                        <Badge variant={JOB_STATUS_VARIANT[job.status] || 'outline'} className="text-xs">
                          {JOB_STATUS_LABEL[job.status] || job.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium capitalize">{rfq?.category || '—'}</p>
                      <p className="text-xs text-slate-500">
                        {format(new Date(job.start_date), 'dd MMM')} – {format(new Date(job.end_date), 'dd MMM yyyy')}
                      </p>
                      <p className="text-xs text-slate-500">{job.city}, {job.country}</p>
                      <p className="text-xs text-slate-600">{job.allocated_resources.length} resource group(s)</p>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
      </div>

    </div>
  )
}
