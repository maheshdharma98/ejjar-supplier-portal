import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/store/authStore'
import { SUPPLIER_PROFILE } from '../../data/supplierDemoData'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const displayName = i18n.language === 'ar' ? SUPPLIER_PROFILE.companyAr : SUPPLIER_PROFILE.company

  function switchLang() {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.body.style.fontFamily = next === 'ar' ? 'Cairo, sans-serif' : 'inherit'
    localStorage.setItem('ejjar_supplier_lang', next)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = SUPPLIER_PROFILE.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <header className="h-14 border-b bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Hidden spacer on desktop so right-side items stay right */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={switchLang}
          className="text-sm font-medium text-slate-600 hover:text-[#192433] transition-colors px-2 py-1 rounded whitespace-nowrap"
        >
          {i18n.language === 'en' ? 'EN | عربي' : 'عربي | EN'}
        </button>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-[#192433] text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:block text-sm font-medium text-slate-700 max-w-[160px] truncate">
            {displayName}
          </span>
        </div>

        <Button variant="ghost" size="icon" onClick={handleLogout} title={t('nav.logout')}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
