'use client'

import { useState } from 'react'
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

  const slides = images.map((image) => ({
    src: urlFor(image).width(1920).url(),
    download: urlFor(image).width(1920).url(),
    alt: image.alt || albumTitle,
  }))

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
        {images.map((image, i) => (
          <div
            key={i}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => setIndex(i)}
          >
            <div className="relative w-full overflow-hidden">
              <Image
                src={urlFor(image).width(800).url()}
                alt={image.alt || albumTitle}
                width={800}
                height={600}
                className="w-full object-cover group-hover:opacity-90 transition-opacity duration-200"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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