import { Image } from '@/components/ui'

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <Image
            src="/documents.png"
            alt="Documents"
            fill
            className="object-contain"
            darkSrc="/documents-dark.png"
          />
        </div>
        <div className="relative h-[400px] w-[400px] hidden md:block">
          <Image
            src="/reading.png"
            alt="Reading"
            fill
            className="object-contain"
            darkSrc="/reading-dark.png"
          />
        </div>
      </div>
    </div>
  )
}
