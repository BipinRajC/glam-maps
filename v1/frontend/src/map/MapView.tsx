/// <reference types="@types/google.maps" />
import { useEffect, useRef } from "react";
import type { Zone } from "@/api/types";
import type { PositionTick } from "@/journey/PositionSource";

interface Props {
  encodedPolyline: string;
  position: PositionTick | null;
  zones: Zone[];
}

export function MapView({ encodedPolyline, position, zones }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const path = google.maps.geometry.encoding.decodePath(encodedPolyline);
    const center = path[Math.floor(path.length / 2)];

    const map = new google.maps.Map(containerRef.current, {
      center,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      mapId: "glam-maps",
    });
    mapRef.current = map;

    new google.maps.Polyline({
      path,
      strokeColor: "#7C3AED",
      strokeWeight: 5,
      map,
    });

    for (const z of zones) {
      const el = document.createElement("div");
      el.style.cssText =
        "width:10px;height:10px;background:#EF4444;border-radius:50%;border:2px solid white;";
      new google.maps.marker.AdvancedMarkerElement({
        position: z.alertPoint,
        map,
        content: el,
        title: z.label,
      });
    }
  }, [encodedPolyline, zones]);

  useEffect(() => {
    if (!position || !mapRef.current) return;
    const pos = { lat: position.lat, lng: position.lng };

    if (!markerRef.current) {
      const el = document.createElement("div");
      el.style.cssText =
        "width:18px;height:18px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(59,130,246,0.6);";
      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        position: pos,
        map: mapRef.current,
        content: el,
      });
    } else {
      markerRef.current.position = pos;
    }
    mapRef.current.panTo(pos);
  }, [position]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
