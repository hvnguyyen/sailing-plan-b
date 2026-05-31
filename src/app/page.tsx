import Link from 'next/link'
import Image from 'next/image'
import ScrollGallery from '@/components/ui/ScrollGallery'
import HeroVideo from '@/components/ui/HeroVideo'
import { client, urlFor } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const settings = await client.fetch(siteSettingsQuery, {}, { cache: 'no-store' })

  return (
    <main>
      <section className="relative h-screen min-h-[600px] bg-navy flex flex-col items-center justify-center text-center overflow-hidden">

        {/* Background: video > image > plain navy */}
        {settings?.heroVideoUrl ? (
          <HeroVideo src={settings.heroVideoUrl} />
        ) : settings?.heroImage ? (
          <Image
            src={urlFor(settings.heroImage).width(1920).url()}
            alt=""
            fill
            className="object-cover"
            priority
            placeholder={settings.heroImageLqip ? 'blur' : 'empty'}
            blurDataURL={settings.heroImageLqip ?? undefined}
          />
        ) : null}

        {/* Dark overlay — lighter when there's a background media */}
        <div className={`absolute inset-0 ${
          settings?.heroVideoUrl || settings?.heroImage
            ? 'bg-gradient-to-b from-navy/70 via-navy/50 to-navy/70'
            : 'bg-gradient-to-b from-navy via-navy-mid to-navy'
        }`} />

        {/* Content */}
        <div className="relative z-10 px-6 md:px-8" spellCheck={false}>
          <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-4 md:mb-6">
            Najad 343
          </p>

          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,12vw,9rem)] font-bold text-white leading-[0.95] tracking-tight">
            Sailing<br />
            <span className="italic text-sand">Plan B</span>
          </h1>

          <p className="font-[family-name:var(--font-lora)] italic text-sand/70 text-base md:text-xl mt-4 md:mt-6 max-w-xs md:max-w-md mx-auto">
            {settings?.currentLocation ? (
              <span className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-light opacity-90"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-light"></span>
                </span>
                Currently in <span className="text-red-light opacity-80">{settings.currentLocation}</span>
              </span>
            ) : 'Two people from Nøtterøy, Norway.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-8 md:mt-10">
            <Link
              href="/blog"
              className="w-full sm:w-auto font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase bg-red text-white px-8 py-3 hover:bg-red-light transition-colors duration-200"
            >
              Read the log
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase border border-white/30 text-white/70 px-8 py-3 hover:text-white hover:border-white/60 transition-colors duration-200"
            >
              About us
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[0.6rem] tracking-[0.2em] uppercase text-white/30">
            Scroll
          </span>
          <div className="w-px h-8 md:h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>

      </section>
      <ScrollGallery />
    </main>
  )
}