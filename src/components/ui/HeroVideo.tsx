'use client'

import { useEffect, useRef } from 'react'

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // React doesn't reliably set the muted attribute on video elements — set it directly
    video.muted = true

    const tryPlay = () => {
      video.muted = true
      video.play().catch(() => {})
    }

    // canplay fires when browser has enough data; loadeddata is an earlier fallback
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('loadeddata', tryPlay)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        video.load()
        tryPlay()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Force the browser to start loading (iOS ignores preload="auto" by default)
    video.load()
    tryPlay()

    return () => {
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('loadeddata', tryPlay)
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
