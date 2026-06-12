// EJJAR Design System v1.0
// Glassmorphism login card over responsive splash screen background

import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Phone, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { toast }        from '@/hooks/use-toast'

import logoMarkSrc from '@/assets/Ejjar_logo_outlinwhite.svg'
import wordmarkSrc from '@/assets/Ejjar_logo_white.svg'

export default function Login() {
  const { t, i18n } = useTranslation()
  const lang        = i18n.language
  const navigate    = useNavigate()
  const login       = useAuthStore((s) => s.login)

  const [phone, setPhone]     = useState('+968 ')
  const [step, setStep]       = useState<'phone' | 'otp'>('phone')
  const [otp, setOtp]         = useState(['', '', '', '', '', ''])
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
    <div className="min-h-screen relative overflow-hidden">

      {/* Splash backgrounds — object-cover fills the viewport */}
      <img
        src="/Web_Splash_screen.svg"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none hidden sm:block"
        aria-hidden="true"
        draggable={false}
        alt=""
      />
      <img
        src="/Mobile View splash screen.svg"
        className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none sm:hidden"
        aria-hidden="true"
        draggable={false}
        alt=""
      />

      {/* Subtle dark scrim — just enough contrast, keeps splash visible */}
      <div className="absolute inset-0 bg-navy/40 pointer-events-none" />

      {/* Page layout */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Top strip — wordmark */}
        <div className="px-6 py-4 flex items-center gap-2.5 flex-shrink-0">
          <img src={wordmarkSrc} alt="EJJAR" className="h-[22px] w-auto" draggable={false} />
          <span className="text-white/25 text-[12px]">·</span>
          <span className="text-white/50 text-[12px] font-medium">
            {lang === 'ar' ? 'بوابة المورد' : 'Supplier Portal'}
          </span>
        </div>

        {/* Centered form area */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-[400px]">

            {/* Logo mark + heading (above the glass card) */}
            <div className="flex flex-col items-center mb-7">
              <img
                src={logoMarkSrc}
                alt="EJJAR"
                className="h-[60px] w-auto mb-4 drop-shadow-lg"
                draggable={false}
              />
              <h1 className="text-[22px] font-bold text-white leading-tight drop-shadow">
                {lang === 'ar' ? 'تسجيل الدخول' : 'Welcome back'}
              </h1>
              <p className="text-[13px] text-white/55 mt-1.5 text-center">
                {lang === 'ar'
                  ? 'أدخل رقم هاتفك للمتابعة'
                  : 'Enter your phone number to continue'}
              </p>
            </div>

            {/* ── Glass card ─────────────────────────────────────────── */}
            <div
              className="rounded-card border border-white/20 p-6 sm:p-8"
              style={{
                background: 'rgba(255,255,255,0.10)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >

              {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-[11px] font-semibold text-white/60 uppercase tracking-[0.8px] mb-1.5"
                    >
                      {t('login.phone_label')}
                    </label>
                    <div className="relative">
                      <Phone
                        size={15}
                        strokeWidth={1.75}
                        className="absolute start-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                      />
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={t('login.phone_placeholder')}
                        required
                        className="w-full ps-9 pe-3.5 py-3 text-[14px] text-white placeholder:text-white/30 rounded-input transition-colors focus:outline-none"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.18)',
                        }}
                        onFocus={(e) => {
                          e.target.style.border = '1px solid rgba(230,126,58,0.70)'
                          e.target.style.boxShadow = '0 0 0 3px rgba(230,126,58,0.18)'
                        }}
                        onBlur={(e) => {
                          e.target.style.border = '1px solid rgba(255,255,255,0.18)'
                          e.target.style.boxShadow = 'none'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand-orange text-white font-semibold text-[14px] rounded-button shadow-cta hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? (lang === 'ar' ? 'جارٍ الإرسال…' : 'Sending…')
                      : t('login.send_otp')}
                  </button>
                </form>

              ) : (
                <form onSubmit={handleVerify} className="flex flex-col gap-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Shield size={14} strokeWidth={1.75} className="text-brand-sky" />
                      <label className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.8px]">
                        {t('login.otp_label')}
                      </label>
                    </div>

                    {/* OTP digit boxes */}
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
                          className="w-10 h-12 sm:w-12 sm:h-14 rounded-[10px] text-center text-[18px] font-bold text-white focus:outline-none transition-colors"
                          style={
                            digit
                              ? { background: 'rgba(230,126,58,0.22)', border: '1.5px solid rgba(230,126,58,0.80)', boxShadow: '0 0 0 3px rgba(230,126,58,0.15)' }
                              : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }
                          }
                        />
                      ))}
                    </div>

                    <p className="text-[11px] text-center text-white/35 mt-2.5">
                      {t('login.otp_hint')}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-brand-orange text-white font-semibold text-[14px] rounded-button shadow-cta hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? (lang === 'ar' ? 'جارٍ التحقق…' : 'Verifying…')
                      : t('login.verify')}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-[12px] text-white/35 hover:text-white/60 transition-colors text-center"
                  >
                    ← {lang === 'ar' ? 'تغيير رقم الهاتف' : 'Change phone number'}
                  </button>
                </form>
              )}
            </div>
            {/* ── end glass card ────────────────────────────────────── */}

            <p className="text-center text-[11px] text-white/25 mt-6">
              © 2025 EJJAR. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
