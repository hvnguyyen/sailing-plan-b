import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'

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
          The crew
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl lg:text-8xl font-bold leading-[0.95]">
          Ulrik <span className="italic text-sand">&</span> Karen
        </h1>
        <p className="font-[family-name:var(--font-lora)] italic text-sand/60 text-base md:text-lg mt-4 md:mt-6">
          {s?.aboutSubtitle || 'Two people from Norway with one big idea.'}
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
          <a
            href={s?.ulrikInstagram || 'https://www.instagram.com/ulrik.kjaergaard_/'}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-navy/10 p-6 md:p-8 bg-white block hover:border-navy/30 transition-colors duration-200"
          >
            {s?.ulrikImage ? (
              <div className="relative w-full aspect-[4/3] mb-4 md:mb-6 overflow-hidden">
                <Image src={urlFor(s.ulrikImage).width(800).url()} alt="Ulrik" fill className="object-cover" />
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
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30 mt-4">
              Instagram ↗
            </p>
          </a>

          {/* Karen */}
          <a
            href={s?.karenInstagram || 'https://www.instagram.com/karenwolaussen/'}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-navy/10 p-6 md:p-8 bg-white block hover:border-navy/30 transition-colors duration-200"
          >
            {s?.karenImage ? (
              <div className="relative w-full aspect-[4/3] mb-4 md:mb-6 overflow-hidden">
                <Image src={urlFor(s.karenImage).width(800).url()} alt="Karen" fill className="object-cover" />
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
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30 mt-4">
              Instagram ↗
            </p>
          </a>
        </div>

        {/* The boat */}
        <div className="mb-10 md:mb-16 lg:mb-20">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-red mb-3 md:mb-4">
            The vessel
          </p>
          <a
            href="https://najad.se/"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-4 md:mb-6 group-hover:italic transition-all duration-200">
              {s?.boatTitle || 'A 1984 Najad 343'} <span className="font-[family-name:var(--font-mono)] text-sm font-normal not-italic text-navy/30">↗</span>
            </h2>
          </a>
          {s?.boatImage ? (
            <div className="relative w-full aspect-[4/3] mb-4 md:mb-6 overflow-hidden">
              <Image src={urlFor(s.boatImage).width(1200).url()} alt="Plan B" fill className="object-cover" />
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
              <div key={place} className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-t border-white/10 pt-4 md:pt-6">
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
