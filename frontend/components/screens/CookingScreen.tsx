"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import MapCanvas, { type MapCanvasHandle } from "@/components/MapCanvas";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { getDifficultyBg } from "@/lib/score";

interface CookingScreenProps {
  route: GlamRoute;
  onDone: () => void;
}

const LOADING_LINES = [
  "Scanning Bengaluru's beauty hazards…",
  "Consulting the pothole oracles…",
  "Calibrating your makeup integrity baseline…",
  "Plotting your glow route…",
];

type Beat = "loading" | "map-reveal" | "route-draw" | "mascot-reveal" | "stats-slide" | "done";

export default function CookingScreen({ route, onDone }: CookingScreenProps) {
  const mapRef = useRef<MapCanvasHandle>(null);
  const [beat, setBeat] = useState<Beat>("loading");
  const [loadingLineIdx, setLoadingLineIdx] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const sequenceStarted = useRef(false);

  useEffect(() => {
    if (beat !== "loading") return;
    const interval = setInterval(() => {
      setLoadingLineIdx((prev) => Math.min(prev + 1, LOADING_LINES.length - 1));
    }, 600);
    return () => clearInterval(interval);
  }, [beat]);

  const runSequence = useCallback(() => {
    if (sequenceStarted.current) return;
    sequenceStarted.current = true;

    setBeat("map-reveal");
    mapRef.current?.flyTo(route.startCoords, 14);

    setTimeout(() => {
      setBeat("route-draw");
      mapRef.current?.drawRoute(route, () => {
        setTimeout(() => {
          setBeat("mascot-reveal");
          mapRef.current?.addMascotMarker(route.startCoords);
          setTimeout(() => {
            setBeat("stats-slide");
            setTimeout(() => {
              setBeat("done");
              setTimeout(onDone, 600);
            }, 1400);
          }, 700);
        }, 500);
      });
    }, 1300);
  }, [route, onDone]);

  useEffect(() => {
    if (loadingLineIdx < LOADING_LINES.length - 1) return;
    if (!mapReady) return;
    if (beat !== "loading") return;
    const t = setTimeout(runSequence, 500);
    return () => clearTimeout(t);
  }, [loadingLineIdx, mapReady, beat, runSequence]);

  const mapVisible = beat !== "loading";

  return (
    <div className="relative flex flex-col min-h-dvh w-full overflow-hidden">
      {/* Pink pulsating bg — visible only during loading state */}
      <AnimatePresence>
        {!mapVisible && (
          <motion.div
            key="loading-bg"
            className="absolute inset-0 z-0"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0" style={{ background: "#fff" }} />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(125% 125% at 50% 90%, rgba(255,255,255,0) 40%, #ec4899 100%)",
                animation: "glam-pulse 4s ease-in-out infinite",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map — always mounted, fades in */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ opacity: mapVisible ? 1 : 0 }}
        transition={{ duration: 0.9 }}
      >
        <MapCanvas
          ref={mapRef}
          className="w-full h-full"
          initialCenter={route.startCoords}
          initialZoom={12}
          onReady={() => setMapReady(true)}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(240,240,255,0.55) 0%, rgba(240,240,255,0.08) 50%, transparent 100%)" }}
        />
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {beat === "loading" && (
          <motion.div
            key="loading"
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-20 px-8"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <motion.div
                className="font-playfair text-3xl font-bold"
                style={{
                  background: "linear-gradient(90deg, #C2185B, #FF4081, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦ Glamifying Your Route ✦
              </motion.div>

              <div className="flex flex-col gap-3 w-full text-left">
                {LOADING_LINES.map((line, i) => (
                  <AnimatePresence key={i}>
                    {i <= loadingLineIdx && (
                      <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <span className="text-sm font-inter w-4 text-center"
                          style={{ color: i < loadingLineIdx ? "#16a34a" : "#FF4081" }}>
                          {i < loadingLineIdx ? "✓" : "›"}
                        </span>
                        <span
                          className="font-inter text-sm flex-1"
                          style={{
                            color: i < loadingLineIdx ? "#8480aa" : "#1e1b4b",
                            textDecoration: i < loadingLineIdx ? "line-through" : "none",
                          }}
                        >
                          {line}
                        </span>
                        {i === loadingLineIdx && <LoadingDots />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route name badge */}
      <AnimatePresence>
        {(beat === "route-draw" || beat === "mascot-reveal" || beat === "stats-slide") && (
          <motion.div
            key="route-name"
            className="absolute top-10 left-0 right-0 flex justify-center z-20"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", damping: 16 }}
          >
            <div className="glass px-5 py-2 text-center">
              <p className="font-inter text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#8480aa" }}>
                Your Glam Route
              </p>
              <p className="font-playfair text-xl font-bold" style={{ color: "#1e1b4b" }}>{route.glamName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot burst */}
      <AnimatePresence>
        {(beat === "mascot-reveal" || beat === "stats-slide") && (
          <motion.div
            key="mascot-burst"
            className="absolute left-0 right-0 flex justify-center z-20"
            style={{ top: "40%" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 10, stiffness: 140 }}
          >
            <div className="glass px-4 py-2.5 flex items-center gap-3">
              <motion.span className="text-2xl" animate={{ rotate: [0, 15, -10, 0] }} transition={{ duration: 0.6, delay: 0.2 }}>💄</motion.span>
              <span className="font-playfair text-sm font-bold" style={{ color: "#1e1b4b" }}>She&apos;s ready. Let&apos;s go.</span>
              <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-base">✨</motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats panel */}
      <AnimatePresence>
        {beat === "stats-slide" && (
          <motion.div
            key="stats"
            className="absolute inset-x-3 bottom-3 z-20 glass-dark px-5 py-5 rounded-2xl"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-playfair text-lg font-bold" style={{ color: "#1e1b4b" }}>{route.glamName}</p>
                <p className="font-inter text-xs" style={{ color: "#8480aa" }}>{route.realName}</p>
              </div>
              <span className={`text-xs font-inter font-semibold px-2 py-1 rounded-full border ${getDifficultyBg(route.difficulty)}`}>
                {route.difficulty}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <StatChip label="Checkpoints" value={`${route.checkpoints.length}`} />
              <StatChip label="Hazard Zones" value={`${route.stats.hazardZones}`} />
              <StatChip label="Community Reports" value={`${route.stats.communityReports}`} />
            </div>

            <p className="font-inter text-xs italic mb-3" style={{ color: "#4c4876" }}>&quot;{route.description}&quot;</p>

            <div className="flex items-center justify-between">
              <AuthenticityBadge variant="namma" size="sm" />
              <motion.span
                className="font-inter text-xs font-semibold"
                style={{ color: "#FF4081" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                Starting journey…
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="font-inter font-bold text-xl" style={{ color: "#1e1b4b" }}>{value}</span>
      <span className="font-inter text-xs leading-tight" style={{ color: "#8480aa" }}>{label}</span>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1 items-center">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: "#FF4081" }}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay }}
        />
      ))}
    </span>
  );
}
