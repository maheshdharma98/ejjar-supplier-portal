import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ExternalLink, CheckCircle, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { jobs as allJobs, rfqs, contractors, CURRENT_SUPPLIER_ID } from '@/utils/mockData'
import type { Job } from '@/types'

export default function Jobs() {
  const { t } = useTranslation()
  const [jobs, setJobs] = useState<Job[]>(allJobs.filter((j) => j.supplier_id === CURRENT_SUPPLIER_ID))
  const [tab, setTab] = useState('active')

  const filtered = jobs.filter((j) => (tab === 'active' ? j.status === 'in_progress' : j.status === 'completed'))

  function markCompleted(id: string) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: 'completed' } : j)))
    toast({ title: t('jobs.completed_success'), variant: 'default' })
  }

  function JobCard({ job }: { job: Job }) {
    const rfq = rfqs.find((r) => r.id === job.rfq_id)
    const contractor = contractors.find((c) => c.id === job.contractor_id)
    const isActive = job.status === 'in_progress'

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs text-slate-500">{job.id}</p>
              <p className="font-semibold text-slate-900 capitalize mt-0.5">{rfq?.category || '—'}</p>
            </div>
            <Badge variant={isActive ? 'success' : 'secondary'}>
              {isActive ? t('jobs.status_in_progress') : t('jobs.status_completed')}
            </Badge>
          </div>

          <div className="text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('jobs.col_contractor')}</span>
              <span className="font-medium text-slate-700">{contractor?.name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('jobs.col_dates')}</span>
              <span className="text-slate-700 text-xs">
                {format(new Date(job.start_date), 'dd MMM yy')} – {format(new Date(job.end_date), 'dd MMM yy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location</span>
              <span className="text-slate-700 text-xs">{job.city}, {job.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('jobs.col_resources')}</span>
              <span className="text-slate-700">
                {job.allocated_resources.map((r) => `${r.quantity} ${r.unit}`).join(', ')}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => window.open(job.work_order_url, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              {t('jobs.work_order')}
            </Button>
            {isActive && (
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => markCompleted(job.id)}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {t('jobs.mark_completed')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">{t('jobs.title')}</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="active">{t('jobs.active')}</TabsTrigger>
          <TabsTrigger value="completed">{t('jobs.completed')}</TabsTrigger>
        </TabsList>

        {['active', 'completed'].map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
                <Briefcase className="h-12 w-12" />
                <p className="text-sm">{t('jobs.no_jobs')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {filtered.map((job) => <JobCard key={job.id} job={job} />)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
