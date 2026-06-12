// EJJAR Design System v1.0 — Topbar
// bg-navy, Inter, orange action button, clean (no gradients)

import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bell, Globe } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

// ── Route → page meta ────────────────────────────────────────────────
interface PageMeta {
  title: string
  titleAr: string
  subtitle: string
  subtitleAr: string
}

const PAGE_META: Record<string, PageMeta> = {
  '/dashboard': { title: 'Dashboard',  titleAr: 'لوحة التحكم',          subtitle: 'Overview of your activity',          subtitleAr: 'نظرة عامة على نشاطك'   },
  '/rfqs':      { title: 'RFQ Inbox',  titleAr: 'طلبات عروض الأسعار',   subtitle: 'Manage incoming requests',            subtitleAr: 'إدارة الطلبات الواردة'  },
  '/rfqs/:id':  { title: 'RFQ Detail', titleAr: 'تفاصيل الطلب',         subtitle: 'Negotiation thread',                  subtitleAr: 'خيط التفاوض'             },
  '/resources': { title: 'Resources',  titleAr: 'الموارد',               subtitle: 'Your team and equipment',             subtitleAr: 'فريقك ومعداتك'           },
  '/jobs':      { title: 'Jobs',       titleAr: 'المهام',                subtitle: 'Active and completed work',           subtitleAr: 'العمل الجاري والمنجز'    },
  '/reviews':   { title: 'Reviews',    titleAr: 'التقييمات',             subtitle: 'Client feedback and ratings',         subtitleAr: 'آراء العملاء والتقييمات' },
  '/settings':  { title: 'Settings',   titleAr: 'الإعدادات',             subtitle: 'Account and company preferences',     subtitleAr: 'تفضيلات الحساب والشركة'  },
}

function getPageMeta(pathname: string): PageMeta {
  if (PAGE_META[pathname]) return PAGE_META[pathname]
  if (pathname.startsWith('/rfqs/')) return PAGE_META['/rfqs/:id']
  return { title: 'EJJAR', titleAr: 'إيجار', subtitle: 'Supplier Portal', subtitleAr: 'بوابة المورد' }
}

// ── Language switcher ────────────────────────────────────────────────
function LangToggle() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  const toggle = () => {
    const next = isAr ? 'en' : 'ar'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
    document.body.style.fontFamily = next === 'ar' ? 'Cairo, Inter, sans-serif' : ''
    localStorage.setItem('ejjar_supplier_lang', next)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-[11px] font-medium text-white/70 hover:text-white transition-colors h-8 px-2.5 rounded-[8px] hover:bg-white/[0.08]"
      aria-label="Switch language"
    >
      <Globe size={13} strokeWidth={1.75} />
      <span>{isAr ? 'EN' : 'عربي'}</span>
    </button>
  )
}

// ── Topbar ────────────────────────────────────────────────────────────
export function Topbar() {
  const { i18n }     = useTranslation()
  const { pathname } = useLocation()
  const supplierName = useAuthStore((s) => s.supplierName)
  const lang         = i18n.language
  const meta         = getPageMeta(pathname)

  return (
    <header className="h-14 flex-shrink-0 bg-navy flex items-center px-4 gap-3 border-b border-white/[0.06]">
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-white text-[17px] font-semibold leading-tight truncate">
          {lang === 'ar' ? meta.titleAr : meta.title}
        </h1>
        <p className="text-ink-dim text-[11px] leading-none mt-[2px] truncate">
          {lang === 'ar' ? meta.subtitleAr : meta.subtitle}
        </p>
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {supplierName && (
          <span className="hidden sm:inline-flex items-center text-[11px] font-medium text-white/80 bg-white/[0.08] px-2.5 h-7 rounded-[8px] max-w-[140px] truncate">
            {supplierName}
          </span>
        )}

        <LangToggle />

        <button
          className="flex items-center justify-center w-8 h-8 rounded-[8px] text-white/60 hover:text-white hover:bg-white/[0.08] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={15} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
