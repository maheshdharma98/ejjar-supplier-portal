import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Upload, CheckCircle, UserPlus, Mail } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { suppliers, CURRENT_SUPPLIER_ID } from '@/utils/mockData'

const supplier = suppliers.find((s) => s.id === CURRENT_SUPPLIER_ID)!

interface Member {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'pending'
}

const INITIAL_MEMBERS: Member[] = [
  { id: 'm1', name: 'Ahmed Al-Rashidi', email: 'ahmed@gcs.om', role: 'Admin', status: 'active' },
  { id: 'm2', name: 'Sara Mohammed', email: 'sara@gcs.om', role: 'Operations', status: 'active' },
  { id: 'm3', name: 'John Smith', email: 'john@gcs.om', role: 'Finance', status: 'pending' },
]

export default function Settings() {
  const { t } = useTranslation()
  const [companyName, setCompanyName] = useState(supplier.name)
  const [country, setCountry] = useState(supplier.country)
  const [region, setRegion] = useState(supplier.region)
  const [description, setDescription] = useState(supplier.description)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Operations' })

  function handleSaveCompany() {
    toast({ title: t('settings.saved_success'), variant: 'default' })
  }

  function handleInvite() {
    if (!inviteForm.name || !inviteForm.email) return
    setMembers((prev) => [
      ...prev,
      { id: `m${Date.now()}`, ...inviteForm, status: 'pending' },
    ])
    setInviteOpen(false)
    setInviteForm({ name: '', email: '', role: 'Operations' })
    toast({ title: t('settings.invited_success'), variant: 'default' })
  }

  const tierVariant: Record<string, 'default' | 'warning' | 'outline'> = {
    platinum: 'default',
    gold: 'warning',
    silver: 'outline',
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">{t('settings.title')}</h1>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">{t('settings.company')}</TabsTrigger>
          <TabsTrigger value="team">{t('settings.team')}</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('settings.company')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>{t('settings.company_name')}</Label>
                    <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('settings.country')}</Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['Oman', 'Saudi Arabia', 'UAE', 'Kuwait', 'Qatar', 'Bahrain'].map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('settings.region')}</Label>
                      <Input value={region} onChange={(e) => setRegion(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.description')}</Label>
                    <textarea
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('settings.license')}</Label>
                    <label className="flex items-center gap-2 cursor-pointer border border-dashed rounded-md px-4 py-3 hover:bg-slate-50 transition-colors w-fit">
                      <Upload className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-500">{t('settings.upload_license')}</span>
                      <input type="file" accept=".pdf,.jpg,.png" className="hidden" />
                    </label>
                  </div>
                  <Button onClick={handleSaveCompany}>{t('settings.save')}</Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{t('settings.tier')}</p>
                    <Badge variant={tierVariant[supplier.subscription_tier] || 'outline'} className="capitalize">
                      {t(`settings.${supplier.subscription_tier}`)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <div className="flex items-center gap-1.5">
                      {supplier.verified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">{t('settings.verified')}</span>
                        </>
                      ) : (
                        <span className="text-sm text-slate-500">{t('settings.not_verified')}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Supplier ID</p>
                    <p className="font-mono text-sm text-slate-700">{supplier.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="text-sm text-slate-700">{supplier.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{t('settings.members')}</CardTitle>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t('settings.invite')}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-slate-50">
                    <tr>
                      {[t('settings.col_name'), t('settings.col_email'), t('settings.col_role'), t('settings.col_status')].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr key={m.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{m.name}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />{m.email}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{m.role}</td>
                        <td className="px-4 py-3">
                          <Badge variant={m.status === 'active' ? 'success' : 'warning'}>
                            {m.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('settings.invite_title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.invite_name')}</Label>
              <Input value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.invite_email')}</Label>
              <Input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.invite_role')}</Label>
              <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({ ...inviteForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Admin', 'Operations', 'Finance', 'Viewer'].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleInvite}>{t('settings.send_invite')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
