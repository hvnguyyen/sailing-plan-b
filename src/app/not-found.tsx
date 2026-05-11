import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="bg-navy min-h-screen flex flex-col items-center justify-center text-center px-8">
      <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-6">
        404
      </p>
      <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-6">
        Off <span className="italic text-sand">course</span>
      </h1>
      <p className="font-[family-name:var(--font-lora)] italic text-sand/50 text-base md:text-lg max-w-sm mb-10">
        This page doesn't exist — or it's drifted somewhere we can't find it.
      </p>
      <Link
        href="/"
        className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase bg-red text-white px-8 py-3 hover:bg-red-light transition-colors duration-200"
      >
        Back to port
      </Link>
    </main>
  )
}
