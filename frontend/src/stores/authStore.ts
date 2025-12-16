import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'admin' | 'CUSTOMER' | 'ADMIN'
}

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
}))

