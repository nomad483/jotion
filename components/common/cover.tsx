'use client'

import { useMutation } from 'convex/react'
import { ImageIcon, X } from 'lucide-react'
import { useParams } from 'next/navigation'

import { ButtonWithImage, Image, Skeleton } from '@/components/ui'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useCoverImage } from '@/hooks'
import { useEdgeStore } from '@/lib/edgestore'
import { cn } from '@/lib/utils'

interface Props {
  url?: string
  preview?: boolean
}

export const Cover = ({ url, preview }: Props) => {
  const { edgestore } = useEdgeStore()
  const params = useParams()
  const coverImage = useCoverImage()

  const removeCoverImage = useMutation(api.documents.removeCoverIcon)

  const handleOpenCover = (url: string) => {
    coverImage.onReplace(url)
  }

  const onRemove = async () => {
    if (url) {
      await edgestore.publicFiles.delete({ url })
    }

    removeCoverImage({
      id: params.documentId as Id<'documents'>,
    })
  }

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {!!url && <Image src={url} alt="Cover" fill className="object-cover" />}
      {!!url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <ButtonWithImage
            onClick={() => handleOpenCover(url)}
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
            image={ImageIcon}
          >
            Change cover
          </ButtonWithImage>
          <ButtonWithImage
            onClick={onRemove}
            variant="outline"
            size="sm"
            className="text-muted-foreground text-xs"
            image={X}
          >
            Remove cover
          </ButtonWithImage>
        </div>
      )}
    </div>
  )
}

Cover.Skeleton = () => <Skeleton className="w-full h-[12vh]" />
