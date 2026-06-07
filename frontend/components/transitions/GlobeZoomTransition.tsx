"use client";

import { useEffect, useRef, useCallback, useState } from "react";

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function greatCircleArc(
  from: [number, number],
  to: [number, number],
  segments = 80,
): [number, number][] {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;

  const lat1r = toRad(lat1);
  const lat2r = toRad(lat2);
  const lng1r = toRad(lng1);
  const lng2r = toRad(lng2);

  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin((lat2r - lat1r) / 2), 2) +
          Math.cos(lat1r) *
            Math.cos(lat2r) *
            Math.pow(Math.sin((lng2r - lng1r) / 2), 2),
      ),
    );

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const f = i / segments;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);

    const x =
      A * Math.cos(lat1r) * Math.cos(lng1r) +
      B * Math.cos(lat2r) * Math.cos(lng2r);
    const y =
      A * Math.cos(lat1r) * Math.sin(lng1r) +
      B * Math.cos(lat2r) * Math.sin(lng2r);
    const z = A * Math.sin(lat1r) + B * Math.sin(lat2r);

    const lat = toDeg(Math.atan2(z, Math.sqrt(x * x + y * y)));
    const lng = toDeg(Math.atan2(y, x));

    points.push([lng, lat]);
  }

  return points;
}

function midpoint(
  a: [number, number],
  b: [number, number],
): [number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
}

export interface GlobeZoomTransitionProps {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  onComplete: () => void;
  skippable?: boolean;
}

const POSITRON_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const ARC_COLOR = "#FF4081";
const START_COLOR = "#16a34a";
const END_COLOR = "#FF4081";

export default function GlobeZoomTransition({
  fromLat,
  fromLng,
  toLat,
  toLng,
  onComplete,
  skippable = true,
}: GlobeZoomTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<InstanceType<typeof import("maplibre-gl").Map> | null>(
    null,
  );
  const completedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const [phase, setPhase] = useState<"globe" | "flying" | "fading" | "done">(
    "globe",
  );

  const fireComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  const clearAllTimeouts = useCallback(() => {
    while (timeoutsRef.current.length) {
      const id = timeoutsRef.current.pop();
      if (id !== undefined) window.clearTimeout(id);
    }
  }, []);

  const handleSkip = useCallback(() => {
    if (!skippable || completedRef.current) return;
    clearAllTimeouts();
    mapRef.current?.stop();
    setPhase("done");
    const t = window.setTimeout(fireComplete, 200);
    timeoutsRef.current.push(t);
  }, [skippable, fireComplete, clearAllTimeouts]);

  useEffect(() => {
    if (completedRef.current) return;
    if (!containerRef.current) return;

    const from: [number, number] = [fromLng, fromLat];
    const to: [number, number] = [toLng, toLat];
    const center = midpoint(from, to);

    let cancelled = false;

    import("maplibre-gl").then((ml) => {
      if (cancelled || !containerRef.current) return;

      const map = new ml.Map({
        container: containerRef.current,
        style: POSITRON_STYLE,
        center,
        zoom: 1,
        attributionControl: false,
        interactive: false,
        // Globe projection set after style.load
      } as ConstructorParameters<typeof ml.Map>[0]);

      mapRef.current = map;

      map.on("style.load", () => {
        if (cancelled) return;
        map.setProjection({ type: "globe" });

        const arcSourceId = "transition-arc";
        const arcLayerId = "transition-arc-layer";

        const arcCoords = greatCircleArc(from, to, 80);

        map.addSource(arcSourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates: arcCoords },
          },
        });

        map.addLayer({
          id: arcLayerId,
          type: "line",
          source: arcSourceId,
          layout: { "line-cap": "round", "line-join": "round" },
          paint: {
            "line-color": ARC_COLOR,
            "line-width": 2.5,
            "line-opacity": 0.9,
            "line-dasharray": [2, 2],
          },
        });

        const startEl = document.createElement("div");
        startEl.style.cssText = `
          width: 18px; height: 18px; border-radius: 50%;
          background: ${START_COLOR};
          border: 2.5px solid white;
          box-shadow: 0 1px 6px rgba(0,0,0,0.18);
        `;
        new ml.Marker({ element: startEl }).setLngLat(from).addTo(map);

        const endEl = document.createElement("div");
        endEl.style.cssText = `
          width: 22px; height: 22px; border-radius: 50%;
          background: ${END_COLOR};
          border: 2.5px solid white;
          box-shadow: 0 0 0 3px rgba(255,64,129,0.25), 0 2px 10px rgba(255,64,129,0.35);
          animation: gzt-pulse 1.8s ease-in-out infinite;
        `;
        new ml.Marker({ element: endEl }).setLngLat(to).addTo(map);

        const tFly = window.setTimeout(() => {
          if (completedRef.current) return;
          setPhase("flying");

          map.flyTo({
            center: from,
            zoom: 13,
            duration: 2200,
            essential: true,
            easing: (t) => {
              // easeInOutCubic
              return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
            },
          });

          const tRemoveArc = window.setTimeout(() => {
            if (map.getLayer(arcLayerId)) map.removeLayer(arcLayerId);
            if (map.getSource(arcSourceId)) map.removeSource(arcSourceId);
          }, 1100);
          timeoutsRef.current.push(tRemoveArc);

          const tFade = window.setTimeout(() => {
            if (completedRef.current) return;
            setPhase("fading");
            const tDone = window.setTimeout(() => {
              setPhase("done");
              fireComplete();
            }, 400);
            timeoutsRef.current.push(tDone);
          }, 2300);
          timeoutsRef.current.push(tFade);
        }, 900);
        timeoutsRef.current.push(tFly);
      });
    });

    return () => {
      cancelled = true;
      clearAllTimeouts();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [fromLat, fromLng, toLat, toLng, fireComplete, clearAllTimeouts]);

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) handleSkip();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [handleSkip]);

  const opacity = phase === "fading" || phase === "done" ? 0 : 1;

  return (
    <div
      className="absolute inset-0 z-50 bg-white"
      style={{
        opacity,
        transition: "opacity 0.4s ease-out",
        pointerEvents: phase === "done" ? "none" : "auto",
        cursor: skippable ? "pointer" : "default",
        // Hard-cap the map to the mobile container width; never spill into
        // a wide web viewport even if a parent loses its constraint.
        maxWidth: "100vw",
        overflow: "hidden",
        contain: "strict",
      }}
      onClick={handleSkip}
      onTouchStart={handleSkip}
      role="presentation"
    >
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <style>{`
        @keyframes gzt-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.75; }
        }
      `}</style>
    </div>
  );
}
