import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/hooks/use-toast'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [phone, setPhone] = useState('+968 ')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
      toast({ title: 'OTP Sent', description: `Code sent to ${phone}`, variant: 'default' })
    }, 1000)
  }

  function handleOtpChange(i: number, val: string) {
    if (!/^\d?$/.test(val)) return
    const next = [...otp]
    next[i] = val
    setOtp(next)
    if (val && i < 5) otpRefs.current[i + 1]?.focus()
  }

  function handleOtpKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus()
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login(phone)
      navigate('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-[#1A4FBA] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1A4FBA] text-white text-3xl font-bold shadow-lg">
            E
          </div>
          <h1 className="text-2xl font-bold text-slate-900">EJJAR</h1>
          <p className="text-base font-semibold text-[#1A4FBA]">{t('login.title')}</p>
          <p className="text-sm text-slate-500 mt-1">{t('login.subtitle')}</p>
        </CardHeader>
        <CardContent className="pb-8 pt-6">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('login.phone_label')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('login.phone_placeholder')}
                  className="h-12 text-base"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                {loading ? t('login.sending') : t('login.send_otp')}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-3">
                <Label>{t('login.otp_label')}</Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#1A4FBA]"
                    />
                  ))}
                </div>
                <p className="text-xs text-center text-slate-500">{t('login.otp_hint')}</p>
              </div>
              <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                {loading ? t('login.verifying') : t('login.verify')}
              </Button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-slate-500 hover:text-[#1A4FBA] transition-colors"
              >
                ← Change phone number
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
