"use client";

import { motion } from "framer-motion";
import type { WaypointView } from "@/lib/waypoints";

interface SpotlightCardProps {
  waypoint: WaypointView;
  onClick?: () => void;
}

export default function SpotlightCard({ waypoint, onClick }: SpotlightCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-full h-[130px] rounded-2xl p-[2px] text-left shrink-0"
      style={{
        background: "linear-gradient(135deg, #831843 0%, #FF4081 50%, #6366f1 100%)",
      }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="w-full h-full rounded-[14px] bg-white px-4 py-3 flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: "#FBCFE8" }}
        >
          {waypoint.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-inter text-[0.7rem] uppercase tracking-widest font-semibold mb-1"
            style={{ color: "#831843" }}
          >
            ✨ Nearest to you
          </p>
          <p
            className="font-playfair font-bold leading-tight truncate"
            style={{ fontSize: "1.25rem", color: "#1e1b4b" }}
          >
            {waypoint.name}
          </p>
          <p
            className="font-inter text-xs leading-snug mt-0.5 italic truncate"
            style={{ color: "#422538", fontStyle: "italic" }}
          >
            “{waypoint.vibe}”
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {waypoint.distanceLabel && (
            <span
              className="font-inter text-xs font-semibold"
              style={{ color: "#564146" }}
            >
              {waypoint.distanceLabel}
            </span>
          )}
          <span
            className="font-inter text-xs font-semibold"
            style={{ color: "#831843" }}
          >
            Tap to drop in →
          </span>
        </div>
      </div>
    </motion.button>
  );
}
