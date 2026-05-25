'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { urlFor } from '@/lib/sanity'

interface VideoItem {
  url: string
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
    alt: albumTitle,
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
                    alt={albumTitle}
                    width={800}
                    height={600}
                    placeholder={item.data.lqip ? 'blur' : 'empty'}
                    blurDataURL={item.data.lqip ?? undefined}
                    className="w-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
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
          {/* Toolbar */}
          <div
            className="absolute top-0 right-0 flex items-center gap-1 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <a
              href={activeVideo}
              download
              className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors"
              title="Download"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
            <button
              className="flex items-center justify-center w-10 h-10 text-white/70 hover:text-white transition-colors"
              onClick={() => setActiveVideo(null)}
              title="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

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
