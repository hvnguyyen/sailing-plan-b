'use client'

import dynamic from 'next/dynamic'

const VesselMap = dynamic(() => import('./VesselMap'), { ssr: false })

export default function VesselMapWrapper({ lat, lon, location }: { lat: number; lon: number; location: string }) {
  return <VesselMap lat={lat} lon={lon} location={location} />
}
