import { client, urlFor } from '@/lib/sanity'
import { postBySlugQuery, postsQuery } from '@/lib/queries'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await client.fetch(postsQuery)
  return posts.map((post: any) => ({ slug: post.slug.current }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await client.fetch(postBySlugQuery, { slug })

  if (!post) return <div>Post not found</div>

  return (
    <main className="bg-cream">

      {/* Header */}
      <section className="bg-navy text-white pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-20 px-8 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs tracking-[0.25em] uppercase mb-4 flex flex-wrap justify-center items-center gap-x-2 text-red-light">
          <span className="whitespace-nowrap">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Oslo',
                })
              : ''}
            {', '}
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleTimeString('en-GB', {
                  hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Oslo',
                })
              : ''}
          </span>
          {post.location && <span className="text-white/30 mx-1">·</span>}
          {post.location && <span className="text-white/50 whitespace-nowrap">{post.location}</span>}
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] max-w-3xl mx-auto">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="font-[family-name:var(--font-lora)] italic text-sand/60 text-base md:text-lg mt-4 md:mt-6 max-w-2xl mx-auto">
            {post.excerpt}
          </p>
        )}
      </section>

      {/* Main image — smaller and contained */}
      {post.mainImage && (
        <div className="max-w-3xl mx-auto px-6 md:px-8 pt-12 md:pt-16">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-2xl mx-auto px-6 md:px-8 py-12 md:py-16
        prose prose-base md:prose-lg
        prose-headings:font-[family-name:var(--font-playfair)]
        prose-headings:text-navy
        prose-p:font-[family-name:var(--font-lora)]
        prose-p:text-navy/80
        prose-p:leading-relaxed
        prose-img:rounded-none">
        {post.body && <PortableText value={post.body} />}
      </article>

      {/* Back */}
      <div className="max-w-2xl mx-auto px-6 md:px-8 pb-16 md:pb-24">
        <Link
          href="/blog"
          className="font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase text-navy/40 hover:text-navy transition-colors duration-200"
        >
          ← Back to the log
        </Link>
      </div>

    </main>
  )
}