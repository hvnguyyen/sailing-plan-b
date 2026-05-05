import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="bg-cream min-h-screen">

      {/* Hero */}
      <section className="bg-navy text-white pt-40 pb-24 px-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-4">
          The crew
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl font-bold leading-[0.95]">
          Ulrik <span className="italic text-sand">&</span> Karen
        </h1>
        <p className="font-[family-name:var(--font-lora)] italic text-sand/60 text-lg mt-6">
          Two people from Nøtterøy with one big idea.
        </p>
      </section>

      {/* Main content */}
      <section className="max-w-3xl mx-auto px-8 py-24">

        {/* The Plan B story */}
        <div className="mb-20">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-red mb-4">
            On the name
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-navy mb-6">
            It was always <span className="italic">Plan A</span>
          </h2>
          <p className="font-[family-name:var(--font-lora)] text-lg leading-relaxed text-navy/70">
            The boat came with the name. But somewhere along the way, it started to make perfect sense —
            because this was never really a backup plan. Leaving the dock, trading routine for open water,
            learning as you go. For Ulrik and Karen, Plan B has always been the plan.
          </p>
        </div>

        {/* Crew cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">

          {/* Ulrik */}
          <div className="border border-navy/10 p-8 bg-white">
           <img
            src="/images/IMG_0976.JPG"
            alt="Ulrik"
            className="w-full aspect-[4/3] object-cover mb-6"
            />
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red mb-2">
              Born 10 Sep 2001 · Age 24
            </p>
            <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-navy mb-4">
              Ulrik
            </h3>
            <p className="font-[family-name:var(--font-lora)] text-navy/70 leading-relaxed">
              Trained carpenter, now studying structural engineering from the chart table.
              Grew up around boats on the Nøtterøy coast — never offshore, but always comfortable
              on the water. The one who got them here.
            </p>
          </div>

          {/* Karen */}
          <div className="border border-navy/10 p-8 bg-white">
            {/* Placeholder image */}
            <div className="w-full aspect-[4/3] bg-navy/10 mb-6 flex items-center justify-center">
              <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30">
                Photo coming
              </span>
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-red mb-2">
              Born 11 Nov 2002 · Age 23
            </p>
            <h3 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-navy mb-4">
              Karen
            </h3>
            <p className="font-[family-name:var(--font-lora)] text-navy/70 leading-relaxed">
              Studying technical design while underway. Brand new to sailing when they left the dock —
              now learning every system, every knot, every weather window. The one who keeps
              everything together.
            </p>
          </div>
        </div>

        {/* The boat */}
        <div className="mb-20">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-red mb-4">
            The vessel
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-navy mb-6">
            A 1984 Najad 343
          </h2>
          <div className="w-full aspect-video bg-navy/10 mb-6 flex items-center justify-center">
            <span className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/30">
              Photo coming
            </span>
          </div>
          <p className="font-[family-name:var(--font-lora)] text-lg leading-relaxed text-navy/70">
            Built in Sweden in 1984, the Najad 343 is a classic offshore cruiser known for its
            robust build and sea-kindly hull. Red hull, reliable bones, and just enough space for
            two people and a big dream. She came with the name Plan B — and she's earning it.
          </p>
        </div>

        {/* Route */}
        <div className="bg-navy text-white p-10">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.2em] uppercase text-red-light mb-4">
            The route
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mb-8">
            Where they're headed
          </h2>
          <div className="space-y-6">
            {[
              { time: 'May / Jun 2025', place: 'Depart Norway', desc: 'Cast off the lines and work their way south along the Norwegian coast.' },
              { time: 'Dec 2025', place: 'Gran Canaria', desc: 'The staging point for the Atlantic crossing. Final preparations, final farewells.' },
              { time: 'Jan / Feb 2026', place: 'Atlantic crossing', desc: 'Trade winds, open ocean, 2 700 nautical miles of nothing but sea and sky.' },
              { time: 'Early 2026', place: 'The Caribbean', desc: 'The other side. After that — wherever the wind goes.' },
            ].map(({ time, place, desc }) => (
              <div key={place} className="flex gap-6 border-t border-white/10 pt-6">
                <div className="w-36 shrink-0">
                  <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider uppercase text-red-light">
                    {time}
                  </p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-playfair)] text-xl font-bold mb-1">{place}</p>
                  <p className="font-[family-name:var(--font-lora)] italic text-white/60 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="font-[family-name:var(--font-lora)] italic text-navy/50 mb-6">
            Follow the journey as it happens
          </p>
          <Link
            href="/blog"
            className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase bg-navy text-white px-10 py-4 hover:bg-navy-mid transition-colors duration-200"
          >
            Read the log →
          </Link>
        </div>

      </section>
    </main>
  )
}