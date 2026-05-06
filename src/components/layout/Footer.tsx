import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white/40 py-12 px-8">

      {/* Logo + links sentrert */}
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">

        <p className="font-[family-name:var(--font-playfair)] text-lg text-white">
          Sailing <span className="italic text-sand">Plan B</span>
        </p>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <Link href="/" className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase hover:text-white transition-colors duration-200">
            Home
          </Link>
          <Link href="/blog" className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase hover:text-white transition-colors duration-200">
            Blog
          </Link>
          <Link href="/about" className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase hover:text-white transition-colors duration-200">
            About
          </Link>
          <a
            href="https://www.instagram.com/sailing.planb"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase hover:text-white transition-colors duration-200"
          >
            Instagram
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto mt-8 border-t border-white/10" />

      {/* Najad + Made by */}
      <div className="max-w-3xl mx-auto mt-6 flex flex-col items-center gap-3 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider">
          by{' '}
          <a
            href="https://www.linkedin.com/in/hv-nguyen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            Vinni
          </a>
        </p>
      </div>

    </footer>
  )
}