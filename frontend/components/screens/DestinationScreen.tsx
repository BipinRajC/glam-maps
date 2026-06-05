"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DESTINATION_CARDS, ROUTES } from "@/lib/routes";
import type { DestinationCard } from "@/lib/routes";
import type { Difficulty } from "@/lib/routes";
import { polylineDistanceM, estimateTimeMinutes, formatDistance } from "@/lib/routeCalc";
import MapCanvas, { type MapCanvasHandle } from "@/components/MapCanvas";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";

interface DestinationScreenProps {
  userLocation: [number, number] | null;
  onSelect: (routeId: string) => void;
}

const ROUTE_GROUPS = [
  {
    label: "Easy",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.2)",
    filter: (d: Difficulty) => d === "Easy",
  },
  {
    label: "Medium",
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
    filter: (d: Difficulty) => d === "Medium",
  },
  {
    label: "Survival Mode 💀",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.18)",
    filter: (d: Difficulty) => d === "Survival Mode",
  },
];

export default function DestinationScreen({ userLocation, onSelect }: DestinationScreenProps) {
  const mapRef = useRef<MapCanvasHandle>(null);
  const [selectedCard, setSelectedCard] = useState<DestinationCard | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; time: string } | null>(null);

  const startCoords = userLocation ?? [77.5946, 12.9716];

  useEffect(() => {
    if (!mapReady) return;
    mapRef.current?.flyTo(startCoords, 12);
    mapRef.current?.addMascotMarker(startCoords);
  }, [mapReady, startCoords]);

  const handleSelect = useCallback((card: DestinationCard) => {
    setSelectedCard(card);
    const route = ROUTES[card.routeId];
    if (!route) return;

    if (mapRef.current) {
      mapRef.current?.drawRoute(route);
      mapRef.current?.flyTo(route.startCoords, 13);
    }

    const dist = polylineDistanceM(route.polyline);
    const time = estimateTimeMinutes(dist);
    setRouteInfo({ distance: formatDistance(dist), time: `${time} min` });
  }, []);

  const handleStart = useCallback(() => {
    if (selectedCard) onSelect(selectedCard.routeId);
  }, [selectedCard, onSelect]);

  return (
    <GradientBackground>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
      >
        <div className="px-5 pt-8 pb-4">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter font-semibold mb-4"
            style={{ background: "rgba(194,24,91,0.1)", border: "1px solid rgba(194,24,91,0.28)", color: "#C2185B" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            ✦ Flipkart Glam Up × Namma Pothole
          </motion.div>
          <motion.h2
            className="font-playfair font-bold leading-tight"
            style={{ fontSize: "2.2rem", color: "#1e1b4b" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Where are we slaying today?
          </motion.h2>
          <motion.p
            className="font-inter text-sm mt-1"
            style={{ color: "#4c4876" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Pick your destination. Your makeup will beg for mercy.
          </motion.p>
        </div>

        <div className="h-40 mx-5 rounded-2xl overflow-hidden mb-4 relative" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
          <MapCanvas
            ref={mapRef}
            className="w-full h-full"
            initialCenter={startCoords}
            initialZoom={12}
            onReady={() => setMapReady(true)}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(240,240,255,0.5) 0%, transparent 40%)" }} />
        </div>

        <div className="flex-1 px-5 pb-8 flex flex-col gap-6 overflow-y-auto">
          {ROUTE_GROUPS.map((group, gi) => {
            const groupCards = DESTINATION_CARDS.filter((c) => group.filter(c.difficulty));
            return (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + gi * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${group.color}50, transparent)` }} />
                  <span
                    className="font-inter text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: group.bg, color: group.color, border: `1px solid ${group.border}` }}
                  >
                    {group.label}
                  </span>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${group.color}50)` }} />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {groupCards.map((card, i) => {
                    const isSelected = selectedCard?.id === card.id;
                    const route = ROUTES[card.routeId];
                    const dist = route ? formatDistance(polylineDistanceM(route.polyline)) : null;
                    return (
                      <motion.button
                        key={card.id}
                        className="w-full text-left"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + gi * 0.1 + i * 0.04 }}
                        onClick={() => handleSelect(card)}
                      >
                        <motion.div
                          className="glass w-full rounded-2xl overflow-hidden"
                          whileTap={{ scale: 0.975 }}
                          style={{
                            border: isSelected ? `2px solid ${group.color}` : `1px solid ${group.border}`,
                            boxShadow: isSelected ? `0 4px 20px ${group.color}22` : undefined,
                          }}
                        >
                          <div style={{ height: 3, background: `linear-gradient(90deg, ${group.color}, ${group.color}60)` }} />
                          <div className="px-4 py-3.5 flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                              style={{ background: group.bg, border: `1px solid ${group.border}` }}
                            >
                              {card.emoji}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-playfair text-sm font-bold leading-tight" style={{ color: "#1e1b4b" }}>{card.glamName}</p>
                              <p className="font-inter text-xs mt-0.5" style={{ color: "#8480aa" }}>{card.realName}</p>
                              <p className="font-inter text-xs mt-1 italic leading-snug" style={{ color: "#6366f1" }}>{card.vibe}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              {dist && <span className="font-inter text-xs font-semibold" style={{ color: group.color }}>{dist}</span>}
                              <span className="font-inter text-lg" style={{ color: group.color }}>›</span>
                            </div>
                          </div>
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}

          <motion.div className="flex justify-center pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <AuthenticityBadge variant="powered" size="sm" />
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedCard && (
            <motion.div
              key="start-bar"
              className="sticky bottom-0 left-0 right-0 z-30 px-5 pb-5 pt-3"
              style={{ background: "linear-gradient(to top, rgba(255,255,255,0.98) 60%, transparent 100%)" }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
            >
              {routeInfo && (
                <div className="flex items-center justify-center gap-4 mb-2">
                  <span className="font-inter text-xs" style={{ color: "#4c4876" }}>📏 {routeInfo.distance}</span>
                  <span className="font-inter text-xs" style={{ color: "#4c4876" }}>⏱️ {routeInfo.time}</span>
                </div>
              )}
              <motion.button
                className="w-full py-4 rounded-2xl font-inter font-bold text-lg text-white"
                style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 55%, #6366f1 100%)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStart}
              >
                Start Journey ✨
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </GradientBackground>
  );
}
