import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { albumsQuery } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from the journey, shot by Karen on board Plan B.',
}

export const revalidate = 60

export default async function GalleryPage() {
  const albums = await client.fetch(albumsQuery)

  return (
    <main className="bg-cream">

      {/* Header */}
      <section className="bg-navy text-white pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20 lg:pb-24 px-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-4">
          The gallery
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-8xl font-bold leading-[0.95]">
          Gallery
        </h1>
        <p className="font-[family-name:var(--font-lora)] italic text-sand/60 text-base md:text-lg mt-4 md:mt-6">
          For the stalkers.
        </p>
      </section>

      {/* Albums grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {albums.length === 0 ? (
          <div className="text-center">
            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl italic text-navy/30">
              No albums yet — photos are coming.
            </p>
          </div>
        ) : (
          <>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red mb-8">
            Albums
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {albums.map((album: any) => (
              <Link
                key={album._id}
                href={`/gallery/${album.slug.current}`}
                className="group block"
              >
                {/* Cover image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/10">
                  {album.coverImage ? (
                    <Image
                      src={urlFor(album.coverImage).width(800).url()}
                      alt={album.title}
                      fill
                      placeholder={album.coverLqip ? 'blur' : 'empty'}
                      blurDataURL={album.coverLqip ?? undefined}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30">
                        No cover
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="pt-4">
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy group-hover:italic transition-all duration-200">
                    {album.title}
                  </h2>
                  {album.description && (
                    <p className="font-[family-name:var(--font-lora)] italic text-navy/50 text-sm mt-1">
                      {album.description}
                    </p>
                  )}
                  <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-navy/30 mt-2">
                    {album.imageCount} {album.imageCount === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          </>
        )}
      </section>

    </main>
  )
}