import { useEffect, useState } from 'react'

export const useScrollTop = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const isScrolled = window.scrollY > threshold
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return scrolled
}
