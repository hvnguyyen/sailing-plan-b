import { NextResponse } from 'next/server'
import WebSocket from 'ws'
import { createClient } from 'next-sanity'

export const maxDuration = 45

const MMSI = '257748150'
const MARINETRAFFIC_URL = 'https://www.marinetraffic.com/en/ais/details/ships/shipid:10609272/mmsi:257748150/imo:0/vessel:PLAN_B'

async function getVesselPosition(): Promise<{ position: { lat: number; lon: number } | null; debug: object }> {
  return new Promise((resolve) => {
    const ws = new WebSocket('wss://stream.aisstream.io/v0/stream')
    let connected = false
    let totalMessages = 0
    let wsError: string | null = null
    const sampleMMSIs: string[] = []

    const finish = (position: { lat: number; lon: number } | null) => {
      ws.terminate()
      resolve({ position, debug: { connected, totalMessages, wsError, sampleMMSIs } })
    }

    const timeout = setTimeout(() => finish(null), 10000)

    ws.on('open', () => {
      connected = true
      ws.send(JSON.stringify({
        APIKey: process.env.AISSTREAM_API_KEY,
        BoundingBoxes: [[[-90, -180], [90, 180]]],
        FilterMessageTypes: ['PositionReport', 'StandardClassBPositionReport'],
      }))
    })

    ws.on('message', (data: WebSocket.RawData) => {
      totalMessages++
      try {
        const msg = JSON.parse(data.toString())
        const mmsi = msg.MetaData?.MMSI_String ?? msg.MetaData?.MMSI
        if (mmsi && sampleMMSIs.length < 5) sampleMMSIs.push(String(mmsi))
        if (String(mmsi) === MMSI) {
          const pos = msg.Message?.StandardClassBPositionReport ?? msg.Message?.PositionReport
          if (pos?.Latitude && pos?.Longitude) {
            clearTimeout(timeout)
            finish({ lat: pos.Latitude, lon: pos.Longitude })
          }
        }
      } catch { /* ignore */ }
    })

    ws.on('error', (err) => {
      clearTimeout(timeout)
      wsError = String(err)
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
  const { position, debug } = await getVesselPosition()
  if (!position) {
    return NextResponse.json({ ok: false, reason: 'no AIS position received within timeout', debug })
  }

  const location = await reverseGeocode(position.lat, position.lon)
  await updateSanityLocation(location, position.lat, position.lon)
  return NextResponse.json({ ok: true, location, position, debug, marinetraffic: MARINETRAFFIC_URL })
}
