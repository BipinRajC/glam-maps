"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { GradientBackground } from "@/components/ui/gradient-backgrounds";
import BrandPill from "@/components/shared/brand-pill";
import GlamDropdown from "@/components/ui/glam-dropdown";
import DestinationCard from "@/components/ui/destination-card";
import SpotlightCard from "@/components/ui/spotlight-card";
import { haversineMeters } from "@/lib/routeCalc";
import {
  WAYPOINTS,
  CURRENT_LOCATION,
  withDistance,
  pickNearest,
  pickTrending,
  pickFallbackSpotlight,
  type Waypoint,
  type WaypointView,
} from "@/lib/waypoints";

interface LocationSelectScreenProps {
  userLocation: [number, number] | null;
  onSelect: (pickup: Waypoint, destination: Waypoint) => void;
}

const MIN_DESTINATION_DISTANCE_M = 3000;

type SelectableWaypoint = Waypoint & { emoji?: string; distanceLabel?: string };

function makeCurrentLocation(loc: [number, number] | null): SelectableWaypoint {
  if (!loc) {
    return {
      ...CURRENT_LOCATION,
      lat: 0,
      lng: 0,
    };
  }
  return {
    ...CURRENT_LOCATION,
    lat: loc[1],
    lng: loc[0],
  };
}

function getId<T extends { id: string }>(v: T): string {
  return v.id;
}

function getSearchText(v: SelectableWaypoint): string {
  return `${v.name} ${v.area} ${v.vibe}`;
}

function renderOption(v: SelectableWaypoint) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-base shrink-0" aria-hidden>
        {v.emoji ?? "📍"}
      </span>
      <div className="min-w-0">
        <p
          className="font-inter text-sm font-semibold leading-tight truncate"
          style={{ color: "#1e1b4b" }}
        >
          {v.name}
        </p>
        <p
          className="font-inter text-[0.7rem] leading-tight truncate"
          style={{ color: "#564146" }}
        >
          {v.area}
        </p>
      </div>
    </div>
  );
}

export default function LocationSelectScreen({ userLocation, onSelect }: LocationSelectScreenProps) {
  const [pickup, setPickup] = useState<SelectableWaypoint | null>(() =>
    makeCurrentLocation(userLocation),
  );
  const [destination, setDestination] = useState<SelectableWaypoint | null>(null);
  const [pulse, setPulse] = useState(0);
  const [trendingSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));

  useEffect(() => {
    setPickup(makeCurrentLocation(userLocation));
  }, [userLocation]);

  const origin = useMemo<[number, number] | null>(() => {
    if (!pickup) return null;
    if (pickup.id === "__current__") return userLocation;
    if (pickup.lat === 0 && pickup.lng === 0) return null;
    return [pickup.lng, pickup.lat];
  }, [pickup, userLocation]);

  const destinationPool = useMemo<Waypoint[]>(() => {
    if (!origin) return WAYPOINTS;
    const filtered = WAYPOINTS.filter(
      (w) => w.id !== pickup?.id && haversineMeters(origin, [w.lng, w.lat]) >= MIN_DESTINATION_DISTANCE_M,
    );
    return filtered.length > 0 ? filtered : WAYPOINTS;
  }, [origin, pickup]);

  const spotlight = useMemo<Waypoint>(() => {
    return (
      pickNearest(origin, destinationPool, MIN_DESTINATION_DISTANCE_M) ??
      pickFallbackSpotlight(destinationPool)
    );
  }, [origin, destinationPool]);

  const trending = useMemo<Waypoint[]>(() => {
    return pickTrending(destinationPool, spotlight.id, 4, trendingSeed);
  }, [destinationPool, spotlight, trendingSeed]);

  useEffect(() => {
    if (!destination || !origin) return;
    const d = haversineMeters(origin, [destination.lng, destination.lat]);
    if (d < MIN_DESTINATION_DISTANCE_M) setDestination(null);
  }, [origin, destination]);

  const spotlightView: WaypointView = useMemo(
    () => withDistance(spotlight, origin),
    [spotlight, origin],
  );

  const trendingViews: WaypointView[] = useMemo(
    () => trending.map((w) => withDistance(w, origin)),
    [trending, origin],
  );

  const pickupOptions: SelectableWaypoint[] = useMemo(() => {
    const cur = makeCurrentLocation(userLocation);
    return [cur, ...WAYPOINTS.map((w) => ({ ...w, emoji: undefined }))];
  }, [userLocation]);

  const destinationOptions: SelectableWaypoint[] = useMemo(
    () => destinationPool.map((w) => ({ ...w, emoji: undefined })),
    [destinationPool],
  );

  const setDestinationWithPulse = (w: Waypoint) => {
    setDestination({ ...w, emoji: undefined });
    setPulse((p) => p + 1);
  };

  const ctaEnabled = pickup != null && destination != null;

  return (
    <GradientBackground mapOpacity={0.40} mapCenter={[77.68, 12.93]} mapZoom={12}>
      <motion.div
        className="relative w-full min-h-dvh flex flex-col px-5 py-8 gap-5"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
      >
        <div className="flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BrandPill text="✦ Flipkart Glam Up" />
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
            className="font-inter text-sm"
            style={{ color: "#4c4876" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Set pickup + destination. We do the rest.
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlamDropdown<SelectableWaypoint>
            label="Starting From"
            icon="my_location"
            options={pickupOptions}
            value={pickup}
            onChange={setPickup}
            pinned={makeCurrentLocation(userLocation)}
            getId={getId}
            renderOption={(v) => (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">
                  {v.id === "__current__" ? "📍" : v.emoji ?? "📍"}
                </span>
                <div className="min-w-0">
                  <p
                    className="font-inter text-sm font-semibold leading-tight truncate"
                    style={{ color: "#1e1b4b" }}
                  >
                    {v.name}
                  </p>
                  <p
                    className="font-inter text-[0.7rem] leading-tight truncate"
                    style={{ color: "#564146" }}
                  >
                    {v.area}
                  </p>
                </div>
              </div>
            )}
            getSearchText={getSearchText}
            placeholder="Search pickup…"
          />

          <motion.div
            key={pulse}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 0.4 }}
          >
            <GlamDropdown<SelectableWaypoint>
              label="Slay Destination"
              icon="location_on"
              options={destinationOptions}
              value={destination}
              onChange={setDestination}
              excludeIds={pickup ? [getId(pickup)] : []}
              getId={getId}
              renderOption={renderOption}
              getSearchText={getSearchText}
              placeholder="Search destinations…"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SpotlightCard
            waypoint={spotlightView}
            onClick={() => setDestinationWithPulse(spotlight)}
          />
        </motion.div>

        <motion.p
          className="font-inter text-xs uppercase tracking-widest font-semibold"
          style={{ color: "#564146", letterSpacing: "0.05em" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ✨ Trending Now
        </motion.p>

        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {trendingViews.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.05 }}
            >
              <DestinationCard
                waypoint={w}
                compact
                onClick={() => setDestinationWithPulse(w)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-auto" />

        <motion.button
          type="button"
          disabled={!ctaEnabled}
          className="w-full py-4 rounded-2xl font-inter font-bold text-lg text-white"
          style={{
            background: ctaEnabled
              ? "linear-gradient(135deg, #C2185B 0%, #FF4081 55%, #6366f1 100%)"
              : "rgba(99,102,241,0.18)",
            opacity: ctaEnabled ? 1 : 0.5,
            cursor: ctaEnabled ? "pointer" : "not-allowed",
          }}
          whileTap={ctaEnabled ? { scale: 0.98 } : undefined}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => {
            if (!pickup || !destination) return;
            console.log("Slay My Route tapped", { pickup, destination });
            onSelect(
              { id: pickup.id, name: pickup.name, area: pickup.area, vibe: pickup.vibe, lat: pickup.lat, lng: pickup.lng },
              { id: destination.id, name: destination.name, area: destination.area, vibe: destination.vibe, lat: destination.lat, lng: destination.lng },
            );
          }}
        >
          Slay My Route ✨
        </motion.button>
      </motion.div>
    </GradientBackground>
  );
}
