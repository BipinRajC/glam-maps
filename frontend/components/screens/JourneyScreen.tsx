"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlamRoute } from "@/lib/routes";
import type { JourneyState } from "@/lib/journeyMachine";
import { Camera, Map } from "lucide-react";
import MapCanvas, { type MapCanvasHandle } from "@/components/MapCanvas";
import CheckpointCard from "@/components/CheckpointCard";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { getDifficultyBg } from "@/lib/score";
import { haversineMeters, formatDistance } from "@/lib/routeCalc";
import { getCheckpointBanner } from "@/lib/commentary";

const CHECKPOINT_PROXIMITY_M = 50;

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
  const [checkpointBanner, setCheckpointBanner] = useState<string | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const currentCoordsRef = useRef<[number, number]>(route.startCoords);
  const watchIdRef = useRef<number | null>(null);
  const nextCpIdxRef = useRef(0);
  const arrivedRef = useRef(false);

  const onReachCheckpointRef = useRef(onReachCheckpoint);
  const onArriveRef = useRef(onArrive);
  useEffect(() => { onReachCheckpointRef.current = onReachCheckpoint; }, [onReachCheckpoint]);
  useEffect(() => { onArriveRef.current = onArrive; }, [onArrive]);

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

  const checkProximity = useCallback((coords: [number, number]) => {
    if (arrivedRef.current) return;
    const cpIdx = nextCpIdxRef.current;
    const cp = route.checkpoints[cpIdx];
    if (!cp) {
      const distToEnd = haversineMeters(coords, route.endCoords);
      if (distToEnd < CHECKPOINT_PROXIMITY_M) {
        arrivedRef.current = true;
        onArriveRef.current();
      }
      setNextCheckpointDistanceM(0);
      return;
    }

    const dist = haversineMeters(coords, cp.coords);
    setNextCheckpointDistanceM(Math.round(dist));

    if (dist < CHECKPOINT_PROXIMITY_M) {
      if (navigator.vibrate) navigator.vibrate(200);
      const banner = getCheckpointBanner(cpIdx, cp.def.hazardType);
      setCheckpointBanner(banner);
      onReachCheckpointRef.current(cpIdx, cp.def.integrityDelta, cp.progressPct);
      nextCpIdxRef.current = cpIdx + 1;
    }
  }, [route]);

  useEffect(() => {
    if (mirrorMode) startCamera();
    else stopCamera();
  }, [mirrorMode, startCamera, stopCamera]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (!mapReady) return;

    mapRef.current?.drawRoute(route);
    mapRef.current?.addMascotMarker(route.startCoords);
    mapRef.current?.flyTo(route.startCoords, 14);

    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        currentCoordsRef.current = coords;
        checkProximity(coords);
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [mapReady, route, checkProximity]);

  const prevActiveCard = useRef(false);
  useEffect(() => {
    const wasActive = prevActiveCard.current;
    const isActive = journeyState.activeCheckpointCard;
    prevActiveCard.current = isActive;

    if (isActive && !wasActive) {
      const cp = route.checkpoints[journeyState.checkpointIndex];
      if (cp) {
        const banner = getCheckpointBanner(journeyState.checkpointIndex, cp.def.hazardType);
        mapRef.current?.showCheckpointPopup(cp.coords, banner);
      }
    }
    if (wasActive && !isActive) {
      mapRef.current?.removeCheckpointPopup();
      setCheckpointBanner(null);
    }
  }, [journeyState.activeCheckpointCard, journeyState.checkpointIndex, route.checkpoints]);

  const handleMapReady = useCallback(() => {
    setMapReady(true);
  }, []);

  const { makeupIntegrity, progressPct, checkpointIndex, activeCheckpointCard } = journeyState;
  const activeCheckpoint = checkpointIndex >= 0 ? route.checkpoints[checkpointIndex] : null;

  return (
    <motion.div
      className="relative w-full min-h-dvh overflow-hidden bg-[#f0f0ff]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border"
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

            <div className="absolute top-3 left-3 right-3 flex flex-col gap-2">
              {checkpointBanner && (
                <motion.div
                  className="glass-dark px-4 py-3 rounded-xl"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="font-inter text-sm font-semibold text-cream/90">{checkpointBanner}</span>
                </motion.div>
              )}
              <div className="flex items-center gap-2">
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

function StatItem({ value, label, accent }: { value: string; label: string; accent: "green" | "gold" | "red" | "blue" }) {
  const colors = { green: "#22c55e", gold: "#F9A825", red: "#ef4444", blue: "#60a5fa" };
  return (
    <div className="flex flex-col items-center gap-0.5 flex-1 text-center">
      <span className="font-inter text-base font-bold tabular-nums" style={{ color: colors[accent] }}>{value}</span>
      <span className="font-inter text-xs text-cream/40 leading-tight">{label}</span>
    </div>
  );
}
