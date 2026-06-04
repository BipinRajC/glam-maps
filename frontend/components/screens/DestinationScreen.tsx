"use client";

import { motion } from "framer-motion";
import { DESTINATION_CARDS, type Difficulty } from "@/lib/routes";
import AuthenticityBadge from "@/components/shared/AuthenticityBadge";

interface DestinationScreenProps {
  onSelect: (routeId: string) => void;
}

const ROUTE_GROUPS = [
  {
    label: "Easy",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.2)",
    cards: ["mg-road", "whitefield"],
  },
  {
    label: "Medium",
    color: "#F9A825",
    bg: "rgba(249,168,37,0.08)",
    border: "rgba(249,168,37,0.2)",
    cards: ["indiranagar", "jpnagar"],
  },
  {
    label: "Survival Mode 💀",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    cards: ["koramangala", "electronic-city"],
  },
];

export default function DestinationScreen({ onSelect }: DestinationScreenProps) {
  return (
    <motion.div
      className="relative w-full min-h-dvh flex flex-col"
      style={{ background: "linear-gradient(145deg, #0f0a1e 0%, #1e0d30 40%, #12091e 100%)" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: "spring", damping: 22, stiffness: 180 }}
    >
      {/* Header */}
      <div className="px-6 sm:px-10 lg:px-16 xl:px-24 pt-10 pb-6">
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-inter font-semibold mb-4"
          style={{ background: "rgba(194,24,91,0.15)", border: "1px solid rgba(194,24,91,0.35)", color: "#FF4081" }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ✦ Flipkart Glam Up × Namma Pothole
        </motion.div>
        <motion.h2
          className="font-playfair font-bold text-cream leading-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Where are we slaying today?
        </motion.h2>
        <motion.p
          className="font-inter text-sm sm:text-base text-cream/50 mt-2 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Pick your destination. Your makeup will beg for mercy.
        </motion.p>
      </div>

      {/* Card groups by difficulty */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-16 xl:px-24 pb-10 flex flex-col gap-8">
        {ROUTE_GROUPS.map((group, gi) => {
          const groupCards = DESTINATION_CARDS.filter((c) => group.cards.includes(c.id));
          return (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + gi * 0.12 }}
            >
              {/* Difficulty section label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${group.color}40, transparent)` }} />
                <span
                  className="font-inter text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: group.bg, color: group.color, border: `1px solid ${group.border}` }}
                >
                  {group.label}
                </span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${group.color}40)` }} />
              </div>

              {/* Cards in 2-col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groupCards.map((card, i) => (
                  <motion.button
                    key={card.id}
                    className="w-full text-left"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + gi * 0.12 + i * 0.06 }}
                    onClick={() => onSelect(card.routeId)}
                  >
                    <motion.div
                      className="glass w-full px-5 py-5 flex items-center gap-4 h-full"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.975 }}
                      style={{ border: `1px solid ${group.border}` }}
                    >
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                        style={{ background: group.bg, border: `1px solid ${group.border}` }}
                      >
                        {card.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-playfair text-base sm:text-lg font-bold text-cream leading-tight">{card.glamName}</p>
                        <p className="font-inter text-xs text-champagne/50 mt-0.5">{card.realName}</p>
                        <p className="font-inter text-xs text-cream/40 mt-1.5 italic leading-snug">{card.vibe}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-2">
                        <span
                          className="font-inter text-xs font-bold px-2 py-1 rounded-full"
                          style={{ color: group.color }}
                        >
                          ›
                        </span>
                      </div>
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          );
        })}

        <motion.div className="flex justify-center pt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
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

// Kept for type safety
void DifficultyDot;
