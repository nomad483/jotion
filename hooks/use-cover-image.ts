import { create } from 'zustand'

type Store = {
  url?: string
  isOpen: boolean
  onOpen: VoidFunction
  onClose: VoidFunction
  onReplace: (url: string) => void
}

export const useCoverImage = create<Store>((set) => ({
  url: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true, url: undefined }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url }),
}))
