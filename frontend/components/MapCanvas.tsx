"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { GlamRoute } from "@/lib/routes";

let maplibregl: typeof import("maplibre-gl") | null = null;

export interface MapCanvasHandle {
  flyTo: (coords: [number, number], zoom?: number) => void;
  drawRoute: (route: GlamRoute, onDone?: () => void) => void;
  addMascotMarker: (coords: [number, number]) => void;
  moveMascotMarker: (coords: [number, number]) => void;
  showCheckpointPopup: (coords: [number, number], text: string) => void;
  removeCheckpointPopup: () => void;
  project: (coords: [number, number]) => { x: number; y: number } | null;
  getMap: () => InstanceType<typeof import("maplibre-gl").Map> | null;
}

interface MapCanvasProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  onReady?: () => void;
  interactive?: boolean;
}

const BENGALURU_CENTER: [number, number] = [77.5946, 12.9716];

const MapCanvas = forwardRef<MapCanvasHandle, MapCanvasProps>(
  ({ className = "", initialCenter = BENGALURU_CENTER, initialZoom = 11, onReady, interactive = true }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<InstanceType<typeof import("maplibre-gl").Map> | null>(null);
    const mascotMarkerRef = useRef<InstanceType<typeof import("maplibre-gl").Marker> | null>(null);
    const popupRef = useRef<InstanceType<typeof import("maplibre-gl").Popup> | null>(null);
    const routeAnimFrameRef = useRef<number | null>(null);

    useEffect(() => {
      if (!containerRef.current || mapRef.current) return;

      let map: InstanceType<typeof import("maplibre-gl").Map>;

      import("maplibre-gl").then((ml) => {
        maplibregl = ml;

        map = new ml.Map({
          container: containerRef.current!,
          style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
          center: initialCenter,
          zoom: initialZoom,
          attributionControl: false,
          interactive,
        });

        mapRef.current = map;
        if (map.loaded()) {
          onReady?.();
        } else {
          map.once("idle", () => { onReady?.(); });
        }
      });

      return () => {
        if (routeAnimFrameRef.current) cancelAnimationFrame(routeAnimFrameRef.current);
        popupRef.current?.remove();
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
        if (!map || !maplibregl) return;

        const sourceId = "glam-route";
        const layerId = "glam-route-layer";

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
          paint: { "line-color": "#FF4081", "line-width": 5, "line-opacity": 0.9 },
        });

        // ── Start marker (green pin with ring) ──
        const startEl = document.createElement("div");
        startEl.style.cssText = `
          width: 22px; height: 22px; border-radius: 50%;
          background: #16a34a;
          border: 3px solid white;
          box-shadow: 0 0 0 3px #16a34a55, 0 2px 10px rgba(0,0,0,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
        `;
        startEl.innerHTML = "▶";
        startEl.style.color = "white";
        new maplibregl.Marker({ element: startEl })
          .setLngLat(route.startCoords)
          .addTo(map);

        // ── End/destination marker (pink flag) ──
        const endEl = document.createElement("div");
        endEl.style.cssText = `
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #C2185B, #FF4081);
          border: 3px solid white;
          box-shadow: 0 0 0 3px rgba(194,24,91,0.35), 0 2px 12px rgba(194,24,91,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          animation: pulse-marker 2s infinite;
        `;
        endEl.innerHTML = "🏁";
        new maplibregl.Marker({ element: endEl })
          .setLngLat(route.endCoords)
          .addTo(map);

        // ── Checkpoint markers ──
        route.checkpoints.forEach((cp) => {
          if (!maplibregl) return;
          const el = document.createElement("div");
          el.style.cssText = `
            width: 18px; height: 18px; border-radius: 50%;
            background: ${markerColor(cp.def.markerColor)};
            border: 2.5px solid white;
            box-shadow: 0 0 0 2px ${markerColor(cp.def.markerColor)}55, 0 2px 8px rgba(0,0,0,0.2);
            ${cp.def.pulse ? "animation: pulse-marker 2s infinite;" : ""}
          `;
          new maplibregl.Marker({ element: el })
            .setLngLat(cp.coords)
            .addTo(map!);
        });

        // ── Animate route drawing ──
        const TARGET_FRAMES = 120;
        const step = Math.max(1, Math.ceil(coords.length / TARGET_FRAMES));
        let frameCount = 0;

        function animate() {
          frameCount++;
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
      },

      addMascotMarker(coords) {
        const map = mapRef.current;
        if (!map || !maplibregl) return;

        mascotMarkerRef.current?.remove();
        mascotMarkerRef.current = null;

        const el = document.createElement("div");
        el.id = "mascot-map-marker";
        el.style.cssText = `
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #C2185B, #FF4081);
          border: 3px solid white;
          box-shadow: 0 0 0 3px rgba(194,24,91,0.4), 0 2px 16px rgba(194,24,91,0.6);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
          z-index: 100;
        `;
        el.innerHTML = "💄";

        mascotMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(map);
      },

      moveMascotMarker(coords) {
        mascotMarkerRef.current?.setLngLat(coords);
        // Follow the mascot — duration matches GSAP segment (0.7s), linear easing keeps it locked
        mapRef.current?.easeTo({ center: coords, duration: 750, easing: (t) => t });
      },

      showCheckpointPopup(coords, text) {
        const map = mapRef.current;
        if (!map || !maplibregl) return;
        popupRef.current?.remove();
        popupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 20,
          className: "glam-checkpoint-popup",
        })
          .setLngLat(coords)
          .setHTML(`<span style="font-family:sans-serif;font-size:12px;font-weight:700;color:#1e1b4b;white-space:nowrap;">${text}</span>`)
          .addTo(map);
      },

      removeCheckpointPopup() {
        popupRef.current?.remove();
        popupRef.current = null;
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
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.35); opacity: 0.75; }
          }
          .glam-checkpoint-popup .maplibregl-popup-content {
            background: rgba(255,255,255,0.96);
            border: 1px solid rgba(99,102,241,0.22);
            border-radius: 12px;
            padding: 7px 13px;
            box-shadow: 0 4px 18px rgba(99,102,241,0.18);
          }
          .glam-checkpoint-popup .maplibregl-popup-tip {
            border-top-color: rgba(255,255,255,0.96);
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
    green: "#16a34a",
    blue: "#6366f1",
    yellow: "#d97706",
    orange: "#f97316",
    red: "#dc2626",
  };
  return map[color] ?? "#6366f1";
}

export default MapCanvas;
