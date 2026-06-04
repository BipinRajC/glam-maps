"use client";

import { motion } from "framer-motion";
import type { CheckpointDef } from "@/lib/checkpoints";

interface CheckpointCardProps {
  checkpoint: CheckpointDef;
  onContinue: () => void;
  checkpointNumber: number;
  totalCheckpoints: number;
  makeupIntegrity: number;
}

const HAZARD_LABELS: Record<string, string> = {
  smooth: "Smooth Stretch",
  flyover: "Flyover",
  "pothole-light": "Pothole Zone",
  "pothole-cluster": "Pothole Cluster",
  "pothole-severe": "Severe Potholes",
  construction: "Road Damage",
  "speed-hump": "Speed Hump",
};

const HAZARD_COLORS: Record<string, string> = {
  smooth: "#22c55e",
  flyover: "#60a5fa",
  "pothole-light": "#F9A825",
  "pothole-cluster": "#ef4444",
  "pothole-severe": "#dc2626",
  construction: "#f97316",
  "speed-hump": "#eab308",
};

const SOURCE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "namma-pothole": { label: "Namma Pothole", color: "#FF4081", bg: "rgba(194,24,91,0.15)" },
  "osm": { label: "OpenStreetMap", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
};

// Styled "Namma Pothole report photo" per hazard type — CSS only, no external images
const PHOTO_CONFIG: Record<string, {
  bg: string;
  overlay: string;
  icon: string;
  caption: string;
  severity?: string;
  severityColor?: string;
}> = {
  smooth: {
    bg: "linear-gradient(180deg, #1a2e1a 0%, #1e3a1e 50%, #152815 100%)",
    overlay: "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 40px)",
    icon: "🟢",
    caption: "Clean tarmac. A rare sighting in Bengaluru.",
    severity: "Safe",
    severityColor: "#22c55e",
  },
  flyover: {
    bg: "linear-gradient(180deg, #0d1a2e 0%, #0a1a3a 50%, #0d1530 100%)",
    overlay: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 24px)",
    icon: "🌉",
    caption: "Elevated corridor. Your eyeliner is safe up here.",
    severity: "Elevated",
    severityColor: "#60a5fa",
  },
  "pothole-light": {
    bg: "linear-gradient(180deg, #2a2218 0%, #2e2510 50%, #1e1a10 100%)",
    overlay: "radial-gradient(ellipse 28px 14px at 40% 55%, rgba(0,0,0,0.7) 0%, transparent 100%), radial-gradient(ellipse 18px 10px at 70% 45%, rgba(0,0,0,0.6) 0%, transparent 100%)",
    icon: "😬",
    caption: "Minor potholes. Enough to smudge your liner.",
    severity: "Low",
    severityColor: "#F9A825",
  },
  "pothole-cluster": {
    bg: "linear-gradient(180deg, #2a1818 0%, #301010 50%, #1e0808 100%)",
    overlay: "radial-gradient(ellipse 32px 16px at 30% 50%, rgba(0,0,0,0.8) 0%, transparent 100%), radial-gradient(ellipse 22px 12px at 60% 40%, rgba(0,0,0,0.75) 0%, transparent 100%), radial-gradient(ellipse 18px 10px at 80% 65%, rgba(0,0,0,0.7) 0%, transparent 100%), radial-gradient(ellipse 14px 8px at 15% 70%, rgba(0,0,0,0.65) 0%, transparent 100%)",
    icon: "😭",
    caption: "Pothole cluster. Your foundation has left the chat.",
    severity: "High",
    severityColor: "#ef4444",
  },
  "pothole-severe": {
    bg: "linear-gradient(180deg, #300808 0%, #3a0505 50%, #200303 100%)",
    overlay: "radial-gradient(ellipse 40px 22px at 35% 50%, rgba(0,0,0,0.9) 0%, transparent 100%), radial-gradient(ellipse 28px 16px at 65% 38%, rgba(0,0,0,0.85) 0%, transparent 100%), radial-gradient(ellipse 20px 12px at 80% 68%, rgba(0,0,0,0.8) 0%, transparent 100%), radial-gradient(ellipse 16px 10px at 12% 62%, rgba(0,0,0,0.75) 0%, transparent 100%), radial-gradient(ellipse 12px 8px at 50% 80%, rgba(0,0,0,0.7) 0%, transparent 100%)",
    icon: "💀",
    caption: "Catastrophic. Even your concealer is filing a complaint.",
    severity: "Critical",
    severityColor: "#dc2626",
  },
  construction: {
    bg: "linear-gradient(180deg, #2a1e08 0%, #302008 50%, #1e1505 100%)",
    overlay: "repeating-linear-gradient(45deg, rgba(249,168,37,0.06) 0px, rgba(249,168,37,0.06) 4px, transparent 4px, transparent 20px)",
    icon: "🚧",
    caption: "Under construction. Just like your makeup right now.",
    severity: "Medium",
    severityColor: "#f97316",
  },
  "speed-hump": {
    bg: "linear-gradient(180deg, #1e1a08 0%, #252010 50%, #181500 100%)",
    overlay: "linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.4) 100%)",
    icon: "💄",
    caption: "Speed hump. Lipstick exit: confirmed.",
    severity: "Medium",
    severityColor: "#eab308",
  },
};

export default function CheckpointCard({
  checkpoint,
  onContinue,
  checkpointNumber,
  totalCheckpoints,
  makeupIntegrity,
}: CheckpointCardProps) {
  const isPositive = checkpoint.integrityDelta >= 0;
  const hazardColor = HAZARD_COLORS[checkpoint.hazardType] ?? "#ffffff";
  const source = SOURCE_BADGE[checkpoint.dataSource];
  const photo = PHOTO_CONFIG[checkpoint.hazardType];

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      exit={{ y: "110%" }}
      transition={{ type: "spring", damping: 26, stiffness: 260 }}
    >
      {/* Max width so it floats as a card, not full-screen on desktop */}
      <div
        className="w-full max-w-md sm:max-w-lg glass-dark rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: `1px solid ${hazardColor}30` }}
      >
        {/* Top — integrity impact */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: isPositive
              ? "linear-gradient(90deg, rgba(34,197,94,0.16), transparent)"
              : "linear-gradient(90deg, rgba(239,68,68,0.16), transparent)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-inter text-cream/45">{checkpointNumber}/{totalCheckpoints}</span>
            <span
              className="text-xs font-inter font-bold px-2 py-0.5 rounded-full"
              style={{ background: isPositive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", color: isPositive ? "#22c55e" : "#ef4444" }}
            >
              {isPositive ? "+" : ""}{checkpoint.integrityDelta} integrity
            </span>
          </div>
          <span className="text-xs font-inter" style={{ color: integrityColor(makeupIntegrity) }}>
            Makeup {makeupIntegrity}%
          </span>
        </div>

        <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
          {/* Source + hazard label */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-inter font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${hazardColor}15`, color: hazardColor, border: `1px solid ${hazardColor}30` }}
            >
              {checkpoint.emoji} {HAZARD_LABELS[checkpoint.hazardType]}
            </span>
            {source && (
              <span
                className="text-xs font-inter font-medium px-2 py-0.5 rounded-full"
                style={{ background: source.bg, color: source.color, border: `1px solid ${source.color}25` }}
              >
                📍 {source.label}
              </span>
            )}
          </div>

          {/* Headline */}
          <h2 className="font-playfair text-xl font-bold text-cream leading-snug">
            {checkpoint.headline}
          </h2>

          {/* Pothole "photo" — styled road condition preview */}
          {photo && (
            <motion.div
              className="relative rounded-xl overflow-hidden"
              style={{ height: 90 }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Road surface */}
              <div className="absolute inset-0" style={{ background: photo.bg }} />
              <div className="absolute inset-0" style={{ background: photo.overlay }} />

              {/* Namma Pothole / OSM watermark bar */}
              <div
                className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 py-1"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#ef4444" }} />
                  <span className="font-inter text-xs text-white/70">
                    {checkpoint.dataSource === "namma-pothole" ? "🗺️ Namma Pothole Report" : "🗺️ OpenStreetMap Survey"}
                  </span>
                </div>
                {photo.severity && (
                  <span
                    className="font-inter text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ background: `${photo.severityColor}25`, color: photo.severityColor }}
                  >
                    {photo.severity}
                  </span>
                )}
              </div>

              {/* Big condition icon, centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))" }}>
                  {photo.icon}
                </span>
              </div>

              {/* Bottom caption bar */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1"
                style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
              >
                <span className="font-inter text-xs text-white/60 italic">&ldquo;{photo.caption}&rdquo;</span>
                <span className="font-inter text-xs text-white/40 shrink-0 ml-2">{checkpoint.location}</span>
              </div>
            </motion.div>
          )}

          {/* Data line */}
          <p className="font-inter text-xs text-cream/40 leading-relaxed">
            {checkpoint.dataLine}
          </p>

          {/* Continue CTA */}
          <motion.button
            className="w-full py-5 rounded-2xl font-inter font-bold text-base text-white mt-1"
            style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 60%, #F9A825 100%)" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
          >
            Continue Journey →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

function integrityColor(pct: number): string {
  if (pct > 70) return "#22c55e";
  if (pct > 40) return "#F9A825";
  return "#ef4444";
}
