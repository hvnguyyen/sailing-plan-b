'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L, { type LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const vesselIcon = L.divIcon({
  className: '',
  html: `<span style="display:block;width:12px;height:12px;border-radius:50%;background:#c0392b;border:2px solid white;box-shadow:0 0 0 2px #c0392b"></span>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

function RecenterMap({ position }: { position: LatLngTuple }) {
  const map = useMap()
  useEffect(() => { map.setView(position) }, [map, position])
  return null
}

export default function VesselMap({ lat, lon }: { lat: number; lon: number; location: string }) {
  const position: LatLngTuple = [lat, lon]

  return (
    <MapContainer
      center={position}
      zoom={9}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />
      <Marker position={position} icon={vesselIcon} />
      <RecenterMap position={position} />
    </MapContainer>
  )
}
