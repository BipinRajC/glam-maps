"use client";

import { motion } from "framer-motion";
import { DESTINATION_CARDS, type Difficulty } from "@/lib/routes";
import { getDifficultyBg } from "@/lib/score";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";

interface DestinationScreenProps {
  onSelect: (routeId: string) => void;
}

export default function DestinationScreen({ onSelect }: DestinationScreenProps) {
  return (
    <motion.div
      className="relative w-full min-h-dvh flex flex-col"
      style={{ background: "linear-gradient(160deg, #1A1A2E 0%, #2D1535 60%, #1A1A2E 100%)" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", damping: 22, stiffness: 180 }}
    >
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-5">
        <motion.h2
          className="font-playfair text-2xl sm:text-3xl font-bold text-cream"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          Where are we slaying today?
        </motion.h2>
        <motion.p
          className="font-inter text-sm text-cream/50 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
        >
          Pick your destination. Your makeup will beg for mercy.
        </motion.p>
      </div>

      {/* Responsive card grid — 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto px-4 sm:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DESTINATION_CARDS.map((card, i) => (
            <motion.button
              key={card.id}
              className="w-full text-left"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.06, type: "spring", damping: 22 }}
              onClick={() => onSelect(card.routeId)}
            >
              <motion.div
                className="glass w-full px-4 py-4 flex items-center gap-3 h-full"
                whileHover={{ scale: 1.015, borderColor: "rgba(255,64,129,0.4)" }}
                whileTap={{ scale: 0.975 }}
              >
                <span className="text-3xl shrink-0">{card.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-playfair text-base font-bold text-cream leading-tight">{card.glamName}</p>
                  <p className="font-inter text-xs text-champagne/50 mt-0.5 leading-snug">{card.realName}</p>
                  <p className="font-inter text-xs text-cream/40 mt-1 italic">{card.vibe}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-xs font-inter font-semibold px-2 py-0.5 rounded-full border ${getDifficultyBg(card.difficulty)}`}>
                    {card.difficulty === "Survival Mode" ? "💀 Survival" : card.difficulty}
                  </span>
                  <DifficultyDot difficulty={card.difficulty} />
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>

        <motion.div className="mt-5 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
          <AuthenticityBadge variant="powered" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function DifficultyDot({ difficulty }: { difficulty: Difficulty }) {
  const color = difficulty === "Easy" ? "#22c55e" : difficulty === "Medium" ? "#F9A825" : "#ef4444";
  return <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />;
}
