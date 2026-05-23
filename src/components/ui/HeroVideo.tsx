'use client'

import { useEffect, useRef } from 'react'

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // React doesn't reliably write the muted attribute to the DOM on iOS
    video.muted = true

    const tryPlay = () => {
      video.muted = true
      video.play().catch(() => {})
    }

    // Fire when the browser has buffered enough to start
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('loadeddata', tryPlay)

    // iOS pauses the video when you switch apps — resume when the tab comes back
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Catch any unexpected pause (iOS background/foreground transitions)
    const onPause = () => {
      setTimeout(() => {
        if (!video.ended && document.visibilityState === 'visible') tryPlay()
      }, 150)
    }
    video.addEventListener('pause', onPause)

    // Force the browser to start loading, then try to play
    video.load()
    tryPlay()

    return () => {
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('pause', onPause)
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
