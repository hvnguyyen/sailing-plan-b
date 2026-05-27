import { NextResponse } from 'next/server'
import WebSocket from 'ws'
import { createClient } from 'next-sanity'

export const maxDuration = 45

const MMSI = 257748150
const MARINETRAFFIC_URL = 'https://www.marinetraffic.com/en/ais/details/ships/shipid:10609272/mmsi:257748150/imo:0/vessel:PLAN_B'

function getVesselPosition(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    const ws = new WebSocket('wss://stream.aisstream.io/v0/stream')
    const candidates: Array<{ lat: number; lon: number; time: number }> = []

    const finish = () => {
      ws.terminate()
      if (candidates.length === 0) return resolve(null)
      candidates.sort((a, b) => b.time - a.time)
      resolve({ lat: candidates[0].lat, lon: candidates[0].lon })
    }

    // Collect for 15s, then pick the most recently timestamped position
    const collectTimeout = setTimeout(finish, 15000)
    const hardTimeout = setTimeout(() => { clearTimeout(collectTimeout); finish() }, 28000)

    ws.on('open', () => {
      ws.send(JSON.stringify({
        APIKey: process.env.AISSTREAM_API_KEY,
        BoundingBoxes: [[[-90, -180], [90, 180]]],
        FilterMessageTypes: ['PositionReport'],
        FilterMMSI: [MMSI],
      }))
    })

    ws.on('message', (data: WebSocket.RawData) => {
      try {
        const msg = JSON.parse(data.toString())
        const pos = msg.Message?.PositionReport
        if (pos?.Latitude && pos?.Longitude) {
          const time = msg.MetaData?.time_utc
            ? new Date(msg.MetaData.time_utc).getTime()
            : Date.now()
          candidates.push({ lat: pos.Latitude, lon: pos.Longitude, time })
        }
      } catch { /* ignore */ }
    })

    ws.on('error', () => {
      clearTimeout(collectTimeout)
      clearTimeout(hardTimeout)
      finish()
    })
  })
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { 'User-Agent': 'sailing-planb/1.0 (hvnguyen.work@gmail.com)' } }
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

async function updateSanityLocation(location: string) {
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  })
  const settings = await client.fetch<{ _id: string }>('*[_type == "siteSettings"][0]{ _id }')
  if (!settings?._id) throw new Error('siteSettings document not found')
  await client.patch(settings._id).set({ currentLocation: location }).commit()
}

export async function GET() {
  const position = await getVesselPosition()
  if (!position) {
    return NextResponse.json({ ok: false, reason: 'no AIS position received within timeout' })
  }

  const location = await reverseGeocode(position.lat, position.lon)
  await updateSanityLocation(location)
  return NextResponse.json({ ok: true, location, position, marinetraffic: MARINETRAFFIC_URL })
}
