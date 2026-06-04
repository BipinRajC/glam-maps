"use client";

import { motion } from "framer-motion";
import type { CheckpointDef } from "@/lib/checkpoints";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";

interface CheckpointCardProps {
  checkpoint: CheckpointDef;
  onContinue: () => void;
  checkpointNumber: number;
  totalCheckpoints: number;
  makeupIntegrity: number;
}

const HAZARD_LABELS: Record<string, string> = {
  smooth: "Smooth Stretch",
  flyover: "Flyover Corridor",
  "pothole-cluster": "Pothole Cluster",
  "pothole-severe": "Severe Pothole Zone",
  construction: "Construction Zone",
  "speed-bump": "Speed Bump",
};

const HAZARD_COLORS: Record<string, string> = {
  smooth: "#22c55e",
  flyover: "#60a5fa",
  "pothole-cluster": "#ef4444",
  "pothole-severe": "#dc2626",
  construction: "#f97316",
  "speed-bump": "#F9A825",
};

const ROAD_VISUALS: Record<string, string> = {
  smooth: "🟢🟢🟢 ━━━━━━━━━━━━ 🟢🟢🟢",
  flyover: "🔵 ╌╌╌╌╌╌╌╌╌╌╌╌ 🔵 (ELEVATED)",
  "pothole-cluster": "⚫ ○ ⚫  ━━●━━●━━●━━  ⚫ ○ ⚫",
  "pothole-severe": "🔴 ●●● ━━●━●━●━●━━ ●●● 🔴",
  construction: "🚧━━━━━━━━━━━━━━━━━🚧",
  "speed-bump": "▬▬▬▬▬▬▬▬▬▬ BUMP ▬▬▬▬▬▬▬▬▬▬",
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

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-50 px-3 pb-4"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 120 }}
    >
      <div
        className="glass-dark rounded-3xl overflow-hidden"
        style={{ border: `1px solid ${hazardColor}33` }}
      >
        {/* Integrity impact flash banner */}
        <motion.div
          className="w-full py-2 px-4 flex items-center justify-between"
          style={{
            background: isPositive
              ? "linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))"
              : "linear-gradient(90deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))",
            borderBottom: `1px solid ${hazardColor}22`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ originX: 0 } as React.CSSProperties}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-inter text-cream/60">Checkpoint {checkpointNumber}/{totalCheckpoints}</span>
            <span
              className="text-xs font-inter font-bold px-1.5 py-0.5 rounded"
              style={{
                background: isPositive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
                color: isPositive ? "#22c55e" : "#ef4444",
              }}
            >
              {isPositive ? "+" : ""}{checkpoint.integrityDelta} Integrity
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-cream/50 font-inter">Makeup:</span>
            <span className="text-xs font-bold font-inter" style={{ color: integrityColor(makeupIntegrity) }}>
              {makeupIntegrity}%
            </span>
          </div>
        </motion.div>

        <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
          {/* Hazard type label */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-inter font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${hazardColor}20`, color: hazardColor, border: `1px solid ${hazardColor}40` }}
              >
                {checkpoint.emoji} {HAZARD_LABELS[checkpoint.hazardType]}
              </span>
            </div>
            <span className="text-sm text-champagne/40 font-inter">{checkpoint.collectibleName}</span>
          </motion.div>

          {/* Witty headline — Playfair, large */}
          <motion.h2
            className="font-playfair text-xl font-bold text-cream leading-snug"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", damping: 14 }}
          >
            {checkpoint.headline}
          </motion.h2>

          {/* Road visual */}
          <motion.div
            className="py-3 px-3 rounded-xl text-center font-mono text-sm"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <span className="text-base">{ROAD_VISUALS[checkpoint.hazardType]}</span>
            <p className="text-xs text-champagne/50 font-inter mt-1">{checkpoint.location}</p>
          </motion.div>

          {/* Data line */}
          <motion.p
            className="font-inter text-xs text-cream/50 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {checkpoint.dataLine}
          </motion.p>

          {/* Data source badge */}
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AuthenticityBadge text={checkpoint.dataBadge} />
          </motion.div>

          {/* Continue CTA */}
          <motion.button
            className="w-full py-4 rounded-2xl font-inter font-bold text-base text-white mt-1"
            style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 60%, #F9A825 100%)" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
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
