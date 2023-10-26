import { ReactNode } from 'react'

import { Navbar } from './_components'

interface Props {
  children: ReactNode
}

const MarketingLayout = ({ children }: Props) => {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <Navbar />
      <main className="h-full pt-40">{children}</main>
    </div>
  )
}

export default MarketingLayout
