import { create } from 'zustand'
import type { User, AuthState } from '@/types/auth'
import { tokenManager } from '@/utils/token'

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      tokenManager.set(token)
    }
    set({ token })
  },
  logout: () => {
    tokenManager.remove()
    set({ user: null, token: null })
  },
}))
