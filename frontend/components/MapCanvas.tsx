"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { GlamRoute } from "@/lib/routes";

// Dynamically import maplibre to avoid SSR issues
let maplibregl: typeof import("maplibre-gl") | null = null;

export interface MapCanvasHandle {
  flyTo: (coords: [number, number], zoom?: number) => void;
  drawRoute: (route: GlamRoute, onDone?: () => void) => void;
  addMascotMarker: (coords: [number, number]) => void;
  moveMascotMarker: (coords: [number, number]) => void;
  project: (coords: [number, number]) => { x: number; y: number } | null;
  getMap: () => InstanceType<typeof import("maplibre-gl").Map> | null;
}

interface MapCanvasProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  onReady?: () => void;
}

// Bengaluru center
const BENGALURU_CENTER: [number, number] = [77.5946, 12.9716];

const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  ({ className = "", initialCenter = BENGALURU_CENTER, initialZoom = 11, onReady }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<InstanceType<typeof import("maplibre-gl").Map> | null>(null);
    const mascotMarkerRef = useRef<InstanceType<typeof import("maplibre-gl").Marker> | null>(null);
    const routeAnimFrameRef = useRef<number | null>(null);

    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      let map: InstanceType<typeof import("maplibre-gl").Map>;

      import("maplibre-gl").then((ml) => {
        maplibregl = ml;

        map = new ml.Map({
          container: containerRef.current!,
          style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
          center: initialCenter,
          zoom: initialZoom,
          attributionControl: false,
          interactive: false, // map is a backdrop — no user panning
        });

        mapRef.current = map;

        map.on("load", () => {
          onReady?.();
        });
      });

      return () => {
        if (routeAnimFrameRef.current) cancelAnimationFrame(routeAnimFrameRef.current);
        mapRef.current?.remove();
        mapRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      flyTo(coords, zoom = 14) {
        mapRef.current?.flyTo({ center: coords, zoom, duration: 1800, essential: true });
      },

      drawRoute(route: GlamRoute, onDone?: () => void) {
        const map = mapRef.current;
        if (!map) return;

        const sourceId = "glam-route";
        const layerId = "glam-route-layer";

        // Remove existing route
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);

        const coords = route.polyline;
        let drawn = 0;

        map.addSource(sourceId, {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
        });

        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": "#FF4081",
            "line-width": 5,
            "line-opacity": 0.9,
          },
        });

        // Draw the route over ~2s (120 frames at 60fps), interpolating smoothly
        const TARGET_FRAMES = 120;
        const step = Math.max(1, Math.ceil(coords.length / TARGET_FRAMES));
        let frameCount = 0;

        function animate() {
          frameCount++;
          // For short polylines, slow down by only advancing every N frames
          const advance = coords.length <= 12 ? frameCount % 12 === 0 : true;
          if (advance) drawn = Math.min(drawn + step, coords.length);
          const src = map?.getSource(sourceId) as import("maplibre-gl").GeoJSONSource | undefined;
          src?.setData({
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: coords.slice(0, drawn) },
          });

          if (drawn < coords.length) {
            routeAnimFrameRef.current = requestAnimationFrame(animate);
          } else {
            onDone?.();
          }
        }

        routeAnimFrameRef.current = requestAnimationFrame(animate);

        // Also add checkpoint markers
        route.checkpoints.forEach((cp) => {
          const el = document.createElement("div");
          el.style.cssText = `
            width: 16px; height: 16px; border-radius: 50%;
            background: ${markerColor(cp.def.markerColor)};
            border: 2px solid white;
            box-shadow: 0 0 8px ${markerColor(cp.def.markerColor)};
            ${cp.def.pulse ? "animation: pulse-marker 2s infinite;" : ""}
          `;

          if (!maplibregl) return;
          new maplibregl.Marker({ element: el })
            .setLngLat(cp.coords)
            .addTo(map!);
        });
      },

      addMascotMarker(coords) {
        const map = mapRef.current;
        if (!map || !maplibregl) return;

        const el = document.createElement("div");
        el.id = "mascot-map-marker";
        el.style.cssText = `
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #C2185B, #FF4081);
          border: 3px solid #F9A825;
          box-shadow: 0 0 16px rgba(194,24,91,0.8);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          z-index: 100;
        `;
        el.innerHTML = "💄";

        mascotMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(map);
      },

      moveMascotMarker(coords) {
        mascotMarkerRef.current?.setLngLat(coords);
      },

      project(coords) {
        const map = mapRef.current;
        if (!map) return null;
        const point = map.project(coords as [number, number]);
        return { x: point.x, y: point.y };
      },

      getMap() {
        return mapRef.current;
      },
    }));

    return (
      <>
        <style>{`
          @keyframes pulse-marker {
            0%, 100% { transform: scale(1); opacity: 1; box-shadow: 0 0 8px currentColor; }
            50% { transform: scale(1.4); opacity: 0.7; box-shadow: 0 0 20px currentColor; }
          }
        `}</style>
        <div ref={containerRef} className={`w-full h-full ${className}`} />
      </>
    );
  }
);

MapCanvas.displayName = "MapCanvas";

function markerColor(color: string): string {
  const map: Record<string, string> = {
    green: "#22c55e",
    blue: "#60a5fa",
    yellow: "#F9A825",
    orange: "#f97316",
    red: "#ef4444",
  };
  return map[color] ?? "#ffffff";
}

export default MapCanvas;
