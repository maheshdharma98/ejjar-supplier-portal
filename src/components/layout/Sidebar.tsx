import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutDashboard, FileText, Boxes, Briefcase, Star, Settings, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import ejjarLogoWhite from '@/assets/Ejjar_logo_white.svg'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard', tourId: undefined },
  { to: '/rfqs', icon: FileText, key: 'rfqs', tourId: 'tour-sidebar-rfqs' },
  { to: '/resources', icon: Boxes, key: 'resources', tourId: undefined },
  { to: '/jobs', icon: Briefcase, key: 'jobs', tourId: 'tour-sidebar-jobs' },
  { to: '/reviews', icon: Star, key: 'reviews', tourId: 'tour-sidebar-reviews' },
  { to: '/settings', icon: Settings, key: 'settings', tourId: undefined },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        // JS-driven RTL: avoids Tailwind variant CSS-scan timing issues
        ...(isRtl ? { right: 0 } : { left: 0 }),
      }}
      className={cn(
        'flex h-screen w-60 flex-col bg-[#0F172A] text-white z-40 transition-transform duration-300',
        // Mobile: slide off-canvas when closed, visible when open; Desktop: always visible
        open
          ? 'translate-x-0'
          : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex flex-col gap-1 min-w-0">
          <img src={ejjarLogoWhite} alt="EJJAR" style={{ height: '40px', width: 'auto' }} />
          <div className="text-xs text-slate-400 leading-tight truncate">{t('login.title')}</div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden shrink-0 p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, key, tourId }) => (
          <NavLink
            key={to}
            to={to}
            id={tourId}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#192433] text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
