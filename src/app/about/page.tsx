import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Ulrik & Karen, two Norwegians sailing anywhere on a 1984 Najad 343 named Plan B.',
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

export const revalidate = 60

export default async function AboutPage() {
  const s = await client.fetch(siteSettingsQuery)

  const routeItems = s?.routeItems?.length > 0
    ? s.routeItems
    : [
        { time: 'May / Jun 2025', place: 'Depart Norway', desc: 'Cast off the lines and work their way south along the Norwegian coast.' },
        { time: 'Dec 2025', place: 'Gran Canaria', desc: 'The staging point for the Atlantic crossing. Final preparations, final farewells.' },
        { time: 'Jan / Feb 2026', place: 'Atlantic crossing', desc: 'Trade winds, open ocean, 2 700 nautical miles of nothing but sea and sky.' },
        { time: 'Early 2026', place: 'The Caribbean', desc: 'The other side. After that — wherever the wind goes.' },
      ]

  return (
    <main className="bg-cream">

      {/* Hero */}
      <section className="bg-navy text-white pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20 lg:pb-24 px-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-4">
          About
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-8xl font-bold leading-[0.95]">
          Ulrik <span className="italic text-sand">&</span> Karen
        </h1>
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-white/40 mt-4 md:mt-5">
          Nøtterøy, Norway
        </p>
      </section>

      {/* Main content */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16 lg:py-24">

        {/* The Plan B story */}
        <div className="mb-10 md:mb-16 lg:mb-20">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-red mb-3 md:mb-4">
            On the name
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-4 md:mb-6">
            {s?.planBStoryTitle || <><span className="italic whitespace-nowrap">It was always Plan A</span></>}
          </h2>
          <p className="font-[family-name:var(--font-lora)] text-base md:text-lg leading-relaxed text-navy/70 text-justify">
            {s?.planBStoryText || 'The boat came with the name. But somewhere along the way, it started to make perfect sense, because this was never really a backup plan. Leaving the dock, trading routine for open water, learning as you go. For Ulrik and Karen, Plan B has always been the plan.'}
          </p>
        </div>

        {/* Crew cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16 lg:mb-20">

          {/* Ulrik */}
          <div className="border border-navy/10 p-6 md:p-8 bg-white">
            {s?.ulrikImage ? (
              <div className="relative w-full aspect-[4/3] mb-4 md:mb-6 overflow-hidden">
                <Image src={urlFor(s.ulrikImage).width(800).url()} alt="Ulrik" fill placeholder={s.ulrikImageLqip ? 'blur' : 'empty'} blurDataURL={s.ulrikImageLqip ?? undefined} className="object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] bg-navy/10 mb-4 md:mb-6 flex items-center justify-center">
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30">Photo coming</span>
              </div>
            )}
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red mb-2">
              {s?.ulrikBirthLabel || 'Born 10 Sep 2001 · Age 24'}
            </p>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-navy mb-3 md:mb-4">
              {s?.ulrikName || 'Ulrik Gjersøe Kjærgaard'}
            </h3>
            <p className="font-[family-name:var(--font-lora)] text-sm md:text-base text-navy/70 leading-relaxed text-justify">
              {s?.ulrikBio || 'Grew up in an active family, and has never really stopped moving since. Trained carpenter who can\'t sit still long enough to stick to one thing, so naturally, he bought a 40-year-old sailboat and decided sailing the world was next.'}
            </p>
            <a
              href={s?.ulrikInstagram || 'https://www.instagram.com/ulrik.kjaergaard_/'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-navy/25 hover:text-navy/50 transition-colors duration-200"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>

          {/* Karen */}
          <div className="border border-navy/10 p-6 md:p-8 bg-white">
            {s?.karenImage ? (
              <div className="relative w-full aspect-[4/3] mb-4 md:mb-6 overflow-hidden">
                <Image src={urlFor(s.karenImage).width(800).url()} alt="Karen" fill placeholder={s.karenImageLqip ? 'blur' : 'empty'} blurDataURL={s.karenImageLqip ?? undefined} className="object-cover" />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] bg-navy/10 mb-4 md:mb-6 flex items-center justify-center">
                <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30">Photo coming</span>
              </div>
            )}
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red mb-2">
              {s?.karenBirthLabel || 'Born 11 Nov 2002 · Age 23'}
            </p>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold text-navy mb-3 md:mb-4">
              {s?.karenName || 'Karen Wiik Olaussen'}
            </h3>
            <p className="font-[family-name:var(--font-lora)] text-sm md:text-base text-navy/70 leading-relaxed text-justify">
              {s?.karenBio || 'The one behind the camera, most of the photos you\'ll find here are hers. She had zero sailing experience when they cast off the lines, but that hasn\'t slowed her down. Turns out she picks things up fast when the alternative is the open ocean.'}
            </p>
            <a
              href={s?.karenInstagram || 'https://www.instagram.com/karenwolaussen/'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-navy/25 hover:text-navy/50 transition-colors duration-200"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* The boat */}
        <div className="mb-10 md:mb-16 lg:mb-20">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-red mb-3 md:mb-4">
            The vessel
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-4 md:mb-6">
            {s?.boatTitle || 'A 1984 Najad 343'}
          </h2>
          {s?.boatImage ? (
            <div className="relative w-full aspect-[4/3] mb-4 md:mb-6 overflow-hidden">
              <Image src={urlFor(s.boatImage).width(1200).url()} alt="Plan B" fill placeholder={s.boatImageLqip ? 'blur' : 'empty'} blurDataURL={s.boatImageLqip ?? undefined} className="object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-navy/10 mb-4 md:mb-6 flex items-center justify-center">
              <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30">Photo coming</span>
            </div>
          )}
          <p className="font-[family-name:var(--font-lora)] text-base md:text-lg leading-relaxed text-navy/70 text-justify">
            {s?.boatDescription || 'Built in Sweden in 1984, the Najad 343 is a classic offshore cruiser known for its robust build and sea-kindly hull. Red hull, reliable bones, and just enough space for two people and a big dream. She came with the name Plan B, and she\'s earning it.'}
          </p>
        </div>

        {/* Route */}
        <div className="bg-navy text-white p-6 md:p-10">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-red-light mb-3 md:mb-4">
            The route
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
            Where we're headed
          </h2>
          <div className="space-y-4 md:space-y-6">
            {routeItems.map(({ time, place, desc }: { time: string; place: string; desc: string }) => (
              <div key={place} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border-t border-white/10 pt-4 md:pt-6">
                <div className="sm:w-36 shrink-0">
                  <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-red-light">
                    {time}
                  </p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-playfair)] text-lg md:text-xl font-bold mb-1">{place}</p>
                  <p className="font-[family-name:var(--font-lora)] italic text-white/60 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16 lg:mt-20">
          <p className="font-[family-name:var(--font-lora)] italic text-navy/50 text-sm md:text-base mb-4 md:mb-6">
            Follow the journey as it happens
          </p>
          <Link
            href="/blog"
            className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase bg-navy text-white px-8 md:px-10 py-3 md:py-4 hover:bg-navy-mid transition-colors duration-200"
          >
            Read the log →
          </Link>
        </div>

      </section>
    </main>
  )
}
