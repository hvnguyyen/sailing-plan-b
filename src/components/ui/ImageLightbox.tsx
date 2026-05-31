'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import Video from 'yet-another-react-lightbox/plugins/video'
import 'yet-another-react-lightbox/styles.css'
import { urlFor } from '@/lib/sanity'
import type { SanityAsset } from '@/lib/types'

interface AlbumImage {
  asset: SanityAsset
  lqip?: string
}

interface VideoItem {
  url: string
}

interface Props {
  images: AlbumImage[]
  albumTitle: string
  videos?: VideoItem[]
}

type MediaItem =
  | { kind: 'image'; data: AlbumImage }
  | { kind: 'video'; data: VideoItem }

function interleave(images: AlbumImage[], videos: VideoItem[]): MediaItem[] {
  const imageItems: MediaItem[] = images.map((data) => ({ kind: 'image', data }))
  if (!videos.length) return imageItems

  const result: MediaItem[] = [...imageItems]
  const step = Math.max(1, Math.floor(images.length / (videos.length + 1)))
  videos.forEach((data, i) => {
    const pos = Math.min(step * (i + 1) + i, result.length)
    result.splice(pos, 0, { kind: 'video', data })
  })
  return result
}

export default function ImageLightbox({ images, albumTitle, videos = [] }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const items = interleave(images ?? [], videos ?? []).filter(item =>
    item.kind === 'image' ? !!item.data?.asset : !!item.data?.url
  )

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100')
            entry.target.classList.remove('opacity-0')
          }
        })
      },
      { threshold: 0.1 }
    )
    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  const slides = items.map((item) => {
    if (item.kind === 'image') {
      const url = urlFor(item.data).width(1920).url()
      return { src: url, download: url, alt: albumTitle }
    } else {
      return { type: 'video' as const, sources: [{ src: item.data.url, type: 'video/mp4' }] }
    }
  })

  return (
    <>
      <div className="columns-2 md:columns-2 lg:columns-3 gap-2 md:gap-6 space-y-2 md:space-y-6">
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => { itemRefs.current[i] = el }}
            className="break-inside-avoid cursor-pointer group opacity-0 transition-opacity duration-500 ease-out"
            onClick={() => setLightboxIndex(i)}
          >
            {item.kind === 'image' ? (
              <div className="relative w-full overflow-hidden">
                <Image
                  src={urlFor(item.data).width(800).url()}
                  alt={albumTitle}
                  width={800}
                  height={600}
                  placeholder={item.data.lqip ? 'blur' : 'empty'}
                  blurDataURL={item.data.lqip ?? undefined}
                  className="w-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="relative w-full overflow-hidden bg-navy/5" style={{ aspectRatio: '16/9' }}>
                <video
                  src={item.data.url + '#t=0.001'}
                  preload="metadata"
                  muted
                  playsInline
                  className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-navy ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Download, Video]}
        styles={{
          container: { backgroundColor: 'rgba(11, 31, 46, 0.97)' },
        }}
      />
    </>
  )
}
