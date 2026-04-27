import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (adminData, token) => set({
        admin: adminData,
        token: token,
        isAuthenticated: true,
      }),

      logout: () => set({
        admin: null,
        token: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'ypark-admin-auth',
    }
  )
)

export default useAuthStore