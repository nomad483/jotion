import { Poppins } from 'next/font/google'

import { Image } from '@/components/ui'
import { cn } from '@/lib/utils'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
})

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        alt="Logo"
        height="40"
        width="40"
        darkSrc="/logo-dark.svg"
      />
      <p className={cn('font-semibold', font.className)}>Jotion</p>
    </div>
  )
}
