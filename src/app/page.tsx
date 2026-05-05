import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <section className="relative h-screen min-h-[600px] bg-navy flex flex-col items-center justify-center text-center overflow-hidden">

        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-mid to-navy" />

        {/* Content */}
        <div className="relative z-10 px-8">
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-6">
            Najad 343 · Est. 2026
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(4rem,12vw,9rem)] font-bold text-white leading-[0.95] tracking-tight">
            Sailing<br />
            <span className="italic text-sand">Plan B</span>
          </h1>

          <p className="font-[family-name:var(--font-lora)] italic text-sand/70 text-xl mt-6 max-w-md mx-auto">
            Ulrik & Karen — trading land for sea, one nautical mile at a time.
          </p>

          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              href="/blog"
              className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase bg-red text-white px-8 py-3 hover:bg-red-light transition-colors duration-200"
            >
              Read the log
            </Link>
            <Link
              href="/about"
              className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase border border-white/30 text-white/70 px-8 py-3 hover:text-white hover:border-white/60 transition-colors duration-200"
            >
              About us
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[0.6rem] tracking-[0.2em] uppercase text-white/30">
            scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>

      </section>
    </main>
  )
}