'use client'

import { MouseEvent as ReactMouseEvent } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from '@/components/ui'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'

interface Props {
  id?: Id<'documents'>
  documentIcon?: string
  active?: boolean
  expanded?: boolean
  isSearch?: boolean
  level?: number
  onExpand?: VoidFunction
  onClick?: VoidFunction
  label: string
  icon: LucideIcon
}

export const Item = ({
  id,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
  onClick,
  label,
  icon: Icon,
}: Props) => {
  const router = useRouter()
  const create = useMutation(api.documents.create)
  const { user } = useUser()
  const archive = useMutation(api.documents.archive)

  const onArchive = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()

    if (!id) {
      return
    }

    const promise = archive({
      id: id,
    }).then(() => {
      router.push('/documents')
    })

    toast.promise(promise, {
      loading: 'Archiving document...',
      success: 'Document archived!',
      error: 'Failed to archive document',
    })
  }
  const handleExpand = (event: ReactMouseEvent) => {
    event.stopPropagation()
    onExpand?.()
  }

  const onCreate = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()

    if (!id) {
      return
    }

    const promise = create({
      title: 'Untitled',
      parentDocument: id,
    }).then((documentId) => {
      if (!expanded) {
        onExpand?.()
      }

      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: 'Creating document...',
      success: 'Document created!',
      error: 'Failed to create document',
    })
  }

  const ChevronIcon = expanded ? ChevronDown : ChevronRight
  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: `${(level + 1) * 12}px` }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {!!id && (
        <div
          role="button"
          onClick={handleExpand}
          className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60 dark:bg-[#1F1F1F]"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            role="button"
            onClick={onCreate}
            className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

Item.Skeleton = ({ level }: { level: number }) => (
  <div
    style={{ paddingLeft: level ? `${level * 12 + 25}px` : '12px' }}
    className="flex gap-x-2 py-[3px]"
  >
    <Skeleton className="h-4 w-4" />
    <Skeleton className="h-4 w-[30%]" />
  </div>
)
