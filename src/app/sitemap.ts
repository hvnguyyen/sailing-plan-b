import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { groq } from 'next-sanity'

const baseUrl = 'https://www.sailing-planb.com'

interface SitemapPost { slug: { current: string }; publishedAt?: string }
interface SitemapAlbum { slug: { current: string } }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts: SitemapPost[] = await client.fetch(groq`*[_type == "post"] { slug, publishedAt }`)
  const albums: SitemapAlbum[] = await client.fetch(groq`*[_type == "album"] { slug }`)

  return [
    { url: baseUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/gallery`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug.current}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...albums.map((a) => ({
      url: `${baseUrl}/gallery/${a.slug.current}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
