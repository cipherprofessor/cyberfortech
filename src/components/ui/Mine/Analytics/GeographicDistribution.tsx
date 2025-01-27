"use client";
// src/components/ui/Mine/Analytics/GeographicDistribution.tsx
import { Tooltip } from '@heroui/react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

export function GeographicDistribution() {
 const locations = [
   { lat: 40.7128, lng: -74.0060, students: 500, label: 'New York' },
   { lat: 51.5074, lng: -0.1278, students: 300, label: 'London' }
 ];

 return (
   <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
     <h2 className="text-lg font-semibold mb-4">Student Distribution</h2>
     <div className="h-[400px] relative">
       <MapContainer
         center={[20, 0] as LatLngExpression}
         zoom={2}
         className="h-full w-full rounded-lg"
       >
         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
         {locations.map((location, i) => (
           <CircleMarker
             key={i}
             center={[location.lat, location.lng] as LatLngExpression}
             radius={Math.sqrt(location.students) / 2}
             pathOptions={{
               fillColor: "#3b82f6",
               fillOpacity: 0.5,
               stroke: false
             }}
           >
             <Tooltip>{location.label}: {location.students} students</Tooltip>
           </CircleMarker>
         ))}
       </MapContainer>
     </div>
   </div>
 );
}