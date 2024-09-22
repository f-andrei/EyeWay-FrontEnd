import { create } from "zustand";


export const useStore = create((set) => ({
    isAuthenticated: false,

    setAuthenticated: (authenticated) => set((state) => ({ isAuthenticated: authenticated }))

  }))
  
  