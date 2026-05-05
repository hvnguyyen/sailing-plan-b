import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white/40 py-12 px-8">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        <p className="font-[family-name:var(--font-playfair)] text-lg text-white">
          Sailing <span className="italic text-sand">Plan B</span>
        </p>

        <div className="flex gap-8">
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
            Instagram ↗
          </a>
        </div>

        <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider">
          Najad 343 · Norway to the world
        </p>

      </div>

      <div className="max-w-3xl mx-auto mt-8 pt-8 border-t border-white/10 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-wider">
          Made with ♥ by{' '}
          <a
            href="https://www.linkedin.com/in/hv-nguyen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            HV Nguyen
          </a>
        </p>
      </div>

    </footer>
  )
}