"use client";

import { motion } from "framer-motion";
import type { CheckpointDef } from "@/lib/checkpoints";

interface CheckpointCardProps {
  checkpoint: CheckpointDef;
  onContinue: () => void;
  checkpointNumber: number;
  totalCheckpoints: number;
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

const WITTY_LINES: Record<string, string> = {
  smooth: "Clean patch. Makeup wins this round.",
  flyover: "Elevated road, elevated confidence.",
  "pothole-light": "Small wobble. Keep your hand steady.",
  "pothole-cluster": "Cluster ahead. Foundation in danger.",
  "pothole-severe": "Severe hit zone. Brace for impact.",
  construction: "Construction patch. Expect sudden shake.",
  "speed-hump": "Speed hump spotted. Lipstick test incoming.",
};

export default function CheckpointCard({
  checkpoint,
  onContinue,
  checkpointNumber,
  totalCheckpoints,
}: CheckpointCardProps) {
  const hazardColor = HAZARD_COLORS[checkpoint.hazardType] ?? "#6366f1";

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      exit={{ y: "110%" }}
      transition={{ type: "spring", damping: 24, stiffness: 250 }}
    >
      <div className="w-full glass-dark rounded-2xl px-4 py-4" style={{ border: `1px solid ${hazardColor}33` }}>
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-inter font-semibold px-2 py-1 rounded-full"
            style={{ background: `${hazardColor}18`, color: hazardColor, border: `1px solid ${hazardColor}33` }}
          >
            {checkpoint.emoji} {HAZARD_LABELS[checkpoint.hazardType]}
          </span>
          <span className="font-inter text-xs text-cream/45">
            {checkpointNumber}/{totalCheckpoints}
          </span>
        </div>

        <p className="font-playfair text-xl font-bold leading-snug text-cream mb-3">
          {WITTY_LINES[checkpoint.hazardType] ?? checkpoint.headline}
        </p>

        <p
          className="font-inter text-xs font-medium px-2.5 py-2 rounded-xl mb-4"
          style={{ background: "rgba(99,102,241,0.08)", color: "#4c4876", border: "1px solid rgba(99,102,241,0.15)" }}
        >
          {checkpoint.dataBadge}
        </p>

        <motion.button
          className="w-full py-3.5 rounded-2xl font-inter font-bold text-base text-white"
          style={{ background: "linear-gradient(135deg, #C2185B 0%, #FF4081 60%, #F9A825 100%)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}
