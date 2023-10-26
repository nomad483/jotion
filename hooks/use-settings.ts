import { create } from 'zustand'

type Store = {
  isOpen: boolean
  onOpen: VoidFunction
  onClose: VoidFunction
}
export const useSettings = create<Store>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
