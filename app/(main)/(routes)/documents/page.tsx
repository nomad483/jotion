'use client'

import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { ButtonWithImage, Image } from '@/components/ui'
import { api } from '@/convex/_generated/api'

const DocumentsPage = () => {
  const router = useRouter()
  const { user } = useUser()
  const create = useMutation(api.documents.create)

  const onCreate = () => {
    const promise = create({
      title: 'Untitled',
    }).then((documentId) => {
      router.push(`/documents/${documentId}`)
    })

    toast.promise(promise, {
      loading: 'Creating document...',
      success: 'Document created!',
      error: 'Failed to create document',
    })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        alt="Empty"
        height="300"
        width="300"
        darkSrc="/empty-dark.png"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion
      </h2>
      <ButtonWithImage onClick={onCreate} image={PlusCircle}>
        Create a note
      </ButtonWithImage>
    </div>
  )
}

export default DocumentsPage
