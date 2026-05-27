import { NextResponse } from 'next/server'
import WebSocket from 'ws'
import { createClient } from 'next-sanity'

export const maxDuration = 45

const MMSI = '257748150'
const MARINETRAFFIC_URL = 'https://www.marinetraffic.com/en/ais/details/ships/shipid:10609272/mmsi:257748150/imo:0/vessel:PLAN_B'

async function getVesselPosition(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    const ws = new WebSocket('wss://stream.aisstream.io/v0/stream')

    const finish = (result: { lat: number; lon: number } | null) => {
      ws.terminate()
      resolve(result)
    }

    const timeout = setTimeout(() => finish(null), 25000)

    ws.on('open', () => {
      ws.send(JSON.stringify({
        APIKey: process.env.AISSTREAM_API_KEY,
        BoundingBoxes: [[[-90, -180], [90, 180]]],
        FiltersShipMMSI: [MMSI],
        FilterMessageTypes: ['PositionReport', 'StandardClassBPositionReport'],
      }))
    })

    ws.on('message', (data: WebSocket.RawData) => {
      try {
        const msg = JSON.parse(data.toString())
        const pos = msg.Message?.StandardClassBPositionReport ?? msg.Message?.PositionReport
        if (pos?.Latitude && pos?.Longitude) {
          // Reject positions older than 5 minutes — aisstream can serve stale cached data
          const timeUtc = msg.MetaData?.time_utc
          if (timeUtc) {
            const ageMs = Date.now() - new Date(timeUtc).getTime()
            if (ageMs > 5 * 60 * 1000) return
          }
          clearTimeout(timeout)
          finish({ lat: pos.Latitude, lon: pos.Longitude })
        }
      } catch { /* ignore */ }
    })

    ws.on('error', () => {
      clearTimeout(timeout)
      finish(null)
    })
  })
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'User-Agent': 'sailing-planb/1.0 (hvnguyen.work@gmail.com)', 'Accept-Language': 'en' } }
    )
    if (!res.ok) return 'At sea'
    const data = await res.json()
    if (data.error) return 'At sea'
    const addr = data.address ?? {}
    const place = addr.city ?? addr.town ?? addr.village ?? addr.hamlet ?? addr.municipality ?? addr.county ?? addr.state
    const country = addr.country
    if (!place && !country) return 'At sea'
    return [place, country].filter(Boolean).join(', ')
  } catch {
    return 'At sea'
  }
}

async function updateSanityLocation(location: string, lat: number, lon: number) {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
  const settings = await client.fetch<{ _id: string }>('*[_type == "siteSettings"][0]{ _id }')
  if (!settings?._id) throw new Error('siteSettings document not found')
  const publishedId = settings._id.replace(/^drafts\./, '')
  await client.patch(publishedId).set({ currentLocation: location, currentLat: lat, currentLon: lon, currentLocationUpdatedAt: new Date().toISOString() }).commit()
}

export async function GET() {
  const position = await getVesselPosition()
  if (!position) {
    return NextResponse.json({ ok: false, reason: 'no AIS position received within timeout' })
  }

  const location = await reverseGeocode(position.lat, position.lon)
  await updateSanityLocation(location, position.lat, position.lon)
  return NextResponse.json({ ok: true, location, position, marinetraffic: MARINETRAFFIC_URL })
}
