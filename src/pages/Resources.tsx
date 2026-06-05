import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Plus, Pencil, Trash2, Boxes } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { resources as allResources, CURRENT_SUPPLIER_ID } from '@/utils/mockData'
import type { Resource } from '@/types'

const TABS = ['manpower', 'machinery', 'vehicles', 'shipping']

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  available: 'success',
  booked: 'warning',
  maintenance: 'danger',
}

function specsPreview(specs: Record<string, unknown>): string {
  const parts: string[] = []
  if (specs.experience_years) parts.push(`${specs.experience_years}yr exp`)
  if (specs.daily_rate_usd) parts.push(`$${specs.daily_rate_usd}/day`)
  if (specs.quantity_available) parts.push(`qty: ${specs.quantity_available}`)
  if (specs.make) parts.push(String(specs.make))
  if (specs.model) parts.push(String(specs.model))
  if (specs.capacity) parts.push(String(specs.capacity))
  return parts.join(' · ') || '—'
}

export default function Resources() {
  const { t } = useTranslation()
  const [resources, setResources] = useState<Resource[]>(
    allResources.filter((r) => r.supplier_id === CURRENT_SUPPLIER_ID)
  )
  const [tab, setTab] = useState('manpower')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<Resource | null>(null)
  const [loading] = useState(false)
  const [form, setForm] = useState({ subcategory: '', status: 'available', from: '', to: '', specs: '' })

  const filtered = resources.filter((r) => r.category === tab)

  function openAdd() {
    setEditTarget(null)
    setForm({ subcategory: '', status: 'available', from: '', to: '', specs: '' })
    setSheetOpen(true)
  }

  function openEdit(res: Resource) {
    setEditTarget(res)
    setForm({
      subcategory: res.subcategory,
      status: res.status,
      from: res.availability_start,
      to: res.availability_end,
      specs: specsPreview(res.specs),
    })
    setSheetOpen(true)
  }

  function handleSave() {
    if (editTarget) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editTarget.id
            ? { ...r, subcategory: form.subcategory, status: form.status as Resource['status'], availability_start: form.from, availability_end: form.to }
            : r
        )
      )
    } else {
      const newRes: Resource = {
        id: `res-${Date.now()}`,
        supplier_id: CURRENT_SUPPLIER_ID,
        category: tab,
        subcategory: form.subcategory,
        status: form.status as Resource['status'],
        availability_start: form.from,
        availability_end: form.to,
        specs: {},
      }
      setResources((prev) => [newRes, ...prev])
    }
    setSheetOpen(false)
    toast({ title: t('resources.saved_success'), variant: 'default' })
  }

  function handleDelete(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id))
    setDeleteTarget(null)
    toast({ title: t('resources.deleted_success'), variant: 'destructive' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('resources.title')}</h1>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          {t('resources.add_resource')}
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {TABS.map((t2) => (
            <TabsTrigger key={t2} value={t2}>{t(`resources.${t2}`)}</TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey}>
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
                    <Boxes className="h-10 w-10" />
                    <p className="text-sm">{t('resources.no_resources')}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-slate-50">
                        <tr>
                          {[t('resources.col_id'), t('resources.col_type'), t('resources.col_status'),
                            t('resources.col_from'), t('resources.col_to'), t('resources.col_specs'), t('resources.col_actions')].map((h) => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((res) => (
                          <tr key={res.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-slate-600">{res.id}</td>
                            <td className="px-4 py-3 capitalize">{res.subcategory}</td>
                            <td className="px-4 py-3">
                              <Badge variant={STATUS_VARIANT[res.status] || 'outline'}>
                                {t(`resources.${res.status}`)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">{format(new Date(res.availability_start), 'dd MMM yy')}</td>
                            <td className="px-4 py-3 text-xs text-slate-500">{format(new Date(res.availability_end), 'dd MMM yy')}</td>
                            <td className="px-4 py-3 text-xs text-slate-500 max-w-[200px] truncate">{specsPreview(res.specs)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openEdit(res)}>
                                  <Pencil className="h-4 w-4 text-slate-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(res.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
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
          </TabsContent>
        ))}
      </Tabs>

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editTarget ? t('resources.edit_title') : t('resources.add_title')}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>{t('resources.form_type')}</Label>
              <Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="e.g. mason, excavator..." />
            </div>
            <div className="space-y-2">
              <Label>{t('resources.form_status')}</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{t('resources.available')}</SelectItem>
                  <SelectItem value="booked">{t('resources.booked')}</SelectItem>
                  <SelectItem value="maintenance">{t('resources.maintenance')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('resources.form_from')}</Label>
              <Input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('resources.form_to')}</Label>
              <Input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('resources.form_specs')}</Label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                value={form.specs}
                onChange={(e) => setForm({ ...form, specs: e.target.value })}
                placeholder="Enter specs..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={handleSave}>{t('resources.save')}</Button>
              <Button variant="outline" className="flex-1" onClick={() => setSheetOpen(false)}>{t('resources.cancel')}</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.delete')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">{t('resources.delete_confirm')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>{t('resources.cancel')}</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>{t('common.delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
