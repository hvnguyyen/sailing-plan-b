'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="bg-navy min-h-screen flex flex-col items-center justify-center text-center px-8">
      <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-6">
        Something went wrong
      </p>
      <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-6">
        Rough <span className="italic text-sand">waters</span>
      </h1>
      <p className="font-[family-name:var(--font-lora)] italic text-sand/50 text-base md:text-lg max-w-sm mb-10">
        Something broke on our end. Try again or head back to port.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase bg-red text-white px-8 py-3 hover:bg-red-light transition-colors duration-200"
        >
          Try again
        </button>
        <Link
          href="/"
          className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase border border-white/30 text-white/70 px-8 py-3 hover:text-white hover:border-white/60 transition-colors duration-200"
        >
          Back to port
        </Link>
      </div>
    </main>
  )
}
