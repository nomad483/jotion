import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { ConfirmModal } from '@/components/modals'
import { Button } from '@/components/ui'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

interface Props {
  documentId: Id<'documents'>
}

export const Banner = ({ documentId }: Props) => {
  const router = useRouter()

  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)

  const onRemove = () => {
    const promise = remove({ id: documentId })

    toast.promise(promise, {
      loading: 'Removing...',
      success: 'Removed!',
      error: 'Failed to remove.',
    })

    router.push('/documents')
  }

  const onRestore = () => {
    const promise = restore({ id: documentId })

    toast.promise(promise, {
      loading: 'Restoring...',
      success: 'Restored!',
      error: 'Failed to restore.',
    })
  }

  return (
    <div className="flex items-center justify-center gap-x-2 w-full bg-rose-500 text-center text-sm p-2 text-white">
      <p>This page is in the Trash</p>
      <Button
        size="sm"
        onClick={onRestore}
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="sm"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  )
}
