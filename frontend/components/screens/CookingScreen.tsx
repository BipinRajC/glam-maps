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

type Beat =
  | "loading"
  | "map-zoom"
  | "route-draw"
  | "mascot-reveal"
  | "checkpoints-pulse"
  | "stats-slide"
  | "done";

export default function CookingScreen({ route, onDone }: CookingScreenProps) {
  const mapRef = useRef<MapCanvasHandle>(null);
  const [beat, setBeat] = useState<Beat>("loading");
  const [loadingLineIdx, setLoadingLineIdx] = useState(0);
  const [mapReady, setMapReady] = useState(false);
  const beatRef = useRef<Beat>("loading");

  // Advance loading lines
  useEffect(() => {
    if (beat !== "loading") return;
    const interval = setInterval(() => {
      setLoadingLineIdx((prev) => {
        if (prev >= LOADING_LINES.length - 1) return prev;
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [beat]);

  const advanceBeat = useCallback((next: Beat) => {
    beatRef.current = next;
    setBeat(next);
  }, []);

  // Choreography starts once loading lines are done AND map is ready
  useEffect(() => {
    if (loadingLineIdx < LOADING_LINES.length - 1) return;
    if (!mapReady) return;
    if (beat !== "loading") return;

    // Small delay after last line, then start sequence
    const t = setTimeout(() => {
      advanceBeat("map-zoom");

      // Fly to route
      mapRef.current?.flyTo(route.startCoords, 14);

      setTimeout(() => {
        advanceBeat("route-draw");
        mapRef.current?.drawRoute(route, () => {
          setTimeout(() => {
            advanceBeat("mascot-reveal");
            mapRef.current?.addMascotMarker(route.startCoords);

            setTimeout(() => {
              advanceBeat("checkpoints-pulse");
              setTimeout(() => {
                advanceBeat("stats-slide");
                setTimeout(() => {
                  advanceBeat("done");
                  setTimeout(onDone, 800);
                }, 1200);
              }, 600);
            }, 700);
          }, 400);
        });
      }, 1200); // wait for fly-to
    }, 500);

    return () => clearTimeout(t);
  }, [loadingLineIdx, mapReady, beat, route, onDone, advanceBeat]);

  const showMap = beat !== "loading";

  return (
    <motion.div
      className="relative flex flex-col min-h-dvh w-full overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0D0D1E 0%, #2D0F35 50%, #1A0D2E 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Map backdrop — hidden during loading */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MapCanvas
              ref={mapRef}
              className="w-full h-full"
              initialCenter={route.startCoords}
              initialZoom={13}
              onReady={() => setMapReady(true)}
            />
            {/* Dark overlay on map */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(26,10,46,0.7) 0%, rgba(26,10,46,0.2) 60%, transparent 100%)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* If map not shown yet, invisible map preloads */}
      {!showMap && (
        <div className="absolute inset-0 pointer-events-none opacity-0">
          <MapCanvas
            ref={mapRef}
            initialCenter={route.startCoords}
            initialZoom={13}
            onReady={() => setMapReady(true)}
          />
        </div>
      )}

      {/* Loading overlay */}
      <AnimatePresence>
        {beat === "loading" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-20 px-8"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated gradient BG */}
            <motion.div
              className="absolute inset-0"
              animate={{ background: [
                "linear-gradient(135deg, #1A1A2E, #2D0F35, #1A1A2E)",
                "linear-gradient(135deg, #2D0F35, #1A1A2E, #C2185B22)",
                "linear-gradient(135deg, #1A1A2E, #2D0F35, #1A1A2E)",
              ] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <motion.div
                className="font-playfair text-4xl font-bold"
                style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦ Glamifying Route ✦
              </motion.div>

              <div className="flex flex-col gap-3 w-full">
                {LOADING_LINES.map((line, i) => (
                  <AnimatePresence key={i}>
                    {i <= loadingLineIdx && (
                      <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.span
                          className="text-sm font-inter text-cream/80"
                          animate={i === loadingLineIdx ? { opacity: [0.6, 1, 0.6] } : undefined}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {i < loadingLineIdx ? "✓" : "›"}
                        </motion.span>
                        <span
                          className={`font-inter text-sm ${i < loadingLineIdx ? "text-cream/40 line-through" : "text-cream"}`}
                        >
                          {line}
                        </span>
                        {i === loadingLineIdx && (
                          <LoadingDots />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route revealed overlay — bottom UI */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-0 pointer-events-none">
        {/* Mascot reveal burst */}
        <AnimatePresence>
          {(beat === "mascot-reveal" || beat === "checkpoints-pulse" || beat === "stats-slide" || beat === "done") && (
            <motion.div
              className="flex items-center justify-center pb-2"
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 10, stiffness: 120 }}
            >
              <div className="glass px-4 py-2 flex items-center gap-3">
                <span className="text-2xl">💄</span>
                <span className="font-playfair text-sm text-cream font-bold">She&apos;s ready. Let&apos;s go.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats panel slides up */}
        <AnimatePresence>
          {(beat === "stats-slide" || beat === "done") && (
            <motion.div
              className="glass-dark mx-3 mb-3 px-5 py-4 rounded-2xl pointer-events-auto"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 18, stiffness: 100 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-playfair text-lg font-bold text-cream">{route.glamName}</p>
                  <p className="font-inter text-xs text-champagne/60">{route.realName}</p>
                </div>
                <span className={`text-xs font-inter font-semibold px-2 py-1 rounded-full border ${getDifficultyBg(route.difficulty)}`}>
                  {route.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <StatChip label="Checkpoints" value={`${route.checkpoints.length}`} />
                <StatChip label="Hazard Zones" value={`${route.stats.hazardZones}`} />
                <StatChip label="Community Reports" value={`${route.stats.communityReports}`} />
              </div>

              <p className="font-inter text-xs text-cream/50 italic mb-3">
                &quot;{route.description}&quot;
              </p>

              <div className="flex justify-between items-center">
                <AuthenticityBadge variant="namma" size="sm" />
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="font-inter text-xs text-electric-pink font-semibold">
                    Starting journey…
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Route name overlay — center */}
      <AnimatePresence>
        {(beat === "route-draw" || beat === "mascot-reveal") && (
          <motion.div
            className="absolute top-16 left-0 right-0 flex justify-center z-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass px-5 py-2 text-center">
              <p className="font-inter text-xs text-champagne/60 font-semibold uppercase tracking-widest mb-0.5">
                Your Glam Route
              </p>
              <p className="font-playfair text-xl font-bold text-cream">{route.glamName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="font-inter font-bold text-lg text-cream">{value}</span>
      <span className="font-inter text-xs text-champagne/50 leading-tight">{label}</span>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      {[0, 0.2, 0.4].map((delay, i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-electric-pink inline-block"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay }}
        />
      ))}
    </span>
  );
}
