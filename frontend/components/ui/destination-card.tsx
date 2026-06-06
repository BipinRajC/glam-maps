"use client";

import { motion } from "framer-motion";
import type { WaypointView } from "@/lib/waypoints";

interface DestinationCardProps {
  waypoint: WaypointView;
  onClick?: () => void;
  compact?: boolean;
}

export default function DestinationCard({ waypoint, onClick, compact = true }: DestinationCardProps) {
  const heightClass = compact ? "h-24" : "h-20";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`w-full text-left ${heightClass} rounded-lg bg-white flex items-center gap-3 px-3 py-2 shrink-0`}
      style={{
        border: "1px solid #DCC0C5",
        boxShadow: "0 2px 10px rgba(99,102,241,0.06)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
        style={{ background: "#FBCFE8" }}
      >
        {waypoint.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="font-playfair font-bold leading-tight truncate"
          style={{ fontSize: "1rem", color: "#1e1b4b" }}
        >
          {waypoint.name}
        </p>
        <p
          className="font-inter text-xs leading-tight truncate"
          style={{ color: "#564146" }}
        >
          {waypoint.area}
        </p>
        <p
          className="font-inter text-xs italic leading-tight truncate"
          style={{ color: "#422538", fontStyle: "italic" }}
        >
          {waypoint.vibe}
        </p>
      </div>
      <div className="flex flex-col items-end gap-0.5 shrink-0">
        {waypoint.distanceLabel && (
          <span
            className="font-inter text-xs font-semibold"
            style={{ color: "#564146" }}
          >
            {waypoint.distanceLabel}
          </span>
        )}
        <span className="font-inter text-lg leading-none" style={{ color: "#831843" }}>
          ›
        </span>
      </div>
    </motion.button>
  );
}
