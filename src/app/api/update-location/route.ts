import { NextResponse } from 'next/server'
import WebSocket from 'ws'
import { createClient } from 'next-sanity'

export const maxDuration = 45

const MMSI = 257748150
const MARINETRAFFIC_URL = 'https://www.marinetraffic.com/en/ais/details/ships/shipid:10609272/mmsi:257748150/imo:0/vessel:PLAN_B'

type Candidate = { lat: number; lon: number; time: number; name: string }

function getVesselPosition(): Promise<{ lat: number; lon: number; allNames: string[] } | null> {
  return new Promise((resolve) => {
    const ws = new WebSocket('wss://stream.aisstream.io/v0/stream')
    const candidates: Candidate[] = []

    const finish = () => {
      ws.terminate()
      if (candidates.length === 0) return resolve(null)
      candidates.sort((a, b) => b.time - a.time)
      const allNames = [...new Set(candidates.map(c => c.name.trim()).filter(Boolean))]
      resolve({ lat: candidates[0].lat, lon: candidates[0].lon, allNames })
    }

    const collectTimeout = setTimeout(finish, 10000)
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
          const name: string = msg.MetaData?.ShipName ?? ''
          candidates.push({ lat: pos.Latitude, lon: pos.Longitude, time, name })
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
  return NextResponse.json({ ok: true, location, position, shipNames: position.allNames, marinetraffic: MARINETRAFFIC_URL })
}
