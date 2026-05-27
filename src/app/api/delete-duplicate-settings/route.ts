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

  await client.delete('f1734a36-8ecf-436c-a52d-420cbcc1faa5')
  return NextResponse.json({ ok: true, deleted: 'f1734a36-8ecf-436c-a52d-420cbcc1faa5' })
}
