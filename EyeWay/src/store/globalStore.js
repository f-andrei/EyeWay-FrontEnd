import { create } from "zustand";


export const useStore = create((set) => ({
    isAuthenticated: false,

    setAuthenticated: (authenticated) => set((state) => ({ isAuthenticated: authenticated })),
    setUserId: (user_id) => set((state) => ({ user_id: user_id})),
    user_id: 0,
  }))
  
  