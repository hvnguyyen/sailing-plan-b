import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImage, SanityAsset } from './types'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-05-06',
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImage | SanityAsset | object) {
  return builder.image(source)
}