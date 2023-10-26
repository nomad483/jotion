import { create } from 'zustand'

type Store = {
  isOpen: boolean
  onOpen: VoidFunction
  onClose: VoidFunction
  toggle: VoidFunction
}

export const useSearch = create<Store>((set, get) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set({ isOpen: !get().isOpen }),
}))
