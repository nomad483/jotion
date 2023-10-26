import { ReactNode } from 'react'

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return <div className="w-full dark:bg-[#1F1F1F]">{children}</div>
}

export default PublicLayout
