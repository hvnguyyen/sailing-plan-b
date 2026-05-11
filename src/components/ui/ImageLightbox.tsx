'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { urlFor } from '@/lib/sanity'

interface Props {
  images: any[]
  albumTitle: string
}

export default function ImageLightbox({ images, albumTitle }: Props) {
  const [index, setIndex] = useState(-1)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

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
  }, [images])

  const slides = images.map((image) => ({
    src: urlFor(image).width(1920).url(),
    download: urlFor(image).width(1920).url(),
    alt: image.alt || albumTitle,
  }))

  return (
    <>
      <div className="columns-2 md:columns-2 lg:columns-3 gap-2 md:gap-6 space-y-2 md:space-y-6">
        {images.map((image, i) => (
          <div
            key={i}
            ref={(el: HTMLDivElement | null) => { itemRefs.current[i] = el }}
            className="break-inside-avoid cursor-pointer group opacity-0 transition-opacity duration-500 ease-out"
            onClick={() => setIndex(i)}
          >
            <div className="relative w-full overflow-hidden">
              <Image
                src={urlFor(image).width(800).url()}
                alt={image.alt || albumTitle}
                width={800}
                height={600}
                placeholder={image.lqip ? 'blur' : 'empty'}
                blurDataURL={image.lqip ?? undefined}
                className="w-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {(image.location || image.caption) && (
              <div className="mt-2 flex flex-col gap-0.5">
                {image.location && (
                  <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red">
                    {image.location}
                  </p>
                )}
                {image.caption && (
                  <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-navy/30">
                    {image.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Download]}
        styles={{
          container: { backgroundColor: 'rgba(11, 31, 46, 0.97)' },
        }}
      />
    </>
  )
}
