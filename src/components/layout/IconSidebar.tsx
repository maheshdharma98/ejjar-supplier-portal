// EJJAR Design System v1.0 applied
// Last updated: 2026-06-11
// Tokens: tailwind.config.js → navy / brand-orange / brand-sky / ink

import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, FileText, Boxes,
  Briefcase, Star, Settings, LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import logoMarkSrc from '@/assets/Ejjar_logo_outlinwhite.svg'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard', tourId: undefined        },
  { to: '/rfqs',      icon: FileText,        key: 'rfqs',      tourId: 'tour-sidebar-rfqs'  },
  { to: '/resources', icon: Boxes,           key: 'resources', tourId: undefined        },
  { to: '/jobs',      icon: Briefcase,       key: 'jobs',      tourId: 'tour-sidebar-jobs'  },
  { to: '/reviews',   icon: Star,            key: 'reviews',   tourId: 'tour-sidebar-reviews'},
]

// ── Hover tooltip ─────────────────────────────────────────────────────
function Tooltip({ label, visible }: { label: string; visible: boolean }) {
  if (!visible) return null
  return (
    <div
      className="absolute start-[54px] top-1/2 -translate-y-1/2 z-50 pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative bg-navy text-white text-[11px] font-medium px-2.5 py-1.5 rounded-[8px] whitespace-nowrap shadow-card border border-white/10">
        {label}
        {/* Pointing triangle toward the icon */}
        <span className="absolute end-full top-1/2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent ltr:border-r-[4px] ltr:border-r-navy rtl:border-l-[4px] rtl:border-l-navy" />
      </div>
    </div>
  )
}

// ── Single nav item ───────────────────────────────────────────────────
function NavItem({
  to, icon: Icon, label, tourId,
}: {
  to: string; icon: React.ElementType; label: string; tourId?: string
}) {
  const [hovered, setHovered] = useState(false)
  const { pathname } = useLocation()
  const isActive = pathname === to || (to !== '/dashboard' && pathname.startsWith(to + '/'))

  return (
    <div
      className="relative w-16 flex justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavLink
        to={to}
        id={tourId}
        end={to === '/dashboard'}
        aria-label={label}
        className={cn(
          'flex items-center justify-center w-11 h-11 rounded-[10px] transition-colors duration-150',
          isActive
            ? 'text-brand-orange bg-[rgba(230,126,58,0.10)]'
            : 'text-ink-dim hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
        )}
      >
        <Icon size={19} strokeWidth={1.75} />
      </NavLink>

      {/* Right-edge accent bar for active state */}
      {isActive && (
        <span className="absolute end-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-brand-orange pointer-events-none rounded-tl-[3px] rounded-bl-[3px] rtl:rounded-tl-none rtl:rounded-bl-none rtl:rounded-tr-[3px] rtl:rounded-br-[3px]" />
      )}

      <Tooltip label={label} visible={hovered} />
    </div>
  )
}

// ── Bottom utility button (Settings / Logout) ─────────────────────────
function UtilButton({
  icon: Icon, label, to, onClick,
}: {
  icon: React.ElementType; label: string; to?: string; onClick?: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const { pathname } = useLocation()
  const isActive = to ? pathname === to : false

  const cls = cn(
    'flex items-center justify-center w-11 h-11 rounded-[10px] transition-colors duration-150',
    isActive
      ? 'text-brand-orange bg-[rgba(230,126,58,0.10)]'
      : 'text-ink-dim hover:text-white hover:bg-[rgba(255,255,255,0.06)]'
  )

  return (
    <div
      className="relative w-16 flex justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {to ? (
        <NavLink to={to} className={cls} aria-label={label}>
          <Icon size={19} strokeWidth={1.75} />
        </NavLink>
      ) : (
        <button onClick={onClick} className={cls} aria-label={label}>
          <Icon size={19} strokeWidth={1.75} />
        </button>
      )}
      {isActive && (
        <span className="absolute end-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-brand-orange pointer-events-none rounded-tl-[3px] rounded-bl-[3px]" />
      )}
      <Tooltip label={label} visible={hovered} />
    </div>
  )
}

// ── Sidebar shell ─────────────────────────────────────────────────────
export function IconSidebar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const logout   = useAuthStore((s) => s.logout)

  return (
    <aside className="w-16 flex-shrink-0 flex flex-col bg-navy h-full z-40 overflow-visible">
      {/* Logo mark — EJJAR outline on navy */}
      <div className="h-14 flex items-center justify-center flex-shrink-0">
        <img
          src={logoMarkSrc}
          alt="EJJAR"
          className="h-8 w-auto select-none"
          draggable={false}
        />
      </div>

      {/* Primary nav */}
      <nav className="flex-1 flex flex-col items-center pt-1 gap-0.5 overflow-y-auto overflow-x-visible">
        {NAV_ITEMS.map(({ to, icon, key, tourId }) => (
          <NavItem key={to} to={to} icon={icon} label={t(`nav.${key}`)} tourId={tourId} />
        ))}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="flex flex-col items-center pb-3 gap-0.5 flex-shrink-0 border-t border-white/5 pt-2">
        <UtilButton icon={Settings} label={t('nav.settings')} to="/settings" />
        <UtilButton icon={LogOut}   label={t('nav.logout')}   onClick={() => { logout(); navigate('/login') }} />
      </div>
    </aside>
  )
}
