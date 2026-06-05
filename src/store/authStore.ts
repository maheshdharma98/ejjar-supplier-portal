import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  phone: string | null
  supplierName: string
  supplierId: string
  login: (phone: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      phone: null,
      supplierName: 'Gulf Construction Services LLC',
      supplierId: 'sup-001',
      login: (phone) => set({ isAuthenticated: true, phone }),
      logout: () => set({ isAuthenticated: false, phone: null }),
    }),
    { name: 'ejjar-auth' }
  )
)
