import { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button, ButtonProps } from './button'

interface Props extends ButtonProps {
  image?: LucideIcon
  rightImage?: boolean
}

export const ButtonWithImage = forwardRef<HTMLButtonElement, Props>(
  ({ image: ButtonImage, rightImage, children, ...props }, ref) => {
    const marginClass = rightImage ? 'ml-2' : 'mr-2'
    const LucideImage = () =>
      ButtonImage && (
        <ButtonImage className={cn('w-4 h-4', children && marginClass)} />
      )
    return (
      <Button {...props} ref={ref}>
        {!rightImage && <LucideImage />}
        {children}
        {rightImage && <LucideImage />}
      </Button>
    )
  }
)

ButtonWithImage.displayName = 'ButtonWithImage'
