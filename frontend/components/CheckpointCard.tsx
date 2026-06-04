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

const ROAD_VISUALS: Record<string, string[]> = {
  smooth: ["🟢 🟢 🟢", "━━━━━━━━━━━━", "🟢 🟢 🟢"],
  flyover: ["🔵", "╌ ╌ ╌ ELEVATED ╌ ╌ ╌", "🔵"],
  "pothole-light": ["⚫ ○", "━━●━━●━━", "○ ⚫"],
  "pothole-cluster": ["🔴 ○ ⚫", "━●━●━●━●━", "⚫ ○ 🔴"],
  "pothole-severe": ["🔴 ●●●", "━●━●━●━●━●━", "●●● 🔴"],
  construction: ["🚧", "━━━━━━━━━━━━", "🚧"],
  "speed-hump": ["▬▬▬", "BUMP", "▬▬▬"],
};

const SOURCE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  "namma-pothole": { label: "Namma Pothole data", color: "#C2185B", bg: "rgba(194,24,91,0.15)" },
  "osm": { label: "OpenStreetMap data", color: "#60a5fa", bg: "rgba(96,165,250,0.15)" },
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
  const visual = ROAD_VISUALS[checkpoint.hazardType] ?? ["•", "━━━━━━━━━━", "•"];

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-50 px-3 pb-3"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 24, stiffness: 240 }}
    >
      <div
        className="glass-dark rounded-3xl overflow-hidden"
        style={{ border: `1px solid ${hazardColor}33` }}
      >
        {/* Top banner — integrity delta */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: isPositive
              ? "linear-gradient(90deg, rgba(34,197,94,0.18), transparent)"
              : "linear-gradient(90deg, rgba(239,68,68,0.18), transparent)",
            borderBottom: `1px solid ${hazardColor}18`,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-inter text-cream/50"
            >
              {checkpointNumber}/{totalCheckpoints}
            </span>
            <span
              className="text-xs font-inter font-bold px-2 py-0.5 rounded-full"
              style={{
                background: isPositive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                color: isPositive ? "#22c55e" : "#ef4444",
              }}
            >
              {isPositive ? "+" : ""}{checkpoint.integrityDelta} integrity
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-cream/40 font-inter">Makeup</span>
            <span
              className="text-xs font-bold font-inter tabular-nums"
              style={{ color: integrityColor(makeupIntegrity) }}
            >
              {makeupIntegrity}%
            </span>
          </div>
        </div>

        <div className="px-5 pt-3 pb-4 flex flex-col gap-2.5">
          {/* Hazard label + source */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-inter font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${hazardColor}18`, color: hazardColor, border: `1px solid ${hazardColor}35` }}
            >
              {checkpoint.emoji} {HAZARD_LABELS[checkpoint.hazardType]}
            </span>
            {source && (
              <span
                className="text-xs font-inter font-medium px-2 py-0.5 rounded-full"
                style={{ background: source.bg, color: source.color, border: `1px solid ${source.color}30` }}
              >
                {source.label}
              </span>
            )}
          </div>

          {/* Headline */}
          <h2 className="font-playfair text-xl font-bold text-cream leading-snug">
            {checkpoint.headline}
          </h2>

          {/* Road visual */}
          <div
            className="py-2.5 px-3 rounded-xl text-center font-mono"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-center gap-3 text-sm">
              <span>{visual[0]}</span>
              <span className="text-cream/50">{visual[1]}</span>
              <span>{visual[2]}</span>
            </div>
            <p className="text-xs text-champagne/45 font-inter mt-1">{checkpoint.location}</p>
          </div>

          {/* Data line */}
          <p className="font-inter text-xs text-cream/45 leading-relaxed">
            {checkpoint.dataLine}
          </p>

          {/* Continue CTA */}
          <motion.button
            className="w-full py-3.5 rounded-2xl font-inter font-bold text-sm text-white mt-1"
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
