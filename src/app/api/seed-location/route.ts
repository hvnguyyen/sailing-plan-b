import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

export async function GET() {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
  const settings = await client.fetch<{ _id: string }>('*[_type == "siteSettings"][0]{ _id }')
  if (!settings?._id) return NextResponse.json({ ok: false, reason: 'no siteSettings doc' })

  const result = await client.patch(settings._id)
    .set({ currentLat: 60.378567, currentLon: 5.331538 })
    .commit()

  const verify = await client.fetch('*[_type == "siteSettings"][0]{ currentLat, currentLon }')

  return NextResponse.json({ ok: true, id: settings._id, patchResult: result, verify })
}
