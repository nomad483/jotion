'use client'

import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

import { Banner } from './banner'
import { Menu } from './menu'
import { Publish } from './publish'
import { Title } from './title'

interface Props {
  isCollapsed: boolean
  resetWidth: VoidFunction
}

export const Navbar = ({ isCollapsed, resetWidth }: Props) => {
  const params = useParams()

  const document = useQuery(api.documents.getById, {
    id: params.documentId as Id<'documents'>,
  })

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    )
  }

  if (document === null) {
    return null
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            className="w-6 h-6 text-muted-foreground"
            onClick={resetWidth}
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={document} />
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  )
}
