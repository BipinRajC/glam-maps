"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import type { HazardType } from "@/lib/checkpoints";
import type { JourneyState } from "@/lib/journeyMachine";
import MapCanvas, { type MapCanvasHandle } from "@/components/MapCanvas";
import CheckpointCard from "@/components/CheckpointCard";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { getDifficultyBg } from "@/lib/score";

const CHECKPOINT_WITTIES: Record<HazardType, string> = {
  smooth:             "Makeup intact. Rare Bengaluru sighting ✨",
  flyover:            "No lipstick zone up here ⬆️",
  "pothole-light":    "Slight wobble. Hold your brushes 💄",
  "pothole-cluster":  "Foundation has left the chat 😭",
  "pothole-severe":   "RIP contour. No survivors 💀",
  construction:       "Road work? More like face work 🚧",
  "speed-hump":       "Lipstick exit: confirmed 💋",
};

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

  const gsapRef = useRef<typeof import("gsap")["gsap"] | null>(null);
  const animState = useRef({ segIdx: 0, cpIdx: 0, paused: false, started: false });

  // Always-current callbacks — stable refs prevent stale closures inside GSAP
  const onReachCheckpointRef = useRef(onReachCheckpoint);
  const onArriveRef = useRef(onArrive);
  useEffect(() => { onReachCheckpointRef.current = onReachCheckpoint; }, [onReachCheckpoint]);
  useEffect(() => { onArriveRef.current = onArrive; }, [onArrive]);

  // Only move the MapLibre marker — it follows map pan/zoom natively
  const moveMascot = useCallback((lng: number, lat: number) => {
    mapRef.current?.moveMascotMarker([lng, lat]);
  }, []);

  // Animation loop stored in a ref — GSAP onComplete always calls the current version
  const loopRef = useRef<() => void>(() => {});

  loopRef.current = function runSegment() {
    const gsap = gsapRef.current;
    const st = animState.current;
    if (!gsap || st.paused) return;

    const polyline = route.polyline;
    const totalSegs = polyline.length - 1;

    if (st.segIdx >= totalSegs) {
      setTimeout(() => onArriveRef.current(), 600);
      return;
    }

    const from = polyline[st.segIdx];
    const to = polyline[st.segIdx + 1];
    const progress = { t: 0 };

    gsap.to(progress, {
      t: 1,
      duration: 0.7,
      ease: "none",
      overwrite: "auto",
      onUpdate() {
        const lng = from[0] + (to[0] - from[0]) * progress.t;
        const lat = from[1] + (to[1] - from[1]) * progress.t;
        moveMascot(lng, lat);
      },
      onComplete() {
        st.segIdx++;
        const pctDone = (st.segIdx / totalSegs) * 100;
        const cp = route.checkpoints[st.cpIdx];
        if (cp && pctDone >= cp.progressPct) {
          st.paused = true;
          onReachCheckpointRef.current(st.cpIdx, cp.def.integrityDelta, cp.progressPct);
          st.cpIdx++;
        } else {
          loopRef.current();
        }
      },
    });
  };

  useEffect(() => {
    import("gsap").then((mod) => { gsapRef.current = mod.gsap; });
  }, []);

  // Start animation once map + GSAP are both ready
  useEffect(() => {
    if (!mapReady) return;
    if (animState.current.started) return;
    const poll = setInterval(() => {
      if (!gsapRef.current) return;
      clearInterval(poll);
      animState.current.started = true;
      mapRef.current?.drawRoute(route);
      setTimeout(() => loopRef.current(), 900);
    }, 100);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  // Resume after checkpoint dismissed + manage map popup
  const prevActiveCard = useRef(false);
  useEffect(() => {
    const wasActive = prevActiveCard.current;
    const isActive = journeyState.activeCheckpointCard;
    prevActiveCard.current = isActive;

    if (isActive && !wasActive) {
      // Show witty popup at the checkpoint that was just reached
      const cp = route.checkpoints[journeyState.checkpointIndex];
      if (cp) {
        const witty = CHECKPOINT_WITTIES[cp.def.hazardType] ?? "Something happened to your glam 💄";
        mapRef.current?.showCheckpointPopup(cp.coords, witty);
      }
    }
    if (wasActive && !isActive) {
      mapRef.current?.removeCheckpointPopup();
      if (animState.current.paused) {
        animState.current.paused = false;
        setTimeout(() => loopRef.current(), 450);
      }
    }
  }, [journeyState.activeCheckpointCard, journeyState.checkpointIndex, route.checkpoints]);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
    mapRef.current?.addMascotMarker(route.startCoords);
    mapRef.current?.flyTo(route.startCoords, 14);
  }, [route.startCoords]);

  const { makeupIntegrity, progressPct, checkpointIndex, activeCheckpointCard } = journeyState;
  const activeCheckpoint = checkpointIndex >= 0 ? route.checkpoints[checkpointIndex] : null;

  return (
    <motion.div
      className="relative w-full min-h-dvh overflow-hidden bg-[#f0f0ff]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Full-screen map — interactive: pan + zoom enabled */}
      <div className="absolute inset-0">
        <MapCanvas
          ref={mapRef}
          className="w-full h-full"
          initialCenter={route.startCoords}
          initialZoom={14}
          onReady={handleMapReady}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(240,240,255,0.6) 0%, rgba(240,240,255,0.1) 35%, transparent 55%)" }}
        />
      </div>

      {/* Top HUD — responsive width */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center px-3">
        <div className="w-full max-w-2xl flex flex-col gap-2">
          <motion.div
            className="glass px-4 py-2.5 flex items-center gap-2"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", damping: 20 }}
          >
            <span className="text-lg">{route.emoji}</span>
            <span className="font-playfair text-sm sm:text-base font-bold text-cream flex-1 truncate">
              {route.glamName}
            </span>
            <span className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border shrink-0 ${getDifficultyBg(route.difficulty)}`}>
              {route.difficulty}
            </span>
          </motion.div>

          <motion.div
            className="glass px-4 py-2"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, type: "spring", damping: 20 }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-inter text-xs text-cream/55">Route Progress</span>
              <span className="font-inter text-xs font-bold text-cream tabular-nums">{Math.round(progressPct)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #C2185B, #FF4081, #F9A825)" }}
                animate={{ width: `${Math.max(progressPct, 2)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom — stats bar OR checkpoint card, centered + responsive */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {activeCheckpointCard && activeCheckpoint ? (
              <CheckpointCard
                key={`cp-${checkpointIndex}`}
                checkpoint={activeCheckpoint.def}
                checkpointNumber={checkpointIndex + 1}
                totalCheckpoints={route.checkpoints.length}
                makeupIntegrity={makeupIntegrity}
                onContinue={onDismissCheckpoint}
              />
            ) : (
              <motion.div
                key="stats"
                className="glass-dark mx-3 mb-3 px-4 py-3 rounded-2xl"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 200 }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <StatItem value={`${makeupIntegrity}%`} label="Makeup integrity" accent={makeupIntegrity > 70 ? "green" : makeupIntegrity > 40 ? "gold" : "red"} />
                  <div className="w-px h-8 bg-white/10" />
                  <StatItem value={`${route.stats.potholeCount}`} label="Pothole clusters" accent="red" />
                  <div className="w-px h-8 bg-white/10" />
                  <StatItem value={`${route.stats.communityReports}`} label="Reports" accent="blue" />
                </div>
                <AuthenticityBadge variant="namma" size="sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function StatItem({ value, label, accent }: { value: string; label: string; accent: "green" | "gold" | "red" | "blue" }) {
  const colors = { green: "#22c55e", gold: "#F9A825", red: "#ef4444", blue: "#60a5fa" };
  return (
    <div className="flex flex-col items-center gap-0.5 flex-1 text-center">
      <span className="font-inter text-base font-bold tabular-nums" style={{ color: colors[accent] }}>{value}</span>
      <span className="font-inter text-xs text-cream/40 leading-tight">{label}</span>
    </div>
  );
}
