'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { client, urlFor } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'

export default function ScrollGallery() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [images, setImages] = useState<any[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  useEffect(() => {
    client.fetch(siteSettingsQuery).then((settings) => {
      if (settings?.homeGallery) {
        setImages(settings.homeGallery)
      }
    })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-16')
          }
        })
      },
      { threshold: 0.15 }
    )

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [images])

  if (images.length === 0) return null

  const slides = images.map((image) => ({
    src: urlFor(image).width(1920).url(),
    download: urlFor(image).width(1920).url(),
    alt: image.alt || 'Plan B',
  }))

  return (
    <section className="bg-cream py-16 md:py-32">
      <div className="max-w-6xl mx-auto px-4 md:px-0">

        <div className="text-center mb-10 md:mb-20">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red mb-4">
            On board
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-5xl font-bold text-navy">
            Life on <span className="italic whitespace-nowrap">Plan B</span>
          </h2>
        </div>

        <div className="space-y-10 md:space-y-24">
          {images.map((image, i) => (
            <div
              key={i}
              ref={(el: HTMLDivElement | null) => { itemRefs.current[i] = el }}
              className={`opacity-0 translate-y-16 transition-all duration-700 ease-out w-4/5 md:w-3/4 ${
                i % 2 === 0 ? 'mr-auto' : 'ml-auto'
              }`}
            >
              <div
                className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer group"
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={urlFor(image).width(1200).url()}
                  alt={image.alt || 'Plan B'}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity duration-200"
                  sizes="(max-width: 768px) 80vw, 75vw"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 md:mt-28">
          <a
            href="/gallery"
            className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase bg-red text-white px-8 py-3 hover:bg-red-light transition-colors duration-200 inline-block"
          >
            View full gallery
          </a>
        </div>

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
    </section>
  )
}
