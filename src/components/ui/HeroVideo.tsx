'use client'

import { useEffect, useRef } from 'react'

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // React doesn't reliably write muted to the DOM on iOS
    video.muted = true

    const tryPlay = () => {
      video.muted = true
      video.play().catch(() => {})
    }

    // Play once the browser has buffered enough
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('loadeddata', tryPlay)

    // Resume when the user comes back to the tab/app
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Catch unexpected pauses from iOS background/foreground transitions
    const onPause = () => {
      setTimeout(() => {
        if (!video.ended && document.visibilityState === 'visible') tryPlay()
      }, 150)
    }
    video.addEventListener('pause', onPause)

    // iOS Low Power Mode blocks all autoplay — start on first user touch instead
    document.addEventListener('touchstart', tryPlay, { once: true })
    document.addEventListener('click', tryPlay, { once: true })

    video.load()
    tryPlay()

    return () => {
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('pause', onPause)
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('touchstart', tryPlay)
      document.removeEventListener('click', tryPlay)
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
