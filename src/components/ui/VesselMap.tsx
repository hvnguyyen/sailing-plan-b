'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L, { type LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'

const vesselIcon = L.divIcon({
  className: '',
  html: `
    <span style="position:relative;display:flex;width:16px;height:16px;align-items:center;justify-content:center">
      <span style="position:absolute;width:16px;height:16px;border-radius:50%;background:#c0392b;opacity:0.4;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite"></span>
      <span style="position:relative;display:block;width:10px;height:10px;border-radius:50%;background:#c0392b;border:2px solid white"></span>
    </span>
    <style>@keyframes ping{75%,100%{transform:scale(2);opacity:0}}</style>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
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
