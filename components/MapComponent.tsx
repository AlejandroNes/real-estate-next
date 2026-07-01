"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet markers in Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapComponentProps {
  lat: number;
  lng: number;
  popupText?: string;
}

export default function MapComponent({ lat, lng, popupText = "Ubicación de la propiedad" }: MapComponentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center animate-pulse rounded-lg">
        <span className="material-icons text-mosque/50 text-3xl">map</span>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={14} 
      scrollWheelZoom={false} 
      style={{ height: "100%", width: "100%", zIndex: 10 }}
      className="rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>
          <span className="font-semibold text-nordic-dark text-sm">{popupText}</span>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
