'use client'

import { useEffect, useRef } from 'react'

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const tryPlay = () => video.play().catch(() => {})

    // Play as soon as the browser has enough data
    video.addEventListener('canplay', tryPlay)

    // Resume when user comes back to the tab / app
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Also try immediately in case it's already ready
    tryPlay()

    return () => {
      video.removeEventListener('canplay', tryPlay)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <video
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
    />
  )
}
