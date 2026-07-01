"use client";

import dynamic from "next/dynamic";

interface LazyMapProps {
  lat: number;
  lng: number;
  popupText?: string;
}

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 dark:bg-white/5 flex items-center justify-center animate-pulse rounded-lg">
      <span className="material-icons text-mosque/50 text-3xl">map</span>
    </div>
  ),
});

export default function LazyMap(props: LazyMapProps) {
  return <MapComponent {...props} />;
}
