"use client";

import { Map, Marker } from "pigeon-maps";

export function ShipMap({ lat, lng }: { lat: number; lng: number }) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return <div>Loading map...</div>; // Or some other placeholder
  }

  const center: [number, number] = [lat, lng]; // Type assertion for pigeon-maps

  return (
    <div style={{ height: 300, width: '100%' }}>
      <Map center={center} defaultZoom={8}>
        <Marker width={50} anchor={center} />
      </Map>
    </div>
  );
}
