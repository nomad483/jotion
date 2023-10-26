'use client'

import Link from 'next/link'

import { Button, Image } from '@/components/ui'

const Error = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/error.png"
        darkSrc="/error-dark.png"
        alt="Error"
        height={300}
        width={300}
      />
      <h2 className="text-xl">Something went wrong!</h2>
      <Button asChild>
        <Link href="/documents">Go Back</Link>
      </Button>
    </div>
  )
}

export default Error
