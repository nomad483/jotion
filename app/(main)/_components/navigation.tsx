'use client'

import {
  ElementRef,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useMutation } from 'convex/react'
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useMediaQuery } from 'usehooks-ts'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui'
import { api } from '@/convex/_generated/api'
import { useSearch, useSettings } from '@/hooks'
import { cn } from '@/lib/utils'

import { DocumentList } from './document-list'
import { Item } from './item'
import { Navbar } from './navbar'
import { TrashBox } from './trash-box'
import { UserItem } from './user-item'

export const Navigation = () => {
  const router = useRouter()
  const search = useSearch()
  const settings = useSettings()
  const params = useParams()
  const pathname = usePathname()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const create = useMutation(api.documents.create)

  const [isResetting, setIsResetting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(isMobile)
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<ElementRef<'aside'>>(null)
  const navbarRef = useRef<ElementRef<'div'>>(null)

  const resetWidth = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false)
      setIsResetting(true)

      sidebarRef.current.style.width = isMobile ? '100%' : `240px`
      navbarRef.current.style.left = isMobile ? '100%' : `240px`
      navbarRef.current.style.width = isMobile ? '0' : `calc(100% - 240px)`

      setTimeout(() => setIsResetting(false), 300)
    }
  }, [isMobile])

  const collapse = useCallback(() => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true)
      setIsResetting(true)

      sidebarRef.current.style.width = '0'
      navbarRef.current.style.left = '0'
      navbarRef.current.style.width = '100%'

      setTimeout(() => setIsResetting(false), 300)
    }
  }, [])

  useEffect(() => {
    if (isMobile) {
      collapse()
    }

    if (!isMobile) {
      resetWidth()
    }
  }, [isMobile, resetWidth, collapse, pathname])

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) {
      return
    }

    let newWidth = event.clientX

    if (newWidth < 240) {
      newWidth = 240
    }

    if (newWidth > 480) {
      newWidth = 480
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`
      navbarRef.current.style.left = `${newWidth}px`
      navbarRef.current.style.width = `calc(100% - ${newWidth}px)`
    }
  }

  const handleMouseUp = () => {
    isResizingRef.current = false

    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDown = (
    event: ReactMouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault()
    event.stopPropagation()

    isResizingRef.current = true
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleCreate = () => {
    const promise = create({ title: 'Untitled' }).then((documentId) => {
      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: 'Creating document...',
      success: 'Document created!',
      error: 'Failed to create document',
    })
  }

  const handleSearchOpen = () => {
    search.onOpen()
  }

  const handleSettingsOpen = () => {
    settings.onOpen()
  }

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0'
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 transition absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100',
            isMobile && 'opacity-100'
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item
            label="Search"
            icon={Search}
            isSearch
            onClick={handleSearchOpen}
          />
          <Item label="Settings" icon={Settings} onClick={handleSettingsOpen} />
          <Item onClick={handleCreate} label="New Page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item label="Add a page" onClick={handleCreate} icon={Plus} />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? 'bottom' : 'right'}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-full left-0'
        )}
      >
        {params.documentId ? (
          <Navbar isCollapsed={isCollapsed} resetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="w-6 h-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  )
}
