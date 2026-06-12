// EJJAR Design System v1.0 applied
import { Outlet } from 'react-router-dom'
import { IconSidebar } from './IconSidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <IconSidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        {/* py-[14px] px-4 = 14px top/bottom, 16px left/right per spec */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden py-[14px] px-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
