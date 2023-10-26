import NextImage, { ImageProps } from 'next/image'

import { cn } from '@/lib/utils'

interface Props extends ImageProps {
  darkSrc?: string
}

export const Image = ({ darkSrc, src, alt, ...props }: Props) => {
  return (
    <>
      <NextImage
        src={src}
        alt={alt}
        {...props}
        className={cn(darkSrc && 'dark:hidden', props.className)}
      />
      {darkSrc && (
        <NextImage
          src={darkSrc}
          alt={alt}
          {...props}
          className={cn('hidden dark:block', props.className)}
        />
      )}
    </>
  )
}
