import { create } from 'zustand'

import { UserProps } from '@/entities'

type UserStore = {
  user?: UserProps.ItemFull | null
  setUser: (user?: UserProps.ItemFull | null) => void
}

export const useUserStore = create<UserStore>((set) => ({
  setUser: (user) => set((state) => ({ ...state, user }))
}))
