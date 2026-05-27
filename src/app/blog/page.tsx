import type { Metadata } from 'next'
import Link from 'next/link'
import { client } from '@/lib/sanity'
import { postsQuery, siteSettingsQuery } from '@/lib/queries'
import VesselMapWrapper from '@/components/ui/VesselMapWrapper'

export const metadata: Metadata = {
  title: 'Log',
  description: 'The sailing log, written from wherever Plan B happens to be.',
}

export const revalidate = 60

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    client.fetch(postsQuery),
    client.fetch(siteSettingsQuery, {}, { cache: 'no-store' }),
  ])

  return (
    <main className="bg-cream">
      <section className="bg-navy text-white pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20 lg:pb-24 px-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-4">
          Log
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-8xl font-bold leading-[0.95]">
          Here&apos;s what&apos;s up.
        </h1>
      </section>

      {settings?.currentLat && settings?.currentLon && (
        <div className="max-w-3xl mx-auto px-8 pt-12 md:pt-16">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-navy/40 mb-4">
            Live position · <span className="text-red">{settings.currentLocation}</span>
            {settings.currentLocationUpdatedAt && (
              <span className="ml-2 text-navy/30">
                · {new Date(settings.currentLocationUpdatedAt).toLocaleString('en-GB', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo',
                })}
              </span>
            )}
          </p>
          <div className="w-full h-72 md:h-96" style={{ isolation: 'isolate' }}>
            <VesselMapWrapper lat={settings.currentLat} lon={settings.currentLon} location={settings.currentLocation} />
          </div>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.15em] text-navy/30 mt-3">
            Last known position —{' '}
            <a
              href="https://www.marinetraffic.com/en/ais/details/ships/shipid:10609272/mmsi:257748150/imo:0/vessel:PLAN_B"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-navy/60 transition-colors"
            >
              see live on MarineTraffic
            </a>
          </p>
        </div>
      )}

      <section className="max-w-3xl mx-auto px-8 pt-8 md:pt-10 pb-16 md:pb-20 lg:pb-24">
        {posts.length === 0 ? (
          <div className="text-center">
            <p className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl italic text-navy/30">
              The log is empty — for now.
            </p>
            <p className="font-[family-name:var(--font-lora)] text-sm md:text-base text-navy/40 mt-4">
              First entry incoming when the lines are cast off.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-navy/10">
            {posts.map((post: any) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10 py-10 hover:opacity-70 transition-opacity duration-200"
              >
                <div className="shrink-0 md:w-48">
                  {/* Mobile: dato + location på én linje med prikk */}
                  <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase md:hidden">
                    <span className="text-red">
                      {new Date(post.publishedAt).toLocaleString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo',
                      })}
                    </span>
                    {post.location && (
                      <>
                        <span className="text-navy/30 mx-2">·</span>
                        <span className="text-navy/40">{post.location}</span>
                      </>
                    )}
                  </p>
                  {/* Desktop: stacked i sidekolonne */}
                  <p className="hidden md:block font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red">
                    {new Date(post.publishedAt).toLocaleString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo',
                    })}
                  </p>
                  {post.location && (
                    <p className="hidden md:block font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-navy/40 mt-1">
                      {post.location}
                    </p>
                  )}
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-navy mb-2 group-hover:italic transition-all duration-200">
                    {post.title}
                  </h2>
                  <p className="font-[family-name:var(--font-lora)] italic text-navy/60 text-sm md:text-base leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}