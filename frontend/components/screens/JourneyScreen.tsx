"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import type { HazardType } from "@/lib/checkpoints";
import type { JourneyState } from "@/lib/journeyMachine";
import { Camera, Map } from "lucide-react";
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
  const [mirrorMode, setMirrorMode] = useState(false);
  const [brightnessOverlay, setBrightnessOverlay] = useState(0.22);
  const [cameraState, setCameraState] = useState<"idle" | "ready" | "blocked">("idle");
  const [nextCheckpointDistanceM, setNextCheckpointDistanceM] = useState<number | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const currentCoordsRef = useRef<[number, number]>(route.startCoords);

  const gsapRef = useRef<typeof import("gsap")["gsap"] | null>(null);
  const animState = useRef({ segIdx: 0, cpIdx: 0, paused: false, started: false });

  // Always-current callbacks — stable refs prevent stale closures inside GSAP
  const onReachCheckpointRef = useRef(onReachCheckpoint);
  const onArriveRef = useRef(onArrive);
  useEffect(() => { onReachCheckpointRef.current = onReachCheckpoint; }, [onReachCheckpoint]);
  useEffect(() => { onArriveRef.current = onArrive; }, [onArrive]);

  const updateNextCheckpointDistance = useCallback((coords: [number, number]) => {
    const nextCp = route.checkpoints[animState.current.cpIdx];
    if (!nextCp) {
      setNextCheckpointDistanceM(0);
      return;
    }
    setNextCheckpointDistanceM(Math.round(haversineMeters(coords, nextCp.coords)));
  }, [route.checkpoints]);

  const stopCamera = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
    setCameraState("idle");
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("blocked");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "user" } },
        audio: false,
      });
      cameraStreamRef.current = stream;
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        await cameraVideoRef.current.play().catch(() => {});
      }
      setCameraState("ready");
    } catch {
      setCameraState("blocked");
    }
  }, []);

  // Only move the MapLibre marker — it follows map pan/zoom natively
  const moveMascot = useCallback((lng: number, lat: number) => {
    currentCoordsRef.current = [lng, lat];
    updateNextCheckpointDistance(currentCoordsRef.current);
    mapRef.current?.moveMascotMarker([lng, lat]);
  }, [updateNextCheckpointDistance]);

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
          updateNextCheckpointDistance(to);
        } else {
          loopRef.current();
        }
      },
    });
  };

  useEffect(() => {
    import("gsap").then((mod) => { gsapRef.current = mod.gsap; });
  }, []);

  useEffect(() => {
    currentCoordsRef.current = route.startCoords;
    animState.current.cpIdx = 0;
    updateNextCheckpointDistance(route.startCoords);
    setMirrorMode(false);
  }, [route.startCoords, updateNextCheckpointDistance]);

  useEffect(() => {
    if (mirrorMode) startCamera();
    else stopCamera();
  }, [mirrorMode, startCamera, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

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

      {/* Top HUD */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center px-3">
        <div className="w-full flex flex-col gap-2">
          <motion.div
            className="glass px-4 py-2.5 flex items-center gap-2"
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, type: "spring", damping: 20 }}
          >
            <span className="text-lg">{route.emoji}</span>
            <span className="font-playfair text-sm font-bold text-cream flex-1 truncate">
              {route.glamName}
            </span>
            <button
              className="inline-flex items-center justify-center h-7 w-7 rounded-lg border"
              style={{ borderColor: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.1)", color: "#1e1b4b" }}
              onClick={() => setMirrorMode(true)}
              aria-label="Open mirror mode"
            >
              <Camera size={14} />
            </button>
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

      <AnimatePresence>
        {mirrorMode && (
          <motion.div
            key="mirror-overlay"
            className="absolute inset-0 z-40 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {cameraState === "ready" ? (
              <video
                ref={cameraVideoRef}
                className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
                muted
                autoPlay
                playsInline
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <p className="font-inter text-sm text-white/90">
                  {cameraState === "blocked" ? "Camera permission blocked. Enable front camera to use mirror mode." : "Opening front camera..."}
                </p>
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none" style={{ background: `rgba(255,255,255,${brightnessOverlay})` }} />

            <div className="absolute top-3 left-3 right-3 flex items-center gap-2">
              <div className="glass-dark px-3 py-2 rounded-xl flex-1">
                <span className="font-inter text-xs font-semibold text-cream/70">
                  Next checkpoint: {formatDistance(nextCheckpointDistanceM)}
                </span>
              </div>
              <button
                className="glass-dark h-10 px-3 rounded-xl inline-flex items-center gap-1.5"
                onClick={() => setMirrorMode(false)}
                aria-label="Back to map"
              >
                <Map size={14} />
                <span className="font-inter text-xs font-semibold">Map</span>
              </button>
            </div>

            <div className="absolute bottom-3 left-3 right-3 glass-dark px-3 py-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-inter text-xs text-cream/70">Brightness</span>
                <span className="font-inter text-xs font-semibold text-cream/70">{Math.round(brightnessOverlay * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={70}
                value={Math.round(brightnessOverlay * 100)}
                onChange={(e) => setBrightnessOverlay(Number(e.target.value) / 100)}
                className="w-full"
                aria-label="Mirror brightness"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom — stats bar OR checkpoint card */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeCheckpointCard && activeCheckpoint ? (
              <CheckpointCard
                key={`cp-${checkpointIndex}`}
                checkpoint={activeCheckpoint.def}
                checkpointNumber={checkpointIndex + 1}
                totalCheckpoints={route.checkpoints.length}
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

function haversineMeters(from: [number, number], to: [number, number]): number {
  const R = 6371000;
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function formatDistance(distanceM: number | null): string {
  if (distanceM === null) return "--";
  if (distanceM >= 1000) return `${(distanceM / 1000).toFixed(1)} km`;
  return `${distanceM} m`;
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
