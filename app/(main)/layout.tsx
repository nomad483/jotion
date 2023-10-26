'use client'

import { ReactNode } from 'react'
import { useConvexAuth } from 'convex/react'
import { redirect } from 'next/navigation'

import { SearchCommand } from '@/components/common/search-command'
import { Spinner } from '@/components/common/spinner'

import { Navigation } from './_components'

interface Props {
  children: ReactNode
}

const MainLayout = ({ children }: Props) => {
  const { isLoading, isAuthenticated } = useConvexAuth()

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center dark:bg-[#1F1F1F]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return redirect('/')
  }

  return (
    <div className="h-full flex dark:bg-[#1F1F1F]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  )
}

export default MainLayout
