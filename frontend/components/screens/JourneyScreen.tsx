"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import type { JourneyState } from "@/lib/journeyMachine";
import MapCanvas, { type MapCanvasHandle } from "@/components/MapCanvas";
import CheckpointCard from "@/components/CheckpointCard";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { getDifficultyBg } from "@/lib/score";

interface JourneyScreenProps {
  route: GlamRoute;
  journeyState: JourneyState;
  onReachCheckpoint: (index: number, delta: number, progress: number) => void;
  onDismissCheckpoint: () => void;
  onArrive: () => void;
}

export default function JourneyScreen({
  route,
  journeyState,
  onReachCheckpoint,
  onDismissCheckpoint,
  onArrive,
}: JourneyScreenProps) {
  const mapRef = useRef<MapCanvasHandle>(null);
  const [mapReady, setMapReady] = useState(false);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const gsapRef = useRef<typeof import("gsap")["gsap"] | null>(null);
  const mascotElRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof import("gsap")["gsap"]["to"]> | null>(null);
  const checkpointQueueRef = useRef<number[]>([]);
  const pausedRef = useRef(false);

  // Load GSAP
  useEffect(() => {
    import("gsap").then((mod) => {
      gsapRef.current = mod.gsap;
    });
  }, []);

  const startJourney = useCallback(() => {
    if (!mapReady || !gsapRef.current) return;
    setJourneyStarted(true);

    const map = mapRef.current?.getMap();
    if (!map) return;

    const polyline = route.polyline;
    let segIdx = 0;
    let cpIdx = 0;
    const totalSegs = polyline.length - 1;

    // Draw route first
    mapRef.current?.drawRoute(route);
    mapRef.current?.flyTo(route.startCoords, 14);

    setTimeout(() => {
      animateSegment();
    }, 1200);

    function animateSegment() {
      if (segIdx >= totalSegs) {
        // Arrived
        setTimeout(onArrive, 600);
        return;
      }

      const from = polyline[segIdx];
      const to = polyline[segIdx + 1];

      const progress = { t: 0 };
      const gsap = gsapRef.current!;

      animRef.current = gsap.to(progress, {
        t: 1,
        duration: 0.6,
        ease: "none",
        onUpdate() {
          const lng = from[0] + (to[0] - from[0]) * progress.t;
          const lat = from[1] + (to[1] - from[1]) * progress.t;
          mapRef.current?.moveMascotMarker([lng, lat]);

          // Update mascot overlay element position
          const pt = mapRef.current?.project([lng, lat]);
          if (pt && mascotElRef.current) {
            mascotElRef.current.style.transform = `translate(${pt.x - 16}px, ${pt.y - 16}px)`;
            mascotElRef.current.style.opacity = "1";
          }
        },
        onComplete() {
          segIdx++;
          // Check if we hit a checkpoint
          const pctDone = (segIdx / totalSegs) * 100;
          const cp = route.checkpoints[cpIdx];
          if (cp && pctDone >= cp.progressPct) {
            pausedRef.current = true;
            onReachCheckpoint(cpIdx, cp.def.integrityDelta, cp.progressPct);
            cpIdx++;
            // Journey will resume when checkpoint is dismissed
            checkpointQueueRef.current.push(segIdx);
          } else {
            if (!pausedRef.current) animateSegment();
          }
        },
      });
    }
  }, [mapReady, route, onReachCheckpoint, onArrive]);

  // Resume journey after checkpoint dismissed
  useEffect(() => {
    if (!journeyStarted) return;
    if (journeyState.activeCheckpointCard) return;
    if (!pausedRef.current) return;
    pausedRef.current = false;
    // Small delay for card exit animation
    setTimeout(() => {
      // Restart animation from where we left off — just restart the chain from current segment
      startJourneyFromCurrent();
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyState.activeCheckpointCard, journeyStarted]);

  const startJourneyFromCurrent = useCallback(() => {
    const savedSeg = checkpointQueueRef.current.shift() ?? 0;
    const map = mapRef.current?.getMap();
    if (!map || !gsapRef.current) return;

    const polyline = route.polyline;
    let segIdx = savedSeg;
    let cpIdx = journeyState.checkpointIndex + 1;
    const totalSegs = polyline.length - 1;

    function animateSegment() {
      if (segIdx >= totalSegs) {
        setTimeout(onArrive, 600);
        return;
      }
      const from = polyline[segIdx];
      const to = polyline[segIdx + 1];
      const progress = { t: 0 };
      const gsap = gsapRef.current!;

      gsap.to(progress, {
        t: 1,
        duration: 0.6,
        ease: "none",
        onUpdate() {
          const lng = from[0] + (to[0] - from[0]) * progress.t;
          const lat = from[1] + (to[1] - from[1]) * progress.t;
          mapRef.current?.moveMascotMarker([lng, lat]);
          const pt = mapRef.current?.project([lng, lat]);
          if (pt && mascotElRef.current) {
            mascotElRef.current.style.transform = `translate(${pt.x - 16}px, ${pt.y - 16}px)`;
            mascotElRef.current.style.opacity = "1";
          }
        },
        onComplete() {
          segIdx++;
          const pctDone = (segIdx / totalSegs) * 100;
          const cp = route.checkpoints[cpIdx];
          if (cp && pctDone >= cp.progressPct) {
            pausedRef.current = true;
            onReachCheckpoint(cpIdx, cp.def.integrityDelta, cp.progressPct);
            cpIdx++;
            checkpointQueueRef.current.push(segIdx);
          } else {
            if (!pausedRef.current) animateSegment();
          }
        },
      });
    }
    animateSegment();
  }, [route, journeyState.checkpointIndex, onReachCheckpoint, onArrive]);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
    mapRef.current?.addMascotMarker(route.startCoords);
    mapRef.current?.flyTo(route.startCoords, 14);
  }, [route.startCoords]);

  useEffect(() => {
    if (mapReady && gsapRef.current && !journeyStarted) {
      setTimeout(startJourney, 800);
    }
  }, [mapReady, journeyStarted, startJourney]);

  const { makeupIntegrity, progressPct, checkpointIndex, activeCheckpointCard } = journeyState;
  const activeCheckpoint = checkpointIndex >= 0 ? route.checkpoints[checkpointIndex] : null;

  return (
    <motion.div
      className="relative w-full min-h-dvh overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Full-screen map */}
      <MapCanvas
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
        initialCenter={route.startCoords}
        initialZoom={14}
        onReady={handleMapReady}
      />

      {/* Map gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(26,10,46,0.85) 0%, transparent 55%)" }}
      />

      {/* Mascot overlay element (positioned by GSAP) */}
      <div
        ref={mascotElRef}
        className="absolute top-0 left-0 w-8 h-8 z-30 opacity-0 pointer-events-none transition-none"
        style={{ willChange: "transform" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
          style={{
            background: "linear-gradient(135deg, #C2185B, #FF4081)",
            border: "2px solid #F9A825",
            boxShadow: "0 0 16px rgba(255,64,129,0.8)",
          }}
        >
          💄
        </div>
      </div>

      {/* Top HUD */}
      <div className="absolute top-4 left-3 right-3 z-20 flex flex-col gap-2">
        <motion.div
          className="glass px-4 py-2 flex items-center gap-3"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="font-playfair text-sm font-bold text-cream flex-1 truncate">
            {route.glamName}
          </span>
          <span className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBg(route.difficulty)}`}>
            {route.difficulty}
          </span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="glass px-3 py-2"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-inter text-xs text-cream/60">Route Progress</span>
            <span className="font-inter text-xs font-bold text-cream">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)" }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom journey stats bar */}
      <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
        <AnimatePresence>
          {!activeCheckpointCard && (
            <motion.div
              className="glass-dark mx-3 mb-3 px-4 py-3 rounded-2xl"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="grid grid-cols-3 gap-2 mb-2">
                <StatItem
                  value={`${route.stats.potholeCount} clusters`}
                  label="Pothole clusters"
                  accent={route.stats.potholeCount > 5 ? "red" : "green"}
                />
                <StatItem
                  value={`${makeupIntegrity}%`}
                  label="Makeup integrity"
                  accent={makeupIntegrity > 70 ? "green" : makeupIntegrity > 40 ? "gold" : "red"}
                />
                <StatItem
                  value={`${route.stats.smoothCorridors} smooth`}
                  label="Corridors"
                  accent="blue"
                />
              </div>
              <p className="font-inter text-xs text-cream/40 leading-relaxed">
                {route.stats.communityReports} community reports · {route.stats.hazardZones} hazard zones · last 14 days
              </p>
              <div className="mt-2 flex justify-start">
                <AuthenticityBadge variant="namma" size="sm" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkpoint card */}
        <AnimatePresence>
          {activeCheckpointCard && activeCheckpoint && (
            <CheckpointCard
              key={checkpointIndex}
              checkpoint={activeCheckpoint.def}
              checkpointNumber={checkpointIndex + 1}
              totalCheckpoints={route.checkpoints.length}
              makeupIntegrity={makeupIntegrity}
              onContinue={onDismissCheckpoint}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatItem({ value, label, accent }: { value: string; label: string; accent: "green" | "gold" | "red" | "blue" }) {
  const colors = {
    green: "#22c55e",
    gold: "#F9A825",
    red: "#ef4444",
    blue: "#60a5fa",
  };
  return (
    <div className="flex flex-col items-center text-center gap-0.5">
      <span className="font-inter text-sm font-bold" style={{ color: colors[accent] }}>{value}</span>
      <span className="font-inter text-xs text-cream/40 leading-tight">{label}</span>
    </div>
  );
}
