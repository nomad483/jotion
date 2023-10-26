'use client'

import {
  ElementRef,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
} from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { useMutation } from 'convex/react'
import { ImageIcon, Smile, X } from 'lucide-react'

import { IconPicker } from '@/components/common/icon-picker'
import { ButtonWithImage } from '@/components/ui'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { useCoverImage } from '@/hooks'

interface Props {
  initialData: Doc<'documents'>
  preview?: boolean
}

export const Toolbar = ({ initialData, preview }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialData.title)

  const inputRef = useRef<ElementRef<'textarea'>>(null)

  const update = useMutation(api.documents.update)
  const removeIcon = useMutation(api.documents.removeIcon)

  const coverImage = useCoverImage()

  const enableInput = () => {
    if (preview) {
      return
    }

    setIsEditing(true)
    setTimeout(() => {
      setValue(initialData.title)
      inputRef.current?.focus()
    }, 0)
  }

  const disableInput = () => setIsEditing(false)

  const onInput = (value: string) => {
    setValue(value)
    update({ id: initialData._id, title: value })
  }

  const onKeyDown = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      disableInput()
    }
  }

  const onIconSelect = (icon: string) => {
    update({ id: initialData._id, icon })
  }

  const onRemoveIcon = () => {
    removeIcon({ id: initialData._id })
  }

  const handleOpenCoverImage = () => {
    coverImage.onOpen()
  }

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <ButtonWithImage
            onClick={onRemoveIcon}
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
            image={X}
          />
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelect} asChild>
            <ButtonWithImage
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
              image={Smile}
            >
              Add icon
            </ButtonWithImage>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <ButtonWithImage
            onClick={handleOpenCoverImage}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
            image={ImageIcon}
          >
            Add cover image
          </ButtonWithImage>
        )}
      </div>
      {isEditing && !preview ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className="text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  )
}
