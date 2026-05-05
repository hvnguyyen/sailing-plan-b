export default function BlogPage() {
  return (
    <main className="bg-cream min-h-screen">
      <section className="bg-navy text-white pt-40 pb-24 px-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase text-red-light mb-4">
          The logbook
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl font-bold leading-[0.95]">
          From <span className="italic text-sand">the sea</span>
        </h1>
      </section>

      <section className="max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-4xl italic text-navy/30">
          The log is empty — for now.
        </p>
        <p className="font-[family-name:var(--font-lora)] text-navy/40 mt-4">
          First entry incoming when the lines are cast off.
        </p>
      </section>
    </main>
  )
}