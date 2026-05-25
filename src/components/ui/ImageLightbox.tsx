'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { urlFor } from '@/lib/sanity'

interface VideoItem {
  url: string
  caption?: string
}

interface Props {
  images: any[]
  albumTitle: string
  videos?: VideoItem[]
}

type MediaItem =
  | { kind: 'image'; data: any; imageIndex: number }
  | { kind: 'video'; data: VideoItem }

function interleave(images: any[], videos: VideoItem[]): MediaItem[] {
  const imageItems: MediaItem[] = images.map((data, imageIndex) => ({ kind: 'image', data, imageIndex }))
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
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const items = interleave(images ?? [], videos ?? [])

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

  const slides = images.map((image) => ({
    src: urlFor(image).width(1920).url(),
    download: urlFor(image).width(1920).url(),
    alt: image.alt || albumTitle,
  }))

  return (
    <>
      <div className="columns-2 md:columns-2 lg:columns-3 gap-2 md:gap-6 space-y-2 md:space-y-6">
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => { itemRefs.current[i] = el }}
            className="break-inside-avoid cursor-pointer group opacity-0 transition-opacity duration-500 ease-out"
            onClick={() => {
              if (item.kind === 'image') setLightboxIndex(item.imageIndex)
              else setActiveVideo(item.data.url)
            }}
          >
            {item.kind === 'image' ? (
              <>
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={urlFor(item.data).width(800).url()}
                    alt={item.data.alt || albumTitle}
                    width={800}
                    height={600}
                    placeholder={item.data.lqip ? 'blur' : 'empty'}
                    blurDataURL={item.data.lqip ?? undefined}
                    className="w-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                {(item.data.location || item.data.caption) && (
                  <div className="mt-2 flex flex-col gap-0.5">
                    {item.data.location && (
                      <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red">
                        {item.data.location}
                      </p>
                    )}
                    {item.data.caption && (
                      <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-navy/30">
                        {item.data.caption}
                      </p>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
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
                {item.data.caption && (
                  <p className="mt-2 font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-navy/30">
                    {item.data.caption}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Download]}
        styles={{
          container: { backgroundColor: 'rgba(11, 31, 46, 0.97)' },
        }}
      />

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(11, 31, 46, 0.97)' }}
          onClick={() => setActiveVideo(null)}
        >
          <video
            src={activeVideo}
            controls
            autoPlay
            playsInline
            className="max-w-full"
            style={{ maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
