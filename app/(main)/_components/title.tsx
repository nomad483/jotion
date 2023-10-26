'use client'

import {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useRef,
  useState,
} from 'react'
import { useMutation } from 'convex/react'

import { Button, Input, Skeleton } from '@/components/ui'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'

interface Props {
  initialData: Doc<'documents'>
}

export const Title = ({ initialData }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialData.title || 'Untitled')

  const inputRef = useRef<HTMLInputElement>(null)

  const update = useMutation(api.documents.update)

  const handleEnableInput = () => {
    setTitle(initialData.title)
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length)
    }, 0)
  }
  const handleDisableInput = () => {
    setIsEditing(false)
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
    update({ id: initialData._id, title: event.target.value || 'Untitled' })
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleDisableInput()
    }
  }

  return (
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={handleEnableInput}
          onBlur={handleDisableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent"
        />
      ) : (
        <Button
          onClick={handleEnableInput}
          variant="ghost"
          size="sm"
          className="font-normal h-auto p-1"
        >
          <span className="truncate">{initialData.title}</span>
        </Button>
      )}
    </div>
  )
}

Title.Skeleton = () => {
  return <Skeleton className="h-9 w-20 rounded-md" />
}
