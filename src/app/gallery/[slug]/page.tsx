import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import { albumBySlugQuery, albumsQuery } from '@/lib/queries'
import ImageLightbox from '@/components/ui/ImageLightbox'

export const revalidate = 60

export async function generateStaticParams() {
  const albums = await client.fetch(albumsQuery)
  return albums.map((album: any) => ({ slug: album.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const album = await client.fetch(albumBySlugQuery, { slug })
  if (!album) return {}
  const description = album.description || `Photos from ${album.title}`
  const ogImage = album.coverImage ? urlFor(album.coverImage).width(1200).url() : undefined
  return {
    title: album.title,
    description,
    openGraph: {
      title: album.title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: album.title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const album = await client.fetch(albumBySlugQuery, { slug })

  if (!album) return <div>Album not found</div>

  const hasSubAlbums = album.subAlbums && album.subAlbums.length > 0
  const hasImages = album.images && album.images.length > 0
  const hasVideos = album.videos && album.videos.length > 0

  return (
    <main className="bg-cream">

      {/* Header */}
      <section className="bg-navy text-white pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20 px-8 text-center">
        {album.parentAlbum && (
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-4">
            {album.parentAlbum.title}
          </p>
        )}
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-3xl mx-auto">
          {album.title}
        </h1>
        {album.description && (
          <p className="font-[family-name:var(--font-lora)] italic text-sand/60 text-base md:text-lg mt-4 md:mt-6 max-w-2xl mx-auto">
            {album.description}
          </p>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24">

        {/* Sub albums */}
        {hasSubAlbums && (
          <div className="mb-16 md:mb-24">
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red mb-8">
              Albums
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {album.subAlbums.map((sub: any) => (
                <Link
                  key={sub._id}
                  href={`/gallery/${sub.slug.current}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy/10">
                    {sub.coverImage ? (
                      <Image
                        src={urlFor(sub.coverImage).width(800).url()}
                        alt={sub.title}
                        fill
                        placeholder={sub.coverLqip ? 'blur' : 'empty'}
                        blurDataURL={sub.coverLqip ?? undefined}
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
                  <div className="pt-4">
                    {sub.location && (
                      <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red mb-1">
                        {sub.location}
                      </p>
                    )}
                    {sub.date && (
                      <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/40 mb-1">
                        {new Date(sub.date).toLocaleDateString('en-GB', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy group-hover:italic transition-all duration-200">
                      {sub.title}
                    </h2>
                    <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-navy/30 mt-2">
                      {sub.imageCount} {sub.imageCount === 1 ? 'photo' : 'photos'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Images + Videos */}
        {hasImages || hasVideos ? (
          <ImageLightbox images={album.images ?? []} albumTitle={album.title} videos={album.videos} />
        ) : !hasSubAlbums && (
          <p className="font-[family-name:var(--font-playfair)] text-2xl italic text-navy/30 text-center">
            No photos yet.
          </p>
        )}
      </section>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 pb-16 md:pb-24">
        <nav className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase flex items-center gap-2 flex-wrap">
          <Link href="/gallery" className="text-navy/40 hover:text-navy transition-colors duration-200">
            Gallery
          </Link>
          {album.parentAlbum && (
            <>
              <span className="text-navy/20">›</span>
              <Link
                href={`/gallery/${album.parentAlbum.slug}`}
                className="text-navy/40 hover:text-navy transition-colors duration-200"
              >
                {album.parentAlbum.title}
              </Link>
            </>
          )}
          <span className="text-navy/20">›</span>
          <span className="text-navy/60">{album.title}</span>
        </nav>
      </div>

    </main>
  )
}
